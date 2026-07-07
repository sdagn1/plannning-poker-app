# JIRA Formatting Guidelines

- ALWAYS reference files using back ticks e.g. `backlog-assistant/epic-guidelines`

## Attaching File Content

Any code or structured-format content (JSON, JavaScript, XML, SQL, etc.) that appears in any section MUST be wrapped in a Jira `{code}…{code}` block so it renders correctly in the Jira UI. Optional language hint: `{code:json}…{code}`.

Example:

```txt
*Background*
The legacy endpoint returns:

{code:json}
{
  "patientId": "12345",
  "status": "OK"
}
{code}
```
