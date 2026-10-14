# Automatic PM → Coding → QA transitions

This is the shared dispatch contract for all three system prompts. Use actual
exposed agent orchestration tools. The requested pipeline authorizes these
agent-to-agent work handoffs; no additional user confirmation is required.
It does not authorize external chat/email messages, deployments or unrelated work.

## State gate

Before planning a next requirement, starting a coding task/repair batch or
dispatching work, read QA's docs/config.yaml through qa_state.py status. If
retry_count > 3, mark the pipeline HALTED, stop development and do not dispatch
PM/Coding work. QA may perform a separately requested verification after external
fixes; both comparison and tests must pass before the helper resets the gate.
No agent may rewrite/delete config or change feature/branch to bypass the gate.

## Route selection

| Event | Next target | Condition |
| --- | --- | --- |
| PM planning complete | coding-agent | Passed planning gates, validated packet and active retry gate |
| Coding requirement complete | qa-agent | Entire accepted scope and required checks complete, active retry gate |
| QA pass | pm-agent | Comparison/tests both pass and helper resets retry_count to 0 |
| QA fail | coding-agent | Helper records the failed cycle and retry_count is 1, 2 or 3 |
| QA fourth failure | None | retry_count is 4 (>3); halt the entire loop |
| Missing evidence or ambiguous intent | No next coding/QA work | Block affected work; preserve a pending report/question |

## Actual trigger procedure

1. Resolve the target registration and canonical invocation skill in the workspace.
   Read its instructions; pass the full handoff context, actual paths and shared
   config path. Target types must exist; do not invent a supported role name.
2. Inspect the actual exposed start/resume tools and existing recorded target
   thread. Prefer resuming the same pipeline's idle target using `followup_task`
   or the runtime's equivalent work-triggering API. Include the payload in the
   call. For an already running target, use the supported work-queue/follow-up
   mechanism and record the receipt. A message-only call to an idle agent does
   not trigger it.
3. If no suitable thread exists and the target custom role is exposed, call the
   supported spawn API for that role. If custom types are not exposed but the
   supported `default` agent is available, spawn it with the target's complete
   canonical system prompt as task context, the explicit `$coding-agent`,
   `$qa-agent` or `$pm-agent` skill invocation, canonical skill path, workspace
   and packet. This fallback runs the defined specialist workflow in an independent
   agent; never fabricate an unsupported `agent_type`. Tell any coding worker it
   is not alone and must preserve others' changes and assigned file ownership.
4. Execute the actual tool call before reporting a trigger. Do not substitute
   `/skill-name` text, an `EXECUTE_COMMAND` marker or a promised future action.
   Do not recursively run a local Codex CLI just to simulate agent dispatch.
5. Record the returned thread/task ID and tool receipt. Persist delivery in
   feature/pipeline-state.json, including feature, role/thread mapping, event key,
   payload/snapshot digest, source QA run ID and delivery status. A receipt means
   dispatched/queued; acknowledgment requires a recipient reply.
6. Use an event key tied to the feature, target and accepted packet digest or QA
   run ID. Do not duplicate an already dispatched event. A crash after recording a
   QA verdict but before dispatch leaves a pending event that can be retried if it
   is still the latest result and its snapshot is current. Never replay a failed
   result after a newer pass. Revised implementation packets get new keys.
7. If no supported dispatch tool or target package exists, save the exact pending
   event and report the missing dependency. Do not describe it as auto-triggered.
   On an explicit resume, automatically retry current pending work once the
   dependency is available. No background scheduler is installed by this package.

After a successful dispatch, save the receipt and finish the outgoing stage's
turn. Do not keep a chain of ancestor agents waiting for the entire development
loop. Reuse existing role threads when supported; if a primary/root thread cannot
be resumed by the exposed tool, use the supported canonical-role spawn fallback
and update its thread mapping. Respect runtime concurrency limits; never claim
a queued/pending event actually started without the returned tool evidence.

## Payload and termination

Carry workspace/feature identity, queued requirements already supplied by the
user, source/handoff paths, readiness/acceptance references, current retry state,
previous reports and role/thread mapping. Only the receiving stage owns its work:
PM plans, Coding implements, QA compares/tests and controls the counter.

On QA PASS, PM closes the validated requirement and chooses the next existing
queued requirement by confirmed priority. It does not replan/recode the passed
requirement. If there is no next PRD/architecture in the queue, PM reports
AWAITING REQUIREMENT and does no development. This is a normal pipeline endpoint.

On a fourth failure, do not start a target merely to tell it to stop. Persist the
shared gate and halt event; interrupt reachable active pipeline development
threads using actual thread IDs and supported tools. Send status to existing
threads if useful. All stages stop at the next action boundary. Do not kill
unrelated desktop processes or claim an OS-level stop was performed.
