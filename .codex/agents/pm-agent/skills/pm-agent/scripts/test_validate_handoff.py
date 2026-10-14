import copy
import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from validate_handoff import PacketError, validate_packet


class HandoffTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.feature = "specs/001-booking"
        documents = {
            ".specify/memory/constitution.md": "# Constitution\nUse explicit contracts.\n",
            f"{self.feature}/spec.md": "# Booking\n## FR-001\nPersist a booking.\n",
            f"{self.feature}/plan.md": "# Plan\nUse SQLite.\n",
            f"{self.feature}/tasks.md": "- [ ] T001 Create db/schema.sql\n- [ ] T002 [US1] Create src/booking.py\n",
            f"{self.feature}/analysis.md": "# Analysis\nNo blocking findings.\n",
            "docs/architecture.md": "# Architecture\n## Persistence\nSQLite.\n",
            "docs/prd.md": "# PRD\nUsers can create and retrieve bookings.\n",
            f"{self.feature}/checklists/requirements.md": "- [x] CHK001 Persistence requirements are defined [spec.md#FR-001].\n",
        }
        for relative, content in documents.items():
            path = self.root / relative
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")

        def task(task_id, status, dependencies, path):
            return {"id": task_id, "description": "Create booking persistence",
                    "technical_requirements": ["Use SQLite transactions"],
                    "acceptance_criteria": ["A saved booking can be read by its ID"],
                    "dependencies": dependencies, "priority": "P1",
                    "spec_refs": [f"{self.feature}/spec.md#FR-001"],
                    "architecture_refs": ["docs/architecture.md#Persistence"],
                    "files": [path], "blockers": [], "status": status}

        self.packet = {"schema_version": 1, "feature_dir": self.feature,
                       "artifact_hashes": {},
                       "inputs": {"prd": "docs/prd.md", "architecture": "docs/architecture.md"},
                       "checklists": [f"{self.feature}/checklists/requirements.md"],
                       "analysis": {"status": "passed", "report": f"{self.feature}/analysis.md"},
                       "handoff": {"status": "prepared", "recipient": None, "evidence": None},
                       "tasks": [task("T001", "ready", [], "db/schema.sql"),
                                 task("T002", "waiting", ["T001"], "src/booking.py")],
                       "parallel_groups": []}
        self.refresh()

    def refresh(self):
        for path in self.root.rglob("*.md"):
            self.packet["artifact_hashes"][path.relative_to(self.root).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()

    def invalid(self, phrase):
        with self.assertRaisesRegex(PacketError, phrase):
            validate_packet(self.packet, self.root)

    def test_ready_waiting_and_read_only(self):
        before = copy.deepcopy(self.packet)
        result = validate_packet(self.packet, self.root)
        self.assertEqual(result["ready"], ["T001"])
        self.assertEqual(result["waiting"], ["T002"])
        self.assertTrue(result["dispatch_eligible"])
        self.assertEqual(self.packet, before)

    def test_completion_unlocks_downstream(self):
        path = self.root / self.feature / "tasks.md"
        path.write_text(path.read_text().replace("[ ] T001", "[x] T001"))
        self.packet["tasks"][0]["status"] = "done"
        self.packet["tasks"][1]["status"] = "ready"
        self.refresh()
        self.assertEqual(validate_packet(self.packet, self.root)["ready"], ["T002"])

    def test_premature_ready(self):
        self.packet["tasks"][1]["status"] = "ready"
        self.invalid("incomplete dependencies")

    def test_cycle(self):
        self.packet["tasks"][0]["dependencies"] = ["T002"]
        self.invalid("Dependency cycle")

    def test_unknown_dependency(self):
        self.packet["tasks"][1]["dependencies"] = ["T099"]
        self.invalid("unknown dependency")

    def test_missing_acceptance(self):
        self.packet["tasks"][0]["acceptance_criteria"] = []
        self.invalid("must not be empty")

    def test_missing_source_context(self):
        del self.packet["inputs"]["prd"]
        self.invalid("inputs.prd requires")

    def test_missing_requirements_checklist(self):
        self.packet["checklists"] = []
        self.invalid("must not be empty")

    def test_parallel_marker_shared_file(self):
        self.independent_tasks()
        self.packet["parallel_groups"] = []
        self.packet["tasks"][1]["files"] = ["db/schema.sql"]
        path = self.root / self.feature / "tasks.md"
        path.write_text(path.read_text().replace("T001 ", "T001 [P] ").replace("T002 ", "T002 [P] "))
        self.refresh()
        self.invalid("ownership conflict")

    def test_checkbox_mismatch(self):
        self.packet["tasks"][0]["status"] = "done"
        self.invalid("checkbox/status mismatch")

    def test_stale_source(self):
        (self.root / "docs/architecture.md").write_text("Changed architecture")
        self.invalid("Stale artifact")

    def test_cross_feature_spec_reference(self):
        self.packet["tasks"][0]["spec_refs"] = ["docs/architecture.md#Persistence"]
        self.invalid("another feature")

    def test_unhashed_reference(self):
        self.packet["tasks"][0]["architecture_refs"] = ["docs/missing.md#Design"]
        self.invalid("lacks snapshot")

    def test_parallel_dependency(self):
        self.packet["parallel_groups"] = [["T001", "T002"]]
        self.invalid("depend on each other")

    def independent_tasks(self):
        self.packet["tasks"][1]["dependencies"] = []
        self.packet["tasks"][1]["status"] = "ready"
        self.packet["parallel_groups"] = [["T001", "T002"]]

    def test_parallel_independent(self):
        self.independent_tasks()
        self.assertEqual(validate_packet(self.packet, self.root)["ready"], ["T001", "T002"])

    def test_parallel_directory_conflict(self):
        self.independent_tasks()
        self.packet["tasks"][0]["files"] = ["src/"]
        self.invalid("ownership conflict")

    def test_parallel_marker_requires_prerequisites(self):
        path = self.root / self.feature / "tasks.md"
        path.write_text(path.read_text().replace("T002 [US1]", "T002 [P] [US1]"))
        self.refresh()
        self.invalid("incomplete prerequisites")

    def test_blocked_draft_is_valid_but_not_dispatchable(self):
        self.packet["analysis"]["status"] = "blocked"
        for task in self.packet["tasks"]:
            task["status"] = "blocked"
        self.assertFalse(validate_packet(self.packet, self.root)["dispatch_eligible"])

    def test_delivery_requires_evidence(self):
        self.packet["handoff"]["status"] = "dispatched"
        self.invalid("recipient and evidence")

    def test_evidenced_delivery(self):
        self.packet["handoff"] = {"status": "dispatched", "recipient": "coding-agent",
                                  "evidence": "Tool receipt: thread-123"}
        self.assertTrue(validate_packet(self.packet, self.root)["valid"])

    def test_path_traversal(self):
        self.packet["tasks"][0]["files"] = ["../outside.py"]
        self.invalid("traversal")

    def test_cli_pass_and_malformed_input(self):
        packet_path = self.root / self.feature / "handoff.json"
        packet_path.write_text(json.dumps(self.packet))
        helper = Path(__file__).with_name("validate_handoff.py")
        command = [sys.executable, str(helper), "--workspace", str(self.root),
                   f"{self.feature}/handoff.json"]
        result = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stdout)
        self.assertEqual(json.loads(result.stdout)["ready"], ["T001"])
        packet_path.write_text("[]")
        result = subprocess.run(command, capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertFalse(json.loads(result.stdout)["valid"])


if __name__ == "__main__":
    unittest.main()
