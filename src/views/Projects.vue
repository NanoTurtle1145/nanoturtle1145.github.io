<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "项目 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室的项目一览。" }],
});

const projects = [
  {
    name: "BusyMitten/HopeCraft",
    desc: "NT & BM 联合推出的 Minecraft 服务器插件，适用于 Bukkit 核心，实现了服务器菜单等一些功能。",
    status: "开源",
    link: "https://github.com/BusyMitten/HopeCraft",
    external: true,
  },
  {
    name: "WinUI 笔记",
    desc: "面向 WinUI 3 的学习笔记系列，持续迭代更新。",
    status: "更新中",
    link: "/posts/winui-notes",
    external: false,
  },
];

const statusClass = (s: string) =>
  ({
    更新中: "bg-green-500/20 text-green-300",
    归档: "bg-gray-600/40 text-gray-400",
    开源: "bg-blue-500/20 text-blue-300",
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
                <span class="text-xs px-2 py-0.5 rounded" :class="statusClass(p.status)">
                  {{ p.status }}
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
