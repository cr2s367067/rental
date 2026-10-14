#!/usr/bin/env python3
"""Read-only structural validation of a PM Agent implementation packet."""

import argparse
import hashlib
import json
import re
from pathlib import Path


class PacketError(ValueError):
    """An invalid or stale packet."""


def require(condition, message):
    if not condition:
        raise PacketError(message)


def text(value):
    return isinstance(value, str) and bool(value.strip())


def strings(value, label, nonempty=False):
    require(isinstance(value, list), f"{label}: expected an array")
    require(all(text(item) for item in value), f"{label}: expected non-empty strings")
    require(not nonempty or bool(value), f"{label}: must not be empty")
    require(len(value) == len(set(value)), f"{label}: duplicate values")
    return value


def local_path(root, value):
    require(text(value), "Path must be a non-empty string")
    path = Path(value)
    require(not path.is_absolute() and "\\" not in value and
            not any(part in ("", ".", "..") for part in value.rstrip("/").split("/")),
            f"Path must be workspace-relative without traversal: {value}")
    resolved = (root / path).resolve()
    require(resolved.is_relative_to(root), f"Path escapes workspace: {value}")
    return resolved


def task_lines(content):
    result = {}
    fence = None
    for line in content.splitlines():
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if marker:
            char = marker[1][0]
            if fence is None:
                fence = (char, len(marker[1]))
            elif char == fence[0] and len(marker[1]) >= fence[1]:
                fence = None
            continue
        if fence is not None:
            continue
        match = re.match(r"^- \[([ xX])\] (T\d{3,})\b(.*)$", line)
        if match:
            task_id = match[2]
            require(task_id not in result, f"Duplicate tasks.md ID: {task_id}")
            result[task_id] = (match[1].lower() == "x", bool(re.match(r"\s+\[P\]", match[3])))
    require(bool(result), "tasks.md contains no Spec Kit task checklist")
    return result


def overlaps(first, second):
    return first == second or first.is_relative_to(second) or second.is_relative_to(first)


