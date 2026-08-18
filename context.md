# HopeOS Website — Working Notes

## Publish flow (HIGH priority)

The public site lives in a separate git repo that is checked out as a
subfolder of the website project, so publishing is a "build then copy"
operation rather than pushing the website repo directly.

**Layout**
- Source project: `~/website` (Vue 3 + Vite SSG, package name `hopestudio-website`).
- Build output:  `~/website/dist`  (static, SSG-prerendered; `base: "/"`).
- Publish target: `~/website/nanoturtle1145.github.io` — its own git repo,
  the GitHub Pages source. Remote: `git@github.com:NanoTurtle1145/nanoturtle1145.github.io.git`
- Custom domain: `www.hopestudio.top` (see `CNAME` in the Pages repo).
- The HopeOS page is the `/hopeos` route → built to `dist/hopeos` and
  published at `nanoturtle1145.github.io/hopeos` → live at `www.hopestudio.top/hopeos`.

**Steps (do this before every release)**
1. `cd ~/website && npm run build`
   - runs `vite-ssg build && node scripts/postbuild.mjs`.
   - produces `dist/`. Verify `dist/hopeos` exists.
   - `scripts/postbuild.mjs` copies `dist/404/index.html` to `dist/404.html`
     (GitHub Pages only serves the root-level 404).
2. Copy the built site into the Pages repo:
   `cp -r ~/website/dist/* ~/website/nanoturtle1145.github.io/`
   (or `rsync -a --delete ~/website/dist/ ~/website/nanoturtle1145.github.io/`
   to also drop files removed from the build).
3. `cd ~/website/nanoturtle1145.github.io && git add -A && git commit -m "..." `
   then **ask before `git push`** (shared remote — pushing is a visible action).

**Why priority is HIGH:** this is the only public release path. A build that
succeeds but is never copied to `nanoturtle1145.github.io` is invisible, and a
partial copy leaves a broken site. Always confirm `dist/*` is fully synced
before pushing.

**Commit conventions** (from git history):
- Source repo (`~/website`): `hopeos emulator: ...`, `fix(hopeos): ...`
- Pages repo: `deploy: ...`, `Add HopeOS Page`, `fix: ...`
- The Pages repo is built artifacts only; never edit site files there by hand —
  always fix in `~/website/src`, rebuild, and re-copy.

## Current state (2026-08)

- HopeOS HTML emulator is DONE and live: built under this project, embedded in
  `/hopeos` via iframe, published at `www.hopestudio.top/hopeos` (emulator at
  `/hopeos-emulator`). It ships through the normal dist → Pages flow.
- Source repo has one uncommitted change: `src/style.css` (`.link-button`
  descendant selector fix). It is already built into `dist` and deployed on the
  Pages repo, but the source change should be committed so the two don't drift.
- Old WordPress content migrated from `www.hopestudio.top` into
  `src/data/posts.ts` (via the REST API script) — origin links point back to
  the WordPress site for provenance.
- The original `hopestudio.top` WordPress site is scheduled to shut down
  (per the 2026-07-21 farewell post); this GitHub Pages site is the replacement.

## Useful checks

- Verify what's live vs built: compare `dist/assets/*.css` against
  `nanoturtle1145.github.io/assets/*.css` (hashes should match after a deploy).
- Dev server: `npm run dev`. Preview build: `npm run preview`.
