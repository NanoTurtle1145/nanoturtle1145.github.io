<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useHead } from "@vueuse/head";
import { posts } from "../data/posts";

/**
 * 项目动态：从站内文章里筛出提及 HopeOS 的（数据驱动，不虚构内容）。
 */
const hopeosNews = computed(() =>
  [...posts]
    .filter((p) => /hopeos/i.test(`${p.title} ${p.excerpt} ${p.content}`))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3)
);

useHead({
  title: "HopeOS | 希望工作室",
  meta: [
    {
      name: "description",
      content:
        "HopeOS 是希望工作室发起的 UEFI 操作系统项目：从零手写内核、ring 3 用户态与 POSIX 系统调用，并已跑起 X11 服务器与 IceWM 桌面。",
    },
    {
      property: "og:image",
      content: "https://www.hopestudio.top/media/hopeos/xdesk-apps.png",
    },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

// 最新一轮 X11 / IceWM 实拍。首图同时用作 Hero。
const shots = [
  {
    src: "/media/hopeos/xdesk-apps.png",
    alt: "HopeOS 的 X11 桌面：IceWM 任务栏，XTerm、时钟、系统信息、计算器与欢迎窗口同时打开",
    title: "多窗口同时运行",
    text: "IceWM 接管 X11，XTerm、时钟、系统信息与计算器作为 X 客户端同时开着。",
  },
  {
    src: "/media/hopeos/xdesk-menu.png",
    alt: "IceWM 开始菜单在 HopeOS 上展开",
    title: "IceWM 开始菜单",
    text: "窗口收养、标题栏、任务栏与开始菜单均已接通。",
  },
  {
    src: "/media/hopeos/xdesk-xterm-prompt.png",
    alt: "HopeOS 的 XTerm 客户端显示 shell 提示符",
    title: "XTerm 客户端",
    text: "XTerm 已移植为 X 客户端，直接使用 HopeOS 的 POSIX shell。",
  },
  {
    src: "/media/hopeos/desktop-native.png",
    alt: "HopeOS 原生窗口与 IceWM 管理的 X11 窗口共存",
    title: "原生与 X11 共存",
    text: "原生 GUI 应用与 X 客户端在同一块屏幕上工作。",
  },
];

const heroShot = shots[0];

const milestones = [
  {
    no: "01",
    title: "X11 服务器",
    desc: "从零实现协议子集：窗口创建与映射、事件队列、帧缓冲呈现，客户端可以正常绘制。",
    icon: "code",
  },
  {
    no: "02",
    title: "IceWM 接管桌面",
    desc: "上游 IceWM 在 HopeOS 上跑通窗口收养、标题栏、任务栏按钮与开始菜单。",
    icon: "window",
  },
  {
    no: "03",
    title: "X 应用生态",
    desc: "XTerm、Clock、System Info、Calculator 已经作为 X 客户端运行，多窗口同时在线。",
    icon: "terminal",
  },
];

const stack = [
  { label: "BOOT", title: "UEFI 引导", desc: "BOOTX64.EFI 加载 KERNEL.EFI" },
  { label: "KERNEL", title: "内核", desc: "分页 · 堆 · 中断 · 抢占调度 · VFS" },
  { label: "USER", title: "ring 3", desc: "POSIX syscall · 用户态 shell" },
  { label: "X11", title: "X 服务器", desc: "窗口 · 事件 · 帧缓冲呈现" },
  { label: "WM", title: "IceWM", desc: "标题栏 · 任务栏 · 开始菜单" },
];

const done = [
  {
    area: "内核",
    title: "内存管理",
    desc: "隐式空闲链表堆分配器（mm.c），8 MiB 堆；分页与 COW 页表已经就位。",
  },
  {
    area: "内核",
    title: "中断 / 定时器",
    desc: "自接管 GDT/TSS、256 项 IDT、8259 重映射、PIT 100 Hz、ExitBootServices。",
  },
  {
    area: "内核",
    title: "抢占式调度器",
    desc: "内核线程、100 Hz 时间片、栈金丝雀；调度器主路径回收已退出线程。",
  },
  {
    area: "内核",
    title: "VFS + ramfs",
    desc: "文件系统接入内核，支持目录与文件读写，用户态可以正常访问。",
  },
  {
    area: "图形",
    title: "GUI 桌面",
    desc: "离屏双缓冲 + 脏矩形合成，原生窗口、任务栏与桌面组件。",
  },
  {
    area: "图形",
    title: "PS/2 键鼠输入",
    desc: "键盘、鼠标输入解码，并把事件路由到活动窗口。",
  },
  {
    area: "图形",
    title: "X11 服务器 + IceWM",
    desc: "X 协议子集、窗口与事件、帧缓冲呈现；IceWM 负责窗口管理与任务栏。",
  },
  {
    area: "用户态",
    title: "ring 3 + 系统调用",
    desc: "分页基础设施、DPL3 描述符、0x80 syscall 门，用户程序在 ring 3 运行。",
  },
  {
    area: "用户态",
    title: "POSIX 内核",
    desc: "每进程 fd/cwd、fork/execve/重定向、用户态 shell、最小 libc。",
  },
];

const roadmap = [
  {
    stage: "IceWM 桌面收尾",
    detail: "补齐 XPM 图标、桌面壁纸、任务栏时钟刷新与窗口拖拽细节。",
    status: "进行中",
  },
  {
    stage: "按需缺页（demand paging）",
    detail: "在已有 COW + 可返回 #PF 的基础上，补齐真正的按需分页。",
    status: "进行中",
  },
  {
    stage: "可写、持久化文件系统",
    detail: "把 ramfs 内容持久化到磁盘镜像，重启后仍然存在。",
    status: "计划中",
  },
  {
    stage: "用户态 libc 完善 + 工具链",
    detail: "补齐 malloc / 信号 / stdio 缓冲，可承载更多第三方程序。",
    status: "计划中",
  },
  {
    stage: "设备驱动",
    detail: "先网络，再 GPU / 存储（AHCI、NVMe、USB）。",
    status: "计划中",
  },
  {
    stage: "兼容 BusyBox",
    detail: "PIE 加载 + auxv + arch_prctl + mmap/brk + 信号，分 A~E 阶段推进。",
    status: "远期",
  },
  {
    stage: "承载 JVM → 跑 Minecraft",
    detail: "需要足够 POSIX + GPU 图形，属于极远远期终态，学习旅程本身才是重点。",
    status: "极远",
  },
];

const statusClass = (s: string) =>
  ({ 进行中: "is-active", 计划中: "is-plan", 远期: "is-far", 极远: "is-far" })[s] ??
  "is-far";

/* ---------------- 截图灯箱 ---------------- */
const activeShot = ref<number | null>(null);
const active = computed(() =>
  activeShot.value === null ? null : shots[activeShot.value]
);
const closeButton = ref<HTMLButtonElement | null>(null);
let previousFocus: HTMLElement | null = null;

function lockBody(lock: boolean) {
  if (typeof document === "undefined") return;
  document.body.style.overflow = lock ? "hidden" : "";
}

function openShot(index: number) {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  activeShot.value = index;
  lockBody(true);
  nextTick(() => closeButton.value?.focus());
}

function closeShot() {
  activeShot.value = null;
  lockBody(false);
  previousFocus?.focus();
  previousFocus = null;
}

function stepShot(delta: number) {
  if (activeShot.value === null) return;
  activeShot.value = (activeShot.value + delta + shots.length) % shots.length;
}

function onKeydown(event: KeyboardEvent) {
  if (activeShot.value === null) return;
  if (event.key === "Escape") closeShot();
  if (event.key === "ArrowRight") stepShot(1);
  if (event.key === "ArrowLeft") stepShot(-1);
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  lockBody(false);
});
</script>

<template>
  <div class="hopeos-page">
    <!-- Hero：项目名片 + 最新实拍 -->
    <header id="overview" class="hero wrap">
      <div class="hero-copy">
        <p class="eyebrow"><i aria-hidden="true"></i>操作系统项目 · HOPEOS 0.2.0</p>
        <h1>HopeOS<span class="h1-dot" aria-hidden="true">.</span></h1>
        <p class="tagline">从 UEFI 开始，自己写一个操作系统。</p>
        <p class="lead">
          从内核线程、抢占式调度、虚拟文件系统，到 ring 3 用户态与 POSIX
          系统调用，再到今天跑起来的 X11 + IceWM 桌面——每一层都从零实现。
          目标不是做一个玩具，而是弄清楚一台计算机到底是怎么跑起来的。
        </p>

        <div class="tags" aria-label="技术栈">
          <span>UEFI</span>
          <span>x86-64</span>
          <span>ring 3</span>
          <span>POSIX</span>
          <span>X11</span>
          <span>IceWM</span>
        </div>

        <div class="cta-row">
          <a class="btn btn-solid" href="#try">
            <span>在线体验</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
          <a class="btn btn-ghost" href="#roadmap">查看开发路线</a>
        </div>

        <p class="hero-note">
          <span class="lock">源码暂未开源</span>
          <span class="sep" aria-hidden="true">·</span>
          <router-link to="/license">第三方组件许可证</router-link>
        </p>
      </div>

      <div class="hero-visual">
        <div class="shot-shell">
          <div class="shot-bar">
            <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="shot-title">HopeOS · X11 session</span>
            <span class="shot-live"><i aria-hidden="true"></i>RUNNING</span>
          </div>
          <button
            class="shot-main"
            type="button"
            :aria-label="`放大截图：${heroShot.title}`"
            @click="openShot(0)"
          >
            <img :src="heroShot.src" :alt="heroShot.alt" fetchpriority="high" decoding="async" />
            <span class="shot-zoom" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" /></svg>
            </span>
          </button>
          <div class="shot-foot">
            <span>QEMU 实拍 · 1024 × 768</span>
            <span>XTerm / Clock / SysInfo / Calc</span>
          </div>
        </div>
        <div class="hero-glow" aria-hidden="true"></div>
      </div>
    </header>

    <!-- 最新进展 -->
    <section id="milestones" class="wrap section">
      <div class="section-head">
        <div>
          <p class="kicker">LATEST</p>
          <h2>X11 桌面已经跑起来了</h2>
        </div>
        <span class="section-note">2026.10 · QEMU 实拍</span>
      </div>
      <p class="section-lead">
        这一轮把图形栈从自绘桌面继续往上推：X 服务器、窗口管理器与 X
        客户端全部接进 HopeOS，IceWM 已经可以管理真实窗口。
      </p>

      <div class="milestone-grid">
        <article v-for="m in milestones" :key="m.no" class="milestone">
          <div class="milestone-top">
            <span class="milestone-no">{{ m.no }}</span>
            <span class="milestone-icon" aria-hidden="true">
              <svg v-if="m.icon === 'code'" viewBox="0 0 24 24">
                <path d="m9 18-6-6 6-6M15 6l6 6-6 6" />
              </svg>
              <svg v-else-if="m.icon === 'window'" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 9h18" />
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="m7 9 3 3-3 3M13 15h4" />
              </svg>
            </span>
          </div>
          <h3>{{ m.title }}</h3>
          <p>{{ m.desc }}</p>
        </article>
      </div>
    </section>

    <!-- 启动链路 -->
    <section id="stack" class="wrap section">
      <div class="section-head">
        <div>
          <p class="kicker">ARCHITECTURE</p>
          <h2>从按电源键到 IceWM 桌面</h2>
        </div>
        <span class="section-note">自底向上</span>
      </div>

      <div class="pipe">
        <div v-for="node in stack" :key="node.label" class="pipe-node">
          <span class="pipe-label">{{ node.label }}</span>
          <h3>{{ node.title }}</h3>
          <p>{{ node.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 已实现 -->
    <section id="features" class="wrap section">
      <div class="section-head">
        <div>
          <p class="kicker">IMPLEMENTED</p>
          <h2>已经实现的</h2>
        </div>
        <span class="section-note">9 个子系统</span>
      </div>

      <div class="feature-grid">
        <article v-for="(item, i) in done" :key="item.title" class="feature">
          <div class="feature-top">
            <span class="feature-no">{{ String(i + 1).padStart(2, "0") }}</span>
            <span class="feature-area">{{ item.area }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </div>
    </section>

    <!-- 截图 -->
    <section id="gallery" class="wrap section">
      <div class="section-head">
        <div>
          <p class="kicker">SCREENSHOTS</p>
          <h2>桌面实拍</h2>
        </div>
        <span class="section-note">点击放大</span>
      </div>

      <div class="gallery-grid">
        <button
          v-for="(shot, i) in shots"
          :key="shot.src"
          class="shot-card"
          type="button"
          :aria-label="`放大截图：${shot.title}`"
          @click="openShot(i)"
        >
          <img :src="shot.src" :alt="shot.alt" loading="lazy" decoding="async" />
          <span class="shot-caption">
            <b>{{ shot.title }}</b>
            <span>{{ shot.text }}</span>
          </span>
          <span class="shot-zoom" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" /></svg>
          </span>
        </button>
      </div>
    </section>

    <!-- 开发路线 -->
    <section id="roadmap" class="wrap section">
      <div class="section-head">
        <div>
          <p class="kicker">ROADMAP</p>
          <h2>接下来做什么</h2>
        </div>
        <span class="section-note">持续更新</span>
      </div>

      <ol class="timeline">
        <li v-for="step in roadmap" :key="step.stage" :class="statusClass(step.status)">
          <span class="dot" aria-hidden="true"></span>
          <span class="status">{{ step.status }}</span>
          <h3>{{ step.stage }}</h3>
          <p>{{ step.detail }}</p>
        </li>
      </ol>
    </section>

    <!-- 相关阅读 -->
    <section v-if="hopeosNews.length" id="news" class="wrap section">
      <div class="section-head">
        <div>
          <p class="kicker">READING</p>
          <h2>相关阅读</h2>
        </div>
        <router-link class="section-link" to="/posts">全部文章 →</router-link>
      </div>

      <div class="news-grid" :class="{ 'is-single': hopeosNews.length === 1 }">
        <router-link
          v-for="n in hopeosNews"
          :key="n.slug"
          class="news-card"
          :to="`/posts/${n.slug}`"
        >
          <div class="news-meta">
            <span class="news-cat">{{ n.category }}</span>
            <span>{{ n.date }}</span>
          </div>
          <div class="news-main">
            <div class="news-title">{{ n.title }}</div>
            <div class="news-excerpt">{{ n.excerpt }}</div>
          </div>
          <span class="news-arrow" aria-hidden="true">→</span>
        </router-link>
      </div>
    </section>

    <!-- 在线体验 -->
    <section id="try" class="wrap section">
      <div class="section-head">
        <div>
          <p class="kicker">TRY IT</p>
          <h2>在线体验</h2>
        </div>
        <span class="section-note">纯前端演示</span>
      </div>

      <div class="try-intro">
        <p>
          下面是一个浏览器里的 HopeOS 模拟器：启动自检 → 桌面 → 终端，可以直接操作。
          点击「开始」打开开始菜单，或在终端里输入 <code>help</code> 查看命令。
        </p>
        <div class="try-hints" aria-label="操作提示">
          <span class="hint">点击「开始」</span>
          <span class="hint">输入 help</span>
        </div>
      </div>

      <div class="try-panel">
        <div class="try-bar">
          <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="try-url">hopestudio.top/hopeos-emulator</span>
          <span class="try-badge">DEMO</span>
        </div>
        <div class="try-body">
          <iframe
            src="/hopeos-emulator/index.html"
            title="HopeOS 模拟器"
            allow="fullscreen"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <p class="try-note">这是网页演示，并非真实运行的内核。首次加载会播放开机自检动画，点击画面任意处可跳过。</p>
    </section>

    <!-- 页脚 -->
    <footer class="page-foot wrap">
      <p class="foot-note">HopeOS · 希望工作室 · 2023—2026</p>
      <div class="foot-links">
        <router-link class="btn btn-ghost btn-sm" to="/license">第三方组件许可证</router-link>
        <router-link class="btn btn-solid btn-sm" to="/">返回首页</router-link>
      </div>
    </footer>

    <!-- 截图灯箱 -->
    <Teleport to="body">
      <div
        v-if="active"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="active.title"
        tabindex="-1"
        @click.self="closeShot"
      >
        <button class="lightbox-close" type="button" aria-label="关闭" ref="closeButton" @click="closeShot">
          <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        <button class="lightbox-nav prev" type="button" aria-label="上一张" @click="stepShot(-1)">
          <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <figure class="lightbox-figure">
          <img :src="active.src" :alt="active.alt" />
          <figcaption>
            <span>{{ active.title }}</span>
            <span>{{ active.text }}</span>
          </figcaption>
        </figure>
        <button class="lightbox-nav next" type="button" aria-label="下一张" @click="stepShot(1)">
          <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ============================================================
   HopeOS 项目页
   沿用站点 --site-* 令牌，明暗两套皮肤都能自然适配。
   ============================================================ */
.hopeos-page {
  position: relative;
  min-height: 100vh;
  overflow: clip;
  background: var(--site-bg);
}

.hopeos-page::before {
  content: "";
  position: absolute;
  z-index: 0;
  top: -260px;
  left: 50%;
  width: min(1100px, 120vw);
  height: 720px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, var(--site-glow) 0%, transparent 68%);
  pointer-events: none;
}

.wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}

/* ---------------- Hero ---------------- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  align-items: center;
  gap: 54px;
  padding-top: 76px;
  padding-bottom: 68px;
}

.hero-copy {
  min-width: 0;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 22px;
  padding: 7px 13px;
  border: 1px solid var(--site-line);
  border-radius: 999px;
  background: var(--site-tint-1);
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.eyebrow i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--site-accent);
  box-shadow: 0 0 10px var(--site-accent);
}

.hero h1 {
  margin: 0;
  color: var(--site-text);
  font-size: clamp(52px, 7vw, 88px);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.h1-dot {
  color: var(--site-accent);
}

.tagline {
  margin: 18px 0 0;
  color: var(--site-text-2);
  font-size: clamp(18px, 2vw, 23px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.012em;
}

.lead {
  max-width: 540px;
  margin: 18px 0 0;
  color: var(--site-muted);
  font-size: 15.5px;
  line-height: 1.82;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 24px;
}

.tags span {
  padding: 5px 10px;
  border: 1px solid var(--site-line);
  border-radius: 999px;
  background: var(--site-tint-1);
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.btn svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-solid {
  background: var(--site-solid-btn-bg);
  color: var(--site-solid-btn-ink);
}

.btn-solid:hover {
  background: var(--site-solid-btn-bg-hover);
}

.btn-ghost {
  border-color: var(--site-line);
  background: var(--site-tint-1);
  color: var(--site-text-2);
}

.btn-ghost:hover {
  border-color: var(--site-accent-line);
  color: var(--site-text);
  background: var(--site-tint-2);
}

.btn-sm {
  height: 34px;
  padding: 0 13px;
  font-size: 12px;
}

.hero-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 18px 0 0;
  color: var(--site-muted);
  font-size: 11.5px;
}

.hero-note .lock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.hero-note .lock::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--site-subtle);
}

.hero-note a {
  color: var(--site-accent);
  text-decoration: none;
}

.hero-note a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hero-note .sep {
  color: var(--site-line);
}

/* Hero 右侧：屏幕框 */
.hero-visual {
  position: relative;
  min-width: 0;
}

.hero-glow {
  position: absolute;
  z-index: 0;
  inset: 10% -8% -12% 8%;
  border-radius: 50%;
  background: radial-gradient(circle at center, var(--site-glow) 0%, transparent 68%);
  filter: blur(18px);
  pointer-events: none;
}

.shot-shell {
  position: relative;
  z-index: 1;
  overflow: hidden;
  border: 1px solid #2a2e37;
  border-radius: 14px;
  background: #07090d;
  box-shadow:
    0 44px 90px -46px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
}

.shot-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 13px;
  border-bottom: 1px solid #20242c;
  background: #0f1217;
}

.dots {
  display: flex;
  gap: 5px;
}

.dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2c313b;
}

.shot-title {
  color: #7e8794;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.shot-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  color: #8ee2b0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 9.5px;
  letter-spacing: 0.08em;
}

.shot-live i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.8);
}

