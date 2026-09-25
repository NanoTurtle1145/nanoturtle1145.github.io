#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
归档处 · 资料导入器
====================

把 CHM 等打包文档转成站点可直接阅读的归档资料。

用法
----
    python3 scripts/import-archive.py <源文件.chm> --slug das-kapital \
        --title "资本论" --author "卡尔·马克思" [--desc "…"] [--year 2004]

产出（public/archive/library/<slug>/）
--------------------------------------
    meta.json          资料元数据
    toc.json           目录：卷 → 章（含章内锚点）
    text/<cid>.html    规范化正文（站点排版模式，HTML 片段）
    raw/<cid>.htm      原始正文（原文模式，仅补 charset + 阅读样式）
    search.json        全文检索索引（按章分段的纯文本）
    source/            原始文件（供下载/溯源）

同时维护 public/archive/library/index.json（归档资料总清单）。

设计要点
--------
* 原始 CHM 为 2004 年 GB2312/GB18030 编码且无 charset 声明，直出浏览器必乱码，
  故统一解码为 UTF-8 并显式声明。
* 「原文模式」保留原书全部排版标签（FONT/SIZE/ALIGN），只补最小阅读样式；
  「站点排版模式」把旧式标签归一到语义标签（h2/h3/p/strong/em + 笔记/页码标记）。
