# Epic Refinement

Refine an epic ticket through interview and structured writing.

Read [shared rules](shared-rules.md) before writing any content.
Read [epic format](epic-format.md) for field format requirements.

Absolutely NEVER implement any code changes.

---

## Step 1 — Load Epic File

The ticket file was already located by the agent's mode detection step. Read its contents now if not already loaded.

If the file does not exist or could not be located, ask the user to open the `.ticket` file in the editor or run **Backlog Assistant: Fetch Ticket** to download it.

---

## Step 2 — Interview the User

Interview the user relentlessly about every aspect of the epic until you reach a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one. For each question, provide possible answers and mark the recommended answer.

Ask one question at a time.

### Guidelines

- ALWAYS start by asking for the epic key or details if not already provided
- Focus on understanding the epic's goals, scope, dependencies, and potential risks
- NEVER go into very low level implementation details, but do explore architectural and high-level design decisions
- Focus areas to probe (skip if already covered):
  - Personas and their goals
  - Background context and motivation
  - Scope boundaries — what is explicitly in and out of scope
  - Dependencies with other teams or systems
  - Materials / references needed
- **Scope guidance.** If the epic spans distinct independent themes that could be delivered as separate epics, flag this and propose a split with a brief rationale. Let the user decide.

Never invent personas, thresholds, third-party choices, deadlines, or named teams.

---

## Step 3 — Provide Epic Summary

Once enough detail is gathered, provide a concise summary of the epic covering:

- The persona and their goal/outcome
- Key scope items
- Dependencies
- Out of scope items

Wait for the user to approve or request changes before proceeding to Step 4.

---

## Step 4 — Update Epic File

Once the user confirms, update the ticket. Write the full description in one go — do not ask about individual sections. Once done run the `validateTicket` tool to ensure the format of the ticket is valid.

### Rules

- Only edit `.ticket` files — never modify any other file in the workspace
- **Never** modify frontmatter properties other than `title`
- Update `title` only when the current one is clearly misleading or too vague; otherwise leave it unchanged
- Only include sections defined in the [epic format](epic-format.md); no extras
- No blank line after section headings — content starts immediately on the next line
- Blank lines between section headings only (separate introduction from Background, etc.)
- Epic should be business oriented, NEVER mention code files or low level details

### After writing

Summarise what changed: which sections were edited or added, which questions stayed open, and any fields the user still needs to set themselves via the structured editor in VS Code (component, bucket, draft flag).
