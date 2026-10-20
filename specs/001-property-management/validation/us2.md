# US2 — contacts and contract occupancy

PASS: tenant unit2, Stay unit2, persisted occupancy/capacity integration1 and HTTP contact/occupancy2 tests against real PostgreSQL/Redis. Start-inclusive/end-exclusive, future termination, prestart cancellation, retained ended history, Manager visible edits, Owner standalone contacts, denied orphan creation/outscope contacts, forbidden manual movement fields and concurrent capacity version protection are covered. Logs T043-RED.txt/T044-core-RED.txt/T045-GREEN.txt/T046-GREEN.txt/T047-HTTP.txt.

PASS: contact VM2 and browser2 workflows. Manager edits TEN001, reopens history and gets403 feedback for TEN004. No manual movement buttons. Owner advances date to2026-10-22: C007 becomesCurrent and R103Occupied; restores2026-10-19. Shared server query invalidation keeps views aligned. T049-RED.txt/T051-GREEN.txt/T052-browser.txt/T054-build.txt.

History is a projection, not a Stay table or separate mutation authority. Contract fixtures support this story; actual contract mutation/new-tenant atomic creation follows US3. All changes remain in isolated test data. No independent QA claimed.
