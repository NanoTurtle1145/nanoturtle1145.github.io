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

## Brand assets — wide lockup (2026-11-01)

- `public/brand/` holds the wide 希望工作室 / Hope Studio lockup: ring-badge mark +
  「希望工作室」+ letterspaced 「HOPE STUDIO」, light (`#0B1220`) and dark (`#EAF2FF`)
  variants; `-tagline-` versions add 「学生技术兴趣团队 · 浙江 · 2019」.
- Text is converted to outlines (中文 Noto Sans CJK SC Bold, 英文 site's Roboto Flex
  instanced at wght 560/opsz 72), so the SVGs don't depend on fonts at read time;
  the mark reuses `public/logo-mark.svg` line art. Regenerate with
  `python3 scripts/make-brand-logo.py` (needs fontTools + brotli).
- 4 SVGs (1265×420 / 1265×470), 2640px transparent PNG exports, `preview.png`.
  Served at `https://www.hopestudio.top/brand/...`.

## HopeOS 系统架构块状图 (2026-11-01)

- `/hopeos` 新增 `#mindmap` 区块：`src/assets/architecture-mindmap.svg`（内联，颜色走
  `--site-*` 变量，明暗自动切换）+ `public/media/hopeos/architecture-mindmap-{light,dark}.svg`
  （独立版，供「查看大图」新窗口打开，按 `html[data-theme]` 切换链接）。
- 版式：自下而上的六层横向层块（硬件与固件 → UEFI 引导 → 内核 → 用户态/ABI → GUI →
  应用程序），每层左侧层号/名称/仓库路径，右侧能力块；层间向上箭头。
- 由 `scripts/make-architecture-map.py` 生成（fontTools 量字宽后手工折行、布局），
  内容与 `kernel/`、`boot/`、`user/` 实际模块对应；仓库侧文档见
  hopeos `docs/ARCHITECTURE.md`。
- 注意：inline SVG 用 `v-html` 注入，样式需 `:deep(svg)`；窄屏 `min-width:1040px`
  横向滚动，避免 12px 字被压到不可读。

## 主题切换辐射动画 (2026-11-01)

- 用户要求明暗切换「从按钮方向辐射出去」：用 View Transitions API 实现——点主题按钮时
  以按钮中心为圆心，新主题的圆形 clip-path 从 0 扩到覆盖整屏（半径取到窗口最远角），
  旧主题在下面不动，视觉上就是从按钮扩散。
- `useThemeMode.ts`：`toggle(source?: Element)` 计算按钮中心/半径，写
  `--theme-origin-x/y`、`--theme-reveal-radius` 到 `<html>`，在
  `startViewTransition(async () => { apply(); await nextTick(); })` 里换主题，
  `transition.finished` 后清掉变量；不支持该 API、无 source、或
  `prefers-reduced-motion: reduce` 时直接切换（无动画）。
- `GovHeader.vue`：`@click="toggleTheme"` 把 `currentTarget` 传进去（键盘触发同样有效）。
- `style.css`：`::view-transition-new(root)` 做 `theme-radial-reveal` 0.55s
  cubic-bezier(.22,.61,.36,1)；old(root) 静态、`mix-blend-mode: normal`；
  reduced-motion 下再兜一层 `animation: none; clip-path: none`。
- 验证（headless CDP，真实时间而非 virtual-time）：动画挂在
  `::view-transition-new(root)`、圆心 (1146,31)=按钮中心、r=1501=窗口最远角；
  逐帧冻结截图确认圆形从右上角扩散、左下角最后变；反向切换与快速双击都正常，
  结束时 CSS 变量被清理；`--force-prefers-reduced-motion` 下瞬时切换无动画。
- 坑：headless 的 `--virtual-time-budget` 下 View Transition 回调不会执行（`cbRan`
  永远 false），必须走 CDP 真实时间（`/json/new` + Runtime.evaluate +
  Page.captureScreenshot）才能验证；用 `emulation.setDeviceMetricsOverride`
  固定 1440×1000。
