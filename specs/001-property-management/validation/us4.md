# US4 — explicit rent periods and append-only payments

PASS: billing unit3 (nine independent golden states, exact12digit net/reversal math, due-day Overdue precedence, explicit partial periods); payment integration5 (replay/conflict, concurrent overpay/same-key, one reversal/replacement, role scope and late ledger insertion failure rollback). T069-RED/T070-RED → T071-GREEN/T072-GREEN. Payment/idempotency rows commit together under obligation/key advisory locks. Original rows remain unchanged.

PASS: compiled HTTP billing journey23 assertions (T073-HTTP), including baseline9periods/74000TWD, explicit periods, malformed/fractional data, duplicates, stable header replay, conflicting payloads, overpay, replacement rollback, no original PATCH and permissions. Generated SDK contains exact string amounts and required Idempotency-Key.

PASS: PaymentVM2 and money display1 (T075-RED → T076/T077-GREEN). A form intent gets one injected-generated key; pending duplicate commands do not dispatch twice. Failed inputs remain. Browser1 records/rejects overpayment, shows Paid, retains original/reversal/replacement and creates4321TWD manual period (T078-browser). Browser1 confirms Manager tenant/stay own-period panels refresh and PAY002 opens exactly its receipt (T079-browser). Build T080-build PASS.

Full-month periods use calendar boundaries; entered due dates/amounts are retained. UI defaults read contract rent/due-day. No automatic posting, proration, fees/refunds/deposit settlement. These are Coding checks, independent QA pending.
