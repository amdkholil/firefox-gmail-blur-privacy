# Security Policy

## Privacy model

Gmail Blur Privacy is a purely local, cosmetic extension:

- **No data collection.** No analytics, no telemetry, no remote requests.
- **No data transmission.** Email content never leaves the Gmail tab;
  blurring is a client-side CSS `filter` only.
- **Minimal stored data.** The only persisted value is the boolean toggle
  `{ enabled: true/false }` in `storage.local` on your own machine.
- **Minimal permissions.** `storage` plus host access to
  `mail.google.com` / `gmail.com` for content-script injection. There is no
  background network activity.

Blur is a visual deterrent against shoulder surfing and screenshots — it is
**not encryption**. Page source, DevTools, other extensions, and anyone with
access to the logged-in session can still read the underlying text.

## Supported versions

| Version | Supported |
|---|---|
| 1.0.x | Yes |

Only the latest `main` is maintained. Temporary (`about:debugging`) installs
receive updates by re-loading the folder.

## Reporting a vulnerability

Do **not** open a public issue for sensitive reports. Instead:

1. Open a private security advisory on GitHub, or email the maintainer
   (see profile at <https://github.com/amdkholil>).
2. Include: extension version / commit, Firefox version, Gmail view where it
   occurs, steps to reproduce, and (if any) console output. Redact personal
   email content from logs/screenshots.
3. Expect an initial response within 7 days.

Low-severity robustness issues (e.g. selectors broken by a Gmail DOM change,
blur bypass via DevTools by design) may be tracked as public issues since
they carry no data-exposure beyond the local machine.
