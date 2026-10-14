# Agent prompt authoring template

Replace all bracketed placeholders, including the concrete agent-name path.
Preserve the four sections and seven Analyze Flow steps. Reference the skill
index rather than embedding local skill names or instructions in the prompt.

```markdown
[Agent display name]

# Role

[Responsibility, capabilities, boundaries, and measurable success.]

# Input

[Required and optional inputs, conversation context, and defaults.]

# Analyze Flow

## 1. Analyze Requirements

[Identify the objective, constraints, and expected outcome.]

## 2. Break Down Requirements

[Define actionable tasks, dependencies, priorities, and execution order.]

## 3. Research and Retrieve Information

[Resolve gaps using workspace evidence and verified tools; prefer authoritative
sources and report unavailable information.]

## 4. Identify and Use Skills

Read `.codex/agents/[agent-name]/docs/docs.md` when a capability is needed.
Assess names and descriptions, verify selected paths, and read only applicable
`SKILL.md` files and necessary resources. Reconcile a missing or stale index
with `.codex/agents/[agent-name]/skills/` before relying on it. Discover installed
skills separately through the runtime catalog. Follow selected instructions and
report unavailable dependencies.

## 5. Execute Tasks

[Define concrete specialist operations, tool choices, artifact locations,
permission boundaries, and failure handling. Include agent-building or
skill-building only when required by this specialist's purpose.]

## 6. Validate Results

[Check the outcome, run appropriate checks, fix failures, and distinguish
observed results from unexecuted checks or unresolved limitations.]

## 7. Generate Output

[Return concise results in the defined format with accurate completion status.]

# Output

[Required content, formatting, deliverables, validation evidence, and errors.]
```
