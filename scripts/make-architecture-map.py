#!/usr/bin/env python3
"""生成 HopeOS 系统架构思维导图（块状层次结构）。

版式参考「计算机系统层次结构」：自下而上的横向层块叠成塔——
  硬件与固件 → UEFI 引导 → 内核 → 用户态 / ABI → GUI 图形栈 → 应用程序
每层是一个大块，左侧是层号 / 名称 / 仓库路径，右侧是该层的能力块（小方块），
层与层之间用向上的箭头表示「下层支撑上层」。整张图为 2D SVG，无图片依赖。

颜色：内联版全部走站点 CSS 变量（`--site-*`），在页面里随明暗主题切换；
另导出浅色 / 深色两套独立 SVG。

输出：
  src/assets/architecture-mindmap.svg                 内联版（颜色走 CSS 变量）
  public/media/hopeos/architecture-mindmap-light.svg  浅色独立版
  public/media/hopeos/architecture-mindmap-dark.svg   深色独立版
用法：python3 scripts/make-architecture-map.py
"""
import pathlib
import re
from xml.sax.saxutils import escape

from fontTools.ttLib import TTCollection

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONT = "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc"
FONT_BOLD = "/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc"

# ------------------------------------------------------------------ 内容 ----
# (层号, 中文名, 英文名, 仓库路径, [能力块...])  自上而下
LAYERS = [
    ("05", "应用程序", "APPS", "user/ · kernel/apps/", [
        "Terminal · Notepad · FileMgr",
        "Paint · Snake · SysMonitor",
        "StarDust · HopeOS 95 · IceWM",
        "nano · coreutils · BusyBox",
    ]),
    ("04", "GUI 图形栈", "GUI", "kernel/gui/", [
        "compositor 双缓冲 + 脏矩形",
        "wm / wmdwm 平铺 · 4 工作区",
        "PS/2 键鼠 · fbcon 控制台",
        "GB2312 位图字体",
    ]),
    ("03", "用户态 / ABI", "USER", "user/", [
        "ring 3 + POSIX syscall",
        "libc · crt0 · malloc",
        "fork / execve · 信号 · 管道",
        "BusyBox · coreutils · musl",
    ]),
    ("02", "内核", "KERNEL", "kernel/", [
        "堆 64 MiB + 页池 96 MiB",
        "分页 · 4 级页表 · COW",
        "抢占调度 100 Hz",
        "IDT 256 · APIC/IOAPIC",
        "VFS：ramfs · FAT32 · procfs",
        "文件：symlink · statx · *at",
        "网络：e1000 + lwIP 2.2.0",
        "SMP：4 vCPU · 3 AP",
    ]),
    ("01", "UEFI 引导", "BOOT", "boot/", [
        "start.asm → main.c",
        "LoadImage KERNEL.EFI",
        "GOP 帧缓冲 + COM1",
        "ExitBootServices",
    ]),
    ("00", "硬件与固件", "HARDWARE", "QEMU + OVMF", [
        "QEMU + OVMF · x86-64",
        "PCIe · AHCI · e1000",
        "PS/2 · HPET · APIC",
        "4 vCPU · SIPI trampoline",
    ]),
]

# ------------------------------------------------------------------ 字体 ----
class Metrics:
    def __init__(self, path, index):
        ttc = TTCollection(path)
        self.font = ttc.fonts[index]
        self.cmap = self.font.getBestCmap()
        self.upem = self.font["head"].unitsPerEm

    def width(self, text, size):
        total = 0.0
        for ch in text:
            gname = self.cmap.get(ord(ch))
            total += (size * 0.55 if gname is None
                      else self.font["hmtx"][gname][0] * size / self.upem)
        return total


def sc_metrics(path):
    ttc = TTCollection(path)
    for i, f in enumerate(ttc.fonts):
        if (f["name"].getDebugName(1) or "").startswith("Noto Sans CJK SC"):
            return Metrics(path, i)
    return Metrics(path, 0)


REG = sc_metrics(FONT)
BOLD = sc_metrics(FONT_BOLD)

