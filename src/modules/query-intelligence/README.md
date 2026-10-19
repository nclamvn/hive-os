# Query Intelligence

TIP-024A establishes deterministic, provider-neutral trust contracts before a
model provider or enterprise ontology is selected.

- Analyzer output is untrusted and strict-schema validated.
- Organization, Workspace and Mission scope comes only from the trusted server
  context; an analyzer cannot nominate tenant identifiers or permissions.
- Entity IDs come only from an authorized, curator-confirmed registry port.
- The deterministic compiler chooses `RETRIEVE`, `CLARIFY`, or
  `KNOWLEDGE_GAP` from an explicit policy snapshot and retained candidates.
- Every plan remains `READ_ONLY_NON_AUTHORITATIVE` and requires authorization
  again at retrieval. It cannot approve, prove, release, or mutate a governed
  object.
- Golden evaluation contracts retain expected entity, evidence, forbidden
  evidence, answer state, and unsafe-auto-retrieval outcomes.

This module does not implement an ontology database, embeddings, reranking,
generation, a provider adapter, or an answer verifier. Those require real pilot
data and separate authorization.
