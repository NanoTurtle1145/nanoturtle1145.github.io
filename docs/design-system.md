# 设计令牌与 mdui 引入评估

> 2026-10-24 整理。配套代码：`src/style.css`（令牌定义 + 统一控件形状层）、`src/vuetify.ts`（组件默认值）。

## 一、形状刻度（全站唯一圆角来源）

采用 **MD3 / mdui 2 的 7 级形状刻度**（命名与 `--mdui-shape-corner-*` 一一对应，
将来引入 mdui 时令牌可 1:1 映射、无视觉断点）：

| 令牌 | 值 | MD3 档位 | 用途 |
|---|---|---|---|
| `--shape-none` | 0 | none | 应用栏、导航抽屉 |
| `--shape-xs` | 4px | extra-small | 内联标签、code、小徽章、菜单容器 |
| `--shape-sm` | 8px | small | chip、输入框、列表项、头像、snackbar |
| `--shape-md` | 12px | medium | 卡片、面板、图片框（默认） |
| `--shape-lg` | 16px | large | 大面板、FAB、模拟器外框 |
| `--shape-xl` | 28px | extra-large | 对话框、CTA 大横幅 |
| `--shape-full` | 9999px | full | 胶囊按钮、开关、圆点、进度条 |

控件语义别名（`src/style.css` `:root`，改这里即全站生效）：

| 别名 | 取值 | 覆盖控件 |
|---|---|---|
| `--shape-btn` | full | 全部 `v-btn`（图标按钮除外）→ 胶囊 |
| `--shape-card` | md | `v-card` / `.md3e-group` / 手写作业卡片 |
| `--shape-chip` | sm | `v-chip` |
| `--shape-field` | sm | `v-field`（outlined 输入族） |
| `--shape-menu` | sm | `v-menu` |
| `--shape-dialog` | xl | `v-dialog`（含内层卡片） |

### 统一规则（「统一控件形状层」）

- 位置：`src/style.css` 中部，**位于 Vuetify 的 `@layer` 之外**
  → CSS 层叠中 unlayered 规则天然优先于 Vuetify 组件层，无需逐条提优先级
- Vuetify 数字 `rounded="n"` 生成**内联样式** → 统一层用 `!important` 兜底
- 图标按钮（`.v-btn--icon`）保持正圆，FAB 取 16px，避免一刀切
- 刻意保留的例外：文章 `.post-body blockquote` 直角（左侧粗强调条与圆角混搭会突兀）

### 落地清单

- `style.css`：令牌定义、`:focus-visible`、滚动条、统一控件形状层、文章排版（img/pre/code/iframe）
- `vuetify.ts` defaults：VCard 12 / VBtn pill / VChip 8 / 输入族 8 / VAlert 12 / 抽屉 0
- 手写组件 20 余种杂值（1px~16px、.2rem、1.2rem、999px…）全部替换为 `var(--shape-*)`：
  `Home.vue`、`hopeos.vue`、`Posts.vue`、`GovHeader.vue`、`Footer.vue`、`License.vue`、
  `styles/main.sass`、`blocks/*`（editor 模板）、`home/portal-person.vue`
- 移除 `Archive.vue` 中 4 处 `rounded="0"`（内联样式会压掉统一层）

## 二、mdui 2 引入评估（2026-10 调研）

### 事实（npm / 包内容取证）

| 项 | 值 |
|---|---|
| 版本 / 许可证 | 2.1.5（2026-07）/ MIT |
| 包体积 | **5.08 MB unpacked**（未 gzip） |
| 技术形态 | **Lit 3 Web Components**（Custom Elements），非 Vue 组件 |
| 官方 Vue 集成 | **无**（README 称「兼容 Vue/React/Angular」= 直接写自定义元素标签） |
| 组件数 | 128 个（button/card/dialog/tabs/navigation-bar…） |
| 入口 | 单一 `mdui.js`，**无 exports map**（按需子路径导入不受支持） |
| 依赖 | lit、@floating-ui/utils、@material/material-color-utilities、@mdui/shared、@mdui/jq、ssr-window 等 |
| SSR 痕迹 | `localize.js` / `colorScheme.js` 使用 `ssr-window`（服务端不崩，但渲染的是空壳） |
| 形状令牌 | `--mdui-shape-corner-{none,extra-small,small,medium,large,extra-large,full}` = 0/4/8/12/16/28/9999px（与本站刻度一致，见上表） |

### 与本站栈（Vue 3 + Vuetify 4 + vite-ssg）的冲突点

1. **双设计系统**：两套 reset、两套主题机制（`<html>` mdui-theme 属性 vs 本站 `html[data-theme]`）、
   两套图标（Material Icons vs MDI）。mdui 的样式未分 `@layer`，其全局 `*` 规则会直接压制
   Vuetify 的 `@layer` 内样式——与 Vuetify 并存必须写大量隔离规则。
2. **SSG 水合**：自定义元素需要 `compilerOptions.isCustomElement` 白名单（否则模板告警/组件解析失败）；
   组件内部 DOM 由 Lit 在客户端生成 → 预渲染 HTML 里是空壳，**首屏必闪**（FOUC）；
   props 经 HTML 属性传递，数组/对象类 prop 无法响应式绑定。
3. **体积**：5MB 包 + lit 运行时，即便单组件也会拉入 localize/colorScheme 等公共模块；
   无 exports map 导致 tree-shaking 上限低。
4. **生态**：中文社区强、移动端覆盖全，但 Web 桌面端与 Vuetify 相比无增量价值
   （本站现有组件 Vuetify 全有，且已深度定制 Linear 皮肤）。

### 结论与建议

**推荐 C：不引入 mdui，保留 Vuetify 4 为基线，只借鉴其 MD3 形状/令牌规范。**

- 这正是本次「统一控件」做的事：令牌刻度已与 mdui 1:1 对齐，等于把 mdui 的
  形状规范以零成本、零风险的方式提前落地。
- 若未来确需 mdui 独占的组件（如桌面端导航栏），走**最小验证**路线：
  新建一个演示路由 → `vite.config` 加 `isCustomElement: t => t.startsWith('mdui-')`
  → 只注册单个组件 + 隔离作用域（给容器加 class，mdui 规则限定其下），
  验证体积与 FOUC 后再决定是否扩大。
- 全量替换 Vuetify（路径 A）当前不成立：本站 9 个路由 + 归档器 + 编辑器全部基于 Vuetify，
  迁移成本 ≫ 收益。

## 三、后续可扩展

- 尺寸/间距令牌（`--space-*`）与排版令牌（`--font-*`）可按同一模式增量补齐
- 若按钮胶囊不符合口味：只需把 `--shape-btn` 改为 `var(--shape-sm)`，全站按钮同步变 8px