# ------------------------------------------------------------------ 度量 ----
W = 1080
PAD_X = 24
BAR_W = W - 2 * PAD_X
HEAD_W = 196
HEAD_PAD = 18
CHIP_W = 188
CHIP_GAP = 12
CHIP_TEXT = CHIP_W - 20
CHIP_SIZE = 12.5
CHIP_LH = 16
CHIP_PAD_Y = 9
BAR_PAD_Y = 16
BAR_GAP = 24
BAR_MIN_H = 82
ARROW_STROKE = 1.2


def wrap(text, max_w, size=CHIP_SIZE):
    tokens = re.findall(r"[A-Za-z0-9_.+/%#→-]+|.", text)
    lines, cur = [], ""
    for tok in tokens:
        if tok == " " and not cur:
            continue
        if not cur:
            cur = tok
        elif REG.width(cur + tok, size) <= max_w:
            cur += tok
        else:
            lines.append(cur.rstrip())
            cur = tok.lstrip()
    if cur.strip():
        lines.append(cur.rstrip())
    return [ln for ln in lines if ln]


def layout():
    bars = []
    y = 0
    for no, title, tag, path, chips in LAYERS:
        rows = []
        row = []
        x = HEAD_W + HEAD_PAD
        for chip in chips:
            lines = wrap(chip, CHIP_TEXT)
            h = len(lines) * CHIP_LH + 2 * CHIP_PAD_Y
            if row and x + CHIP_W > BAR_W - HEAD_PAD:
                rows.append(row)
                row = []
                x = HEAD_W + HEAD_PAD
            row.append((chip, lines, x, h))
            x += CHIP_W + CHIP_GAP
        if row:
            rows.append(row)

        chip_h = 0
        for r in rows:
            chip_h += max(c[3] for c in r) + 10
        chip_h = chip_h - 10 if rows else 0
        h = max(BAR_MIN_H, BAR_PAD_Y + chip_h + BAR_PAD_Y)
        bars.append({"no": no, "title": title, "tag": tag, "path": path,
                     "rows": rows, "y": y, "h": h})
        y += h + BAR_GAP
    height = y - BAR_GAP + 24
    return bars, height


PALETTES = {
    "light": {
        "text": "#0d1c28", "text2": "#2b3a48", "muted": "#5f6368",
        "line": "#e3e7ec", "line_soft": "#eef1f4", "accent": "#1867c0",
        "accent_soft": "rgba(24,103,192,0.07)", "accent_line": "rgba(24,103,192,0.28)",
        "surface": "#ffffff", "tint": "#f3f5f8",
    },
    "dark": {
        "text": "#f7f8f8", "text2": "#d0d6e0", "muted": "#8a8f98",
        "line": "#23252a", "line_soft": "#1a1c20", "accent": "#8b94f5",
        "accent_soft": "rgba(139,148,245,0.1)", "accent_line": "rgba(139,148,245,0.3)",
        "surface": "#0f1011", "tint": "#17191c",
    },
    "inline": {
        "text": "var(--site-text)", "text2": "var(--site-text-2)",
        "muted": "var(--site-muted)", "line": "var(--site-line)",
        "line_soft": "var(--site-line-soft)", "accent": "var(--site-accent)",
        "accent_soft": "var(--site-accent-soft)", "accent_line": "var(--site-accent-line)",
        "surface": "var(--site-surface)", "tint": "var(--site-tint-2)",
    },
}

FONT_STACK = ("'Noto Sans CJK SC','Source Han Sans SC','PingFang SC',"
              "'Microsoft YaHei',system-ui,sans-serif")
MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"


