#!/usr/bin/env bash
# 希望工作室官网 —— 本地开发/构建脚本
#
#   ./run.sh dev        启动开发服务器（热更新）
#   ./run.sh build      构建静态产物到 dist/
#   ./run.sh preview    构建后本地预览 dist/（模拟 GitHub Pages）
#   ./run.sh clean      清理构建产物与依赖
#
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-5173}"
PREVIEW_PORT="${PREVIEW_PORT:-4173}"

info() { printf '\033[36m==>\033[0m %s\n' "$*"; }
die() { printf '\033[31m错误:\033[0m %s\n' "$*" >&2; exit 1; }

check_node() {
  command -v node >/dev/null 2>&1 || die "未找到 node，请先安装：sudo pacman -S node npm"
  local major
  major="$(node -v | sed 's/^v\([0-9]*\).*/\1/')"
  [ "$major" -ge 18 ] || die "Node 版本过低（当前 $(node -v)），需要 v18 及以上"
}

ensure_deps() {
  if [ ! -d node_modules ]; then
    info "首次运行，安装依赖（可能需要几分钟）"
    npm install
  fi
}

cmd_dev() {
  check_node; ensure_deps
  info "开发服务器: http://localhost:${PORT}"
  npm run dev -- --port "$PORT"
}

cmd_build() {
  check_node; ensure_deps
  info "开始 SSG 构建"
  npm run build
  info "构建完成，产物位于 dist/（共 $(find dist -name '*.html' | wc -l) 个页面）"
}

cmd_preview() {
  cmd_build
  info "预览服务器: http://localhost:${PREVIEW_PORT}"
  info "按 Ctrl+C 停止"
  # 用 Python 起静态服务，行为最接近 GitHub Pages（直接吐 dist 里的文件）
  ( cd dist && python3 -m http.server "$PREVIEW_PORT" )
}

cmd_clean() {
  info "清理 dist/ .vite-ssg-temp/ node_modules/"
  rm -rf dist .vite-ssg-temp node_modules
  info "已清理"
}

case "${1:-dev}" in
  dev)     cmd_dev ;;
  build)   cmd_build ;;
  preview) cmd_preview ;;
  clean)   cmd_clean ;;
  *)
    sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'
    exit 1
    ;;
esac
