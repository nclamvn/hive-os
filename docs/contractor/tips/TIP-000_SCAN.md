# TIP-000 — Repository SCAN

## Header

- Priority: P0
- Dependencies: none
- Builder scope: inspection only
- Architecture changes: forbidden

## Context

The Contractor has produced a provisional greenfield blueprint but has not received the target repository. The Builder must inspect the actual workspace before any implementation.

## Task

Scan the repository and return a factual SCAN REPORT. Do not install packages, edit files, run migrations, initialize a framework, or create code.

## Acceptance Criteria

### AC-01 Repository identity
Given the working directory, when the scan completes, then report root path, Git state, current branch, remotes, and latest commit.

### AC-02 Technology inventory
Given repository files, when inspected, then report runtime, framework, language, package manager, lockfile, database, auth, UI libraries, tests, CI, and deployment configuration.

### AC-03 Health
When safe read-only commands are available, then report build/typecheck/lint/test status without changing dependencies or generated files. If commands mutate state, do not run them; explain.

### AC-04 Architecture map
Report routes, modules, data boundaries, major components, and reusable patterns.

### AC-05 Blueprint conflicts
Compare the repository with the supplied HIVE OS Blueprint and list compatible assets, conflicts, missing foundations, and recommended migration approach.

### AC-06 Secrets safety
List environment variable names only. Never print values.

## Constraints

- Read-only.
- No code.
- No dependency installation.
- No framework initialization.
- No architecture decisions beyond recommendations.

## Required output

A SCAN REPORT plus Completion Report in the Master Prompt format. Stop after reporting.
