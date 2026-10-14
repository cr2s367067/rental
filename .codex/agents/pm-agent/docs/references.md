# Sources and compatibility

Retrieved 2026-10-14.

| Source | Applied finding |
| --- | --- |
| [GitHub Spec Kit repository](https://github.com/github/spec-kit) | Structured SDD skills and reusable artifacts; workflows are agent skills, not shell commands |
| [Spec Kit documentation](https://github.github.io/spec-kit/index.html) | SDD planning chain and optional checklist/analysis gates |
| [OpenAI Build skills](https://learn.chatgpt.com/docs/build-skills) | Repository `.agents/skills` discovery, symlink support, native `$` skill mentions |
| [OpenAI Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) | Standalone project `.codex/agents/*.toml` registrations |
| [OpenAI Custom Prompts](https://learn.chatgpt.com/docs/custom-prompts) | Legacy prompts deprecated; documented commands use `/prompts:name`, not arbitrary bare slash names |
| Installed Spec Kit six SKILL.md files and helper scripts | Actual stage procedures, read-only analysis, feature resolution, checklist semantics and task syntax |
| Installed meta-agent and skill-creator instructions | Canonical package layout, prompt/index sync, skill publication and validation |

The installed Spec Kit integration manifest identifies 0.14.2. Online documents
can describe newer behavior; local installed workflows remain the execution
source. No Spec Kit upgrade was performed. Research findings do not prove Context7
connectivity, Coding Agent delivery, or end-to-end model behavior.
