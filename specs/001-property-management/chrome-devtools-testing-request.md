# Chrome DevTools MCP container testing — 2026-10-19

The user instructed:

> once its running on container help me using chome-devtool-mcp for testing

Use the official chrome-devtools-mcp server against the actual running local Compose app.
This is verification of the accepted demo, not a new product feature or a formal browser
certification project. Coding carries this request to QA and closing PM. Do not close the
user's delivery until live-container Chrome DevTools MCP evidence is recorded.

## Availability and verified transport

Native Chrome DevTools tools are not exposed in the current session. Superset CLI is
absent, and the user MCP configuration contains no Chrome DevTools server. Google Chrome
is installed. An actual stdio MCP preflight succeeded with chrome-devtools-mcp 1.11.0:
initialize negotiated protocol2025-03-26 and tools/list returned 32 tool definitions.
Full returned tool schemas and command are in chrome-devtools-capability.json.
This proves MCP server access, not browser launch or application acceptance.

Use native Chrome DevTools MCP tools if subsequently exposed. Otherwise use the verified
official server over MCP stdio, with an MCP client maintaining the session across calls.
Do not substitute another browser driver and label it Chrome DevTools MCP. List tools and
read their returned schemas before calling them. The preflight command was:

```text
npx -y chrome-devtools-mcp@1.11.0 --isolated --headless --no-usage-statistics --no-performance-crux
```

Preflight performed initialize and tools/list only; no browser/app navigation occurred.
No global client configuration or plugin/account connection was changed. Runtime client
code can be ephemeral testing tooling; no application dependency or stack change is needed.
Use an isolated test browser/profile and the demo dataset. Inspect actual Compose services,
URLs and application UI before choosing actions; do not guess ports, page IDs or selectors.

Official references accessed2026-10-19:
[server](https://github.com/ChromeDevTools/chrome-devtools-mcp),
[configuration](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md),
[tool reference](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md).

## Required container checks

| Area | Observed evidence required |
| --- | --- |
| Runtime identity | Actual app URL, Compose service health, build/image or source identity, timestamp and MCP server version |
| Sessions/roles | Owner/Manager/Viewer login/logout and scoped navigation; no Viewer write/content download or role escalation |
| Dashboard | Baseline visible metrics and drill-down filters match each role's expected-results.json |
| Properties/tenants/contracts | Representative create/edit/reopen; contract-derived occupancy and visible fixed Taiwan date; no check-in/out controls |
| Payments | Representative recording/status refresh and rejected overpayment preserving balance |
| Documents | Allowed upload/download and denied Viewer content access; preserve synthetic fixture bytes |
| Themes/responsive | Essential navigation/form/status smoke across four device categories and light/dark; system/manual persistence; no full multi-browser certification |
| DevTools diagnostics | Console exceptions, failed requests/unexpected HTTP errors, and page screenshot evidence; distinguish intentional negative-test denials from defects |

Use reversible synthetic mutations, return modified baseline records to their original
state, and retain final running services. Do not log passwords/session cookies or publish
sensitive request headers/bodies. Record actual expected/actual results and reproducible
failure details; missing tool/browser access is BLOCKED, not PASS.

## Workflow and ownership

Preferred: QA runs these checks against the completed actual Compose app during its
independent verification. The final PM startup step verifies/retains the tested image and
configuration. If that QA run did not test the final running container snapshot with this
MCP, closing PM must dispatch QA for the explicitly requested container verification after
local-compose-start, rather than mark delivery complete based on the earlier PASS alone.
This follow-up verification does not require repeating completed implementation work.

Track a required `chrome-devtools-container-testing` delivery action depending on
`local-compose-start` in pipeline-state.json. It may be satisfied by earlier independent
Chrome DevTools MCP evidence only when QA tested the same final runtime/configuration and
closing PM verifies that identity still matches. Otherwise perform the actual verification.
QA owns browser comparison/results and audited retry state; PM owns startup/final closeout.
Failures return through the existing QA → Coding → QA retry gate; counts1–3 allow repairs,
>3 HALT. Never reset the counter outside QA or claim a browser defect was fixed without
fresh evidence. A fix must be rebuilt into the containers and retested before completion.

QA writes validation/chrome-devtools.md with command/tool receipts, runtime identity,
check results, screenshots/log references and limitations. Carry the required pending
startup/browser actions through all subsequent handoffs. No other requirement is queued.
