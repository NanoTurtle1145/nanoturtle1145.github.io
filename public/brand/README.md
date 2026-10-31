# 希望工作室 / Hope Studio 横向文字标志

宽版组合标志：环形徽章（圆环 + 五角星 + 顶部吊环）+ 「希望工作室」中文名 + 「HOPE STUDIO」
英文名。字形已全部转成路径（不依赖阅读端字体），可直接当 `<img>` 用。

| 文件 | 说明 |
|---|---|
| `hope-studio-lockup-light.svg` | 浅色主题：墨色 `#0B1220`，白/浅底使用 |
| `hope-studio-lockup-dark.svg` | 深色主题：反白 `#EAF2FF`，深底使用 |
| `hope-studio-lockup-tagline-light.svg` | 浅色 + 副标「学生技术兴趣团队 · 浙江 · 2019」 |
| `hope-studio-lockup-tagline-dark.svg` | 深色 + 副标 |
| `*@2x.png` | 2640px 宽透明 PNG 导出版（第三方平台/文档用） |
| `preview.png` | 明暗两套效果预览 |

- 中文：Noto Sans CJK SC Bold；英文：Roboto Flex 560（站点自带 woff2）；图形复用
  `public/logo-mark.svg`。
- 主色只用一种墨色，英文 62% 不透明度、副标 45%，不引入额外品牌色。
- 重新生成：`python3 scripts/make-brand-logo.py`（需 fontTools + brotli；字体路径见脚本）。
- 页面上按主题切换的写法：两张 `<img>` + CSS 在 `html[data-theme="dark"]` 下互换，
  与融合内核页的 logo 切换方式一致。
