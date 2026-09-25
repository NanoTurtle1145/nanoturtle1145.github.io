import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "url";
import { readFileSync } from "fs";

/**
 * 动态路由 /posts/:slug 需要显式列出才能被预渲染。
 * 直接从 posts.ts 里正则提取 slug，避免构建配置阶段引入 TS 模块。
 */
function postPaths(): string[] {
  const src = readFileSync(
    fileURLToPath(new URL("./src/data/posts.ts", import.meta.url)),
    "utf-8"
  );
  return [...src.matchAll(/"slug":\s*"([^"]+)"/g)].map((m) => `/posts/${m[1]}`);
}

/**
 * 归档处资料列表由 scripts/import-archive.py 写入 public/archive/library/index.json，
 * 这里读出来展开成 /archive/<slug> 供 vite-ssg 预渲染。
 */
function archivePaths(): string[] {
  try {
    const raw = readFileSync(
      fileURLToPath(
        new URL("./public/archive/library/index.json", import.meta.url)
      ),
      "utf-8"
    );
    return (JSON.parse(raw) as { slug: string }[])
      .map((m) => m.slug)
      .filter(Boolean)
      .map((slug) => `/archive/${slug}`);
  } catch {
    return [];
  }
}

// 用户 Pages 仓库（nanoturtle1145.github.io）+ 自定义域名，base 保持 "/"
export default defineConfig({
  base: "/",
  plugins: [vue(), vuetify()],
  ssr: {
    // Vuetify 需要在 SSR/SSG 阶段被转换（否则 Node ESM 无法加载其 .css）
    noExternal: ["vuetify"],
  },
  ssgOptions: {
    dirStyle: "nested",
    formatting: "minify",
    includedRoutes(paths) {
      return [
        ...paths.filter(
          (p) => !p.includes(":") && !p.includes("*") && !p.includes("editor")
        ),
        ...postPaths(),
        ...archivePaths(),
      ];
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
