#!/usr/bin/env python3
"""生成社交分享图（Open Graph / 微信公众号封面用的 1200×630 卡片）。

构图：品牌深色底 + 横向文字标志 + 标语「有希望者，事竟成」+ 站点域名。
文字用系统 Noto Sans CJK SC，图形用 public/brand/ 里已转路径的宽 logo PNG。

输出：public/media/brand/og-default.png
用法：python3 scripts/make-og-image.py
"""
import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
BRAND = ROOT / "public" / "brand"
OUT = ROOT / "public" / "media" / "brand"
OUT.mkdir(parents=True, exist_ok=True)

CJK = "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc"
CJK_BOLD = "/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc"

W, H = 1200, 630
BG_TOP = (13, 16, 22)
BG_BOTTOM = (6, 7, 9)
INK = (247, 248, 248)
MUTED = (138, 143, 152)
SUBTLE = (98, 102, 109)
ACCENT = (139, 148, 245)


def font(path, size, index=2):
    return ImageFont.truetype(path, size, index=index)


def vertical_gradient(size, top, bottom):
    img = Image.new("RGB", (1, size[1]))
    px = img.load()
    for y in range(size[1]):
        t = y / max(1, size[1] - 1)
        px[0, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return img.resize(size, Image.BILINEAR)


def center_text(draw, text, fnt, fill, y, tracking=0, canvas_w=W):
    """居中绘制；tracking 为字距（px），0 时用原生 draw.text。"""
    if tracking == 0:
        box = draw.textbbox((0, 0), text, font=fnt)
        x = (canvas_w - (box[2] - box[0])) / 2 - box[0]
        draw.text((x, y), text, font=fnt, fill=fill)
        return

    widths = [draw.textlength(ch, font=fnt) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (canvas_w - total) / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += w + tracking


def main():
    card = vertical_gradient((W, H), BG_TOP, BG_BOTTOM)
    draw = ImageDraw.Draw(card)

    # 顶部一线强调色（与站内导航底部发丝线呼应）
    draw.rectangle([0, 0, W, 2], fill=(35, 38, 46))
    draw.rectangle([W // 2 - 120, 0, W // 2 + 120, 2], fill=ACCENT)

    # 横向文字标志（深色版，已转路径的透明 PNG）
    lockup = Image.open(BRAND / "hope-studio-lockup-dark@2x.png").convert("RGBA")
    target_w = 720
    target_h = round(lockup.height * target_w / lockup.width)
    lockup = lockup.resize((target_w, target_h), Image.LANCZOS)
    lx = (W - target_w) // 2
    ly = 168
    card.paste(lockup, (lx, ly), lockup)

    center_text(draw, "有希望者，事竟成", font(CJK_BOLD, 40), INK, ly + target_h + 34, tracking=6)
    center_text(draw, "桌面应用 · 操作系统 · 开源分享", font(CJK, 22), MUTED, ly + target_h + 104, tracking=2)

    # 底部域名 + 细线
    draw.rectangle([0, H - 74, W, H - 73], fill=(28, 31, 38))
    center_text(draw, "www.hopestudio.top", font(CJK, 19), SUBTLE, H - 48, tracking=1)

    card.save(OUT / "og-default.png", optimize=True)
    print(f"og-default.png: {W}x{H}, {lockup.width}x{lockup.height} lockup at y={ly}")


if __name__ == "__main__":
    main()
