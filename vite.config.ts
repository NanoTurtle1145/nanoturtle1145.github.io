import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath, URL } from "url";
import { createReadStream, existsSync, readFileSync, statSync } from "fs";
import { join, normalize, resolve, sep } from "path";

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

/**
 * 开发服务器：让 public/ 下的静态目录支持目录索引（目录 + 结尾斜杠）。
 *
 * Vite 的 public 中间件只按文件路径匹配，「/archive/legacy/」这类目录请求会落到
 * SPA 回退，返回应用外壳——HTTP 200 但内容是首页，于是本地 dev 下旧站存档、
 * HopeOS 模拟器等必须显式写 .../index.html 才能打开，而线上 GitHub Pages
 * 本身支持目录索引，所以只在本地复现。
 *
 * 这里直接 use 中间件（会排在 Vite 内置中间件之前），在 SPA 回退前拦下这类请求，
 * 行为与线上保持一致：URL 不带 index.html，直接返回该目录的 index.html。
 */
function servePublicDirIndex(): Plugin {
  return {
    name: "serve-public-dir-index",
    apply: "serve",
    configureServer(server) {
      const publicDir = resolve(server.config.publicDir);
      server.middlewares.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        const raw = (req.url || "").split("?")[0].split("#")[0];
        if (!raw.endsWith("/")) return next();

        let pathname: string;
        try {
          pathname = decodeURIComponent(raw);
        } catch {
          return next();
        }

        const dir = resolve(join(publicDir, normalize(pathname)));
        // 防目录穿越：只允许 public/ 内部
        if (dir !== publicDir && !dir.startsWith(publicDir + sep)) return next();

        const indexFile = join(dir, "index.html");
        if (!existsSync(indexFile) || !statSync(indexFile).isFile()) return next();

        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        createReadStream(indexFile)
          .on("error", () => next())
          .pipe(res);
      });
    },
  };
}

// 用户 Pages 仓库（nanoturtle1145.github.io）+ 自定义域名，base 保持 "/"
export default defineConfig({
  base: "/",
  plugins: [vue(), vuetify(), servePublicDirIndex()],
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
