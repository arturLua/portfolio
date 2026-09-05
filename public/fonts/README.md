# Fonts

Self-hosted **Inter** (SIL Open Font License 1.1). Not loaded from Google Fonts.

## Required file

    public/fonts/InterVariable.woff2

Download it from either:

- https://github.com/rsms/inter/releases — grab `Inter-*.zip`, take `web/InterVariable.woff2`
- https://rsms.me/inter/

Drop the file in this directory. The `@font-face` rule lives in
`src/styles/global.css` and points at `/fonts/InterVariable.woff2`.
Until the file is present, the site falls back to `system-ui` (via
`font-display: swap`).

## Swapping to Geist instead

Replace the file with `GeistVariableVF.woff2` (from
https://github.com/vercel/geist-font/releases, also OFL-1.1), then update
the `src:` URL and `font-family` name in `src/styles/global.css`.
