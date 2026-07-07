# Epic Breakdown

Slice an epic into INVEST-compliant user stories.

Read [shared rules](shared-rules.md) before writing any content.
Read [breakdown patterns](breakdown-patterns.md) for INVEST criteria and splitting patterns.
Read [breakdown file format](breakdown-file-format.md) for file shape, ownership, and validators.

Absolutely NEVER implement any code changes.

---

## Step 1 — Understand the Epic State

Read both files:

- `.backlog/breakdowns/epic-ABC-<id>.breakdown` — the breakdown
- `.backog/remote/epic-ABC-<id>-<slug>.ticket` — the parent epic (gives you the goal, scope, dependencies)

Take stock of `existing-stories` (read-only context — already in Jira) and any `new-stories` entries that already have a `jiraKey` (also locked).

---

## Step 2 — Interview the User

Confirm the epic satisfies INVEST minus Small. If it doesn't, surface the gap rather than slice — the most common failure is **Valuable** (a task pretending to be an epic). If the epic is unclear about persona or outcome, ask before slicing. Never invent.

Identify the splitting pattern(s) that fit the epic (see [breakdown patterns](breakdown-patterns.md)). Ask **one question at a time**, list options as A / B / C, mark the recommended option in **bold**. Do not re-ask anything already answered. Do not analyse code unless requested.

### Focus areas to probe (skip if already covered)

- Pick the dominant splitting pattern (Workflow Steps, Operations, Business Rule Variations, ...). Propose the most likely one with a one-line rationale.
- Resolve unknowns the pattern surfaces — workflow middle steps, the set of operations behind a `manage` / `support` verb, quantified non-functional thresholds, the choice of a third-party component, etc.
- Decide whether a `[Spike]` slice is needed up front to resolve an implementation unknown.

Never invent personas, thresholds, third-party choices, deadlines, or named teams.

---

## Step 3 — Provide Proposed Breakdown

Once the slicing approach is agreed, present the proposed list of stories providing the following for each:

- **Title** and introduction for each slice
- **Blocked by**: which other slices (if any) must complete first

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the dependency relationships correct?
- Should any slices be merged or split further?

Iterate until the user approves the breakdown.

---

## Step 4 — Update Breakdown File

Once the user confirms, update only the unlocked entries in the `new-stories` array. Write all proposed entries in one go.

### Rules

- Only edit `.ticket` and `.breakdown` files — never modify any other file in the workspace
- **Never** modify `epicKey`, `bucketId`, or `existing-stories`
- **Never** modify a `new-stories` entry that already has a `jiraKey` (it is locked — already created in Jira)
- **Never** set the `jiraKey` field yourself — the extension does that after creation
- Every new entry must pass the validators documented in [breakdown file format](breakdown-file-format.md)
- Order matters — the extension creates stories sequentially. Put the most independent / highest-value slice first; put a slice that depends on scaffolding from another after that scaffolding.
- Keep locked entries in their original positions

### After writing

Summarise what changed: which slices were added or edited, which questions stayed open, and any fields the user still needs to set themselves via the structured editor in VS Code (bucket, draft flag).

Write a detailed document summerising all decisions discussed during the breakdown session and store it under `.work/<ticketId>/epic-breakdown-notes.md`
