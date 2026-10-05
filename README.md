# Firefox Gmail Blur Privacy

Blurs Gmail senders, subjects, snippets, and message bodies to protect against
shoulder surfing and screenshots. Hover to peek, click to pin reveal per row.

![icon](icons/icon-128.png)

## Features

- Blurs inbox list (sender, subject, snippet) and open message view
  (subject header, sender, body).
- **Per-row interaction:** hover anywhere on a row reveals the whole row;
  click pins/unpins the reveal for that row.
- Toolbar popup checkbox toggles blur globally (persisted via `storage.local`).
- No network calls, no tracking — everything runs locally.
- Custom toolbar/menu icons (`icons/`, 16–128px).

## Install (temporary, dev)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` from this folder.
4. Reload your Gmail tab (`Ctrl+Shift+R`).

> **Firefox Flatpak note:** the Flatpak sandbox can only read `~/Downloads`
> by default. If `about:debugging` shows `Location: /run/user/.../doc/...`,
> the content scripts can't load. Either copy this folder into `~/Downloads`
> and load it from there, or grant access:
> `flatpak override --user --filesystem=/path/to/firefox-gmail-blur-privacy org.mozilla.firefox`
> then restart Firefox and re-load.

## Usage

- Browse Gmail normally — sensitive text is blurred (`filter: blur(6px)`).
- Hover a row to peek; move away to re-blur.
- Click a row to pin it revealed (click again to re-blur).
- In an open message, hover/click the subject or body blocks directly.
- Use the toolbar popup to disable blur entirely (e.g. for trusted screens).

## Permissions

- `storage` — remembers the on/off toggle only.
- `*://mail.google.com/*`, `*://gmail.com/*` — injects the content
  script + CSS into Gmail.

## Project layout

| File | Purpose |
|---|---|
| `manifest.json` | MV2 manifest, matches, icons, popup |
| `content.js` | Blur logic, MutationObserver for Gmail SPA, click-to-pin |
| `blur.css` | Blur + per-row hover/reveal rules (mirrored inline in `content.js` as fallback) |
| `background.js` | Initializes default `enabled: true` |
| `popup.html` / `popup.js` | Toolbar toggle UI |
| `icons/` | Extension icons (16–512px) |

## Troubleshooting

- **No blur / no `[gmail-blur]` logs in console:** content script not injected.
  Reload the extension in `about:debugging`, then hard-reload Gmail.
  Check the Flatpak note above.
- **`applyBlur: 0 nodes`:** Gmail changed its DOM. Open an issue with your
  Gmail view (Inbox/Search/message) and Firefox version.

## Docs

- [CHANGELOG.md](CHANGELOG.md) — release history.
- [SECURITY.md](SECURITY.md) — privacy model and how to report issues.
