# References

Verified 2026-10-14. The supplied prompt and follow-up define the requested
package layout and skill-index behavior.

| Source | Applied finding |
| --- | --- |
| [OpenAI: Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | Standalone project agents use `.codex/agents/*.toml` with name, description, and developer instructions; permissions, provider, and MCP configuration are inherited. |
| [OpenAI: Build skills](https://learn.chatgpt.com/docs/build-skills) | SKILL.md supplies name and description; `.agents/skills` is scanned and directory symlinks are supported. Skills are distinct from custom slash commands. |
| Installed skill-creator/SKILL.md | Used the initializer, supported YAML, focused routing, UI metadata conventions, and quick validation. |
| Installed openai-docs/SKILL.md | Used official sources to verify this Codex configuration and skill discovery. |

Local versions: Python 3.14.8 and Codex CLI 0.162.1; uv is available. These
references do not establish model execution results or future MCP access.
