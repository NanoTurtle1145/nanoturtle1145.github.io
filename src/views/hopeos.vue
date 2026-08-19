<script setup lang="ts">
import { useHead } from "@vueuse/head";
import BannerCarousel from "../components/BannerCarousel.vue";

useHead({
  title: "HopeOS | 希望工作室",
  meta: [
    {
      name: "description",
      content:
        "HopeOS 是希望工作室发起的一个从零编写的 UEFI 操作系统项目，用于学习操作系统的运行原理，目前正处于活跃开发中，最早可追溯至2023年（https://hopestudio.mysxl.cn/blog/hope-os）。",
    },
  ],
});

// 自动轮播的配图：合成 banner + 各真实运行场景截图
const showcase = [
  "/banner.png",
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
            <div class="text-h2 font-weight-bold text-on-surface mb-2">HopeOS</div>
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
      <div class="text-h4 font-weight-bold text-on-surface mb-6">关于 HopeOS</div>
      <v-row class="mb-6">
        <v-col v-for="f in facts" :key="f.label" cols="6" md="3">
          <v-card elevation="0" class="pa-2">
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
      <div class="text-h4 font-weight-bold text-on-surface mb-6">已经实现的</div>
      <v-row>
        <v-col v-for="item in done" :key="item.title" cols="12" md="6" lg="4">
          <v-card elevation="0" class="h-100 pa-1">
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
      <div class="text-h4 font-weight-bold text-on-surface mb-6">开发路线</div>
      <v-card elevation="0">
        <v-card-text class="pa-6">
          <div class="d-flex flex-column ga-4">
            <div v-for="step in roadmap" :key="step.stage" class="d-flex align-start ga-4">
              <v-chip size="small" :color="statusColor(step.status)" variant="tonal" class="mt-1 shrink-0">
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

    <!-- 在线体验 -->
    <v-container class="py-8">
      <div class="text-h4 font-weight-bold text-on-surface mb-2">在线体验</div>
      <div class="text-body-1 text-medium-emphasis mb-6" style="line-height: 1.8">
        下面是一个纯前端的 HopeOS 模拟器（启动自检 → 桌面 → 终端），可直接在浏览器里操作。
        点击「开始」打开开始菜单，或在终端里输入 <code class="text-primary">help</code> 查看命令。
        （这是网页演示，并非真实运行的内核。）
      </div>
      <div
        class="rounded-xl overflow-hidden border"
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


