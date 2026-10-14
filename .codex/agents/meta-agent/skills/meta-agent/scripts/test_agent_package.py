"""Behavioral tests for packaging helpers; no model or connector calls."""

import os
import tempfile
import tomllib
import unittest
from pathlib import Path

import agent_package as helper


class AgentPackageTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        self.name = "sample-agent"
        self.package = self.root / ".codex/agents" / self.name
        (self.package / "prompt").mkdir(parents=True)
        (self.package / "docs").mkdir()
        (self.package / "skills").mkdir()
        for file in ("requirements.md", "architecture.md", "test-cases.md"):
            (self.package / "docs" / file).write_text("Documented evidence.\n")
        self.prompt = self.sample_prompt()
        (self.package / "prompt/system.md").write_text(self.prompt)
        self.add_skill(self.name, "Run the sample agent workflow.")

    def sample_prompt(self):
        text = "Sample Agent\n\n# Role\n\nA focused sample role.\n\n# Input\n\nA user request.\n\n# Analyze Flow\n\n"
        for number, step in enumerate(helper.STEPS, 1):
            text += f"## {number}. {step}\n\n"
            if number == 4:
                text += f"Read `.codex/agents/{self.name}/docs/docs.md` to select skills.\n\n"
            else:
                text += "Perform the relevant sample operation.\n\n"
        return text + "# Output\n\nA result with evidence.\n"

    def add_skill(self, name, description):
        folder = self.package / "skills" / name
        folder.mkdir()
        (folder / "SKILL.md").write_text(
            f"---\nname: {name}\ndescription: {description}\n---\n\nPerform this capability.\n"
        )
        published = self.root / ".agents/skills" / name
        published.parent.mkdir(parents=True, exist_ok=True)
        published.symlink_to(os.path.relpath(folder, published.parent), target_is_directory=True)
        return folder

    def synchronize(self):
        helper.sync(self.root, self.name, "A sample agent.")

    def test_complete_package_and_multiple_skill_index(self):
        self.add_skill("zebra-skill", "A second capability.")
        self.add_skill("alpha-skill", "A first capability.")
        self.synchronize()
        self.assertEqual(helper.validate(self.root, self.name), [])
        index = (self.package / "docs/docs.md").read_text()
        self.assertLess(index.index("alpha-skill"), index.index("zebra-skill"))
        self.assertIn("A second capability.", index)
        self.assertIn("../skills/alpha-skill/SKILL.md", index)

    def test_sync_preserves_optional_config_and_is_idempotent(self):
        self.synchronize()
        registration = self.package.parent / f"{self.name}.toml"
        registration.write_text(registration.read_text() + '\n# Keep this setting\nmodel = "chosen-model"\n')
        helper.sync(self.root, self.name)
        previous = registration.read_bytes()
        helper.sync(self.root, self.name)
        self.assertEqual(previous, registration.read_bytes())
        config = tomllib.loads(registration.read_text())
        self.assertEqual(config["model"], "chosen-model")
        self.assertEqual(config["developer_instructions"], self.prompt)
        self.assertIn("# Keep this setting", registration.read_text())

    def test_metadata_drift_is_detected_and_repaired(self):
        self.synchronize()
        manifest = self.package / "skills" / self.name / "SKILL.md"
        manifest.write_text(manifest.read_text().replace("Run the sample agent workflow.", "Changed capability."))
        self.assertTrue(any("Skill index differs" in error for error in helper.validate(self.root, self.name)))
        helper.sync(self.root, self.name)
        self.assertEqual(helper.validate(self.root, self.name), [])
        self.assertIn("Changed capability.", (self.package / "docs/docs.md").read_text())

    def test_prompt_drift_and_missing_index_reference(self):
        self.synchronize()
        prompt_path = self.package / "prompt/system.md"
        prompt_path.write_text(self.prompt.replace("A focused sample role.", "An updated role."))
        self.assertTrue(any("instructions differ" in error for error in helper.validate(self.root, self.name)))
        prompt_path.write_text(self.prompt.replace(f".codex/agents/{self.name}/docs/docs.md", "elsewhere.md"))
        with self.assertRaisesRegex(helper.PackageError, "Skill selection must reference"):
            helper.sync(self.root, self.name)

    def test_missing_skill_publication_and_incomplete_structure(self):
        self.synchronize()
        (self.root / ".agents/skills" / self.name).unlink()
        (self.package / "docs/architecture.md").unlink()
        errors = helper.validate(self.root, self.name)
        self.assertTrue(any("Missing published skill" in error for error in errors))
        self.assertTrue(any("architecture.md" in error for error in errors))

    def test_invalid_yaml_prevents_all_sync_writes(self):
        self.synchronize()
        registration = self.package.parent / f"{self.name}.toml"
        previous = registration.read_bytes()
        (self.package / "skills" / self.name / "SKILL.md").write_text("---\nname: [\n---\n")
        with self.assertRaisesRegex(helper.PackageError, "Invalid YAML"):
            helper.sync(self.root, self.name, "Changed description.")
        self.assertEqual(registration.read_bytes(), previous)

    def test_invalid_names_and_escaping_paths(self):
        for name in ("../escape", "UpperCase", "bad--name", "", "a" * 64):
            with self.subTest(name=name), self.assertRaises(helper.PackageError):
                helper.locations(self.root, name)
        with tempfile.TemporaryDirectory() as external:
            (self.package / "docs" / "docs.md").symlink_to(Path(external) / "docs.md")
            with self.assertRaisesRegex(helper.PackageError, "escapes workspace"):
                helper.sync(self.root, self.name, "Sample.")

    def test_conflicting_registration_is_not_overwritten(self):
        self.synchronize()
        registration = self.package.parent / f"{self.name}.toml"
        text = registration.read_text().replace('name = "sample-agent"', 'name = "other-agent"', 1)
        registration.write_text(text)
        with self.assertRaisesRegex(helper.PackageError, "different agent name"):
            helper.sync(self.root, self.name)
        self.assertEqual(registration.read_text(), text)

    def test_multiline_description_and_special_characters(self):
        manifest = self.package / "skills" / self.name / "SKILL.md"
        manifest.write_text(f"---\nname: {self.name}\ndescription: |\n  First | capability.\n  Second capability.\n---\n\nInstructions.\n")
        self.synchronize()
        self.assertEqual(helper.validate(self.root, self.name), [])
        index = (self.package / "docs/docs.md").read_text()
        self.assertIn("First \\| capability.<br>Second capability.", index)

    def test_complete_copy_publication_and_resource_drift(self):
        import shutil
        canonical = self.package / "skills" / self.name
        (canonical / "references").mkdir()
        (canonical / "references/context.md").write_text("Supporting context.")
        published = self.root / ".agents/skills" / self.name
        published.unlink()
        shutil.copytree(canonical, published)
        self.synchronize()
        self.assertEqual(helper.validate(self.root, self.name), [])
        (published / "references/context.md").write_text("Stale supporting context.")
        self.assertTrue(any("copy differs" in error for error in helper.validate(self.root, self.name)))

    def test_prompt_with_quotes_and_backslashes_round_trips(self):
        path = self.package / "prompt/system.md"
        prompt = self.prompt.replace("A focused sample role.", 'Handle "quoted text", triple """, and \\ paths.')
        path.write_text(prompt)
        self.synchronize()
        registration = self.package.parent / f"{self.name}.toml"
        self.assertEqual(tomllib.loads(registration.read_text())["developer_instructions"], prompt)
        self.assertEqual(helper.validate(self.root, self.name), [])

    def test_missing_prompt_and_empty_skill_metadata(self):
        (self.package / "prompt/system.md").unlink()
        with self.assertRaisesRegex(helper.PackageError, "Missing canonical prompt"):
            self.synchronize()
        (self.package / "prompt/system.md").write_text(self.prompt)
        manifest = self.package / "skills" / self.name / "SKILL.md"
        manifest.write_text(f'---\nname: {self.name}\ndescription: ""\n---\n')
        with self.assertRaisesRegex(helper.PackageError, "Empty or unfinished"):
            self.synchronize()

    def test_no_local_skills_index_is_explicit(self):
        import shutil
        shutil.rmtree(self.package / "skills" / self.name)
        skills = helper.read_skills(self.root, self.package)
        self.assertEqual(skills, [])
        self.assertIn("No local skills are defined.", helper.render_index(self.package, skills))

    def test_skill_addition_and_removal_refresh_the_index(self):
        import shutil
        self.synchronize()
        added = self.add_skill("new-capability", "An added capability.")
        self.assertTrue(any("Skill index differs" in error for error in helper.validate(self.root, self.name)))
        helper.sync(self.root, self.name)
        self.assertEqual(helper.validate(self.root, self.name), [])
        (self.root / ".agents/skills/new-capability").unlink()
        shutil.rmtree(added)
        self.assertTrue(any("Skill index differs" in error for error in helper.validate(self.root, self.name)))
        helper.sync(self.root, self.name)
        self.assertEqual(helper.validate(self.root, self.name), [])
        self.assertNotIn("new-capability", (self.package / "docs/docs.md").read_text())

    def test_external_resource_symlinks_are_rejected(self):
        self.synchronize()
        with tempfile.TemporaryDirectory() as external:
            target = Path(external) / "context.md"
            target.write_text("Outside workspace.")
            (self.package / "skills" / self.name / "context.md").symlink_to(target)
            with self.assertRaisesRegex(helper.PackageError, "escapes workspace"):
                helper.validate(self.root, self.name)


if __name__ == "__main__":
    unittest.main()