def build(theme):
    p = PALETTES[theme]
    bars, H = layout()
    font_attr = "" if theme == "inline" else f' font-family="{FONT_STACK}"'
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" class="arch-map-svg" '
        f'width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" '
        f'aria-labelledby="arch-map-title arch-map-desc"{font_attr}>',
        '<title id="arch-map-title">HopeOS 系统架构思维导图</title>',
        '<desc id="arch-map-desc">自下而上的六层块状结构：硬件与固件、UEFI 引导、'
        '内核、用户态 / ABI、GUI 图形栈、应用程序。</desc>',
    ]

    for i, bar in enumerate(bars):
        y, h = bar["y"], bar["h"]
        # 层块
        svg.append(
            f'<rect x="{PAD_X}" y="{y}" width="{BAR_W}" height="{h}" rx="12" '
            f'fill="{p["surface"]}" stroke="{p["line"]}" stroke-width="1.2"/>'
        )
        # 左侧强调条
        svg.append(
            f'<rect x="{PAD_X}" y="{y + 14}" width="4" height="{h - 28}" rx="2" '
            f'fill="{p["accent"]}" opacity="0.85"/>'
        )
        # 头部：层号 + 名称 + 路径
        cx = PAD_X + HEAD_PAD
        svg.append(
            f'<text x="{cx}" y="{y + 26}" fill="{p["accent"]}" font-size="9" '
            f'letter-spacing="1.4" font-weight="600" font-family="{MONO}">'
            f'L{escape(bar["no"])} · {escape(bar["tag"])}</text>'
        )
        svg.append(
            f'<text x="{cx}" y="{y + 50}" fill="{p["text"]}" font-size="16.5" '
            f'font-weight="600">{escape(bar["title"])}</text>'
        )
        svg.append(
            f'<text x="{cx}" y="{y + 68}" fill="{p["muted"]}" font-size="10" '
            f'font-family="{MONO}">{escape(bar["path"])}</text>'
        )
        # 头部分隔线
        svg.append(
            f'<path d="M{PAD_X + HEAD_W} {y + 12} V{y + h - 12}" fill="none" '
            f'stroke="{p["line_soft"]}" stroke-width="1"/>'
        )

        # 能力块
        cy = y + BAR_PAD_Y
        for row in bar["rows"]:
            rh = max(c[3] for c in row)
            for chip, lines, x, ch in row:
                bx = PAD_X + x
                svg.append(
                    f'<rect x="{bx}" y="{cy}" width="{CHIP_W}" height="{ch}" rx="8" '
                    f'fill="{p["tint"]}" stroke="{p["line"]}" stroke-width="1"/>'
                )
                parts = []
                for j, line in enumerate(lines):
                    parts.append(
                        f'<tspan x="{bx + 10}" y="{cy + CHIP_PAD_Y + 3 + j * CHIP_LH}">'
                        f'{escape(line)}</tspan>')
                svg.append(
                    f'<text x="{bx + 10}" y="{cy + CHIP_PAD_Y + 3}" fill="{p["text2"]}" '
                    f'font-size="{CHIP_SIZE}">{"".join(parts)}</text>'
                )
            cy += rh + 10

        # 层间向上箭头
        if i < len(bars) - 1:
            gap_top = y + h
            ax = W / 2
            ay0 = gap_top + 4
            ay1 = gap_top + BAR_GAP - 4
            svg.append(
                f'<path d="M{ax} {ay1} V{ay0 + 6}" fill="none" '
                f'stroke="{p["line"]}" stroke-width="{ARROW_STROKE}"/>'
            )
            svg.append(
                f'<path d="M{ax} {ay0} l-4.2 7.5 h8.4 Z" fill="{p["line"]}"/>'
            )

    svg.append("</svg>")
    return "\n".join(svg), H


if __name__ == "__main__":
    out = ROOT / "src" / "assets" / "architecture-mindmap.svg"
    out.parent.mkdir(parents=True, exist_ok=True)
    inline, H = build("inline")
    out.write_text(inline + "\n", encoding="utf-8")

    media = ROOT / "public" / "media" / "hopeos"
    for theme in ("light", "dark"):
        svg, _ = build(theme)
        (media / f"architecture-mindmap-{theme}.svg").write_text(svg + "\n", encoding="utf-8")

    print(f"architecture-mindmap: {W}x{H}, "
          f"{len(LAYERS)} layers, {sum(len(l[4]) for l in LAYERS)} chips")
