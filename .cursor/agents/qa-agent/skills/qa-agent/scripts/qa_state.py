#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["PyYAML>=6.0"]
# ///
"""Read shared QA retry state or record one evidence-backed QA result atomically."""

import argparse
import fcntl
import hashlib
import json
import os
import re
import tempfile
import time
from pathlib import Path

import yaml


class StateError(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise StateError(message)


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def relative_file(root, value):
    require(nonempty(value), "Evidence path must be a string")
    path = Path(value)
    require(not path.is_absolute() and "\\" not in value and
            not any(part in ("", ".", "..") for part in value.split("/")),
            f"Invalid workspace-relative evidence path: {value}")
    resolved = (root / path).resolve()
    require(resolved.is_relative_to(root), f"Evidence path escapes workspace: {value}")
    require(resolved.is_file(), f"Evidence file missing: {value}")
    return resolved


def read_config(path):
    try:
        data = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        raise StateError(f"Invalid config YAML: {exc}") from exc
    require(isinstance(data, dict), "Config must be a YAML mapping")
    count = data.get("retry_count")
    require(type(count) is int and count >= 0, "retry_count must be a non-negative integer")
    runs = data.get("processed_runs", {})
    require(isinstance(runs, dict), "processed_runs must be a mapping")
    for run_id, receipt in runs.items():
        require(nonempty(run_id) and isinstance(receipt, dict), "Invalid processed run")
        require(receipt.get("verdict") in ("passed", "failed"), "Invalid processed verdict")
        require(isinstance(receipt.get("evidence_sha256"), str) and
                re.fullmatch(r"[a-f0-9]{64}", receipt["evidence_sha256"]),
                "Invalid processed evidence digest")
        require(type(receipt.get("retry_count_after")) is int and receipt["retry_count_after"] >= 0,
                "Invalid processed retry count")
    data["processed_runs"] = runs
    return data


def summary(data):
    runs = data["processed_runs"]
    last = next(reversed(runs), None)
    return {"retry_count": data["retry_count"], "revision": len(runs),
            "development_status": "HALTED" if data["retry_count"] > 3 else "ACTIVE",
            "halted": data["retry_count"] > 3, "last_run_id": last}


def validate_result(result, workspace):
    root = Path(workspace).resolve()
    require(root.is_dir(), "Workspace does not exist")
    require(isinstance(result, dict), "QA result must be an object")
    require(nonempty(result.get("run_id")), "run_id is required")
    feature = result.get("feature_dir")
    require(nonempty(feature), "feature_dir is required")
    # A feature directory is a context reference; snapshots themselves must be files.
    require(not Path(feature).is_absolute() and "\\" not in feature and
            not any(part in ("", ".", "..") for part in feature.split("/")),
            "feature_dir must be workspace-relative without traversal")
    resolved_feature = (root / feature).resolve()
    require(resolved_feature.is_relative_to(root) and resolved_feature.is_dir(),
            "feature_dir is missing or escapes workspace")
    for component in ("comparison", "tests"):
        require(result.get(component) in ("passed", "failed", "blocked"),
                f"Invalid {component} status")
    hashes = result.get("artifact_hashes")
    require(isinstance(hashes, dict) and bool(hashes), "artifact_hashes must not be empty")
    for path, digest in hashes.items():
        artifact = relative_file(root, path)
        require(isinstance(digest, str) and re.fullmatch(r"[a-f0-9]{64}", digest),
                f"Invalid evidence SHA-256: {path}")
        require(hashlib.sha256(artifact.read_bytes()).hexdigest() == digest,
                f"Stale evidence snapshot: {path}")
    for field in ("comparison_evidence", "test_evidence"):
        refs = result.get(field)
        require(isinstance(refs, list) and bool(refs) and all(nonempty(ref) for ref in refs),
                f"{field} must contain evidence references")
        require(all(ref.partition("#")[0] in hashes for ref in refs),
                f"{field} references missing snapshots")
    findings = result.get("findings")
    blockers = result.get("blockers")
    require(isinstance(findings, list), "findings must be an array")
    require(isinstance(blockers, list) and all(nonempty(item) for item in blockers),
            "blockers must be an array of reasons")
    for finding in findings:
        require(isinstance(finding, dict), "Each finding must be an object")
        for field in ("task_id", "requirement_ref", "expected", "actual", "reproduction", "fix_guidance"):
            require(nonempty(finding.get(field)), f"Finding is missing {field}")
    states = (result["comparison"], result["tests"])
    if "failed" in states:
        require(bool(findings), "Failed QA result needs actionable findings")
        verdict = "failed"
    elif "blocked" in states:
        require(bool(blockers), "Blocked QA result needs a reason")
        verdict = "blocked"
    else:
        require(not findings and not blockers, "Passing QA cannot retain defects or blockers")
        verdict = "passed"
    # Canonical digest makes repeat JSON serialization independent of whitespace/key order.
    digest = hashlib.sha256(json.dumps(result, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    return verdict, digest


def atomic_write(path, data):
    path = Path(path)
    scratch = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent,
                                         prefix=f".{path.name}.", delete=False) as handle:
            scratch = Path(handle.name)
            yaml.safe_dump(data, handle, sort_keys=False)
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(scratch, path.stat().st_mode & 0o777)
        os.replace(scratch, path)
    finally:
        if scratch is not None and scratch.exists():
            scratch.unlink()


def record_result(config, result, workspace, expected_revision):
    require(type(expected_revision) is int and expected_revision >= 0,
            "expected_revision must be a non-negative integer")
    verdict, digest = validate_result(result, workspace)
    config = Path(config).resolve()
    require(config.is_file(), "Config is missing; do not silently initialize/reset state")
    with config.with_name(f".{config.name}.lock").open("a") as lock:
        deadline = time.monotonic() + 5
        while True:
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except BlockingIOError:
                require(time.monotonic() < deadline, "QA state lock is busy; reconcile before retrying")
                time.sleep(0.05)
        data = read_config(config)
        runs = data["processed_runs"]
        run_id = result["run_id"]
        applied = False
        previous = data["retry_count"]
        if run_id in runs:
            require(runs[run_id]["evidence_sha256"] == digest and runs[run_id]["verdict"] == verdict,
                    "Run ID reused with conflicting evidence/outcome")
        else:
            require(len(runs) == expected_revision, "State revision changed; result needs reconciliation")
            if verdict == "failed":
                require(data["retry_count"] <= 3, "Development is HALTED; no further failed repair cycle")
                data["retry_count"] += 1
            elif verdict == "passed":
                data["retry_count"] = 0
            if verdict != "blocked":
                runs[run_id] = {"verdict": verdict, "evidence_sha256": digest,
                                "retry_count_after": data["retry_count"],
                                "feature_dir": result["feature_dir"]}
                atomic_write(config, data)
                applied = True
        info = summary(data)
        current = info["last_run_id"] == run_id
        target = None
        if current and not info["halted"]:
            target = "pm-agent" if verdict == "passed" else "coding-agent" if verdict == "failed" else None
        return {**info, "previous_retry_count": previous, "verdict": verdict,
                "applied": applied, "event_current": current, "next_target": target,
                "stop_development": info["halted"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path,
                        default=Path(__file__).resolve().parents[3] / "docs/config.yaml")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("status")
    record = commands.add_parser("record")
    record.add_argument("--workspace", type=Path, default=Path.cwd())
    record.add_argument("--result", required=True, type=Path)
    record.add_argument("--expected-revision", required=True, type=int)
    args = parser.parse_args()
    try:
        if args.command == "status":
            output = summary(read_config(args.config))
        else:
            path = relative_file(args.workspace.resolve(), args.result.as_posix())
            result = json.loads(path.read_text(encoding="utf-8"))
            output = record_result(args.config, result, args.workspace, args.expected_revision)
        print(json.dumps(output, indent=2))
        return 0
    except (OSError, ValueError) as exc:
        print(json.dumps({"error": str(exc), "next_target": None}, indent=2))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
