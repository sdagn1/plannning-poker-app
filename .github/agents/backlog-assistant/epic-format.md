# Epic Content Details

Below find the requirements for different fields structure.
All sections apart from introduction require a header that should be populated in the template.

## Title

- Keep it clear, concise and professional
- The title should be 7-8 words long maximum

## Description

See below list of sections available:

| Section ID            | Required |
|-----------------------|----------|
| `introduction`        | Yes      |
| `background`          | Yes      |
| `materials`           | Yes      |
| `scope`               | Yes      |
| `out-of-scope`        | Yes      |
| `dependencies`        | Yes      |

### Introduction

Information about the goal of the epic and the outcome for the person:

```txt
*As the* Planning Poker {PERSONA}
*I want* {GOAL}
*So that* {OUTCOME}
```

where:

- **PERSONA**: the persona that is interacting with the system. Examples include: System Product Owner, Developer, API Consumer, Security Engineer (not an exhaustive list)
- **GOAL**: the goal of the epic for the persona
- **OUTCOME**: the outcome of the epic for the persona

### Background

Background information about the epic — what it is about, what we are trying to do, and why. A paragraph of 3-4 sentences (optionally) followed by a bulleted list of points for clarity.

### Materials

References to files on the internal project Confluence space or external links (e.g. API docs). Provide a short summary for the link followed by the URL.

e.g. FHIR Questionnaire resource definition: <https://hl7.org/fhir/R4/questionnaire.html>

### Scope

Bulleted list of points related to what is in scope for the epic and required to deliver it.

### Out of Scope

Bulleted list of points related to what is out of scope for the epic.

### Dependencies

Bulleted list of dependencies with other stakeholders (e.g. other NHS teams).
