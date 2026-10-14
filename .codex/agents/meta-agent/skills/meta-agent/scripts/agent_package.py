#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["PyYAML>=6,<7", "tomlkit>=0.13,<1"]
# ///
"""Synchronize and validate repository-local Codex agent packages."""

import argparse
import os
import re
import sys
import tomllib
from pathlib import Path

import tomlkit
import yaml

SECTIONS = ["Role", "Input", "Analyze Flow", "Output"]
STEPS = [
    "Analyze Requirements", "Break Down Requirements",
    "Research and Retrieve Information", "Identify and Use Skills",
    "Execute Tasks", "Validate Results", "Generate Output",
]


class PackageError(ValueError):
    """Invalid package input or an unsafe write destination."""


def check_name(name):
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name) or len(name) > 63:
        raise PackageError(f"Invalid kebab-case name: {name!r}")


def confined(root, path):
    if not path.resolve().is_relative_to(root):
        raise PackageError(f"Path escapes workspace: {path}")
    return path


def locations(workspace, name):
    check_name(name)
    root = Path(workspace).resolve()
    if not root.is_dir():
        raise PackageError(f"Workspace does not exist: {root}")
    package = confined(root, root / ".codex" / "agents" / name)
    registration = confined(root, package.parent / f"{name}.toml")
    return root, package, registration


def read_skills(root, package):
    skills_dir = confined(root, package / "skills")
    if not skills_dir.is_dir():
        raise PackageError(f"Missing skills directory: {skills_dir}")
    skills = []
    names = set()
    for folder in sorted(skills_dir.iterdir()):
        # Only immediate skill directories with a manifest enter the index.
        if not folder.is_dir() or not (folder / "SKILL.md").exists():
            continue
        manifest = confined(root, folder / "SKILL.md")
        match = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)",
                         manifest.read_text(encoding="utf-8"), re.S)
        if not match:
            raise PackageError(f"Missing YAML frontmatter: {manifest}")
        try:
            metadata = yaml.safe_load(match.group(1))
        except yaml.YAMLError as exc:
            raise PackageError(f"Invalid YAML: {manifest}: {exc}") from exc
        if not isinstance(metadata, dict):
            raise PackageError(f"Frontmatter must be a mapping: {manifest}")
        name, description = metadata.get("name"), metadata.get("description")
        if not isinstance(name, str) or not isinstance(description, str):
            raise PackageError(f"Skill requires string name and description: {manifest}")
        check_name(name)
        if name != folder.name or name in names:
            raise PackageError(f"Duplicate name or folder/name mismatch: {manifest}")
        if not description.strip() or "[TODO:" in description:
            raise PackageError(f"Empty or unfinished skill description: {manifest}")
        names.add(name)
        skills.append((name, description, manifest))
    return sorted(skills)


def table_cell(text):
    # Keep multiline YAML descriptions exact in metadata, readable in one row.
    return text.replace("\\", "\\\\").replace("|", "\\|").replace("\r\n", "\n").replace("\r", "\n").replace("\n", "<br>")


def render_index(package, skills):
    text = (
        f"# {package.name} skill index\n\n"
        "Generated from the local `skills/` folder's SKILL.md frontmatter. "
        "Regenerate after adding, renaming, removing, or editing skill metadata.\n\n"
        "Assess names and descriptions here, then read only applicable SKILL.md "
        "files. Installed external skills are discovered through the runtime "
        "catalog separately.\n\n"
    )
    if not skills:
        return text + "No local skills are defined.\n"
    text += "| Skill name | Description | Instructions |\n| --- | --- | --- |\n"
    for name, description, manifest in skills:
        relative = Path(os.path.relpath(manifest, package / "docs")).as_posix()
        text += f"| {name} | {table_cell(description)} | [SKILL.md]({relative}) |\n"
    return text


def prompt_errors(prompt, name):
    # Ignore headings and authoring examples inside fenced code blocks.
    lines = []
    fence = None
    for line in prompt.splitlines():
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if marker:
            char = marker.group(1)[0]
            if fence is None:
                fence = (char, len(marker.group(1)))
            elif char == fence[0] and len(marker.group(1)) >= fence[1]:
                fence = None
            continue
        if fence is None:
            lines.append(line)
    text = "\n".join(lines)
    errors = []
    if re.findall(r"^# (.+)$", text, re.M) != SECTIONS:
        errors.append("Prompt must have Role, Input, Analyze Flow, Output in order")
    flow_match = re.search(r"^# Analyze Flow\n(.*?)(?=^# |\Z)", text, re.M | re.S)
    flow = flow_match.group(1) if flow_match else ""
    expected = [f"{number}. {step}" for number, step in enumerate(STEPS, 1)]
    if re.findall(r"^## (\d+\. .+)$", flow, re.M) != expected:
        errors.append("Prompt must include all seven Analyze Flow steps in order")
    for heading in SECTIONS:
        match = re.search(rf"^# {re.escape(heading)}\n(.*?)(?=^# |\Z)", text, re.M | re.S)
        if not match or not match.group(1).strip():
            errors.append(f"Empty prompt section: {heading}")
    for number, step in enumerate(STEPS, 1):
        match = re.search(rf"^## {number}\. {re.escape(step)}\n(.*?)(?=^## |^# |\Z)", text, re.M | re.S)
        if not match or not match.group(1).strip():
            errors.append(f"Empty Analyze Flow step: {step}")
    selection = re.search(r"^## 4\. Identify and Use Skills\n(.*?)(?=^## |\Z)", flow, re.M | re.S)
    reference = f".codex/agents/{name}/docs/docs.md"
    if not selection or reference not in selection.group(1):
        errors.append(f"Skill selection must reference {reference}")
    if re.search(r"\{(?:agent[-_]name|user input|skill[-_]name)[^}]*\}|\[(?:agent[- ]name|Agent display name|TODO:)[^\]]*\]", text, re.I):
        errors.append("Unresolved prompt placeholder")
    return errors


