#!/usr/bin/env node
/**
 * 归档处阅读器 · CDP 交互测试
 * 用 chrome-headless-shell 的 DevTools 协议真实点击：检索、跳转、模式切换、目录翻章。
 */
/**
 * 运行方式（需先启动静态服务器与带调试端口的 Chrome）：
 *   cd dist && python3 -m http.server 4180 --bind 127.0.0.1 &
 *   "$CHROME" --headless --no-sandbox --remote-debugging-port=9333 \
 *       --user-data-dir=/tmp/chrome-prof about:blank &
 *   node scripts/test-archive-reader.mjs
 *
 * 环境变量：CDP_PORT（默认 9333）、BASE_URL（默认 http://127.0.0.1:4180）
 */
const PORT = Number(process.env.CDP_PORT || 9333);
const BASE = process.env.BASE_URL || "http://127.0.0.1:4180";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws, seq = 0;
const pending = new Map();

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r.result?.exceptionDetails) {
    return { __error: r.result.exceptionDetails.text };
  }
  return r.result?.result?.value;
}

async function until(expr, timeout = 25000, label = expr) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if (await evaluate(expr)) return true;
    await sleep(300);
  }
  throw new Error(`超时等待：${label}`);
}

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

async function connect() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = (await r.json()).filter((t) => t.type === "page");
      if (list.length) return list[0].webSocketDebuggerUrl;
    } catch {
      /* 未就绪 */
    }
    await sleep(250);
  }
  throw new Error("无法连接调试端口");
}