.shot-main {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: #000;
  cursor: zoom-in;
}

.shot-main img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.05, 0.7, 0.1, 1);
}

.shot-main:hover img {
  transform: scale(1.012);
}

.shot-zoom {
  position: absolute;
  top: 10px;
  right: 10px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.46);
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.shot-zoom svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.shot-main:hover .shot-zoom,
.shot-card:hover .shot-zoom {
  opacity: 1;
}

.shot-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-top: 1px solid #20242c;
  background: #0b0e13;
  color: #7e8794;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.03em;
}

/* ---------------- 区块标题 ---------------- */
.section {
  padding-top: 82px;
  scroll-margin-top: 88px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--site-line);
}

.kicker {
  margin: 0 0 9px;
  color: var(--site-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.section h2 {
  margin: 0;
  color: var(--site-text);
  font-size: clamp(24px, 3.2vw, 34px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.section-note {
  flex: none;
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.06em;
}

.section-link {
  flex: none;
  color: var(--site-muted);
  font-size: 12px;
  text-decoration: none;
}

.section-link:hover {
  color: var(--site-accent);
}

.section-lead {
  max-width: 720px;
  margin: 0 0 26px;
  color: var(--site-muted);
  font-size: 14.5px;
  line-height: 1.8;
}

/* ---------------- 最新进展 ---------------- */
.milestone-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.milestone {
  padding: 21px 21px 23px;
  border: 1px solid var(--site-line);
  border-radius: 12px;
  background: var(--site-surface);
  transition:
    transform 0.35s cubic-bezier(0.05, 0.7, 0.1, 1),
    border-color 0.25s ease,
    box-shadow 0.35s ease;
}

.milestone:hover {
  transform: translateY(-3px);
  border-color: var(--site-accent-line);
  box-shadow: 0 18px 40px -28px rgba(0, 0, 0, 0.4);
}

.milestone-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 26px;
}

.milestone-no {
  color: var(--site-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
}

.milestone-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--site-accent-line);
  border-radius: 9px;
  background: var(--site-accent-soft);
  color: var(--site-accent);
}

.milestone-icon svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.milestone h3 {
  margin: 0 0 7px;
  color: var(--site-text);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.015em;
}

.milestone p {
  margin: 0;
  color: var(--site-muted);
  font-size: 13px;
  line-height: 1.7;
}

/* ---------------- 架构链路 ---------------- */
.pipe {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.pipe-node {
  position: relative;
  min-height: 112px;
  padding: 16px;
  border: 1px solid var(--site-line);
  border-radius: 10px;
  background: var(--site-card-bg);
}

.pipe-node::after {
  content: "→";
  position: absolute;
  top: 50%;
  right: -13px;
  z-index: 2;
  transform: translateY(-50%);
  color: var(--site-muted);
  font-size: 13px;
  line-height: 1;
}

.pipe-node:last-child::after {
  display: none;
}

.pipe-label {
  color: var(--site-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 9.5px;
  letter-spacing: 0.14em;
}

.pipe-node h3 {
  margin: 10px 0 4px;
  color: var(--site-text);
  font-size: 15px;
  font-weight: 600;
}

.pipe-node p {
  margin: 0;
  color: var(--site-muted);
  font-size: 11.5px;
  line-height: 1.6;
}

/* ---------------- 已实现 ---------------- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.feature {
  padding: 19px;
  border: 1px solid var(--site-line);
  border-radius: 11px;
  background: var(--site-card-bg);
  transition:
    transform 0.3s cubic-bezier(0.05, 0.7, 0.1, 1),
    border-color 0.22s ease,
    background 0.22s ease;
}

.feature:hover {
  transform: translateY(-2px);
  border-color: var(--site-accent-line);
  background: var(--site-tint-1);
}

.feature-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 16px;
}

.feature-no {
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.08em;
}

.feature-area {
  padding: 3px 8px;
  border: 1px solid var(--site-accent-line);
  border-radius: 999px;
  background: var(--site-accent-soft);
  color: var(--site-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 9.5px;
  letter-spacing: 0.04em;
}

.feature h3 {
  margin: 0 0 6px;
  color: var(--site-text);
  font-size: 15.5px;
  font-weight: 600;
  letter-spacing: -0.012em;
}

.feature p {
  margin: 0;
  color: var(--site-muted);
  font-size: 12.5px;
  line-height: 1.68;
}

/* ---------------- 截图墙 ---------------- */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.shot-card {
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  padding: 0;
  border: 1px solid var(--site-line);
  border-radius: 12px;
  background: #000;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: zoom-in;
}

.shot-card img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.05, 0.7, 0.1, 1);
}

.shot-card:hover img {
  transform: scale(1.025);
}

.shot-caption {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 42px 16px 14px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.84), rgba(0, 0, 0, 0));
  color: #fff;
}

