import copy
import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch

import yaml

from qa_state import StateError, read_config, record_result, summary


class QAStateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.config = self.root / "docs/config.yaml"
        self.config.parent.mkdir()
        self.config.write_text("retry_count: 0\nprocessed_runs: {}\n")
        self.feature = "specs/001-booking"
        (self.root / self.feature).mkdir(parents=True)
        artifacts = {f"{self.feature}/spec.md": "# FR-001\nPersist bookings.\n",
                     "src/booking.py": "def save_booking(): pass\n",
                     f"{self.feature}/comparison.log": "FR-001 comparison evidence\n",
                     f"{self.feature}/tests.log": "Observed test command outcome\n"}
        for path, content in artifacts.items():
            target = self.root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content)
        self.hashes = {path: hashlib.sha256((self.root / path).read_bytes()).hexdigest()
                       for path in artifacts}

    def result(self, run_id, comparison="passed", tests="failed"):
        failed = "failed" in (comparison, tests)
        blocked = "blocked" in (comparison, tests)
        return {"run_id": run_id, "feature_dir": self.feature,
                "comparison": comparison, "tests": tests,
                "artifact_hashes": copy.deepcopy(self.hashes),
                "comparison_evidence": [f"{self.feature}/comparison.log"],
                "test_evidence": [f"{self.feature}/tests.log"],
                "findings": [{"task_id": "T001", "requirement_ref": "FR-001",
                              "expected": "Booking persists", "actual": "Booking is missing",
                              "reproduction": "Save then reload booking ID",
                              "fix_guidance": "Correct persistence in Manager"}] if failed else [],
                "blockers": ["Test environment unavailable"] if blocked else []}

    def record(self, result, revision=None):
        if revision is None:
            revision = summary(read_config(self.config))["revision"]
        return record_result(self.config, result, self.root, revision)

    def failures(self, count):
        return [self.record(self.result(f"failure-{index}")) for index in range(count)]

    def test_fourth_failure_halts_and_no_next_trigger(self):
        results = self.failures(4)
        self.assertEqual([item["retry_count"] for item in results], [1, 2, 3, 4])
        self.assertEqual([item["next_target"] for item in results],
                         ["coding-agent", "coding-agent", "coding-agent", None])
        self.assertTrue(results[-1]["stop_development"])
        self.assertEqual(read_config(self.config)["retry_count"], 4)

    def test_fifth_failure_is_refused(self):
        self.failures(4)
        before = self.config.read_bytes()
        with self.assertRaisesRegex(StateError, "HALTED"):
            self.record(self.result("fifth"))
        self.assertEqual(self.config.read_bytes(), before)

    def test_full_pass_resets_and_routes_pm(self):
        self.failures(2)
        result = self.record(self.result("pass", "passed", "passed"))
        self.assertEqual(result["previous_retry_count"], 2)
        self.assertEqual(result["retry_count"], 0)
        self.assertEqual(result["next_target"], "pm-agent")
        self.assertFalse(result["halted"])

    def test_pass_can_recover_halted_state(self):
        self.failures(4)
        result = self.record(self.result("recovery", "passed", "passed"))
        self.assertEqual(result["retry_count"], 0)
        self.assertEqual(result["development_status"], "ACTIVE")

    def test_comparison_pass_test_fail_does_not_reset(self):
        self.failures(1)
        result = self.record(self.result("test-failure", "passed", "failed"))
        self.assertEqual(result["retry_count"], 2)

    def test_tests_pass_comparison_fail_does_not_reset(self):
        self.failures(1)
        result = self.record(self.result("comparison-failure", "failed", "passed"))
        self.assertEqual(result["retry_count"], 2)

    def test_blocked_evidence_does_not_increment_or_reset(self):
        self.failures(2)
        before = self.config.read_bytes()
        result = self.record(self.result("blocked", "passed", "blocked"))
        self.assertEqual(result["retry_count"], 2)
        self.assertEqual(result["revision"], 2)
        self.assertIsNone(result["next_target"])
        self.assertFalse(result["applied"])
        self.assertEqual(self.config.read_bytes(), before)

    def test_duplicate_failed_delivery_counts_once(self):
        report = self.result("duplicate")
        self.record(report, 0)
        before = self.config.read_bytes()
        duplicate = self.record(report, 0)
        self.assertEqual(duplicate["retry_count"], 1)
        self.assertEqual(duplicate["revision"], 1)
        self.assertFalse(duplicate["applied"])
        self.assertTrue(duplicate["event_current"])
        self.assertEqual(self.config.read_bytes(), before)

    def test_old_failure_after_pass_does_not_retrigger_coding(self):
        old = self.result("old")
        self.record(old)
        self.record(self.result("new-pass", "passed", "passed"))
        replay = self.record(old, 0)
        self.assertFalse(replay["event_current"])
        self.assertIsNone(replay["next_target"])
        self.assertEqual(replay["retry_count"], 0)

    def test_old_pass_does_not_reset_newer_failure(self):
        old = self.result("old-pass", "passed", "passed")
        self.record(old)
        self.record(self.result("new-fail"))
        replay = self.record(old, 0)
        self.assertEqual(replay["retry_count"], 1)
        self.assertIsNone(replay["next_target"])

    def test_run_id_cannot_change_outcome(self):
        self.record(self.result("same-id"))
        before = self.config.read_bytes()
        with self.assertRaisesRegex(StateError, "conflicting"):
            self.record(self.result("same-id", "passed", "passed"))
        self.assertEqual(self.config.read_bytes(), before)

    def test_stale_revision_preserves_state(self):
        self.record(self.result("first"), 0)
        before = self.config.read_bytes()
        with self.assertRaisesRegex(StateError, "revision changed"):
            self.record(self.result("second"), 0)
        self.assertEqual(self.config.read_bytes(), before)

    def test_concurrent_results_cannot_lose_retry_updates(self):
        def update(run_id):
            try:
                return self.record(self.result(run_id), 0)
            except StateError as error:
                return str(error)

        with ThreadPoolExecutor(max_workers=2) as executor:
            results = list(executor.map(update, ["concurrent-a", "concurrent-b"]))
        self.assertEqual(sum(isinstance(item, dict) for item in results), 1)
        self.assertEqual(read_config(self.config)["retry_count"], 1)
        self.assertEqual(summary(read_config(self.config))["revision"], 1)

    def test_stale_code_snapshot_is_rejected(self):
        (self.root / "src/booking.py").write_text("Changed after QA")
        before = self.config.read_bytes()
        with self.assertRaisesRegex(StateError, "Stale evidence"):
            self.record(self.result("stale"))
        self.assertEqual(self.config.read_bytes(), before)

    def test_evidence_changed_while_acquiring_lock_is_rejected(self):
        import qa_state
        actual_flock = qa_state.fcntl.flock

        def change_snapshot_then_lock(fd, mode):
            (self.root / "src/booking.py").write_text("Changed while queued for the state lock")
            return actual_flock(fd, mode)

        before = self.config.read_bytes()
        with patch("qa_state.fcntl.flock", side_effect=change_snapshot_then_lock):
            with self.assertRaisesRegex(StateError, "Stale evidence"):
                self.record(self.result("changed-while-queued"))
        self.assertEqual(self.config.read_bytes(), before)

    def test_failure_requires_actionable_findings(self):
        report = self.result("no-findings")
        report["findings"] = []
        with self.assertRaisesRegex(StateError, "actionable findings"):
            self.record(report)

    def test_pass_with_unresolved_findings_is_rejected(self):
        report = self.result("false-pass")
        report["tests"] = "passed"
        with self.assertRaisesRegex(StateError, "retain defects"):
            self.record(report)

    def test_counter_requires_integer_not_bool_string_or_negative(self):
        for bad in (True, "3", -1, 1.5):
            with self.subTest(value=bad):
                self.config.write_text(yaml.safe_dump({"retry_count": bad}))
                with self.assertRaisesRegex(StateError, "non-negative integer"):
                    read_config(self.config)

    def test_simple_user_config_and_extra_fields_are_preserved(self):
        self.config.write_text("retry_count: 2\nowner: project\n")
        self.record(self.result("simple"), 0)
        config = read_config(self.config)
        self.assertEqual(config["owner"], "project")
        self.assertEqual(config["retry_count"], 3)

    def test_path_traversal_is_rejected(self):
        report = self.result("traversal")
        report["artifact_hashes"] = {"../escape.log": "a" * 64}
        with self.assertRaisesRegex(StateError, "Invalid workspace-relative"):
            self.record(report)

    def test_cli_status_record_and_invalid_input(self):
        script = Path(__file__).with_name("qa_state.py")
        base = [sys.executable, str(script), "--config", str(self.config)]
        status = subprocess.run(base + ["status"], capture_output=True, text=True)
        self.assertEqual(status.returncode, 0, status.stdout)
        self.assertEqual(json.loads(status.stdout)["retry_count"], 0)
        relative = f"{self.feature}/result.json"
        (self.root / relative).write_text(json.dumps(self.result("cli")))
        record = subprocess.run(base + ["record", "--workspace", str(self.root),
                                       "--result", relative, "--expected-revision", "0"],
                                capture_output=True, text=True)
        self.assertEqual(record.returncode, 0, record.stdout)
        self.assertEqual(json.loads(record.stdout)["next_target"], "coding-agent")
        (self.root / relative).write_text("[]")
        invalid = subprocess.run(base + ["record", "--workspace", str(self.root),
                                        "--result", relative, "--expected-revision", "1"],
                                 capture_output=True, text=True)
        self.assertEqual(invalid.returncode, 1)
        self.assertIsNone(json.loads(invalid.stdout)["next_target"])


if __name__ == "__main__":
    unittest.main()
