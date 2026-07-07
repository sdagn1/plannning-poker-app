# Breakdown File Format

## File location

`.backlog/breakdowns/epic-ABC-<id>.breakdown`

The file is created by the **Backlog Assistant: Epic Breakdown** command in VS Code (which fetches existing stories from Jira). Never create one from scratch.

## File shape

Plain JSON:

```json
{
  "epicKey": "BA-42",
  "bucketId": "10001",
  "existing-stories": [
    {
      "title": "Support Jira Cloud team-managed projects",
      "introduction": "*As the* Planning Poker developer\n*I want* the extension to support team-managed projects\n*So that* teams using Jira Cloud can manage their tickets without leaving VS Code",
      "jiraKey": "BA-38"
    }
  ],
  "new-stories": [
    {
      "title": "Add epic breakdown editor UI",
      "introduction": "*As the* Planning Poker developer\n*I want* to edit epic breakdowns in a structured webview\n*So that* users can visually organize and split epics into stories"
    },
    {
      "title": "[Spike] Investigate Jira Server authentication",
      "introduction": "*As the* Planning Poker developer\n*I want* to understand OAuth token flows\n*So that* we can securely authenticate with both Jira Cloud and Server"
    }
  ]
}
```

## Ownership

| Field | Owner | May edit? |
|-------|-------|-----------|
| `epicKey` | extension (set on creation) | No |
| `bucketId` | user (set in the breakdown editor) | No |
| `existing-stories[]` | extension (fetched from Jira) | No |
| `new-stories[]` entry with a `jiraKey` | locked — already created in Jira | No |
| `new-stories[]` entry without a `jiraKey` | editable | Yes — `title` and `introduction` |
| Ordering of unlocked `new-stories[]` entries | editable | Yes — order is creation order in Jira |
| Any `jiraKey` field anywhere | extension | No — never set, change, or delete |

When writing back, preserve `epicKey`, `bucketId`, `existing-stories`, and every locked `new-stories` entry byte-equivalently.

## Validators applied to each new entry

The extension validates each new story before creating it in Jira. To avoid mid-creation failures:

### Title

- Optional `[Spike]` prefix — exactly that casing (capital `S`), followed by a single space
- First non-prefix character must be uppercase
- At least two whitespace-separated words

| Title | Valid? |
|-------|--------|
| `Reject self-signed server certificates` | ✓ |
| `[Spike] Investigate IdP options` | ✓ |
| `[spike] Investigate auth` | ✗ — lowercase `s` |
| `gateway` | ✗ — one word, lowercase |

### Introduction

A single JSON string with `\n` between exactly three non-empty lines:

```txt
*As the* Planning Poker {PERSONA}
*I want* {GOAL}
*So that* {OUTCOME}
```

- Line 1 starts with `*As the*` followed by a project name and persona phrase (Developer, API Consumer, Security Engineer, Platform Lead, …). Never `*As a*`.
- Line 2 starts with `*I want*`
- Line 3 starts with `*So that*`
- No leading blank lines, no trailing blank lines, no extra body lines

Acceptance criteria are NOT written into the breakdown file — they are added later via the structured ticket editor after the story is created in Jira.
