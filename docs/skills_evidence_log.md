# Skills Evidence Log (Live Build Sync)

## SKILL: Git Hygiene & Safety

- **ID**: `git-hygiene-basic`
- **Invocation**: Manual execution of `git status`, `git log`, and branching strategy.
- **Evidence**: See `docs/proof_bundle/deploy_sync/logs/git_baseline.txt`.

## SKILL: Forensic Evidence Collection

- **ID**: `forensic-proof`
- **Invocation**: Creation of `docs/proof_bundle/deploy_sync/` and strict evidence gathering.
- **Evidence**: Directory structure created.

## SKILL: Automated Visual Forensics

- **ID**: `playwright-visual-repro`
- **Invocation**: Ran `e2e/reproduce-mismatch.spec.ts` to capture Local vs Live state.
- **Evidence**: `docs/proof_bundle/deploy_sync/screenshots/` populated.

## SKILL: Firebase Target Diagnosis

- **ID**: `firebase-target-verification`
- **Invocation**: Inspected `.firebaserc` and `firebase projects:list`.
- **Evidence**: Confirmed `apex-recruiter-p1` alignment.

*Log updated dynamically.*
