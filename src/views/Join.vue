<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "加入我们 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室成员招募。" }],
});

const directions = [
  {
    title: "应用开发",
    desc: "Windows 桌面应用（WinUI 3 / UWP / WPF）、跨平台应用，或任何你想做的客户端项目。",
  },
  {
    title: "前端 / 网站",
    desc: "参与本站的开发与维护，Vue、TypeScript、Tailwind，或者只是帮忙改改文案与排版。",
  },
  {
    title: "服务端与运维",
    desc: "服务搭建、部署与自动化，让工作室的项目跑得更稳。",
  },
  {
    title: "内容与资料",
    desc: "写技术笔记、整理与校对资料。不写代码同样重要。",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">加入我们</h1>
        <p class="text-gray-400 mb-8">
          我们欢迎任何对技术有兴趣、愿意动手做点东西的人。没有经验也没关系——工作室本身就是一个学习的地方。
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div
            v-for="d in directions"
            :key="d.title"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h2 class="text-xl font-bold text-white mb-2">{{ d.title }}</h2>
            <p class="text-gray-400">{{ d.desc }}</p>
          </div>
        </div>

        <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-10">
          <h2 class="text-2xl font-bold text-white mb-4">怎么联系我们</h2>
          <p class="text-gray-400 leading-8">
            目前最可靠的方式是通过 GitHub 与我们取得联系：在
            <a
              href="https://github.com/NanoTurtle1145/nanoturtle1145.github.io/issues"
              target="_blank"
              rel="noopener"
              class="text-blue-400 hover:text-blue-300 underline"
            >
              本站仓库的 Issues
            </a>
            中留言，说明你想参与的方向和你做过的东西即可。
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