.shot-caption b {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.shot-caption span {
  color: #c6ccd4;
  font-size: 11.5px;
  line-height: 1.5;
}

.shot-card .shot-zoom {
  top: 10px;
  right: 10px;
}

/* ---------------- 开发路线 ---------------- */
.timeline {
  position: relative;
  margin: 0;
  padding: 2px 0 0 24px;
  list-style: none;
}

.timeline::before {
  content: "";
  position: absolute;
  top: 8px;
  bottom: 16px;
  left: 4px;
  width: 1px;
  background: linear-gradient(var(--site-line), transparent);
}

.timeline li {
  position: relative;
  padding-bottom: 26px;
}

.timeline li:last-child {
  padding-bottom: 0;
}

.timeline .dot {
  position: absolute;
  top: 5px;
  left: -24px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--site-subtle);
  box-shadow: 0 0 0 3px var(--site-bg);
}

.timeline li.is-active .dot {
  background: var(--tag-success-fg);
}

.timeline li.is-plan .dot {
  background: var(--tag-info-fg);
}

.status {
  display: inline-flex;
  align-items: center;
  height: 20px;
  margin-bottom: 8px;
  padding: 0 8px;
  border: 1px solid var(--tag-grey-line);
  border-radius: 999px;
  background: var(--tag-grey-bg);
  color: var(--tag-grey-fg);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
}

