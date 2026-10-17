# Hope Studio Website — Working Notes

Last verified: 2026-10-17 (after deploying Pages commit `06b2701`).

## Repo topology (verified against the live repo, 2026-10-17)

One public GitHub repo holds both source and site: `NanoTurtle1145/nanoturtle1145.github.io`.

| Branch | Content | Role |
| --- | --- | --- |
| `main` (default) | built static artifacts (`dist/` tree) | **the deployed site** |
| `master` | Vue 3 + vite-ssg source | source history only |

- GitHub Pages config: `build_type: legacy` — *Deploy from a branch* → `main`, path `/`.
- Custom domain: `www.hopestudio.top` (`CNAME` in the artifacts tree).
- Local checkouts:
  - `~/website` — source clone, on `master`, remote `origin` = the same repo.
  - `~/website/nanoturtle1145.github.io` — second clone, on `main`, holds the artifacts.
- **`.github/workflows/deploy.yml` is dead weight.** Pages is legacy/`main`, so
  the Actions-based Pages deploy can never win. Every push to `master` starts
  the "Deploy static content to Pages" workflow and it **fails** (runs on
  2026-09-25 07:00 / 05:07, 2026-08-27). It still creates deployment records,
  which is why they appear in the API — they are not live deploys.
  Pushing `master` does **not** publish anything.
  The workflow that actually builds the site is GitHub's built-in
  "pages build and deployment" on `main`.

## Publish flow — the only public release path

1. Build:
   ```bash
   cd ~/website && npm run build
   ```
   - `vite-ssg build` + `node scripts/postbuild.mjs`.
   - Postbuild copies `dist/404/index.html` → `dist/404.html`
     (Pages only serves a root-level 404).
   - Sanity-check the artifacts:
     `dist/index.html`, `dist/404.html`, `dist/CNAME`,
     `dist/hopeos/index.html`, `dist/hopeos-emulator/index.html`.
2. Sync into the Pages clone:
   ```bash
   rsync -a --delete --exclude=.git --exclude=.gitignore \
     ~/website/dist/ ~/website/nanoturtle1145.github.io/
   ```
   - **The excludes are mandatory.** The Pages repo *tracks* `.gitignore`
     (content: `.vite/`). A plain `--delete` unlinks it and `git add -A`
     would then commit its deletion.
   - Expected `git status`: old hashed assets deleted, new hashed assets added,
     HTML files modified (asset hash references + build timestamps). No
     unexpected source-like files.
3. Commit in the Pages clone: `git add -A && git commit -m "deploy: ..."`.
4. `git push origin main` — this is a visible action on a public remote, so
   confirm with the user first unless they already asked for a deploy
   (deploy approved and pushed on 2026-10-17).
5. Verify the release:
   ```bash
   curl -sL https://www.hopestudio.top/ | grep -o 'assets/app-[^"]*' | sort -u
   ls ~/website/dist/assets | grep '^app-'
   ```
   The hashes must match. Spot-check `/hopeos`, `/hopeos-emulator`, `/archive`,
   `/404.html`. Legacy Pages build usually finishes within a minute; re-fetch
   (append `?cachebust=$(date +%s)`) before concluding it failed.

## Source repo commits (`master`)

- Commit source fixes in `~/website`, push to `origin master` when the user
  wants them backed up — it is safe for the site (no deploy), but it *will*
  produce a red-X workflow run (see topology).
- Conventions from history: source uses `fix(hopeos): …`, `a11y(...): …`,
  `style(gov): …`, `docs: …`; Pages repo uses `deploy: …` only.
- Never hand-edit files in the Pages clone — fix `~/website/src`, rebuild, re-sync.

## Current state (2026-10-17)

- Pages `main` = `06b2701`; live assets `app-BluKWGms.css` / `app-CLdw_Ayo.js`.
- Source `master` = `2bf96b0` (`style(gov)`).
- What the 2026-10-17 deploy brought live (previously the live tree was the
  2026-09-25 12:50 build, so the archive reads `/archive` work was already live):
  - `--gov-body-2` `#727475` → `#5F6368`: 4.19:1 → **5.40:1** (WCAG AA on the
    light `#f1f2f3` sheet);
  - card shadow simplified to a hairline + near shadow (no more triple diffuse
    shadow);
  - home card hover transitions honour `prefers-reduced-motion` (`1e598b6`).
- Site content: 33 prerendered pages; posts come from `src/data/posts.ts`
  (old WordPress posts migrated); `/hopeos` embeds
  `public/hopeos-emulator/index.html` in an iframe.
- `public/hopeos/` is **gitignored** (local working copy); only
  `public/hopeos-emulator/` is tracked, so CI builds stay reproducible.
- Known leftovers: the failing `deploy.yml` on `master`; README's old claim
  that pushing `master` auto-deploys (corrected in this change).

## Useful checks

- Live vs built: compare `dist/assets/*` hashes with
  `curl -sL https://www.hopestudio.top/ | grep -o 'assets/[^"]*'`.
- Pages API: `GET /repos/NanoTurtle1145/nanoturtle1145.github.io/pages`
  (`status`, `build_type`, `source`) and `/deployments`.
- Dev server `npm run dev` (default :5173); local preview `./run.sh preview`
  (builds then serves `dist/` on :4173, closest to Pages behaviour).
- Browser regression/audit scripts need headless Chrome on CDP port 9333:
  `scripts/test-navigation.mjs` (nav/blank-content bug) and
  `scripts/audit-design.mjs` (contrast, target sizes, reduced-motion).