def validate_packet(packet, workspace):
    root = Path(workspace).resolve()
    require(root.is_dir(), "Workspace directory does not exist")
    require(isinstance(packet, dict), "Packet must be a JSON object")
    require(type(packet.get("schema_version")) is int and packet["schema_version"] == 1,
            "schema_version must be integer 1")
    feature = packet.get("feature_dir")
    require(local_path(root, feature).is_dir(), "feature_dir does not exist")
    feature = feature.rstrip("/")
    core = {".specify/memory/constitution.md", f"{feature}/spec.md",
            f"{feature}/plan.md", f"{feature}/tasks.md"}
    analysis = packet.get("analysis")
    require(isinstance(analysis, dict), "analysis must be an object")
    require(analysis.get("status") in ("passed", "blocked"), "Invalid analysis status")
    report_path = analysis.get("report")
    require(text(report_path), "analysis.report is required")
    hashes = packet.get("artifact_hashes")
    require(isinstance(hashes, dict), "artifact_hashes must be an object")
    require(core | {report_path} <= hashes.keys(), "Missing core artifact snapshot")
    inputs = packet.get("inputs")
    require(isinstance(inputs, dict), "inputs must identify the PRD and architecture")
    for role in ("prd", "architecture"):
        require(text(inputs.get(role)) and inputs[role] in hashes,
                f"inputs.{role} requires a source artifact snapshot")
    checklists = strings(packet.get("checklists"), "checklists", nonempty=True)
    require(all(path in hashes for path in checklists), "Evaluated checklist lacks snapshot")
    for path, digest in hashes.items():
        artifact = local_path(root, path)
        require(artifact.is_file(), f"Artifact missing: {path}")
        require(artifact.stat().st_size > 0, f"Artifact empty: {path}")
        require(isinstance(digest, str) and re.fullmatch(r"[a-f0-9]{64}", digest),
                f"Invalid SHA-256: {path}")
        require(hashlib.sha256(artifact.read_bytes()).hexdigest() == digest,
                f"Stale artifact snapshot: {path}")

    entries = packet.get("tasks")
    require(isinstance(entries, list) and bool(entries), "tasks must be a non-empty array")
    tasks = {}
    ownership = {}
    for entry in entries:
        require(isinstance(entry, dict), "Each task must be an object")
        task_id = entry.get("id")
        require(isinstance(task_id, str) and re.fullmatch(r"T\d{3,}", task_id),
                "Invalid task ID")
        require(task_id not in tasks, f"Duplicate handoff task ID: {task_id}")
        require(text(entry.get("description")), f"{task_id}: missing description")
        for field in ("technical_requirements", "acceptance_criteria", "spec_refs",
                      "architecture_refs", "files"):
            strings(entry.get(field), f"{task_id}.{field}", nonempty=True)
        strings(entry.get("dependencies"), f"{task_id}.dependencies")
        strings(entry.get("blockers"), f"{task_id}.blockers")
        require(entry.get("priority") in ("P1", "P2", "P3"), f"{task_id}: invalid priority")
        require(entry.get("status") in ("ready", "waiting", "blocked", "in_progress", "done"),
                f"{task_id}: invalid status")
        for field in ("spec_refs", "architecture_refs"):
            for reference in entry[field]:
                path, sep, anchor = reference.partition("#")
                require(sep and text(anchor), f"{task_id}: reference needs a section/ID: {reference}")
                require(path in hashes, f"{task_id}: reference lacks snapshot: {path}")
                if field == "spec_refs":
                    require(path == f"{feature}/spec.md", f"{task_id}: spec reference targets another feature")
                else:
                    require(path not in {f"{feature}/tasks.md", f"{feature}/spec.md", report_path,
                                         ".specify/memory/constitution.md"},
                            f"{task_id}: architecture reference is not a design/source document")
        ownership[task_id] = [local_path(root, path) for path in entry["files"]]
        tasks[task_id] = entry

    checklist = task_lines((root / feature / "tasks.md").read_text(encoding="utf-8"))
    require(tasks.keys() == checklist.keys(), "Task IDs differ between handoff.json and tasks.md")
    for task_id, entry in tasks.items():
        for dep in entry["dependencies"]:
            require(dep in tasks, f"{task_id}: unknown dependency {dep}")
            require(dep != task_id, f"{task_id}: self dependency")

    ancestors = {}
    visiting = set()

    def visit(task_id):
        require(task_id not in visiting, f"Dependency cycle at {task_id}")
        if task_id in ancestors:
            return ancestors[task_id]
        visiting.add(task_id)
        found = set(tasks[task_id]["dependencies"])
        for dependency in tasks[task_id]["dependencies"]:
            found.update(visit(dependency))
        visiting.remove(task_id)
        ancestors[task_id] = found
        return found

    for task_id in tasks:
        visit(task_id)

    ready, waiting, blocked, marked_parallel = [], [], [], []
    for task_id, entry in tasks.items():
        status = entry["status"]
        completed = all(tasks[dep]["status"] == "done" for dep in entry["dependencies"])
        require(checklist[task_id][0] == (status == "done"), f"{task_id}: checkbox/status mismatch")
        if status in ("ready", "waiting", "in_progress"):
            require(analysis["status"] == "passed" and not entry["blockers"],
                    f"{task_id}: unresolved analysis/blockers require blocked status")
        if status in ("ready", "in_progress", "done"):
            require(completed, f"{task_id}: incomplete dependencies prevent {status}")
            require(not entry["blockers"], f"{task_id}: blockers prevent {status}")
        if status == "waiting":
            require(not completed, f"{task_id}: waiting task has completed dependencies")
            waiting.append(task_id)
        elif status == "blocked":
            require(bool(entry["blockers"]) or analysis["status"] == "blocked",
                    f"{task_id}: blocked status needs a reason")
            blocked.append(task_id)
        elif status == "ready":
            ready.append(task_id)
        if checklist[task_id][1] and status != "done":
            require(completed and status in ("ready", "in_progress"),
                    f"{task_id}: [P] task has incomplete prerequisites or blockers")
            marked_parallel.append(task_id)

    groups = packet.get("parallel_groups")
    require(isinstance(groups, list), "parallel_groups must be an array")
    for group in groups:
        strings(group, "parallel group", nonempty=True)
        require(len(group) >= 2, "Parallel group needs at least two tasks")
    for group in groups + ([marked_parallel] if len(marked_parallel) >= 2 else []):
        for index, task_id in enumerate(group):
            require(task_id in tasks, f"Unknown parallel task: {task_id}")
            for other in group[:index]:
                require(other not in ancestors[task_id] and task_id not in ancestors[other],
                        f"Parallel tasks depend on each other: {other}, {task_id}")
                require(not any(overlaps(a, b) for a in ownership[task_id] for b in ownership[other]),
                        f"Parallel ownership conflict: {other}, {task_id}")

    delivery = packet.get("handoff")
    require(isinstance(delivery, dict), "handoff must be an object")
    require(delivery.get("status") in ("prepared", "dispatched", "acknowledged"),
            "Invalid handoff status")
    for field in ("recipient", "evidence"):
        require(field in delivery and (delivery[field] is None or text(delivery[field])),
                f"handoff.{field} must be a non-empty string or null")
    eligible = analysis["status"] == "passed" and not blocked
    if delivery["status"] != "prepared":
        require(text(delivery["recipient"]) and text(delivery["evidence"]),
                "Delivered handoff needs recipient and evidence")
        require(eligible, "Blocked packet cannot be marked delivered")
    return {"valid": True, "dispatch_eligible": eligible, "ready": ready,
            "waiting": waiting, "blocked": blocked, "task_count": len(tasks), "errors": []}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("packet", type=Path, help="handoff.json path relative to workspace")
    parser.add_argument("--workspace", type=Path, default=Path.cwd())
    args = parser.parse_args()
    try:
        root = args.workspace.resolve()
        path = local_path(root, args.packet.as_posix())
        packet = json.loads(path.read_text(encoding="utf-8"))
        result = validate_packet(packet, root)
    except (OSError, ValueError, RecursionError) as exc:
        result = {"valid": False, "dispatch_eligible": False, "errors": [str(exc)]}
    print(json.dumps(result, indent=2))
    return 0 if result["valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
