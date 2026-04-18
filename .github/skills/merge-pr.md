# Merge PR

Fix review comments, check merge conflicts, and merge a pull request cleanly. Invoke with the target PR (for example: `merge-pr wasabali/Claude-quest#123`).

## What you need from the user

- Repository owner/name
- Pull request number
- Confirmation that merge is desired once clean (`merge`, `squash`, or `rebase`)

If merge method is not specified, ask before merging.

---

## Step 1 — Read PR status

1. Fetch PR metadata (base/head/state)
2. Fetch changed files and current diff
3. Fetch review threads and PR comments
4. Fetch check runs and CI status

## Step 2 — Fix actionable review feedback

- Address valid, unresolved review comments with minimal edits
- If a comment is invalid/outdated, reply with clear reasoning
- Do not leave valid actionable feedback unresolved

## Step 3 — Validate

Run existing project checks:

```bash
npm test
npm run build
```

Fix failures introduced by your changes.

## Step 4 — Ensure mergeability

- Update/sync PR branch with base branch
- Detect and resolve merge conflicts in the PR branch
- Re-run validation after conflict resolution

## Step 5 — Final merge gate

Merge only when all are true:
- No unresolved actionable review threads
- CI/check runs are passing
- PR branch is conflict-free against base
- Local validation passes (`npm test`, `npm run build`)

If any gate fails, do not merge; report blockers.

## Step 6 — Merge and report

Merge using the requested method, then report:
- What was changed to satisfy review feedback
- Which review threads were resolved
- Validation and CI results
- Merge result (commit SHA / PR merged status)
