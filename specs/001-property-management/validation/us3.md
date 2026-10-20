# US3 — contracts and protected documents

PASS: contract unit3 + capacity/concurrency integration4 (T056-RED/T109-RED → T058-GREEN). Classifications include exact30day/start/end/termination boundaries. Manager new contacts and first contracts are atomic. Sequential commitments pass event sweep; duplicate tenant/resource overlap, shared full rooms and conflicting capacity/contract writes fail. Stable ordered resource locks/version checks protect edits, reassignment and termination. Associated document tenant/property metadata moves transactionally with contracts. No historic obligations auto-posted.

PASS: document integration5 (T057-RED → T059-GREEN), all15fixture hashes unchanged, Unicode text upload/download exact, PNG/JPEG/PDF/text accepted with structural content validation, exact10MiB boundary, denied Viewer content/outscope reads, invalid MIME/names/links and late PostgreSQL BYTEA insertion failure all preserve data. Compiled-Nest HTTP2 tests verify XOR/nested validation/versions/termination plus multipart413/415/422 and Viewer403 (T060-HTTP).

PASS: VM3 and browser2 (T062-RED → T064-GREEN; T065-browser). Manager retries a full-resource first-contact form without losing input, saves/edits contract, transfers unchanged file bytes and terminates it; resource becomes available. Viewer sees metadata with upload/download hidden and direct content403. Related-record browser1 (T066-GREEN) preserves property/contract/tenant/file links and exact scoped totals. Frontend build T067-build PASS. File bytes are returned transiently by generated SDK and never inserted into metadata/query caches. Test traces disabled to avoid retaining login payloads.

These are Coding observations; independent QA and final container Chrome DevTools MCP verification remain pending.
