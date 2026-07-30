# Authorization

TIP-023B implements deterministic enterprise roles, direct/group scoped
grants, explicit deny precedence, bounded delegation and high-assurance
separation of duties.

Authority-plane tables are protected by transaction-local PostgreSQL RLS.
Database-wide business-ledger RLS is not claimed by this TIP.
