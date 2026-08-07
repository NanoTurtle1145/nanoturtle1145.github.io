# 希望工作室官方网站

Hope Studio 官网。Vue 3 + TypeScript + Tailwind CSS + Vite-SSG，构建期预渲染为纯静态页面，部署在 GitHub Pages。

## 本地运行

```bash
./run.sh dev        # 开发服务器，热更新
./run.sh build      # 构建到 dist/
./run.sh preview    # 构建后本地预览（行为接近 GitHub Pages）
./run.sh clean      # 清理 dist/ 与 node_modules/
```

首次运行会自动执行 `npm install`。需要 Node 18+。

## 目录结构

```
src/
  components/    Navigation、Footer
  views/         各页面组件
  router/        路由表
  data/posts.ts  文章数据（由旧站迁移生成）
public/media/    文章配图（已本地化）
scripts/         构建后处理
```

## 内容来源

文章迁移自旧版官网 `www.hopestudio.top`（WordPress，2026-08-20 关停）：

- 21 篇有价值的文章，正文经清洗后以 HTML 形式内联在 `src/data/posts.ts`
- 29 张配图已下载到 `public/media/`，避免随原站图床一起失效
- 文内跨文章链接与目录锚点已重写为站内地址
- 旧站的大体积附件（安装包、资料文件）未镜像，链接保留并标注「原站附件」

## 部署

推送到 `master` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）自动构建并发布到 GitHub Pages。

自定义域名通过 `public/CNAME` 配置，因此 `vite.config.ts` 中 `base` 为 `/`。

动态路由 `/posts/:slug` 需要显式列出才能预渲染，这一步由 `vite.config.ts` 的 `includedRoutes` 从 `posts.ts` 中提取 slug 完成——新增文章时无需手动维护路径清单。
