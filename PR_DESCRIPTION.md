Closes #436

## Summary

Documents the pre-commit secret scanning expectation for contributors and maintainers, including recommended tools, remediation steps, private escalation when a secret reaches a shared branch or artifact, and the limits of the current process. The change is backed by a focused policy test so reviewers can verify the guidance without manual guesswork.

## What changed

- Added a pre-commit secret scanning section to `.github/SECURITY.md`, including the required control path, recommended tools, remediation steps, and known risk boundaries.
- Added contributor-facing secret scanning guidance to `CONTRIBUTING.md`.
- Added maintainer review expectations and a verification command to `MAINTAINER_WAVE_PLAYBOOK.md`.
- Added a focused `secret-scanning-guidance.test.ts` policy test and wired it into `npm run test` plus a dedicated `npm run test:policy` command.
- Added `npm run test` to the web CI job so the focused policy test runs in CI.

## Validation

```bash
rg -n "TODO|TBD" README.md CONTRIBUTING.md MAINTAINER_WAVE_PLAYBOOK.md .github/SECURITY.md || true
```

Expected: no unresolved placeholder output.

```bash
cd apps/web
nvm use 22
npm run test:policy
npm run test
```

Expected: the secret-scanning acceptance path is documented, recommended scanners are named, remediation steps are present, and the docs stay cross-linked.

## Local Output Summary

- `rg -n "TODO|TBD" README.md CONTRIBUTING.md MAINTAINER_WAVE_PLAYBOOK.md .github/SECURITY.md || true`: no output.
- `git diff --check`: passed.
- `jq empty apps/web/package.json`: passed.
- `ruby -e 'require "yaml"; YAML.load_file(".github/workflows/ci.yml"); puts "ci yaml ok"'`: `ci yaml ok`.
- `cd apps/web && nvm use 22 && npm ci`: passed.
- `cd apps/web && nvm use 22 && npm run test:policy`: passed.
- `cd apps/web && nvm use 22 && npm run test`: passed.

## Notes for Maintainers

- Recommended scanners are documented as `gitleaks` and `trufflehog`; this PR does not introduce an enforced pre-commit hook or CI secret scanner.
- If a real secret is reported after push, rotate or revoke it first, then move the response to the private reporting path in `.github/SECURITY.md` before continuing public review.
- False positives should be discussed with scanner name and file path only; do not paste the full matched value into a PR.
