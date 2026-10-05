# Gmail Blur Privacy for Firefox

Protect your inbox from shoulder surfers. This extension blurs senders,
subjects, snippets, and message bodies in Gmail — hover to peek, click to
keep a message visible.

![Gmail Blur Privacy icon](icons/icon-128.png)

## Install

**From Firefox Add-ons** (recommended, after review):

> Add-on listing is in review — the install link will appear here once
> published.

**Temporary install (for testing / development):**

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` from this folder.
4. Reload your Gmail tab (`Ctrl+Shift+R`).

## How to use

- Open Gmail — sensitive text appears blurred.
- **Hover** any email row to peek at it; move the mouse away to blur it again.
- **Click** a row to keep it visible (click again to re-blur).
- Inside an open message, hover or click the subject/body to reveal it.
- Click the toolbar icon to switch blur off/on entirely (useful on trusted
  screens). Your choice is remembered.

## Privacy

- Everything runs locally in your browser. No accounts, no analytics,
  no network requests.
- The only thing stored is your on/off toggle.
- Blur hides content visually — it is not encryption. The page source and
  DevTools can still show the text. See [SECURITY.md](SECURITY.md).

## Compatibility

- Firefox 57+ (desktop).
- Gmail web (`mail.google.com`, `gmail.com`).
- Gmail occasionally changes its layout; if blur stops working after a
  Gmail update, please open an issue (see below) and we'll update the
  selectors.

## Permissions — why each one?

| Permission | Why |
|---|---|
| Access to `mail.google.com` / `gmail.com` | To blur the Gmail page content. Nothing else. |
| `storage` | To remember your on/off toggle on your own device. |

## Issues & support

Found a bug or Gmail changed its layout? Please open an issue at
<https://github.com/amdkholil/firefox-gmail-blur-privacy/issues> with:

- Extension version, Firefox version
- Which Gmail view (Inbox / Search / open message)
- What you expected vs. what happened

Security-sensitive reports: see [SECURITY.md](SECURITY.md) — please don't
file them as public issues.

## For developers

```sh
git clone https://github.com/amdkholil/firefox-gmail-blur-privacy.git
```

Load it temporarily (see Install above) and open the Browser Console
filtered by `gmail-blur` to see diagnostics (`blurred N nodes`).

| File | Purpose |
|---|---|
| `manifest.json` | Extension manifest (matches, icons, popup) |
| `content.js` | Blur logic, Gmail SPA observer, click-to-pin |
| `blur.css` | Blur + per-row hover/reveal rules |
| `background.js` | Default toggle state |
| `popup.html` / `popup.js` | Toolbar toggle UI |
| `icons/` | Extension icons (16–512px) |

> **Firefox Flatpak note:** Flatpak Firefox can only read `~/Downloads` by
> default. If `about:debugging` shows `Location: /run/user/.../doc/...`,
> copy the folder into `~/Downloads` first, or grant access with
> `flatpak override --user --filesystem=/path/to/firefox-gmail-blur-privacy org.mozilla.firefox`.

## More docs

- [CHANGELOG.md](CHANGELOG.md) — release history.
- [SECURITY.md](SECURITY.md) — privacy model and reporting.
