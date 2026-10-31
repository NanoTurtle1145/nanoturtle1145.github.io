#!/usr/bin/env python3
"""生成「希望工作室 / Hope Studio」横向文字标志（宽 logo）。

字形全部转成路径，不依赖阅读端安装字体：
  - 中文：Noto Sans CJK SC Bold（系统字体 /usr/share/fonts/noto-cjk/）
  - 英文：Roboto Flex（站点自带 public/fonts/roboto-flex-latin.woff2，实例化为 wght 560 / opsz 72）
图形部分复用 public/logo-mark.svg 的线稿（圆环徽章 + 五角星）。

输出（public/brand/）：
  hope-studio-lockup-{light,dark}.svg           两行：图形 + 希望工作室 + HOPE STUDIO
  hope-studio-lockup-tagline-{light,dark}.svg   三行：多一行小字副标
运行：python3 scripts/make-brand-logo.py
"""
import pathlib
import re

from fontTools.ttLib import TTCollection, TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT = PUBLIC / "brand"
OUT.mkdir(parents=True, exist_ok=True)

INK = {"light": "#0B1220", "dark": "#EAF2FF"}

# ---- 字体 ----------------------------------------------------------------
def cjk_bold():
    ttc = TTCollection("/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc")
    for f in ttc.fonts:
        if (f["name"].getDebugName(1) or "") == "Noto Sans CJK SC":
            return f
    raise SystemExit("Noto Sans CJK SC Bold not found")


def latin_flex():
    font = TTFont(PUBLIC / "fonts" / "roboto-flex-latin.woff2")
    return instantiateVariableFont(font, {"wght": 560, "opsz": 72})


# ---- 字形转路径 ----------------------------------------------------------
def text_runs(font, text, size, tracking, x, baseline):
    """返回 (svg 片段列表, 文本宽度)。坐标系：基线在 baseline，y 轴向下。"""
    cmap = font.getBestCmap()
    glyphset = font.getGlyphSet()
    upem = font["head"].unitsPerEm
    scale = size / upem
    parts = []
    pen_x = 0.0
    for ch in text:
        if ch == " ":
            pen_x += size * 0.30 + tracking
            continue
        gname = cmap.get(ord(ch))
        if gname is None:
            pen_x += size * 0.5 + tracking
            continue
        glyph = glyphset[gname]
        pen = SVGPathPen(glyphset)
        glyph.draw(pen)
        d = pen.getCommands()
        if d:
            parts.append(
                f'<path transform="translate({x + pen_x:.2f} {baseline:.2f}) '
                f'scale({scale:.6f} {-scale:.6f})" d="{d}"/>'
            )
        pen_x += glyph.width * scale + tracking
    width = pen_x - tracking if text else 0.0
    return parts, width


def mark_svg(stroke_color):
    """取 public/logo-mark.svg 的线稿，替换描边色、去掉 xml/title/注释。"""
    src = (PUBLIC / "logo-mark.svg").read_text(encoding="utf-8")
    body = re.search(r"<svg[^>]*>(.*)</svg>", src, re.S).group(1)
    body = re.sub(r"<title>.*?</title>", "", body, flags=re.S)
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    body = body.replace('stroke="#070707"', f'stroke="{stroke_color}"')
    return body.strip()


MARK_BBOX = (80.9, 38.4, 842.8, 906.9)  # logo-mark.svg 的 getBBox() 实测值


def build(theme, tagline):
    ink = INK[theme]
    cn = cjk_bold()
    lat = latin_flex()

    mark_h = 240.0
    s = mark_h / MARK_BBOX[3]
    mark_w = MARK_BBOX[2] * s
    left = 48.0
    gap_mark_div = 40.0
    div_w = 1.5
    gap_div_text = 44.0
    text_x = left + mark_w + gap_mark_div + div_w + gap_div_text

    cn_size, cn_track = 164.0, 8.0
    en_size, en_track = 44.0, 12.0
    cn_parts, cn_w = text_runs(cn, "希望工作室", cn_size, cn_track, text_x, 0)
    en_parts, en_w = text_runs(lat, "HOPE STUDIO", en_size, en_track, text_x, 0)
    tag_parts, tag_w = ([], 0.0)
    if tagline:
        tag_parts, tag_w = text_runs(cn, "学生技术兴趣团队 · 浙江 · 2019", 24.0, 4.0, text_x, 0)

    content_w = max(cn_w, en_w, tag_w)
    W = round(text_x + content_w + 56.0)
    H = 470 if tagline else 420

    if tagline:
        cn_base, en_base, tag_base = 251.0, 307.0, 359.0
    else:
        cn_base, en_base, tag_base = 251.0, 311.0, 0.0

    def place(parts, baseline):
        return [
            re.sub(r"translate\(([\d.]+) 0\.00\)", f"translate(\\1 {baseline:.2f})", p)
            for p in parts
        ]

    # 重新以真实基线生成（上面先量宽度，这里再按基线生成一次）
    cn_parts, _ = text_runs(cn, "希望工作室", cn_size, cn_track, text_x, cn_base)
    en_parts, _ = text_runs(lat, "HOPE STUDIO", en_size, en_track, text_x, en_base)
    if tagline:
        tag_parts, _ = text_runs(cn, "学生技术兴趣团队 · 浙江 · 2019", 24.0, 4.0, text_x, tag_base)

    mark_y = (H - mark_h) / 2.0
    tx = left - MARK_BBOX[0] * s
    ty = mark_y - MARK_BBOX[1] * s

    div_x = left + mark_w + gap_mark_div
    div_top = H / 2.0 - 96
    div_h = 192

    label = "希望工作室 Hope Studio 横向标志" + ("（含副标）" if tagline else "")
    suffix = "-tagline" if tagline else ""
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{label}（{"深色" if theme == "dark" else "浅色"}版）">
  <title>{label}（{"深色" if theme == "dark" else "浅色"}版）</title>
  <!-- 图形：环形徽章 + 五角星（复用 logo-mark.svg，等比缩放到 {mark_h:.0f} 高） -->
  <g transform="translate({tx:.2f} {ty:.2f}) scale({s:.6f})">
{mark_svg(ink)}
  </g>
  <!-- 分隔线 -->
  <rect x="{div_x:.2f}" y="{div_top:.2f}" width="{div_w}" height="{div_h}" fill="{ink}" opacity="0.16"/>
  <!-- 中文：Noto Sans CJK SC Bold，已转路径 -->
  <g fill="{ink}">
{chr(10).join(cn_parts)}
  </g>
  <!-- 英文：Roboto Flex 560，已转路径 -->
  <g fill="{ink}" fill-opacity="0.62">
{chr(10).join(en_parts)}
  </g>'''
    if tagline:
        svg += f'''
  <!-- 副标 -->
  <g fill="{ink}" fill-opacity="0.45">
{chr(10).join(tag_parts)}
  </g>'''
    svg += "\n</svg>\n"

    name = f"hope-studio-lockup{suffix}-{theme}.svg"
    (OUT / name).write_text(svg, encoding="utf-8")
    return name, W, H, content_w


if __name__ == "__main__":
    for tagline in (False, True):
        for theme in ("light", "dark"):
            name, w, h, cw = build(theme, tagline)
            print(f"{name}: {w}x{h}px, 文字块宽 {cw:.1f}px")
