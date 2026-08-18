<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "项目 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室的项目一览。" }],
});

// 修改：status 改为数组，支持多个状态标签
const projects = [
  {
    name: "BusyMitten/HopeCraft",
    desc: "NT & BM 联合推出的 Minecraft 服务器插件，适用于 Bukkit 核心，实现了服务器菜单等一些功能。",
    status: ["开源",'归档'], // 改为数组
    link: "https://github.com/BusyMitten/HopeCraft",
    external: true,
  },
  {
    name: "WinUI 笔记",
    desc: "面向 WinUI 3 的学习笔记系列，持续迭代更新。",
    status: ["开源", "更新中"], // 合并两个状态为数组，删除重复字段
    link: "/posts/winui-notes",
    external: false,
  },
  {
    name: "HopeOS",
    desc: "一个从零编写的 UEFI 操作系统，用于学习操作系统运行原理。",
    status: ['闭源',"内部开发中"], // 改为数组
    link: "/hopeos",
    external: false,
  },
  {
    name: "RootMyS9280",
    desc: "三星 Galaxy S24 Ultra 免解锁 Root 工具：基于 CVE-2026-43499 的临时提权 + KernelSU 加载，不熔断 KNOX。",
    status: ["开源", "更新中"],
    link: "https://github.com/NanoTurtle1145/root-my-s9280",
    external: true,
  },
];

// 修改：中文键名加引号，避免语法错误（兼容性更好）
const statusClass = (s: string) =>
  ({
    '更新中': "bg-green-500/20 text-green-300",
    '归档': "bg-gray-600/40 text-gray-400",
    '开源': "bg-blue-500/20 text-blue-300",
    '闭源': "bg-red-500/20 text-red-300",
    '内部开发中': "bg-yellow-500/20 text-yellow-300",
  })[s] ?? "bg-gray-600/40 text-gray-400";
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">项目</h1>
        <p class="text-gray-400 mb-8">Under Construction… 工作室做过和正在做的一些东西。</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="p in projects"
            :key="p.name"
            class="group relative bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center gap-3 mb-3">
                <h2 class="text-xl font-bold text-white">{{ p.name }}</h2>
                <!-- 修改：遍历 status 数组，为每个状态生成一个标签 -->
                <span
                  v-for="(st, idx) in p.status"
                  :key="idx"
                  class="text-xs px-2 py-0.5 rounded"
                  :class="statusClass(st)"
                >
                  {{ st }}
                </span>
              </div>
              <p class="text-gray-400 mb-4">{{ p.desc }}</p>
            </div>
            <a
              v-if="p.external"
              :href="p.link"
              target="_blank"
              rel="noopener"
              class="text-blue-400 hover:text-blue-300 transition-colors"
            >
              前往 →
            </a>
            <router-link v-else :to="p.link" class="text-blue-400 hover:text-blue-300 transition-colors">
              了解更多 →
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