* 批阅者笔记（color=blue）与原书页码（color=red）在原书中承载信息，必须保留语义。
"""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "public" / "archive" / "library"

# 原书用到的旧式标签白名单（其余标签丢弃但保留其文字）
INLINE_KEEP = {
    "b": "strong",
    "strong": "strong",
    "i": "em",
    "em": "em",
    "u": "u",
    "sub": "sub",
    "sup": "sup",
}

# 「原文模式」注入的最小阅读样式：不改原书排版，只保证可读与自适应
RAW_CSS = """
html,body{margin:0;padding:0;background:#ffffff;}
body{max-width:46rem;margin:0 auto;padding:2.5rem 1.5rem 5rem;line-height:1.9;color:#111;}
img{max-width:100%;height:auto;}
a{color:#0b57d0;}
hr{border:0;border-top:1px solid #ddd;margin:2rem 0;}
table{border-collapse:collapse;max-width:100%;}
p{margin:.6em 0;}
"""


# --------------------------------------------------------------------------
# 通用工具
# --------------------------------------------------------------------------
def decode(raw: bytes) -> str:
    """旧书多为 GB18030；个别文件声明 gb2312，统一按 GB18030 解（是其超集）。"""
    for enc in ("utf-8", "gb18030", "big5"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("gb18030", "replace")


def strip_tags(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    return re.sub(r"[\s\u00a0\u3000]+", " ", s).strip()


def attr(tag: str, name: str) -> str | None:
    m = re.search(
        rf'{name}\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+))', tag, re.I
    )
    if not m:
        return None
    return next((g for g in m.groups() if g is not None), None)


# 原书章节间链接：cap1_00.htm / ../sub/pareto.htm 之类（不含协议与目录层级）
# 注意原书混用反斜杠（..\sub\gfhzz.html），匹配前统一成正斜杠
CHAPTER_LINK_RE = re.compile(r"^(?:\.\./)*(?:sub/)?([^/\\]+)\.(?:htm|html?)$", re.I)
SCHEME_RE = re.compile(r"^[a-z][a-z0-9+.-]*:", re.I)


def link_tag(href: str, known: dict[str, str]) -> tuple[str, str | None]:
    """把原书链接转成阅读器可解析的形式，返回 (起始标签, 需要闭合的行内标签名)。

    原书是「同目录一个 .htm 一章」的扁平结构，链接写作 href="cap1_00.htm"。
    这类相对链接若原样输出，在 /archive/<slug>?c=… 页面下会被解析成
    /archive/cap1_00.htm 而 404，故改写为 ?c=<章节号>，并用 data-cid 供阅读器
    拦截成站内跳转（避免整页刷新）。

    原书还存在指向未收录文件的死链（如 ..\\sub\\gfhzz.html，CHM 里并无此文件），
    这类改成语义化的 span：保留原文并注明原因，而不是留一个必然 404 的链接。
    锚点链接（#小节名）与外部链接原样保留。
    """
    if href.startswith("#"):
        return f'<a href="{html.escape(href, quote=True)}" class="book-link">', None
    if not SCHEME_RE.match(href):
        target = href.split("#", 1)[0].replace("\\", "/")
        m = CHAPTER_LINK_RE.match(target)
        if m:
            real = known.get(m.group(1).lower())
            if real:
                q = html.escape(real, quote=True)
                return (
                    f'<a href="?c={q}" data-cid="{q}" class="book-link">',
                    "a",
                )
            return (
                f'<span class="book-deadlink" title="原书此处链接的'
                f'《{html.escape(m.group(1), quote=True)}》未收录进该电子书">',
                "span",
            )
    return f'<a href="{html.escape(href, quote=True)}" class="book-link">', None


def extract_chm(src: Path, dest: Path) -> None:
    """用 7z 解包 CHM（p7zip 支持 Chm 格式）。"""
    if not shutil.which("7z"):
        sys.exit("错误：未找到 7z，无法解包 CHM（请安装 p7zip）")
    r = subprocess.run(
        ["7z", "x", str(src), f"-o{dest}", "-y"],
        capture_output=True,
        text=True,
    )
    if r.returncode != 0:
        sys.exit(f"错误：7z 解包失败\n{r.stdout[-1500:]}\n{r.stderr[-800:]}")


# --------------------------------------------------------------------------
# 目录（.hhc）解析
# --------------------------------------------------------------------------
def parse_hhc(path: Path) -> list[dict]:
    """从 .hhc 提取目录条目（Name + Local），保持原书顺序。"""
    raw = decode(path.read_bytes())
    entries: list[dict] = []
    for m in re.finditer(
        r'<param\s+name="Name"\s+value="([^"]*)"\s*>\s*'
        r'<param\s+name="Local"\s+value="([^"]*)"\s*>',
        raw,
        re.I,
    ):
        entries.append({"title": html.unescape(m.group(1)), "file": m.group(2)})
    return entries


def volume_of(title: str, cid: str) -> str:
    """判定所属卷别。

    注意不能只看标题里的「第X卷」：原书把附录条目放在目录最末，若按出现顺序
    归组会导致「卷首」被拆成两段而丢失内容，故卷别一律以文件名前缀为锚。
    """
    m = re.match(r"cap(\d+)_", cid)
    if m:
        num = int(m.group(1))
        return {1: "第一卷", 2: "第二卷", 3: "第三卷"}.get(num, f"第{num}卷")
    if cid.lower().startswith("capindex"):
        return "卷首"
    return "附录"


VOLUME_ORDER = ["卷首", "第一卷", "第二卷", "第三卷", "附录"]


# --------------------------------------------------------------------------
# 正文规范化：旧式 HTML → 语义 HTML 片段
# --------------------------------------------------------------------------
class Normalizer:
    """把 eTextWizard 生成的旧式 HTML 归一为语义结构。

    原书排版约定（据全量统计）：
      FONT SIZE=5 → 章标题   FONT SIZE=4 → 节标题   FONT SIZE=3 → 正文
      <br>        → 段落分隔（7033 处，原书不靠 <p> 分段）
      ALIGN=CENTER + 短行 → 居中标题
      color=blue  → 批阅者笔记     color=red → 原书页码
      <a NAME>    → 章内锚点
    """

    def __init__(self, known: dict[str, str] | None = None) -> None:
        # known: 小写章节号 → 实际章节号（用于区分站内链接与原书死链）
        self._known: dict[str, str] = known or {}
        self.blocks: list[dict] = []
        self.anchors: list[dict] = []
        self._buf: list[str] = []
        self._buf_size: int | None = None
        self._buf_align: str | None = None
        self._fonts: list[dict] = []
        self._inline: list[str] = []      # 行内标签闭合栈
        self._pending_anchor: str | None = None
        self._raw_table: list[str] | None = None

    # -- 状态 ------------------------------------------------------------
    def _size(self) -> int | None:
        for f in reversed(self._fonts):
            if f.get("size") is not None:
                return f["size"]
        return None

    def _color(self) -> str | None:
        for f in reversed(self._fonts):
            if f.get("color"):
                return f["color"].lower()
        return None

    # -- 输出 ------------------------------------------------------------
    def _flush(self) -> None:
        text_html = "".join(self._buf).strip()
        # 收尾未闭合的行内标签
        text_html += "".join(f"</{t}>" for t in reversed(self._inline))
        self._inline.clear()
        self._buf = []
        if not text_html:
            self._buf_size = self._buf_align = None
            return

        plain = strip_tags(text_html)
        size, align = self._buf_size, self._buf_align
        anchor, self._pending_anchor = self._pending_anchor, None

        # 全角缩进交给 CSS text-indent，避免双重缩进
        text_html = re.sub(r"^(?:&nbsp;|\u3000|\s)+", "", text_html)

        if size is not None and size >= 5:
            kind = "h2"
        elif size is not None and size == 4:
            kind = "h3"
        elif align == "center" and 0 < len(plain) <= 30:
            kind = "h3"
        else:
            kind = "p"

        if kind in ("h2", "h3") and len(plain) > 60:
            kind = "p"  # 防误判：过长的「居中行」其实不是标题

        self.blocks.append({"k": kind, "v": text_html})
        if anchor:
            self.blocks[-1]["id"] = anchor
            self.anchors.append({"id": anchor, "text": plain[:60] or anchor})
        self._buf_size = self._buf_align = None

    def _push(self, s: str) -> None:
        self._buf.append(s)

    # -- 主循环 ----------------------------------------------------------
    def feed(self, body: str) -> None:
        pos = 0
        for m in re.finditer(r"<[^>]*>", body):
            if m.start() > pos:
                chunk = body[pos : m.start()]
                if self._raw_table is not None:
                    self._raw_table.append(chunk)
                else:
                    self._push(chunk.replace("\u3000\u3000", ""))
            tag = m.group(0)
            self._tag(tag)
            pos = m.end()
        if pos < len(body):
            self._push(body[pos:])
        self._flush()

    def _tag(self, tag: str) -> None:
        closing = tag.startswith("</")
        name = re.match(r"</?\s*([a-zA-Z][a-zA-Z0-9]*)", tag)
        name = name.group(1).lower() if name else ""

        # 未知标签：仅在表格捕获时才保留原文
        known = {
            "font", "p", "br", "hr", "a", "table", "tr", "td", "th",
            "tbody", "thead", "div", "span", "body", "html", "head",
            "title", "meta", "center", "blockquote", "li", "ul", "ol",
            "dl", "dt", "dd", "h1", "h2", "h3", "h4", "h5", "h6",
        } | set(INLINE_KEEP)
        if name not in known:
            return
        if self._raw_table is not None and name not in ("table",):
            if not closing:
                self._raw_table.append(tag)
            else:
                self._raw_table.append(tag)
            return

        if name == "font":
            color = (attr(tag, "color") or "").lower()
            if closing:
                if self._fonts:
                    f = self._fonts.pop()
                    # 行内色彩标注（无 SIZE）只收 span，不切断段落；
                    # 块级字体包装（带 SIZE）是原书的分段手段，需 flush。
                    if f.get("inline"):
                        while self._inline:
                            t = self._inline.pop()
                            self._push(f"</{t}>")
                            if t == "span":
                                break
                    else:
                        self._flush()
            else:
                size = attr(tag, "size")
                try:
                    size = int(size) if size else None
                except ValueError:
                    size = None
                # 无 SIZE 但有 COLOR ⇒ 行内标注：蓝=批阅者笔记，红=原书页码
                if size is None and color:
                    cls = (
                        "note"
                        if color in ("blue", "#0000ff", "#00f")
                        else "pg"
                        if color in ("red", "#ff0000", "#f00")
                        else "mark"
                    )
                    self._inline.append("span")
                    self._push(f'<span class="{cls}">')
                self._fonts.append(
                    {"size": size, "color": color, "inline": size is None and bool(color)}
                )
            return

        if name == "table":
            if closing:
                if self._raw_table is not None:
                    self._flush()
                    self._raw_table.append(tag)
                    html_tbl = re.sub(
                        r"<(/?)(?!table|tr|td|th|tbody|thead)[a-zA-Z][^>]*>", "", "".join(self._raw_table)
                    )
                    self.blocks.append({"k": "table", "v": html_tbl})
                    self._raw_table = None
            else:
                self._flush()
                self._raw_table = [tag]
            return

        if name == "p":
            if closing:
                self._flush()
            else:
                self._flush()
                align = (attr(tag, "align") or "").lower()
                self._buf_align = align or None
                self._buf_size = self._size()
            return

        if name == "br":
            self._flush()
            return

        if name == "hr":
            self._flush()
            self.blocks.append({"k": "hr", "v": ""})
            return

        if name in ("h1", "h2", "h3", "h4", "h5", "h6"):
            if closing:
                self._flush()
            else:
                self._flush()
                self._buf_size = 5
                self._buf_align = "center"
            return

        if name == "a":
            if closing:
                # 链接可能是 <a>（改写为站内跳转）或 <span>（原书死链），
                # 两者都以 </a> 收尾，故弹到对应的行内标签为止
                while self._inline:
                    t = self._inline.pop()
                    self._push(f"</{t}>")
                    if t in ("a", "span"):
                        break
                return
            an = attr(tag, "name") or attr(tag, "id")
            href = attr(tag, "href")
            if an and not href:
                # 章内锚点：挂到紧随其后的那个块上
                self._flush()
                self._pending_anchor = an
                return
            if href and not href.lower().startswith("javascript:"):
                open_tag, inline_tag = link_tag(href, self._known)
                if inline_tag:
                    self._inline.append(inline_tag)
                self._push(open_tag)
            return

        if name in INLINE_KEEP:
            mapped = INLINE_KEEP[name]
            if closing:
                if mapped in self._inline:
                    while self._inline:
                        t = self._inline.pop()
                        self._push(f"</{t}>")
                        if t == mapped:
                            break
            else:
                self._inline.append(mapped)
                self._push(f"<{mapped}>")
            return

        if name in ("center",):
            if closing:
                self._flush()
            else:
                self._flush()
                self._buf_align = "center"
                self._buf_size = self._size()
            return

        if name in ("div", "span", "blockquote", "body", "html", "head",
                    "title", "meta", "li", "ul", "ol", "dl", "dt", "dd",
                    "tr", "td", "th", "tbody", "thead"):
            if name in ("li", "tr"):
                self._flush()
            return

    # -- 行内色彩处理（在文本块进入前替换）------------------------------
    def result(self) -> tuple[list[dict], list[dict]]:
        self._postprocess()
        self._merge_page_marks()
        # 丢弃无用锚点：OPTop 是原书顶部跳转锚，非章节小节
        self.anchors = [
            a for a in self.anchors
            if a["id"].lower() != "optop" and len(a["text"]) <= 40
        ]
        return self.blocks, self.anchors

    def _postprocess(self) -> None:
        """独立成块的纯数字（1-4 位）判定为原书页码。"""
        for b in self.blocks:
            if b["k"] != "p":
                continue
            plain = strip_tags(b["v"])
            if re.fullmatch(r"\d{1,4}", plain):
                b["k"] = "pg"
                b["v"] = plain

    def _merge_page_marks(self) -> None:
        """把夹在段落之间的原书页码并回前一段，恢复被切断的句子。

        原书页码写作 <p align=right><font color=red>N</font></p>，位置常在一句话中间，
        直接当独立块会把句子劈开；合并为行内上标既保住页码信息又不打断阅读。
        """
        out: list[dict] = []
        blocks = self.blocks
        i = 0
        while i < len(blocks):
            b = blocks[i]
            if (
                b["k"] == "pg"
                and out
                and out[-1]["k"] == "p"
                and i + 1 < len(blocks)
                and blocks[i + 1]["k"] == "p"
            ):
                nxt = blocks[i + 1]
                merged = (
                    out[-1]["v"].rstrip()
                    + f'<sup class="pg">{b["v"]}</sup>'
                    + nxt["v"].lstrip()
                )
                keep = dict(out[-1])
                keep["v"] = merged
                if nxt.get("id") and not keep.get("id"):
                    keep["id"] = nxt["id"]
                out[-1] = keep
                i += 2
                continue
            out.append(b)
            i += 1
        self.blocks = out


def normalize_chapter(
    html_text: str, known: dict[str, str] | None = None
) -> tuple[list[dict], list[dict]]:
    """规范化一章正文，返回 (blocks, anchors)。"""
    body_m = re.search(r"<body[^>]*>(.*)</body>", html_text, re.I | re.S)
    body = body_m.group(1) if body_m else html_text
    n = Normalizer(known)
    n.feed(body)
    return n.result()


def blocks_to_html(blocks: list[dict]) -> str:
    """每个块都带 data-b 序号，供检索命中后精确滚动定位。"""
    parts: list[str] = []
    for i, b in enumerate(blocks):
        k, v = b["k"], b["v"]
        bid = f' data-b="{i}"'
        anchor = (
            f' id="{html.escape(b["id"], quote=True)}"' if b.get("id") else ""
        )
        if k == "hr":
            parts.append("<hr>")
        elif k == "table":
            parts.append(f'<div class="book-table"{bid}>{v}</div>')
        elif k == "pg":
            parts.append(f'<p class="book-pg"{bid}>{v}</p>')
        elif k == "h2":
            parts.append(f"<h2{bid}{anchor}>{v}</h2>")
        elif k == "h3":
            parts.append(f"<h3{bid}{anchor}>{v}</h3>")
        else:
            parts.append(f"<p{bid}{anchor}>{v}</p>")
    return "\n".join(parts)


def blocks_plain(blocks: list[dict]) -> list[dict]:
    """检索索引：保留块序号，便于命中后定位。"""
    out: list[dict] = []
    for i, b in enumerate(blocks):
        if b["k"] in ("hr", "table"):
            continue
        t = strip_tags(b["v"])
        if t:
            out.append({"i": i, "t": t})
    return out


# --------------------------------------------------------------------------
# 「原文模式」页面
# --------------------------------------------------------------------------
def raw_page(original: str, title: str) -> str:
    """保留原书全部排版，仅补 charset 与小段阅读样式。"""
    s = original
    # 修掉原书里一处失效链接（../sub/pareto.htm，实际同层）
    s = re.sub(r'href="\.\./sub/([^"]+)"', r'href="\1"', s, flags=re.I)
    s = re.sub(r'(?i)<meta[^>]*charset[^>]*>', "", s)
    style = f"<style>{RAW_CSS}</style>"
    if re.search(r"(?i)<head[^>]*>", s):
        s = re.sub(
            r"(?i)(<head[^>]*>)",
            r'\1<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            + style,
            s,
            count=1,
        )
    else:
        s = (
            f'<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width,initial-scale=1">'
            f"{style}<title>{html.escape(title)}</title></head><body>{s}</body></html>"
        )
    return s


# --------------------------------------------------------------------------
# 主流程
# --------------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description="归档处 · 资料导入器")
    ap.add_argument("source", help="源文件（.chm）")
    ap.add_argument("--slug", required=True, help="资料标识（用于网址与目录名）")
    ap.add_argument("--title", required=True, help="资料标题")
    ap.add_argument("--author", default="", help="作者")
    ap.add_argument("--desc", default="", help="简介")
    ap.add_argument("--year", default="", help="原始年份")
    ap.add_argument("--tags", default="", help="标签，逗号分隔")
    args = ap.parse_args()

    src = Path(args.source).expanduser().resolve()
    if not src.exists():
        sys.exit(f"错误：源文件不存在 {src}")

    out = LIBRARY / args.slug
    # 只删除文件、保留目录结构。
    # vite dev server 会缓存 public 目录清单；若把 text/ raw/ 这类目录整个删除再重建，
    # 该目录下所有文件都会失效——请求回落到 SPA 外壳（HTTP 200 但内容是首页），
    # 表现为阅读器正文/原文空白，且必须重启 dev server 才恢复。
    OUT_DIRS = {"text", "raw", "source"}
    if out.exists():
        for path in sorted(out.rglob("*"), key=lambda p: len(p.parts), reverse=True):
            if path.is_file():
                path.unlink()
            elif path.is_dir() and path.name not in OUT_DIRS:
                path.rmdir()          # 上一次导入遗留的未知目录才删
    for d in OUT_DIRS:
        (out / d).mkdir(parents=True, exist_ok=True)

    tmp = Path(tempfile.mkdtemp(prefix="archive-import-"))
    try:
        print(f"[1/5] 解包 {src.name} …")
        extract_chm(src, tmp)

        hhc = next(iter(tmp.glob("*.hhc")), None)
        toc_entries = parse_hhc(hhc) if hhc else []
        print(f"      目录条目 {len(toc_entries)} 条")

        # 收集内容文件（.htm/.html），排除 CHM 内部结构文件
        content_files = sorted(
            p
            for p in tmp.iterdir()
            if p.is_file()
            and p.suffix.lower() in (".htm", ".html")
            and not p.name.startswith(("$", "#"))
        )
        by_name = {p.name.lower(): p for p in content_files}
        # 章节号映射（小写 → 实际），用于判定原书链接是否为死链
        known_ids = {p.stem.lower(): p.stem for p in content_files}
        # 原书 .hhc 里混有制作软件自带的英文标签（Contents / About eTextWizard），
        # 优先取含中文的目录名；全为英文时回落到文件自身的 <TITLE>。
        names_of: dict[str, list[str]] = {}
        for e in toc_entries:
            names_of.setdefault(
                Path(e["file"]).name.lower(), []
            ).append(e["title"])

        def resolve_title(fname: str, file_title: str, cid: str) -> str:
            for n in names_of.get(fname, []):
                if re.search(r"[^\x00-\x7f]", n):
                    return n.strip()
            if file_title and re.search(r"[^\x00-\x7f]", file_title):
                return file_title.strip()
            return (names_of.get(fname) or [file_title or cid])[0].strip()

        print(f"[2/5] 转换正文 {len(content_files)} 篇 …")
        chapters: list[dict] = []
        search: list[dict] = []
        seen: set[str] = set()

        for p in content_files:
            cid = p.stem
            text = decode(p.read_bytes())
            tm = re.search(r"(?is)<title[^>]*>(.*?)</title>", text)
            file_title = strip_tags(tm.group(1)) if tm else ""
            title = resolve_title(p.name.lower(), file_title, cid)

            # 原文模式
            (out / "raw" / f"{cid}.htm").write_text(
                raw_page(text, title), encoding="utf-8"
            )
            # 站点排版模式
            blocks, anchors = normalize_chapter(text, known_ids)
            (out / "text" / f"{cid}.html").write_text(
                blocks_to_html(blocks), encoding="utf-8"
            )

            if cid in seen:
                continue
            seen.add(cid)
            chapters.append(
                {
                    "id": cid,
                    "title": title,
                    "file": p.name,
                    "volume": volume_of(title, cid),
                    "anchors": anchors,
                }
            )
            search.append(
                {"c": cid, "t": title, "p": blocks_plain(blocks)}
            )

        # 目录顺序对齐原书 .hhc
        order = {Path(e["file"]).stem: i for i, e in enumerate(toc_entries)}
        chapters.sort(key=lambda c: (order.get(c["id"], 10_000), c["id"]))

        # 按卷别归组（字典分组，不受章节原书排序影响）
        groups: dict[str, list[dict]] = {}
        for ch in chapters:
            groups.setdefault(ch["volume"], []).append(
                {"id": ch["id"], "title": ch["title"], "anchors": ch["anchors"]}
            )
        order = [v for v in VOLUME_ORDER if v in groups] + [
            v for v in groups if v not in VOLUME_ORDER
        ]
        volumes = [
            {"name": v, "index": i, "chapters": groups[v]}
            for i, v in enumerate(order)
        ]

        print("[3/5] 写入目录与元数据 …")
        (out / "toc.json").write_text(
            json.dumps(
                {"slug": args.slug, "title": args.title, "volumes": volumes},
                ensure_ascii=False,
                indent=1,
            ),
            encoding="utf-8",
        )
        meta = {
            "slug": args.slug,
            "title": args.title,
            "author": args.author,
            "desc": args.desc,
            "year": args.year,
            "tags": [t.strip() for t in args.tags.split(",") if t.strip()],
            "chapters": len(chapters),
            "volumes": [v["name"] for v in volumes],
            "hasSearch": True,
            "hasRaw": True,
            "source": {
                "file": src.name,
                "size": src.stat().st_size,
                "format": src.suffix.lstrip(".").lower(),
            },
            "imported": date.today().isoformat(),
        }
        (out / "meta.json").write_text(
            json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8"
        )

        print("[4/5] 建全文检索索引 …")
        (out / "search.json").write_text(
            json.dumps(search, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )

        print("[5/5] 归档原始文件并登记清单 …")
        sdir = out / "source"
        sdir.mkdir(exist_ok=True)
        shutil.copy2(src, sdir / src.name)

        LIBRARY.mkdir(parents=True, exist_ok=True)
        idx_path = LIBRARY / "index.json"
        manifest = []
        if idx_path.exists():
            try:
                manifest = json.loads(idx_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                manifest = []
        manifest = [m for m in manifest if m.get("slug") != args.slug]
        manifest.append(
            {
                **meta,
                "url": f"/archive/{args.slug}",
                "download": f"/archive/library/{args.slug}/source/{src.name}",
            }
        )
        manifest.sort(key=lambda m: m.get("year") or "", reverse=True)
        idx_path.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8"
        )

        size = sum(f.stat().st_size for f in out.rglob("*") if f.is_file())
        print(
            f"\n完成：{args.title}\n"
            f"  章节 {len(chapters)} 篇 / 卷别 {[v['name'] for v in volumes]}\n"
            f"  锚点 {sum(len(c['anchors']) for c in chapters)} 个\n"
            f"  产出 {out.relative_to(ROOT)}（{size / 1048576:.1f} MB）"
        )
        return 0
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    raise SystemExit(main())
