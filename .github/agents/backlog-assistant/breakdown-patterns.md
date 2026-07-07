# Breakdown Patterns

The goal of breakdown is to produce thin **vertical slices** of value that cuts through ALL integration layers end-to-end, NOT a horizontal slice of one layer. The slices need individually satisfy INVEST rules.

## INVEST

A good user story is INVEST

| Letter | Means | What it asks of a story |
|--------|-------|--------------------------|
| **I** | Independent | Can be prioritised on something other than technical dependency |
| **N** | Negotiable | Leaves room for collaboration on the details of what and how |
| **V** | Valuable | Adds a visible increment of value for a user — not a component, not a layer, not a task |
| **E** | Estimable | Defined enough that the team can size it relative to other stories |
| **S** | Small | When it reaches the top of the backlog, 6–10 fit in a sprint |
| **T** | Testable | A concrete change in system behaviour with a way to know it's done |

A story MUST be a **vertical slice** through the architecture — it touches whatever layers are needed (schema, API, UI, logic, persistence, integrations, tests) to deliver an observable change in behaviour. A completed slice is demoable or verifiable on its own.

A **horizontal slice** (a single layer in isolation) satisfies Small but fails Independent and Valuable; never slice that way.-

## The 3-step flow

### Step 1 — Get the input ready

If the epic is unclear about persona or outcome, ask before slicing. Never invent.

Then ask: is it too big? If 6–10 peers would not fit in a sprint, slice.

### Step 2 — Apply a pattern

Walk the patterns below in order. The first that fits is usually the right one. Many epics yield to more than one — try one, evaluate, iterate.

### Step 3 — Evaluate the split

For each candidate slice:

- Is it a vertical slice (touches whatever layers it needs to deliver value)?
- Does it pass INVEST individually?
- Does the set form a fair partition of the epic's value, or are there gaps?

If a slice fails, refine it or pick a different pattern.

## The 9 patterns

### 1. Workflow Steps

The epic describes a multi-step workflow. Biggest value usually lives at the **beginning and end** — slice the simplest end-to-end path first, then add middle steps and special cases as their own slices.

Anti-pattern: slicing strictly one workflow step at a time from start to finish. Middle steps alone rarely deliver standalone value.

Epic: *Publish a news story to the corporate website.* Splits:

- Publish directly (no review)
- Publish with editor review
- Publish with legal review
- View on a staging site
- Publish from staging to production

### 2. Operations (CRUD-ish)

Verbs like **manage**, **handle**, **support** hide a set of operations.

Epic: *Manage my account.* Splits:

- Sign up for an account
- Edit account settings
- Cancel account

Ask the user which operations are in scope if the verb is generic.

### 3. Business Rule Variations

The epic describes a feature with multiple business-rule interpretations.

Epic: *Search flights with flexible dates.* Hidden variations:

- "n days between x and y"
- "a weekend in December"
- "± n days of x and y"

### 4. Variations in Data

Complexity lives in the data shape, not the feature.

Epic: *Search transportation providers by origin and destination.* Splits:

- By county (simplest)
- By county, city, town, or neighbourhood
- Providers serving different origin vs destination areas

Classic localisation case: build the feature in one language first, add languages as separate slices.

### 5. Data Entry Methods

UI complexity, not feature complexity.

Epic: *Search flights between two destinations.* Splits:

- Simple date input
- Fancy calendar UI

Not strictly independent (the second replaces the first), but the split still ships value sooner.

### 6. Major Effort

Most of the work goes into the first variant; later variants are cheap.

Epic: *Pay with VISA, MasterCard, Diners Club, or AmEx.* Splits:

- Pay with one card type (defer which until the team starts the story)
- Pay with all four card types (given one is implemented)

Don't split into 4 equal stories — the size is asymmetric and that's important information.

### 7. Simple / Complex

Whenever an estimation conversation balloons ("what about X?", "what if Y?"), capture the simplest version as one story and split each variation off as its own slice.

Epic: *Search flights between two destinations.* Stays simple by splitting off:

- Specify max number of stops
- Include nearby airports
- Use flexible dates

This is really about finding the **core** and keeping it small; everything else becomes a future slice.

### 8. Defer Non-functional

The feature is mostly easy; most of the effort is the non-functional requirement.

Epic: *Search flights between two destinations.* Splits:

- Make it work (slow, show a spinner)
- Make it return in under 5 seconds

Works for performance, scale, security, accessibility. Use sparingly — easy to call "make it work" done and pile up debt.

### 9. Break out a Spike

The epic is large because the implementation is poorly understood, not because the user-facing change is big.

Epic: *Pay by credit card.* Splits:

- `[Spike] Investigate credit card processing`
- Implement credit card processing (informed by the spike)

A spike is the only acceptable non-vertical slice — it deliberately produces knowledge, not behaviour change. Time-box it. Use the `[Spike]` title prefix (capital `S`, single space).

## Picking a pattern fast

When in doubt, try in this order:

1. **Workflow Steps** — if you see steps or stages
2. **Operations** — if you see "manage" / "handle" / "support"
3. **Business Rule Variations** — if you see a feature whose behaviour depends on a rule set
4. **Simple / Complex** as a fallback — pull out the core, push variants to their own slices
5. **Break out a Spike** — if the implementation is the unknown, not the user-facing change

If two patterns fit equally well, pick the one that produces slices with the most independent value.

## What NOT to do

- Don't split by architectural layer (UI / backend / DB). That's a horizontal slice — fails Independent and Valuable.
- Don't split into "design", "implement", "test" stories. Testing is part of done.
- Don't write speculative slices for variants the user hasn't asked for — ask first.
- Don't fill `new-stories` with task-shaped items just to look thorough. Three solid vertical slices beat ten tasks.
- Don't touch entries that already have a `jiraKey` — reordering them lies about creation order.