.timeline li.is-active .status {
  border-color: var(--tag-success-line);
  background: var(--tag-success-bg);
  color: var(--tag-success-fg);
}

.timeline li.is-plan .status {
  border-color: var(--tag-info-line);
  background: var(--tag-info-bg);
  color: var(--tag-info-fg);
}

.timeline h3 {
  margin: 0 0 4px;
  color: var(--site-text);
  font-size: 15.5px;
  font-weight: 600;
}

.timeline p {
  margin: 0;
  max-width: 760px;
  color: var(--site-muted);
  font-size: 12.8px;
  line-height: 1.68;
}

/* ---------------- 相关阅读 ---------------- */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.news-grid.is-single {
  grid-template-columns: minmax(0, 1fr);
}

.news-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 20px;
  border: 1px solid var(--site-line);
  border-radius: 11px;
  background: var(--site-card-bg);
  text-decoration: none;
  transition:
    transform 0.3s cubic-bezier(0.05, 0.7, 0.1, 1),
    border-color 0.22s ease;
}

.news-card:hover {
  transform: translateY(-3px);
  border-color: var(--site-accent-line);
}

.news-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.03em;
}

.news-cat {
  padding: 3px 8px;
  border: 1px solid var(--site-accent-line);
  border-radius: 999px;
  background: var(--site-accent-soft);
  color: var(--site-accent);
  font-size: 9.5px;
}