async function main() {
  const wsUrl = await connect();
  ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id).resolve(m);
      pending.delete(m.id);
    }
  };

  await send("Page.enable");
  await send("Runtime.enable");

  console.log("\n【1】打开阅读器");
  await send("Page.navigate", { url: `${BASE}/archive/das-kapital/` });
  await until(
    "document.querySelectorAll('.book-body p[data-b]').length > 0",
    30000,
    "正文档落渲染"
  );
  const init = await evaluate(`(() => ({
    title: document.querySelector('.reader-chapter-head__title')?.textContent?.trim(),
    vols: document.querySelectorAll('.reader-vol__head').length,
    items: document.querySelectorAll('.reader-item').length,
    paras: document.querySelectorAll('.book-body p[data-b]').length,
    notes: document.querySelectorAll('.book-body .note').length,
    pages: document.querySelectorAll('.book-body sup.pg').length,
    h2: document.querySelectorAll('.book-body h2').length,
    author: document.querySelector('.reader-nav__byline')?.textContent?.trim(),
  }))()`);
  check("章标题已渲染", !!init.title, init.title);
  check("侧栏卷别数 = 5", init.vols === 5, `${init.vols} 卷`);
  check("侧栏章节项 > 0", init.items > 0, `${init.items} 项`);
  check("正文档落 > 0", init.paras > 0, `${init.paras} 段`);
  check("作者行", !!init.author, init.author);

  console.log("\n【2】目录翻章（点「第一卷」里的章节）");
  await evaluate(`(() => {
    const heads = [...document.querySelectorAll('.reader-vol__head')];
    const first = heads.find(h => h.textContent.includes('第一卷'));
    if (first && first.nextElementSibling && !first.nextElementSibling.offsetParent) first.click();
    return true;
  })()`);
  await sleep(400);
  await evaluate(`(() => {
    const items = [...document.querySelectorAll('.reader-item')];
    const t = items.find(i => i.textContent.includes('商品'));
    if (t) t.click();
    return !!t;
  })()`);
  await until(
    "document.querySelector('.reader-chapter-head__title')?.textContent?.includes('商品') && document.querySelector('.book-body')?.innerHTML.includes('第一章')",
    20000,
    "切换到「商品」章（含正文渲染完成）"
  );
  const ch2 = await evaluate(`(() => ({
    title: document.querySelector('.reader-chapter-head__title')?.textContent?.trim(),
    url: location.search,
    notes: document.querySelectorAll('.book-body .note').length,
    pages: document.querySelectorAll('.book-body sup.pg').length,
    pager: document.querySelectorAll('.reader-pager__btn').length,
  }))()`);
  check("章节已切换", ch2.title.includes("商品"), ch2.title);
  check("URL 同步 ?c=", ch2.url.includes("c=cap1_01"), ch2.url);
  check("批阅者笔记渲染", ch2.notes > 0, `${ch2.notes} 处`);
  check("原书页码内联", ch2.pages > 0, `${ch2.pages} 处`);
  check("上下章导航", ch2.pager === 2, `${ch2.pager} 个`);

  console.log("\n【3】全文检索");
  await evaluate(
    `document.querySelector('[aria-label="全文检索"]').click(), true`
  );
  await until("!!document.querySelector('.reader-search input')", 10000, "检索面板");
  check("检索面板打开", true);

  await evaluate(`(() => {
    const inp = document.querySelector('.reader-search input');
    inp.value = '剩余价值';
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  await until(
    "document.querySelectorAll('.reader-hit').length > 0",
    40000,
    "检索命中（需加载 4.5MB 索引）"
  );
  const s = await evaluate(`(() => ({
    hits: document.querySelectorAll('.reader-hit').length,
    meta: document.querySelector('.reader-search__meta')?.textContent?.trim(),
    firstCh: document.querySelector('.reader-hit__ch')?.textContent?.trim(),
    firstTx: document.querySelector('.reader-hit__tx')?.textContent?.trim()?.slice(0, 40),
    marked: document.querySelectorAll('.reader-hit mark').length,
  }))()`);
  check("检索有命中", s.hits > 0, `${s.hits} 条`);
  check("命中计数提示", !!s.meta, s.meta);
  check("关键词高亮", s.marked > 0, `${s.marked} 处 <mark>`);
  console.log(`      首条命中：[${s.firstCh}] ${s.firstTx}`);

  console.log("\n【4】命中跳转（应定位并高亮段落）");
  await evaluate(`document.querySelector('.reader-hit').click(), true`);
  await until("!!document.querySelector('.book-body .is-hit')", 20000, "命中段落高亮");
  await until(
    "(() => { const e = document.querySelector('.book-body .is-hit'); if (!e) return false; const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; })()",
    8000,
    "滚动落定到命中段落"
  );
  const jump = await evaluate(`(() => {
    const el = document.querySelector('.book-body .is-hit');
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return {
      tag: el.tagName, block: el.getAttribute('data-b'),
      text: el.textContent.slice(0, 40),
      top: Math.round(rect.top), bottom: Math.round(rect.bottom),
      h: Math.round(rect.height), vh,
      intersects: rect.top < vh && rect.bottom > 0,
      searchClosed: !document.querySelector('.reader-search'),
      title: document.querySelector('.reader-chapter-head__title')?.textContent?.trim(),
      url: location.search,
    };
  })()`);
  check(
    "跳转并高亮段落",
    jump.intersects,
    `块 #${jump.block} top=${jump.top} bottom=${jump.bottom} 高=${jump.h} 视口=${jump.vh}`
  );
  check("跳转后 URL 同步", jump.url.includes("c=cap1_00"), jump.url);
  check("检索面板自动收起", jump.searchClosed);
  check("跳转后章节正确", !!jump.title, jump.title);
  console.log(`      命中段落：${jump.text}…`);

  console.log("\n【5】切换到原文模式");
  await evaluate(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('原文模式'));
    if (b) b.click();
    return !!b;
  })()`);
  await until("!!document.querySelector('iframe.reader-raw')", 15000, "原文 iframe");
  await sleep(1500);
  const raw = await evaluate(`(() => {
    const f = document.querySelector('iframe.reader-raw');
    const d = f.contentDocument;
    return {
      src: f.getAttribute('src'),
      height: Math.round(f.getBoundingClientRect().height),
      innerH: d ? Math.round(d.body.scrollHeight) : -1,
      innerText: d ? d.body.innerText.slice(0, 30) : '',
      hasFont: d ? d.body.innerHTML.toUpperCase().includes('FONT') : false,
      url: location.search,
    };
  })()`);
  check("原文 iframe 载入", raw.innerH > 0, `内容高 ${raw.innerH}px`);
  check("iframe 定高(非贴合内容)", raw.height > 300 && raw.height < 1500, `${raw.height}px`);
  check("原文中文无乱码", /[\u4e00-\u9fa5]/.test(raw.innerText), raw.innerText.replace(/\n/g, " "));
  check("保留原书 FONT 标签", raw.hasFont);
  check("URL 记录原文模式", raw.url.includes("mode=raw"), raw.url);
  console.log(`      iframe src: ${raw.src}`);

  console.log("\n【6】回到站点排版并检查主题跟随");
  await evaluate(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('站点排版'));
    if (b) b.click();
    return !!b;
  })()`);
  await until("!!document.querySelector('.book-body p[data-b]')", 15000, "回到站点排版");
  const back = await evaluate(`(() => ({
    hasArticle: !!document.querySelector('.book-body'),
    noIframe: !document.querySelector('iframe.reader-raw'),
    url: location.search,
  }))()`);
  check("切回站点排版", back.hasArticle && back.noIframe);
  check("URL 清除 mode", !back.url.includes("mode=raw"), back.url || "(空)");

  console.log("\n【7】正文内章节链接（《资本论》目录页）");
  await send("Page.navigate", { url: `${BASE}/archive/das-kapital/` });
  await until(
    "document.querySelectorAll('.book-body a[data-cid]').length > 0",
    30000,
    "目录页正文链接渲染"
  );
  const lk = await evaluate(`(() => {
    const links = [...document.querySelectorAll('.book-body a[data-cid]')];
    const bad = links.filter(a => !(a.getAttribute('href') || '').startsWith('?c='));
    window.__noReload = true;
    return {
      count: links.length,
      badCount: bad.length,
      badSample: bad[0]?.getAttribute('href') || null,
      dead: document.querySelectorAll('.book-body .book-deadlink').length,
      head: document.querySelector('.reader-chapter-head__title')?.textContent?.trim(),
    };
  })()`);
  check("目录页在默认章打开", !!lk.head, lk.head);
  check(
    "正文章节链接已改写为 ?c=",
    lk.count > 0 && lk.badCount === 0,
    `${lk.count} 个链接，未改写 ${lk.badCount} 个${lk.badSample ? " 例:" + lk.badSample : ""}`
  );

  await evaluate(`(() => {
    const a = [...document.querySelectorAll('.book-body a[data-cid]')].find(x => x.dataset.cid === 'cap1_00');
    if (a) a.click();
    return !!a;
  })()`);
  await until(
    "document.querySelector('.reader-chapter-head__title')?.textContent?.includes('序言')",
    20000,
    "点击正文链接后切到「序言」章"
  );
  const nv = await evaluate(`(() => ({
    title: document.querySelector('.reader-chapter-head__title')?.textContent?.trim(),
    url: location.search,
    noReload: window.__noReload === true,
    paras: document.querySelectorAll('.book-body p[data-b]').length,
  }))()`);
  check("点击正文链接完成跳转", !!nv.title, nv.title);
  check("URL 同步目标章节", nv.url.includes("c=cap1_00"), nv.url);
  check("站内跳转未整页刷新", nv.noReload);
  check("目标章正文已渲染", nv.paras > 0, `${nv.paras} 段`);

  // 原书存在指向未收录文件的死链（..\sub\gfhzz.html 等，CHM 内并无该文件），
  // 导入时应转为不可跳转的标注而非留下必然 404 的链接
  await send("Page.navigate", { url: `${BASE}/archive/das-kapital/?c=cap3_27` });
  await until(
    "document.querySelectorAll('.book-body p[data-b]').length > 0",
    25000,
    "第三卷第 27 章渲染"
  );
  const dl = await evaluate(`(() => {
    const dead = [...document.querySelectorAll('.book-body .book-deadlink')];
    return {
      count: dead.length,
      title: dead[0]?.getAttribute('title') || null,
      isLink: dead.some(d => d.tagName === 'A'),
      hasHref: dead.some(d => d.hasAttribute('href')),
    };
  })()`);
  check("原书死链已转为惰性标注", dl.count > 0, `${dl.count} 处`);
  check("死链不再是可跳转链接", !dl.isLink && !dl.hasHref, dl.title || "");

  console.log("\n【8】原文模式下的章内链接");
  await send("Page.navigate", { url: `${BASE}/archive/das-kapital/?c=capindex&mode=raw` });
  await until("!!document.querySelector('iframe.reader-raw')", 20000, "原文 iframe");
  await sleep(2500);
  const rl = await evaluate(`(() => {
    const f = document.querySelector('iframe.reader-raw');
    const doc = f.contentDocument;
    const links = [...doc.querySelectorAll('a[href$=".htm"], a[href$=".html"]')];
    return { total: links.length, sample: links[0]?.getAttribute('href') || null };
  })()`);
  check("原文页存在章节链接", rl.total > 0, `${rl.total} 个，例:${rl.sample}`);

  const before = await evaluate(
    "document.querySelector('.reader-chapter-head__title')?.textContent?.trim()"
  );
  await evaluate(`(() => {
    const doc = document.querySelector('iframe.reader-raw').contentDocument;
    const a = [...doc.querySelectorAll('a[href$=".htm"], a[href$=".html"]')]
      .find(x => /cap1_00/i.test(x.getAttribute('href')));
    a.click();
    return !!a;
  })()`);
  await sleep(1800);
  const after = await evaluate(`(() => ({
    title: document.querySelector('.reader-chapter-head__title')?.textContent?.trim(),
    url: location.search,
    iframeSrc: document.querySelector('iframe.reader-raw')?.getAttribute('src'),
  }))()`);
  check("点击原文链接在阅读器内换章", after.title !== before, `${before} → ${after.title}`);
  check("原文模式保持且 URL 同步", after.url.includes('c=cap1_00') && after.url.includes('mode=raw'), after.url);
  check("iframe 已指向新章原文", /cap1_00/.test(after.iframeSrc || ''), after.iframeSrc);

  console.log("\n【9】移动端（390x844）：目录抽屉");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
  });
  await send("Page.navigate", { url: `${BASE}/archive/das-kapital/?c=cap1_01` });
  await until(
    "document.querySelectorAll('.book-body p[data-b]').length > 0",
    30000,
    "移动端正文字渲染"
  );
  const m0 = await evaluate(`(() => {
    const nav = document.querySelector('.reader-nav');
    const btn = document.querySelector('.reader-toolbar [aria-label="打开目录"]');
    return {
      navX: Math.round(nav.getBoundingClientRect().x),
      navW: Math.round(nav.getBoundingClientRect().width),
      hasBtn: !!btn && btn.offsetParent !== null,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      articleW: Math.round(document.querySelector('.book-body').getBoundingClientRect().width),
    };
  })()`);
  check("窄屏目录默认离屏", m0.navX < 0, `x=${m0.navX} 宽=${m0.navW}`);
  check("汉堡按钮可见", m0.hasBtn);
  check("窄屏无横向溢出", !m0.overflow, `正文宽 ${m0.articleW}px`);

  await evaluate(`document.querySelector('.reader-toolbar [aria-label="打开目录"]').click(), true`);
  await sleep(700);
  const m1 = await evaluate(`(() => {
    const nav = document.querySelector('.reader-nav');
    return {
      navX: Math.round(nav.getBoundingClientRect().x),
      navW: Math.round(nav.getBoundingClientRect().width),
      items: nav.querySelectorAll('.reader-item').length,
    };
  })()`);
  check("点击后目录滑出", m1.navX >= 0, `x=${m1.navX} 宽=${m1.navW}，${m1.items} 个章节项`);

  await evaluate(`document.querySelector('.reader-nav .reader-item').click(), true`);
  await sleep(900);
  const m2 = await evaluate(`(() => {
    const nav = document.querySelector('.reader-nav');
    return {
      navX: Math.round(nav.getBoundingClientRect().x),
      title: document.querySelector('.reader-chapter-head__title')?.textContent?.trim(),
    };
  })()`);
  check("选章后抽屉自动收起", m2.navX < 0, `x=${m2.navX}`);
  check("移动端选章生效", !!m2.title, m2.title);

  await send("Emulation.clearDeviceMetricsOverride");

  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n=========== 结果：${results.length - failed.length}/${results.length} 通过 ===========`
  );
  if (failed.length) {
    console.log("失败项：");
    failed.forEach((f) => console.log(`  ✗ ${f.name} ${f.detail}`));
    process.exitCode = 1;
  }
  ws.close();
}

main().catch((e) => {
  console.error("\n测试异常：", e.message);
  process.exitCode = 1;
});
