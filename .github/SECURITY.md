# Security Policy

## Supported Versions

Only the latest commit on `main` is actively maintained. There are no versioned releases at this time.

| Branch | Supported |
|--------|-----------|
| `main` | ✅ Yes    |
| older  | ❌ No     |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

To report a vulnerability, please use one of the following private channels:

- **GitHub private vulnerability reporting**: Use the [Security tab → "Report a vulnerability"](../../security/advisories/new) button in this repository. This is the preferred path.
- **Email**: If GitHub private reporting is unavailable, email the maintainers directly. Contact details are listed in [`FUNDING.json`](../FUNDING.json) or the repository profile.

### What to include

A useful report includes:

- A clear description of the vulnerability and its potential impact
- Steps to reproduce or a minimal proof-of-concept
- Affected component(s) (e.g., `crashlab-core`, `apps/web`, CI scripts)
- Any suggested mitigations or patches, if available

### Response expectations

| Step | Target timeline |
|------|----------------|
| Acknowledgement of report | 48 hours |
| Initial triage and severity assessment | 5 business days |
| Fix or mitigation plan communicated to reporter | 14 days |
| Public disclosure (coordinated with reporter) | 90 days from report, or sooner if fix is ready |

We follow a **coordinated disclosure** model. We ask reporters to keep details private until a fix is available or the 90-day window closes, whichever comes first. We will credit reporters in the advisory unless they prefer to remain anonymous.

## Pre-Commit Secret Scanning Expectations

Contributors and maintainers are expected to scan changes for credentials before pushing a shared branch or opening a PR. This is a local safety check, not a replacement for private vulnerability reporting.

### Required control path

1. Before the first push for a change and again after editing config files, environment examples, logs, fixtures, or copied command output, run at least one recommended local scanner.
2. Recommended tools:
   - `gitleaks detect --no-git --source .`
   - `trufflehog filesystem --directory .`
3. If a scanner flags a likely real secret, stop and do not push. Remove the value from the working tree and any local git history that already captured it (for example: amend, interactive rebase, or recommit after restore).
4. If the value is a real credential, rotate or revoke it immediately, then review nearby files, shell history, logs, and generated artifacts for the same secret.
5. If a suspected secret already reached a remote branch, pull request, or shared artifact, treat it as a security incident and report it through the private channels in this policy. Maintainers then follow the response timelines above.
6. If a finding is a false positive, note the scanner name and file path in the PR or maintainer discussion without pasting the full matched value.

### Known risks and mitigation boundaries

- Local secret scanning depends on contributor follow-through; the repository does not yet ship an enforced pre-commit hook. Mitigation: reviewers should ask which scanner was run when a PR touches config, logs, fixtures, or copied output.
- Scanners can miss transformed, partial, or newly formatted secrets. Mitigation: contributors and maintainers should still review diffs manually around credentials, tokens, keys, and connection strings.
- History cleanup in this repository reduces exposure here but does not revoke already-issued credentials or remove already-downloaded copies. Mitigation: always pair cleanup with rotation or revocation when the secret is real.

## Scope

This policy covers:

- `contracts/crashlab-core` — Rust fuzzing and reproducibility crate
- `apps/web` — Next.js frontend dashboard
- CI/CD configuration under `.github/workflows`
- Scripts under `scripts/`

Out of scope: third-party dependencies (report those upstream), and issues that require physical access to infrastructure.

## Known Gaps and Accepted Risks

See the [Operational Security Assumptions](../MAINTAINER_WAVE_PLAYBOOK.md#operational-security-assumptions) section of the Maintainer Wave Playbook for a documented list of known gaps and accepted residual risks.
