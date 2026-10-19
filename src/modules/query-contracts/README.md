# Query Contracts

Enterprise read-model boundary for versioned cursors, stable server-side
filters, bounded collections and provider-neutral governed-object search.

The PostgreSQL adapter may rank candidates, but scoped authorization remains
the final disclosure authority. Consumers depend on this module's connection
and search result contracts rather than on PostgreSQL-specific SQL.
