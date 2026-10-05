# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-10-05

### Fixed

- Blur no longer disappears after idle / tab switch: Gmail rewrites row
  classes on refresh, wiping the blur class. The content script now watches
  `class` attribute changes, re-scans periodically (2.5s safety net), and
  re-applies blur when the tab becomes visible again.
- AMO submission: declare `browser_specific_settings.gecko
  .data_collection_permissions.required: ["none"]` (no data collected).

### Removed

- All `console.log` diagnostics from the content script — the console stays
  clean (temporary debug logging can be re-added locally when needed).

## [1.0.0] - 2026-10-05

### Added

- Inbox + message-view blurring (senders, subjects, snippets, bodies) via
  content script + CSS (`content.js`, `blur.css`).
- Per-row hover reveal (`tr.zA` / `div[role="listitem"]`) and click-to-pin
  reveal per row.
- Toolbar popup toggle persisted with `storage.local` (`popup.html`,
  `popup.js`, `background.js` default `enabled: true`).
- Extension icons (`icons/icon-16`–`icon-512.png`) wired in `manifest.json`
  (`icons`, `browser_action.default_icon`).
- `README.md` (install incl. Flatpak note, usage, troubleshooting),
  `CHANGELOG.md`, `SECURITY.md`.

### Fixed

- Content script reliability on modern Gmail: expanded selector set
  (`td.yX`, `span.yP/yX`, `div.y6`, `span.y2`, `div.yW`, `div.a4W`,
  `table[role="grid"] tr`), debounced `MutationObserver`, re-apply after
  lazy load (500/1500/3000 ms), `0 nodes` diagnostic log.
- `storage` access compatible with both Firefox `browser` (promise) and
  Chrome `chrome` (callback) APIs.
- Manifest matches + permissions cover both `mail.google.com` and `gmail.com`.
- Row-click no longer forces blur when toggle is off; `gbp-hidden` leftover
  class removed.