def sync(workspace, name, description=None):
    root, package, registration = locations(workspace, name)
    prompt_path = confined(root, package / "prompt" / "system.md")
    if not prompt_path.is_file():
        raise PackageError(f"Missing canonical prompt: {prompt_path}")
    prompt = prompt_path.read_text(encoding="utf-8")
    errors = prompt_errors(prompt, name)
    if errors:
        raise PackageError("; ".join(errors))
    skills = read_skills(root, package)
    index_path = confined(root, package / "docs" / "docs.md")
    index = render_index(package, skills)
    if registration.exists():
        config = tomlkit.parse(registration.read_text(encoding="utf-8"))
        if config.get("name") != name:
            raise PackageError("Existing registration has a different agent name")
        if description is not None:
            config["description"] = description
    else:
        config = tomlkit.document()
        config["name"] = name
        config["description"] = description or ""
    if not isinstance(config.get("description"), str) or not config["description"].strip():
        raise PackageError("A nonempty description is required for registration")
    config["developer_instructions"] = tomlkit.string(prompt, multiline=True)
    serialized = tomlkit.dumps(config)
    if tomllib.loads(serialized)["developer_instructions"] != prompt:
        raise PackageError("TOML serialization did not preserve the prompt")
    # Validate both outputs before any writes; never overwrite skill directories.
    index_path.parent.mkdir(parents=True, exist_ok=True)
    registration.write_text(serialized, encoding="utf-8")
    index_path.write_text(index, encoding="utf-8")
    return registration, index_path


def resource_files(root, folder):
    result = {}
    for path in folder.rglob("*"):
        if path.is_file() and "__pycache__" not in path.parts and path.name != ".DS_Store":
            confined(root, path)
            result[path.relative_to(folder).as_posix()] = path.read_bytes()
    return result


def validate(workspace, name):
    root, package, registration = locations(workspace, name)
    errors = []
    required = ["docs/requirements.md", "docs/architecture.md", "docs/docs.md",
                "docs/test-cases.md", "prompt/system.md"]
    for relative in required:
        path = confined(root, package / relative)
        if not path.is_file() or not path.read_text(encoding="utf-8").strip():
            errors.append(f"Missing or empty required file: {relative}")
    prompt_path = confined(root, package / "prompt/system.md")
    prompt = prompt_path.read_text(encoding="utf-8") if prompt_path.is_file() else ""
    errors.extend(prompt_errors(prompt, name))
    try:
        config = tomllib.loads(registration.read_text(encoding="utf-8"))
        for field in ("name", "description", "developer_instructions"):
            if not isinstance(config.get(field), str) or not config[field].strip():
                errors.append(f"Missing or empty registration field: {field}")
        if config.get("name") != name:
            errors.append("Registration name differs from package name")
        if config.get("developer_instructions") != prompt:
            errors.append("Registration instructions differ from canonical prompt")
    except (OSError, tomllib.TOMLDecodeError) as exc:
        errors.append(f"Invalid or missing registration: {exc}")
    try:
        skills = read_skills(root, package)
    except (PackageError, OSError) as exc:
        errors.append(str(exc))
        return errors
    if name not in {skill[0] for skill in skills}:
        errors.append(f"Missing invocation skill: {name}")
    index_path = confined(root, package / "docs/docs.md")
    if index_path.is_file() and index_path.read_text(encoding="utf-8") != render_index(package, skills):
        errors.append("Skill index differs from actual local skills; run sync")
    for skill_name, _, manifest in skills:
        published = root / ".agents/skills" / skill_name
        confined(root, published)
        # Check canonical resources even when publication is a symlink.
        canonical_files = resource_files(root, manifest.parent)
        if published.is_symlink():
            if os.path.isabs(os.readlink(published)):
                errors.append(f"Published skill symlink must be relative: {skill_name}")
            if published.resolve() != manifest.parent.resolve():
                errors.append(f"Published skill points to another folder: {skill_name}")
        elif not published.is_dir():
            errors.append(f"Missing published skill: {skill_name}")
        elif resource_files(root, published) != canonical_files:
            errors.append(f"Published skill copy differs from canonical skill: {skill_name}")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workspace", type=Path, default=Path.cwd())
    commands = parser.add_subparsers(dest="command", required=True)
    sync_parser = commands.add_parser("sync", help="Synchronize registration and skill index")
    sync_parser.add_argument("name")
    sync_parser.add_argument("--description")
    validate_parser = commands.add_parser("validate", help="Check a package without writing")
    validate_parser.add_argument("name")
    args = parser.parse_args()
    try:
        if args.command == "sync":
            for path in sync(args.workspace, args.name, args.description):
                print(f"Synchronized: {path}")
        else:
            errors = validate(args.workspace, args.name)
            if errors:
                for error in errors:
                    print(f"FAIL: {error}", file=sys.stderr)
                return 1
            print("Agent package: PASS (configuration, prompt, skills, index, structure)")
            print("Runtime behavior: NOT TESTED by this helper")
        return 0
    except (PackageError, OSError, ValueError) as exc:
        print(f"FAIL: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
