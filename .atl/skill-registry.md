# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review. | branch-pr | C:\Users\ADMIN\.gemini\antigravity\skills\branch-pr\SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | C:\Users\ADMIN\.gemini\antigravity\skills\go-testing\SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature. | issue-creation | C:\Users\ADMIN\.gemini\antigravity\skills\issue-creation\SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen". | judgment-day | C:\Users\ADMIN\.gemini\antigravity\skills\judgment-day\SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI. | skill-creator | C:\Users\ADMIN\.gemini\antigravity\skills\skill-creator\SKILL.md |

## Compact Rules

### branch-pr
- Every PR MUST link an approved issue (`status:approved`) using `Closes #N`, `Fixes #N`, or `Resolves #N`.
- Every PR MUST have exactly one `type:*` label (bug, feature, docs, refactor, chore, breaking-change).
- Branch names MUST follow `type/description` pattern (e.g., `feat/user-login`).
- Commit messages MUST follow conventional commits: `type(scope): description`.
- Automated checks (shellcheck, PR validation) must pass before merging.
- No `Co-Authored-By` trailers in commits.

### go-testing
- Use Table-Driven Tests for multiple test cases.
- Test Bubbletea state transitions by calling `Model.Update()` directly.
- Use Charmbracelet's `teatest` for TUI integration tests.
- Use Golden File Testing for visual output (compare `m.View()` against saved files).
- Use `t.TempDir()` for file operations.
- Mock system/exec using interfaces + mocks.
- Run `go test -update` to refresh golden files.

### judgment-day
- Parallel adversarial review protocol with two independent blind judges.
- Launch judges simultaneously, synthesize findings, and apply fixes.
- Re-judge until both pass or escalate after 2 iterations.

### skill-creator
- Creates new skills following the Agent Skills spec.
- Includes `SKILL.md` with YAML frontmatter (name, description).

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| AGENTS.md | AGENTS.md | Index — defines Feature-Slices architecture and project rules |

Read the convention files listed above for project-specific patterns and rules.
