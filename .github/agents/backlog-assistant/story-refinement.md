# Story Refinement

Refine a user story ticket through interview and structured writing.

Read [shared rules](shared-rules.md) before writing any content.
Read [story format](story-format.md) for field format requirements.

Absolutely NEVER implement any code changes.

---

## Step 1 — Load Story File

The ticket file was already located by the agent's mode detection step. Read its contents now if not already loaded.

If the file does not exist or could not be located, ask the user to open the `.ticket` file in the editor or run **Backlog Assistant: Fetch Ticket** to download it.

---

## Step 2 — Interview the User

Interview the user relentlessly about every aspect of the story until you reach a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one. For each question, provide possible answers and mark the recommended answer.

Ask one question at a time.

### Guidelines

- ALWAYS start by asking for the story key or details if not already provided
- Focus on mid-level design decisions — reference modules, specific workflows, or apps without referencing specific files unless instructed in the tech notes
- Do NOT write a full implementation plan — keep it at the level of "what" not "how"
- NEVER go into very low level implementation details (class names, function signatures)
- Focus areas to probe (skip if already covered):
  - Personas and their goals
  - Acceptance criteria completeness and testability
  - Boundaries — what is explicitly out of scope
  - Dependencies or prerequisites
  - Testing approach (unit / integration / manual)
  - Scope size — if the ticket covers multiple independent deliverables, suggest splitting it
- **Scope split guidance.** If the ticket spans distinct independent pieces of work that could be delivered separately, flag this and propose a split with a brief rationale. Let the user decide.

Never invent personas, thresholds, third-party choices, deadlines, or named teams.

### Properties of Good Epic

- **Independent**: Can be prioritised on something other than technical dependency
- **Negotiable**: Leaves room for collaboration on the details of what and how
- **Valuable**: Adds a visible increment of value for a user — not a component, not a layer, not a task
- **Estimable**: Defined enough that the team can size it relative to other stories
- **Testable**: A concrete change in system behaviour with a way to know it's done |

---

## Step 3 — Provide Story Summary

Once enough detail is gathered, provide a concise summary of the story covering:

- The persona and their goal/outcome
- Key acceptance criteria
- Technical approach at module/workflow level
- Testing strategy

Wait for the user to approve or request changes before proceeding to Step 4.

---

## Step 4 — Update Story File

Once the user confirms, update the ticket. Write the full description in one go — do not ask about individual sections. Once done run the `validateTicket` tool to ensure the format of the ticket is valid.

### Rules

- Only edit `.ticket` files — never modify any other file in the workspace
- **Never** modify frontmatter properties other than `title`
- Update `title` only when the current one is clearly misleading or too vague; otherwise leave it unchanged
- Only include sections defined in the [story format](story-format.md); no extras
- No blank line after section headings — content starts immediately on the next line
- Blank lines between section headings only (separate introduction from Acceptance Criteria, etc.)
- Keep acceptance criteria business-friendly; use full plain-English sentences describing observable user-facing behaviour — no technical jargon, no backtick-wrapped identifiers; reserve technical detail for Technical Notes
- Technical Notes items: imperative/actionable form (e.g. "Add unit tests for…")

### After writing

Summarise what changed: which sections were edited or added, which questions stayed open, and any fields the user still needs to set themselves via the structured editor in VS Code (component, epic key, bucket, draft flag).
