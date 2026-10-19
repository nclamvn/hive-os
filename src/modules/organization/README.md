# Organization

TIP-023A introduces the enterprise organization graph while preserving the
existing Workspace authorization contract.

The database owns hierarchy closure and cycle prevention. This module exposes
bounded, tenant-scoped ports for hierarchy, portfolio and group operations.
Scoped grants, delegated authority and PostgreSQL RLS are intentionally deferred
to TIP-023B.
