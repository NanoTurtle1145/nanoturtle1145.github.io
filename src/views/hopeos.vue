<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@vueuse/head";
import BannerCarousel from "../components/BannerCarousel.vue";
import { posts } from "../data/posts";

/**
 * 项目动态：从站内文章里筛出提及 HopeOS 的（数据驱动，不虚构内容）。
 * 目前只有一篇，将来写 HopeOS 相关文章时这里会自动多出来。
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
        "HopeOS 是希望工作室发起的一个从零编写的 UEFI 操作系统项目，用于学习操作系统的运行原理，目前正处于活跃开发中，最早可追溯至2023年（https://hopestudio.mysxl.cn/blog/hope-os）。",
    },
    // 分享卡片用桌面横幅
    { property: "og:image", content: "https://www.hopestudio.top/media/hopeos/banner-hopeos.webp" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

// 自动轮播的配图：HopeOS 桌面横幅 + 各真实运行场景截图
const showcase = [
  "/media/hopeos/banner-hopeos.webp",
  "/media/hopeos/icewm-titled-window.png",
  "/media/hopeos/icewm-managed-client.png",
  "/media/hopeos/icewm-first-paint.png",
  "/media/hopeos/desktop.png",
  "/media/hopeos/stardustui.png",
  "/media/hopeos/ver.png",
  "/media/hopeos/futextest.png",
];

const facts = [
  { label: "类型", value: "UEFI 操作系统（x86-64）" },
  { label: "目标", value: "学习操作系统内部原理" },
  { label: "用户态", value: "ring 3 + Linux 风格 syscall ABI" },
  { label: "开发", value: "部分由 AI 辅助编写" },
];

const done = [
  {
    title: "内存管理",
    desc: "隐式空闲链表堆分配器（mm.c），8 MiB 堆。",
  },
  {
    title: "中断 / 定时器",
    desc: "自接管 GDT/TSS、256 项 IDT、8259 重映射、PIT 100 Hz、ExitBootServices。",
  },
  {
    title: "抢占式调度器",
    desc: "内核线程，16 上限，100 Hz 时间片，带栈金丝雀保护。",
  },
  {
    title: "UEFI 引导链",
    desc: "boot/ 引导加载器加载 KERNEL.EFI。",
  },
  {
    title: "GUI 桌面",
    desc: "离屏双缓冲 + 脏矩形合成，渲染窗口更高效。",
  },
  {
    title: "PS/2 键鼠输入",
    desc: "键盘 / 鼠标输入解码与事件路由到活动窗口。",
  },
  {
    title: "VFS + ramfs",
    desc: "文件系统接入内核，文件可读写。",
  },
  {
    title: "ring 3 用户态 + 系统调用",
    desc: "分页基础设施、DPL3 描述符、0x80 syscall 门；hello 程序在 ring 3 打印并验证抢占。",
  },
  {
    title: "POSIX 内核",
    desc: "每进程 fd/cwd、文件 I/O syscall、最小 libc、用户态 shell（fork/execve/重定向）、fork+COW 页表、宿主单测全绿。",
  },
  {
    title: "X11 服务器 + IceWM",
    desc: "把 X 服务器和 IceWM 窗口管理器搬进了 HopeOS：窗口收养、标题栏与任务栏按钮、客户端内容渲染已经工作（图标与壁纸待收尾）。",
  },
];

const roadmap = [
  { stage: "按需缺页（demand paging）", detail: "在已有 COW + 可返回 #PF 基础上，补齐真正的按需分页。", status: "进行中" },
  { stage: "可写、持久化文件系统", detail: "把 ramfs 内容持久化到磁盘镜像。", status: "计划中" },
  { stage: "用户态 libc 完善 + 工具链", detail: "补齐 malloc / 信号 / stdio 缓冲，可承载第三方程序。", status: "计划中" },
  { stage: "设备驱动", detail: "先网络，再 GPU / 存储（AHCI、NVMe、USB）。", status: "计划中" },
  { stage: "兼容 BusyBox", detail: "PIE 加载 + auxv + arch_prctl + mmap/brk + 信号，分 A~E 阶段推进。", status: "远期" },
  { stage: "承载 JVM → 跑 Minecraft", detail: "需要足够 POSIX + GPU 图形，属于极远远期终态，学习旅程本身才是重点。", status: "极远" },
];

const statusColor = (s: string) =>
  ({ 进行中: "success", 计划中: "info", 远期: "grey", 极远: "grey" })[s] ?? "grey";
</script>

<template>
  <div class="pb-8">
    <!-- Hero -->
    <v-container class="pt-16">
      <v-row align="center">
        <v-col cols="12" lg="7">
          <BannerCarousel :images="showcase" alt="HopeOS" />
        </v-col>
        <v-col cols="12" lg="5">
          <div class="pa-6 pa-lg-10">
            <div class="text-subtitle-1 text-tertiary font-weight-medium mb-2">操作系统项目 · HopeOS</div>
            <div class="text-display-large text-on-surface mb-2" style="font-size: clamp(2.5rem, 5.5vw, 4.5rem)">HopeOS</div>
            <div class="text-subtitle-1 text-medium-emphasis mb-2">
              一个从零编写的 UEFI 操作系统，用于学习操作系统运行原理。
            </div>
            <div class="text-body-2 text-medium-emphasis mb-6">
              最早可追溯至2023年（https://hopestudio.mysxl.cn/blog/hope-os）
            </div>
            <div class="d-flex flex-wrap align-center ga-4">
              <v-chip disabled color="grey">源码暂未开源</v-chip>
              <router-link to="/license" class="text-decoration-none">
                <v-btn color="primary" variant="tonal" append-icon="mdi-arrow-right">
                  第三方组件许可证
                </v-btn>
              </router-link>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 项目概况 -->
    <v-container class="py-8">
      <div class="mb-6">
        <div class="gov-header-1">
          <span>关于 HopeOS</span>
          <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
        </div>
      </div>
      <v-row class="mb-6">
        <v-col v-for="f in facts" :key="f.label" cols="6" md="3">
          <v-card elevation="0" class="pa-2 facts-card">
            <v-card-text>
              <div class="text-caption text-primary mb-1">{{ f.label }}</div>
              <div class="text-body-1 text-on-surface font-weight-medium">{{ f.value }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-body-1 text-medium-emphasis" style="line-height: 1.8">
        HopeOS 是一个从零手写、基于 UEFI 启动的 x86-64 操作系统。它现在已具备内核线程调度、中断与定时器、图形桌面、虚拟文件系统，以及
        ring 3 用户态与一套 Linux 风格的 POSIX 系统调用。项目的核心目标不是做一个玩具，而是借此搞清楚一台计算机到底是怎么跑起来的——跑起
        Minecraft 只是极远期的趣味终态，学习的过程才是重点。
      </div>
    </v-container>

    <!-- 已完成 -->
    <v-container class="py-8">
      <div class="mb-6">
        <div class="gov-header-1">
          <span>已经实现的</span>
          <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
        </div>
      </div>
      <v-row>
        <v-col v-for="item in done" :key="item.title" cols="12" md="6" lg="4">
          <v-card elevation="0" hover class="h-100 pa-1 done-card">
            <v-card-text>
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="mdi-check-circle" color="success" size="small" />
                <div class="text-subtitle-1 font-weight-bold text-on-surface">
                  {{ item.title }}
                </div>
              </div>
              <div class="text-body-2 text-medium-emphasis" style="line-height: 1.7">
                {{ item.desc }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 开发路线 -->
    <v-container class="py-8">
      <div class="mb-6">
        <div class="gov-header-1">
          <span>开发路线</span>
          <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
        </div>
      </div>
      <v-card elevation="0">
        <v-card-text class="pa-6">
          <div class="d-flex flex-column ga-4">
            <div v-for="step in roadmap" :key="step.stage" class="d-flex align-start ga-4 roadmap-row">
              <v-chip size="small" :color="statusColor(step.status)" variant="tonal" class="mt-1 shrink-0 roadmap-chip">
                {{ step.status }}
              </v-chip>
              <div>
                <div class="text-subtitle-1 font-weight-bold text-on-surface">
                  {{ step.stage }}
                </div>
                <div class="text-body-2 text-medium-emphasis">{{ step.detail }}</div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- 项目动态（站内提及 HopeOS 的文章，自动汇总） -->
    <v-container v-if="hopeosNews.length" class="py-8">
      <div class="mb-6">
        <div class="gov-header-1">
          <span>项目动态</span>
          <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
        </div>
      </div>
      <v-row>
        <v-col v-for="n in hopeosNews" :key="n.slug" cols="12" md="6" lg="4">
          <router-link :to="`/posts/${n.slug}`" class="text-decoration-none d-block h-100">
            <v-card elevation="0" hover class="h-100 news-card">
              <v-card-text>
                <div class="d-flex flex-wrap align-center ga-2 mb-3">
                  <v-chip size="x-small" color="primary" variant="tonal">{{ n.category }}</v-chip>
                  <span class="text-caption text-medium-emphasis">{{ n.date }}</span>
                </div>
                <div class="text-subtitle-1 font-weight-bold text-on-surface mb-2 news-card-title">
                  {{ n.title }}
                </div>
                <div class="text-body-2 text-medium-emphasis news-card-text">{{ n.excerpt }}</div>
              </v-card-text>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>

    <!-- 在线体验 -->
    <v-container class="py-8">
      <div class="mb-2">
        <div class="gov-header-1 mb-3">
          <span>在线体验</span>
          <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
        </div>
      </div>
      <div class="text-body-1 text-medium-emphasis mb-6" style="line-height: 1.8">
        下面是一个纯前端的 HopeOS 模拟器（启动自检 → 桌面 → 终端），可直接在浏览器里操作。
        点击「开始」打开开始菜单，或在终端里输入 <code class="text-primary">help</code> 查看命令。
        （这是网页演示，并非真实运行的内核。）
      </div>
      <div
        class="rounded-xl overflow-hidden border emulator-frame"
        style="aspect-ratio: 16 / 10; min-height: 420px; background: #000; border-color: rgb(var(--v-theme-outline))"
      >
        <iframe
          src="/hopeos-emulator/index.html"
          title="HopeOS 模拟器"
          allow="fullscreen"
          allowfullscreen
          class="w-100 h-100 border-0"
        ></iframe>
      </div>
    </v-container>

    <!-- 返回 -->
    <v-container class="pb-12">
      <router-link to="/" class="text-decoration-none">
        <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left">返回首页</v-btn>
      </router-link>
    </v-container>
  </div>
</template>

<style lang="sass" scoped>
  // ---------------- 入场动画 ----------------
  @keyframes hopeos-rise
    from
      opacity: 0
      transform: translateY(16px)
    to
      opacity: 1
      transform: translateY(0)

  .pb-8
    > .v-container
      animation: hopeos-rise .7s cubic-bezier(.05, .7, .1, 1) both
      &:nth-child(1)
        animation-delay: .04s
      &:nth-child(2)
        animation-delay: .1s
      &:nth-child(3)
        animation-delay: .16s
      &:nth-child(4)
        animation-delay: .22s
      &:nth-child(5)
        animation-delay: .28s
      &:nth-child(6)
        animation-delay: .34s
      &:nth-child(7)
        animation-delay: .4s

  // ---------------- 标题与正文 ----------------
  .gov-header-1
    font-size: 1.35rem
    font-weight: 700
    letter-spacing: -.01em
    transition: color .2s ease
    &:hover
      color: rgb(var(--v-theme-primary))

  .text-display-large
    font-weight: 700
    letter-spacing: -.035em
    background: linear-gradient(120deg, rgb(var(--v-theme-on-surface)) 0%, rgb(var(--v-theme-primary)) 105%)
    -webkit-background-clip: text
    background-clip: text
    -webkit-text-fill-color: transparent

  .text-body-1 code
    background: rgba(var(--v-theme-primary), .14)
    color: rgb(var(--v-theme-primary))
    padding: .1rem .4rem
    border-radius: var(--shape-xs)
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
    font-size: .9em

  // ---------------- 卡片基线 ----------------
  .v-card
    border-radius: var(--shape-md) !important
    border: 1px solid rgb(var(--v-theme-outline-variant), .55)
    transition: transform .35s cubic-bezier(.4, 0, .2, 1), box-shadow .35s cubic-bezier(.4, 0, .2, 1), border-color .3s ease

  .v-chip
    border-radius: var(--shape-sm)
    font-weight: 500

  // 项目概况小卡：左侧主题色描边
  .facts-card
    border-left: 3px solid rgb(var(--v-theme-primary))
    &:hover
      transform: translateY(-3px)
      box-shadow: 0 8px 22px rgba(var(--v-theme-primary), .12)

  // 已实现清单卡片
  .done-card
    &:hover
      transform: translateY(-4px)
      border-color: rgb(var(--v-theme-primary), .5)
      box-shadow: 0 12px 28px rgba(var(--v-theme-primary), .12)

  // ---------------- 开发路线 ----------------
  .roadmap-row
    position: relative
    padding: .4rem .5rem
    border-radius: var(--shape-sm)
    transition: background .25s ease, transform .25s ease
    & + .roadmap-row
      border-top: 1px solid rgb(var(--v-theme-outline-variant), .45)
    &:hover
      background: rgba(var(--v-theme-primary), .06)
      transform: translateX(4px)

  .roadmap-chip
    min-width: 3.8rem
    justify-content: center
    font-weight: 600
    letter-spacing: .02em

  // ---------------- 项目动态 ----------------
  .news-card
    display: flex
    flex-direction: column
    &:hover
      transform: translateY(-4px)
      border-color: rgb(var(--v-theme-primary), .5)
      box-shadow: 0 12px 30px rgba(var(--v-theme-primary), .14)

  .news-card-title
    transition: color .25s ease
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical
    overflow: hidden

  .news-card-text
    display: -webkit-box
    -webkit-line-clamp: 3
    -webkit-box-orient: vertical
    overflow: hidden

  .news-card:hover .news-card-title
    color: rgb(var(--v-theme-primary))

  // ---------------- 在线体验 ----------------
  .emulator-frame
    border-radius: var(--shape-lg) !important
    box-shadow: 0 10px 30px rgba(0, 0, 0, .35)
    transition: box-shadow .4s ease, border-color .4s ease, transform .4s ease
    &:hover
      transform: translateY(-2px)
      border-color: rgb(var(--v-theme-primary), .7) !important
      box-shadow: 0 16px 44px rgba(0, 0, 0, .45), 0 0 0 1px rgba(var(--v-theme-primary), .35)

  // ---------------- 返回 ----------------
  .pb-12 .v-btn
    border-radius: var(--shape-btn)
    text-transform: none
    font-weight: 600
    transition: transform .25s ease, background .25s ease
    &:hover
      transform: translateX(-4px)

  // ---------------- 响应式 ----------------
  @media (max-width: 960px)
    .gov-header-1
      font-size: 1.2rem

    .roadmap-row
      padding: .35rem .25rem

  @media (prefers-reduced-motion: reduce)
    .pb-8 > .v-container
      animation: none
</style>


