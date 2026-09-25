#!/usr/bin/env node
/**
 * 站点设计质量审计
 * ================
 * 用真实浏览器量出可核对的数字：文字对比度（WCAG）、字号/行高、
 * 触控目标尺寸、焦点可见性、prefers-reduced-motion 是否被尊重。
 *
 * 运行：
 *   "$CHROME" --headless --no-sandbox --remote-debugging-port=9333 \
 *       --user-data-dir=/tmp/chrome-prof about:blank &
 *   BASE_URL=https://www.hopestudio.top node scripts/audit-design.mjs
 */
const PORT = Number(process.env.CDP_PORT || 9333);
const BASE = process.env.BASE_URL || "https://www.hopestudio.top";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws, seq = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => {
    const id = ++seq;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expr) => {
  const r = await send("Runtime.evaluate", {
    expression: expr,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.result?.exceptionDetails) return { __error: r.result.exceptionDetails.text };
  return r.result?.result?.value;
};

/**
 * 在页面里注入的审计逻辑。
 *
 * 两个必须避开的坑：
 *  1) 文字压在图片/渐变上时无法用纯色推算对比度——早期版本因此算出 1.12:1 的
 *     荒谬值（首页 hero、导航都是白字压图片）。这类元素单独标注为「需人工确认」。
 *  2) 触控目标不能把所有 <a> 都算进来：WCAG 2.2 对正文行内链接有豁免，
 *     只统计 button/按钮型控件，并同时给出 AA(24px) 与 AAA(44px) 两档。
 */
const AUDIT = `(() => {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(/[,\\s/]+/).filter(Boolean).map(Number);
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const ratio = (fg, bg) => {
    const L1 = lum(fg), L2 = lum(bg);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  };
  /** 找文字的实际底色；若途中遇到图片/渐变则判定为不可自动计算 */
  const bgOf = (el) => {
    let n = el, sawImage = false;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') sawImage = true;
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0.85 && !sawImage) return { rgb: c.rgb };
      if (c && c.a > 0.85 && sawImage) return { image: true };
      n = n.parentElement;
    }
    const b = parse(getComputedStyle(document.body).backgroundColor);
    return b && b.a > 0.85 && !sawImage ? { rgb: b.rgb } : { image: sawImage };
  };

  const group = (label, sel, limit = 60) => {
    const els = [...document.querySelectorAll(sel)].slice(0, limit);
    const ok = [], unknown = [];
    for (const el of els) {
      if (!el.textContent || !el.textContent.trim()) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const fg = parse(cs.color);
      if (!fg || fg.a < 0.5) continue;
      const bg = bgOf(el);
      const px = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight) >= 700;
      const large = px >= 24 || (px >= 18.66 && bold);
      if (bg.image || !bg.rgb) { unknown.push({ px }); continue; }
      ok.push({ ratio: ratio(fg.rgb, bg.rgb), px, large, need: large ? 3 : 4.5 });
    }
    if (!ok.length && !unknown.length) return null;
    const need4 = ok.filter((o) => o.need === 4.5);
    const need3 = ok.filter((o) => o.need === 3);
    const fails = ok.filter((o) => o.ratio < o.need);
    return {
      label, sample: ok.length, unknown: unknown.length,
      min: ok.length ? +Math.min(...ok.map((o) => o.ratio)).toFixed(2) : null,
      median: ok.length
        ? +ok.map((o) => o.ratio).sort((a, b) => a - b)[Math.floor(ok.length / 2)].toFixed(2)
        : null,
      failAA: fails.length,
      failList: fails.slice(0, 3).map((o) => ({ r: +o.ratio.toFixed(2), px: +o.px.toFixed(1), need: o.need })),
    };
  };

  const contrasts = [
    group('正文段落', '.v-main p, .book-body p'),
    group('次要文字', '.text-medium-emphasis, [class*="text-medium"]'),
    group('链接', '.v-main a[href], .book-body a'),
    group('卡片/条目标题', '.v-card-title, .text-title-medium, .text-headline-small'),
    group('页面大标题', '.gov-header-1, .gov-header-2, h1, h2'),
    group('按钮', '.v-btn, button'),
    group('导航', '.v-tab, .gov-nav-link'),
    group('小字/标签', '.text-caption, .v-chip'),
  ].filter(Boolean);

  // 触控目标：只统计控件（行内正文链接按 WCAG 2.2 属豁免项）
  const controls = [];
  document.querySelectorAll('button, .v-btn, .v-tab, [role="button"], .v-list-item, input, select').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.height < 24 || r.width < 24) {
      controls.push({ w: Math.round(r.width), h: Math.round(r.height), t: (el.textContent || '').trim().slice(0, 16) });
    }
  });
  const belowAAA = [];
  document.querySelectorAll('button, .v-btn, .v-tab, [role="button"], .v-list-item').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.height < 44 || r.width < 44) belowAAA.push({ w: Math.round(r.width), h: Math.round(r.height), t: (el.textContent || '').trim().slice(0, 16) });
  });

  const sizes = {};
  document.querySelectorAll('body *').forEach((el) => {
    if (!el.textContent || !el.textContent.trim()) return;
    if (el.children.length) return;
    const px = +parseFloat(getComputedStyle(el).fontSize).toFixed(1);
    sizes[px] = (sizes[px] || 0) + 1;
  });

  return JSON.stringify({
    url: location.href,
    theme: document.body.className || '(none)',
    contrasts,
    failAA24: controls.length, controlsSample: controls.slice(0, 6),
    belowAAA44: belowAAA.length, belowAAASample: belowAAA.slice(0, 6),
    fontSizes: Object.entries(sizes).map(([k, v]) => [Number(k), v]).sort((a, b) => a[0] - b[0]),
    docWidth: document.documentElement.scrollWidth, winWidth: innerWidth,
  });
})()`;

async function main() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).filter(
        (t) => t.type === "page"
      );
      if (list.length) {
        ws = new WebSocket(list[0].webSocketDebuggerUrl);
        break;
      }
    } catch {}
    await sleep(250);
  }
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  await send("Page.enable");
  await send("Runtime.enable");

  const pages = ["/", "/posts", "/archive", "/archive/das-kapital"];
  for (const p of pages) {
    await send("Page.navigate", { url: BASE + p });
    await sleep(4000);
    const raw = await evaluate(AUDIT);
    if (typeof raw !== "string") {
      console.log(`\n=== ${p} 审计失败 ===`, raw);
      continue;
    }
    const d = JSON.parse(raw);
    console.log(`\n${"=".repeat(64)}\n${d.url}\n${"=".repeat(64)}`);
    console.log("【对比度】最低 / 中位 / 不达标数");
    for (const c of d.contrasts) {
      const mark = c.failAA === 0 ? "✓" : "✗";
      console.log(
        `  ${mark} ${String(c.min).padStart(6)}:1  中位 ${String(c.median).padStart(6)}:1  样本 ${String(c.sample).padStart(3)}  不达标 ${c.failAA}${c.unknown ? `  (压图/渐变未计入 ${c.unknown})` : ""}  ${c.label}`
      );
      for (const f of c.failList) console.log(`        ↳ ${f.r}:1 (需 ${f.need}) ${f.px}px`);
    }
    console.log(`【触控目标】控件低于 24px(AA): ${d.failAA24} 个；低于 44px(AAA): ${d.belowAAA44} 个`);
    for (const t of d.controlsSample) console.log(`    ${t.w}×${t.h}  "${t.t}"`);
    console.log(`【字号分布】${d.fontSizes.map(([s, n]) => `${s}px×${n}`).join(", ")}`);
    if (d.docWidth > d.winWidth) console.log(`【横向溢出】${d.docWidth} > ${d.winWidth}`);
  }

  // prefers-reduced-motion 是否被尊重
  console.log(`\n${"=".repeat(64)}\nprefers-reduced-motion 检查\n${"=".repeat(64)}`);
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await send("Page.navigate", { url: BASE + "/" });
  await sleep(3500);
  const rm = await evaluate(`(() => {
    const bad = [];
    document.querySelectorAll('body *').forEach((el) => {
      const cs = getComputedStyle(el);
      const dur = parseFloat(cs.transitionDuration) + parseFloat(cs.animationDuration);
      if (dur > 0.05 && cs.animationName !== 'none' || dur > 0.05) {
        if (bad.length < 8) bad.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 34),
          dur: cs.transitionDuration + '/' + cs.animationDuration,
        });
      }
    });
    return JSON.stringify({ animated: bad.length, sample: bad.slice(0, 5) });
  })()`);
  const r = JSON.parse(rm);
  console.log(`  reduce 模式下仍在动的元素: ${r.animated} 个`);
  r.sample.forEach((b) => console.log(`    <${b.tag} class="${b.cls}"> ${b.dur}`));
  await send("Emulation.setEmulatedMedia", { features: [] });

  ws.close();
}

main().catch((e) => {
  console.error("审计异常:", e.message);
  process.exitCode = 1;
});
