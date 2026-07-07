# Story Content Details

Below find the requirements for different fields structure.
All sections apart from introduction require a header that should be populated in the template.

## Title

- Keep it clear, concise and professional
- The title should be 7-8 words long maximum
- Start with an action verb (e.g., "Add", "Create", "Update", "Fix", "Implement", "Investigate", "Research")
- Be specific about what will be done
- **For SPIKE tickets**: prefix the title with `[Spike]` — exactly that casing, capital `S` only, followed by a single space (e.g. `[Spike] Investigate authentication options`)

## Description

See below list of sections available:

| Section ID            | Required |
|-----------------------|----------|
| `introduction`        | Yes      |
| `acceptance-criteria` | Yes      |
| `out-of-scope`        | No       |
| `technical-notes`     | Yes      |
| `testing-notes`       | Yes      |

### Introduction

Information about the goal of the ticket and the outcome for the person:

```md
*As the* Planning Poker {PERSONA}
*I want* {GOAL}
*So that* {OUTCOME}
```

where:

- **PERSONA**: the persona that is interacting with the system. Examples include: System Product Owner, Developer, API Consumer, Security Engineer (not an exhaustive list)
- **GOAL**: the goal of the story for the persona
- **OUTCOME**: the outcome of the story for the persona

NEVER provide any technical code-related details in this section

### Acceptance Criteria

Bulleted list of clear, testable criteria that define when the story is complete:

- Start each AC item with `-` followed by an acceptance criteria id and description (e.g. `- AC01: Login functionality implemented for users with valid credentials`)
- The id format is `AC<id>` with `<id>` a 2-digit number starting from 01 (`AC01`, `AC02`, …) — sequential, no gaps
- Make the acceptance criteria specific and measurable
- Do not end AC items with a full stop
- Use past-tense verbs to indicate completion (e.g. `Migration script implemented to migrate data from X to Y`)
- Focus on user-facing outcomes and business value
- Avoid implementation details: file names, paths, field names, field values, environment variables, library calls, schema concepts
- Write for business analysts — no internal tool jargon

Bad AC: "Work item fetched by key from ADO is saved as a correctly structured `.ticket` file in the `.backlog/remote/` folder"
Good AC: "Ticket can be fetched from Azure DevOps to a local ticket file"

Bad AC: "If `AZURE_DEVOPS_CLOUD_TOKEN` is not set, a clear error is shown"
Good AC: "When the authentication environment variable is not set the user is informed about that with a message"

### Out of Scope

A list of any related items that are explicitly out of scope for this ticket, to set clear boundaries. Optional section.

### Technical Notes

Technical implementation details, architecture decisions, or constraints:

- Include relevant files, services, or components if required but do not provide very low level details like class or function names as they become outdated quickly
- Form as actionable todo items in imperative form (e.g. `Install likec4 CLI…`)
- Note any dependencies or prerequisites
- Mention specific technologies or patterns to use
- Use [jira formating guidelines](./jira-formatting-guidelines.md) to embed file / code content (e.g. json snippets

### Testing Notes

Testing requirements and considerations:

- Form as actionable todo items in imperative form (e.g. `Verify npm scripts work correctly`)
- Types of tests needed (unit, integration, E2E)
- Edge cases to consider
- Manual testing steps if applicable

Ensure the introduction and acceptance criteria are business-friendly and accessible to both technical and non-technical audiences. Reserve technical details (URLs, paths, implementation specifics) for the Technical Notes section.

## Description Example

```txt
*As the* Planning Poker user
*I want* the ticket and breakdown editors to render correctly in all VS Code themes
*So that* I can use the extension regardless of my preferred colour theme

*Acceptance Criteria*
- AC01: Ticket editor is visually correct in light, dark, and high-contrast themes
- AC02: Breakdown editor cards are legible in all three theme variants
- AC03: Theme changes are applied instantly without requiring a window reload

*Out of Scope*
- Creating custom theme packs beyond default VS Code themes

*Technical Notes*
- Review and update CSS variables in ticket editor component to use VS Code theme tokens
- Review and update CSS variables in breakdown editor component to use VS Code theme tokens
- Test color contrast meets WCAG AA standards

*Testing Notes*
- Verify ticket editor renders correctly in VS Code light, dark, and high-contrast themes
- Confirm theme changes are applied instantly without requiring window reload
- Test color contrast in high-contrast theme meets accessibility standards
```
