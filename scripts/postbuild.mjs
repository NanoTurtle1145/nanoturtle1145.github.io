// GitHub Pages 只认根目录下的 404.html，
// 而 vite-ssg 的 nested 模式产出的是 dist/404/index.html，这里补一份。
import { copyFileSync, existsSync } from "fs";
import { fileURLToPath, URL } from "url";

const src = fileURLToPath(new URL("../dist/404/index.html", import.meta.url));
const dest = fileURLToPath(new URL("../dist/404.html", import.meta.url));

if (!existsSync(src)) {
  console.error("[postbuild] 未找到 dist/404/index.html，请确认 /404 路由已被预渲染");
  process.exit(1);
}

copyFileSync(src, dest);
console.log("[postbuild] dist/404.html 已生成");
