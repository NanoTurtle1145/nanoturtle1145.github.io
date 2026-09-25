#!/usr/bin/env node
/**
 * 站点外壳 · 导航切换回归测试
 * =============================
 *
 * 针对一类隐蔽故障：点导航后正文空白、必须 F5 才恢复。
 *
 * 成因：App.vue 的 <Transition mode="out-in"> 要求路由组件是单一根节点。
 * 首页由 4 个区块组成（fragment），离开时过渡状态机会卡死——旧内容移除后
 * 新路由不再插入，.v-main 里只剩一个空注释节点，且不报任何错。
 * 只有以首页为落地页、再点导航时才会触发，因此极易漏测。
 *
 * 运行方式（需先启动带调试端口的 Chrome）：
 *   "$CHROME" --headless --no-sandbox --remote-debugging-port=9333 \
 *       --user-data-dir=/tmp/chrome-prof about:blank &
 *   BASE_URL=http://localhost:5173 node scripts/test-navigation.mjs
 *
 * 环境变量：CDP_PORT（默认 9333）、BASE_URL（默认 http://localhost:5173）
 */
const PORT = Number(process.env.CDP_PORT || 9333);
const BASE = process.env.BASE_URL || "http://localhost:5173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
let seq = 0;
const pending = new Map();

const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++seq;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

async function evaluate(expression) {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return r.result?.result?.value;
}

/** 探测 .v-main 的实际渲染状态 */
const PROBE = `(() => {
  const main = document.querySelector('.v-main');
  const shell = main?.firstElementChild;
  const inner = shell?.firstElementChild;
  const cs = inner ? getComputedStyle(inner) : null;
  return JSON.stringify({
    path: location.pathname,
    shellCount: main?.children.length ?? -1,
    innerH: Math.round(inner?.getBoundingClientRect().height || 0),
    opacity: cs ? Number(cs.opacity) : null,
    text: (main?.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 30),
    bareComment: (main?.innerHTML || '').trim() === '<!---->',
    stuck: [...document.querySelectorAll('[class*="md3e-route"]')].length,
  });
})()`;

const clickTab = (name) => `(() => {
  const t = [...document.querySelectorAll('.v-tab')].find(
    (x) => x.textContent.trim() === ${JSON.stringify(name)}
  );
  if (!t) return false;
  t.click();
  return true;
})()`;

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`);
}

/** 判定一次导航后的正文是否健康 */
function judge(p) {
  const v = JSON.parse(p);
  if (v.bareComment || v.shellCount === 0)
    return { ok: false, why: "正文容器为空（过渡状态机卡死）" , v };
  if (v.shellCount < 0) return { ok: false, why: "未找到 .v-main", v };
  if (v.innerH < 40) return { ok: false, why: `正文高度仅 ${v.innerH}px`, v };
  if (v.opacity !== null && v.opacity < 0.9)
    return { ok: false, why: `正文仍透明 opacity=${v.opacity}`, v };
  if (v.stuck > 0) return { ok: false, why: `${v.stuck} 个过渡类残留`, v };
  return { ok: true, v };
}

async function goto(path) {
  await send("Page.navigate", { url: BASE + path });
  await sleep(4500);
}

async function main() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = (await r.json()).filter((t) => t.type === "page");
      if (list.length) {
        ws = new WebSocket(list[0].webSocketDebuggerUrl);
        break;
      }
    } catch {
      /* 未就绪 */
    }
    await sleep(250);
  }
  if (!ws) throw new Error("无法连接调试端口");
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

  const tabs = [
    "文章",
    "项目",
    "成员",
    "关于我们",
    "加入我们",
    "友情链接",
    "归档处",
    "首页",
  ];

  console.log("\n【1】以首页为落地页逐个点导航（原故障场景：首页是多根组件）");
  await goto("/");
  const start = judge(await evaluate(PROBE));
  check("首页正常渲染", start.ok, start.v.text);
  for (const t of tabs) {
    await evaluate(clickTab(t));
    await sleep(1500);
    const r = judge(await evaluate(PROBE));
    check(`点「${t}」→ ${r.v.path}`, r.ok, r.ok ? r.v.text : r.why);
  }

  console.log("\n【2】快速连点（60ms 间隔，模拟手快连切菜单）");
  let bad = 0;
  for (let i = 0; i < 8; i++) {
    const a = tabs[i % tabs.length];
    const b = tabs[(i + 3) % tabs.length];
    await evaluate(clickTab(a));
    await sleep(60);
    await evaluate(clickTab(b));
    await sleep(1600);
    const r = judge(await evaluate(PROBE));
    if (!r.ok) bad++;
    console.log(
      `  ${r.ok ? "✓" : "✗"} ${a}→${b} → ${r.v.path} 高=${r.v.innerH}${r.ok ? "" : " " + r.why}`
    );
  }
  check("快速连点无空白页", bad === 0, `${bad}/8 异常`);

  console.log("\n【3】动态路由（归档资料阅读器）进出");
  await goto("/archive/das-kapital");
  const reader = judge(await evaluate(PROBE));
  check("阅读器正常渲染", reader.ok, reader.v.text);
  for (const t of ["文章", "归档处", "首页", "项目"]) {
    await evaluate(clickTab(t));
    await sleep(1500);
    const r = judge(await evaluate(PROBE));
    check(`阅读器 →「${t}」`, r.ok, r.ok ? r.v.path : r.why);
  }

  console.log("\n【4】每个页面直接落地后点导航（覆盖非首页落地路径）");
  for (const from of ["/posts", "/projects", "/about", "/archive"]) {
    await goto(from);
    await evaluate(clickTab("成员"));
    await sleep(1500);
    const r = judge(await evaluate(PROBE));
    check(`${from} →「成员」`, r.ok, r.ok ? r.v.path : r.why);
  }

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