.news-title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--site-text);
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.news-excerpt {
  display: -webkit-box;
  overflow: hidden;
  color: var(--site-muted);
  font-size: 12.5px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.news-arrow {
  display: none;
  flex: none;
  color: var(--site-muted);
  font-size: 17px;
  line-height: 1;
  transition:
    color 0.18s ease,
    transform 0.18s ease;
}

.news-grid.is-single .news-card {
  flex-direction: row;
  align-items: center;
  gap: 24px;
  padding: 18px 22px;
}

.news-grid.is-single .news-meta {
  flex-direction: column;
  align-items: flex-start;
  flex: none;
  width: 112px;
  gap: 7px;
}

.news-grid.is-single .news-main {
  flex: 1;
  min-width: 0;
}

.news-grid.is-single .news-excerpt {
  -webkit-line-clamp: 1;
}

.news-grid.is-single .news-arrow {
  display: block;
}

.news-card:hover .news-arrow {
  transform: translateX(3px);
  color: var(--site-accent);
}

/* ---------------- 在线体验 ---------------- */
.try-intro {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 20px;
}

.try-intro p {
  max-width: 680px;
  margin: 0;
  color: var(--site-muted);
  font-size: 14px;
  line-height: 1.8;
}

.try-intro code {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--site-accent-soft);
  color: var(--site-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 0.92em;
}

.try-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.hint {
  padding: 5px 9px;
  border: 1px solid var(--site-line);
  border-radius: 999px;
  background: var(--site-tint-1);
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.try-panel {
  overflow: hidden;
  border: 1px solid var(--site-line);
  border-radius: 14px;
  background: var(--site-surface);
  box-shadow: 0 28px 70px -50px rgba(0, 0, 0, 0.5);
}

.try-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 42px;
  padding: 0 14px;
  border-bottom: 1px solid var(--site-line);
  background: var(--site-surface-2);
}

.try-url {
  margin: 0 auto;
  padding: 4px 12px;
  border: 1px solid var(--site-line);
  border-radius: 6px;
  background: var(--site-tint-1);
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.02em;
}

.try-badge {
  color: var(--site-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 9.5px;
  letter-spacing: 0.12em;
}

.try-body {
  position: relative;
  aspect-ratio: 16 / 10;
  min-height: 420px;
  background: #000;
}

.try-body iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

.try-note {
  margin: 10px 0 0;
  color: var(--site-muted);
  font-size: 11px;
}

/* ---------------- 页脚 ---------------- */
.page-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 74px;
  padding-top: 30px;
  padding-bottom: 64px;
  border-top: 1px solid var(--site-line);
}

.foot-note {
  margin: 0;
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.05em;
}

.foot-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ---------------- 灯箱 ---------------- */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: rgba(3, 5, 8, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.lightbox-figure {
  max-width: min(1180px, 92vw);
  margin: 0;
}

.lightbox-figure img {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: 80vh;
  margin: 0 auto;
  object-fit: contain;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
}

.lightbox-figure figcaption {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 12px;
  color: #d0d6e0;
  font-size: 12.5px;
  line-height: 1.5;
}

.lightbox-figure figcaption span:last-child {
  color: #8a8f98;
  text-align: right;
}

.lightbox-close,
.lightbox-nav {
  position: fixed;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  background: rgba(15, 17, 22, 0.72);
  color: #f7f8f8;
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}

.lightbox-close:hover,
.lightbox-nav:hover {
  border-color: rgba(255, 255, 255, 0.36);
  background: rgba(30, 34, 42, 0.9);
}

.lightbox-close {
  top: 22px;
  right: 22px;
}

.lightbox-nav {
  top: 50%;
  transform: translateY(-50%);
}

.lightbox-nav.prev {
  left: 22px;
}

.lightbox-nav.next {
  right: 22px;
}

.lightbox-close svg,
.lightbox-nav svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------------- 入场动画 ---------------- */
@keyframes hp-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hp-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hero-copy > * {
  animation: hp-rise 0.68s cubic-bezier(0.05, 0.7, 0.1, 1) both;
}

.hero-copy > :nth-child(1) {
  animation-delay: 0.02s;
}
.hero-copy > :nth-child(2) {
  animation-delay: 0.06s;
}
.hero-copy > :nth-child(3) {
  animation-delay: 0.1s;
}
.hero-copy > :nth-child(4) {
  animation-delay: 0.14s;
}
.hero-copy > :nth-child(5) {
  animation-delay: 0.18s;
}
.hero-copy > :nth-child(6) {
  animation-delay: 0.22s;
}
.hero-copy > :nth-child(7) {
  animation-delay: 0.26s;
}

.hero-visual {
  animation: hp-fade 0.9s 0.16s cubic-bezier(0.05, 0.7, 0.1, 1) both;
}

/* ---------------- 响应式 ---------------- */
@media (max-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 42px;
    padding-top: 54px;
    padding-bottom: 54px;
  }

  .hero-visual {
    max-width: 640px;
  }

  .milestone-grid,
  .feature-grid,
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pipe {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pipe-node::after {
    display: none;
  }
}

@media (max-width: 680px) {
  .wrap {
    padding-left: 20px;
    padding-right: 20px;
  }

  .hero {
    padding-top: 40px;
    padding-bottom: 46px;
  }

  .hero h1 {
    font-size: clamp(46px, 15vw, 64px);
  }

  .lead {
    font-size: 14.5px;
  }

  .tags {
    gap: 6px;
  }

  .tags span {
    padding: 4px 8px;
    font-size: 10px;
  }

  .pipe {
    gap: 18px;
  }

  .pipe-node::after {
    top: auto;
    right: auto;
    bottom: -17px;
    left: 50%;
    display: block;
    content: "↓";
    transform: translateX(-50%);
  }

  .pipe-node:last-child::after {
    display: none;
  }

  .section {
    padding-top: 58px;
  }

  .section-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .milestone-grid,
  .feature-grid,
  .gallery-grid,
  .news-grid,
  .pipe {
    grid-template-columns: minmax(0, 1fr);
  }

  .news-grid.is-single .news-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 9px;
    padding: 20px;
  }

  .news-grid.is-single .news-meta {
    flex-direction: row;
    width: auto;
  }

  .news-grid.is-single .news-excerpt {
    -webkit-line-clamp: 3;
  }

  .news-grid.is-single .news-arrow {
    display: none;
  }

  .try-intro {
    flex-direction: column;
    gap: 14px;
  }

  .try-body {
    min-height: 320px;
  }

  .page-foot {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 56px;
  }

  .lightbox {
    padding: 18px;
  }

  .lightbox-nav {
    display: none;
  }

  .lightbox-figure figcaption {
    flex-direction: column;
    gap: 4px;
  }

  .lightbox-figure figcaption span:last-child {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hopeos-page *,
  .lightbox * {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.001ms !important;
  }
}
</style>
