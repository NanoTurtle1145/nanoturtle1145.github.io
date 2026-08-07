<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "项目 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室的项目一览。" }],
});

const projects = [
  {
    name: "WinUI 笔记",
    desc: "一份面向 WinUI 3 初学者的笔记应用，支持深色模式与 Markdown 编辑，持续迭代至 1.1.4.6。",
    status: "维护中",
    link: "/posts/winui-notes-1-1-4-6",
    external: false,
  },
  {
    name: "HPSS Server",
    desc: "希望工作室的自建服务端项目，为工作室内部服务提供基础设施。",
    status: "归档",
    link: "/posts",
    external: false,
  },
  {
    name: "HopeCraft",
    desc: "工作室早期的 Minecraft 相关项目，相关页面保留在旧版存档中。",
    status: "归档",
    link: "/posts",
    external: false,
  },
  {
    name: "HopeOJ",
    desc: "面向练习用途的在线评测系统尝试，相关页面保留在旧版存档中。",
    status: "归档",
    link: "/posts",
    external: false,
  },
  {
    name: "GitHub",
    desc: "工作室成员的开源代码仓库，包含本站源码在内的公开项目。",
    status: "开放",
    link: "https://github.com/NanoTurtle1145",
    external: true,
  },
];

const statusClass = (s: string) =>
  ({
    维护中: "bg-green-500/20 text-green-300",
    归档: "bg-gray-600/40 text-gray-400",
    开放: "bg-blue-500/20 text-blue-300",
  })[s] ?? "bg-gray-600/40 text-gray-400";
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">项目</h1>
        <p class="text-gray-400 mb-8">工作室做过和正在做的一些东西。</p>

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
