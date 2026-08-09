<script setup lang="ts">
import { useHead } from "@vueuse/head";

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
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Hero -->
    <div class="pt-16 relative">
      <div class="hero-container">
        <div class="cover flex items-center justify-center p-8 lg:p-16">
          <img src="/banner.png" alt="HopeOS" class="image max-h-514" />
        </div>
        <div class="body">
          <div class="container">
            <h1 class="title">HopeOS</h1>
            <p class="subtitle">一个从零编写的 UEFI 操作系统，用于学习操作系统运行原理。</p>
            <p class="subtitle">最早可追溯至2023年（https://hopestudio.mysxl.cn/blog/hope-os）</p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/NanoTurtle1145/HopeOS"
              target="_blank"
              rel="noopener"
              class="link-button"
            >
              在 GitHub 上查看 →
            </a>
            <a
              href="/THIRD-PARTY-NOTICES.md"
              target="_blank"
              rel="noopener"
              class="link-button"
            >
              第三方组件许可证 →
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目概况 -->
    <section class="py-12 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6 px-6">关于 HopeOS</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mb-6">
          <div
            v-for="f in facts"
            :key="f.label"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-4"
          >
            <p class="text-sm text-blue-300 mb-1">{{ f.label }}</p>
            <p class="text-gray-200 font-medium">{{ f.value }}</p>
          </div>
        </div>
        <p class="text-gray-400 px-6 leading-relaxed">
          HopeOS 是一个从零手写、基于 UEFI 启动的 x86-64 操作系统。它现在已具备内核线程调度、中断与定时器、图形桌面、虚拟文件系统，以及
          ring 3 用户态与一套 Linux 风格的 POSIX 系统调用。项目的核心目标不是做一个玩具，而是借此搞清楚一台计算机到底是怎么跑起来的——跑起
          Minecraft 只是极远期的趣味终态，学习的过程才是重点。
        </p>
      </div>
    </section>

    <!-- 已完成 -->
    <section class="py-12 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6 px-6">已经实现的</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          <div
            v-for="item in done"
            :key="item.title"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="text-green-300 text-sm">✓</span>
              <h3 class="text-lg font-bold text-white">{{ item.title }}</h3>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 开发路线 -->
    <section class="py-12 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6 px-6">开发路线</h2>
        <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 px-6 mx-6">
          <ul class="space-y-4">
            <li
              v-for="step in roadmap"
              :key="step.stage"
              class="flex items-start gap-4"
            >
              <span
                class="mt-1 shrink-0 text-xs px-2 py-0.5 rounded"
                :class="{
                  'bg-green-500/20 text-green-300': step.status === '进行中',
                  'bg-blue-500/20 text-blue-300': step.status === '计划中',
                  'bg-gray-600/40 text-gray-400': step.status === '远期' || step.status === '极远',
                }"
              >
                {{ step.status }}
              </span>
              <div>
                <h3 class="text-lg font-bold text-white">{{ step.stage }}</h3>
                <p class="text-gray-400">{{ step.detail }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 返回 -->
    <section class="py-12 px-4 relative">
      <div class="max-w-7xl mx-auto px-6">
        <router-link to="/" class="text-blue-400 hover:text-blue-300 transition-colors">
          ← 返回首页
        </router-link>
      </div>
    </section>
  </div>
</template>
