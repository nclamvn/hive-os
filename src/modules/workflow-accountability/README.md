# Workflow Accountability

Enterprise assignment, SLA, escalation, approval-chain and work-inbox bounded
context. Assignment and approval history is retained; time-dependent SLA state
is derived from captured policy, due time, target state and server time.

All commands re-evaluate TIP-023B scoped authority. New workflow tables use
transaction-local Organization context and forced PostgreSQL RLS.
