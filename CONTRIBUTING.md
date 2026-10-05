# Contributing

## Development setup

```sh
git clone https://github.com/amdkholil/firefox-gmail-blur-privacy.git
```

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` from the project folder.
4. Reload your Gmail tab (`Ctrl+Shift+R`). The inbox should be blurred.

> **Firefox Flatpak note:** Flatpak Firefox can only read `~/Downloads` by
> default. If `about:debugging` shows `Location: /run/user/.../doc/...`,
> the content scripts can't load. Copy the folder into `~/Downloads` first,
> or grant access with
> `flatpak override --user --filesystem=/path/to/firefox-gmail-blur-privacy org.mozilla.firefox`,
> then restart Firefox and re-load.

## Project layout

| File | Purpose |
|---|---|
| `manifest.json` | Extension manifest (matches, icons, popup) |
| `content.js` | Blur logic, Gmail SPA observer, click-to-pin |
| `blur.css` | Blur + per-row hover/reveal rules (mirrored inline in `content.js` as fallback) |
| `background.js` | Default toggle state |
| `popup.html` / `popup.js` | Toolbar toggle UI |
| `icons/` | Extension icons (16–512px) |

## Pull requests

- Keep changes focused; update `CHANGELOG.md` under Unreleased.
- If Gmail changed its DOM, include the affected view and selectors in the
  PR description.
