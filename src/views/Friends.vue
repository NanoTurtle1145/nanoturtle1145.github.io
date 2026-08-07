<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "友情链接 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室友情链接。" }],
});

const links = [
  {
    name: "NanoTurtle's Blog",
    url: "https://ntblog.cn",
    desc: "工作室成员 NanoTurtle 的个人博客。",
  },
  {
    name: "希望工作室（旧版存档）",
    url: "https://www.hopestudio.top",
    desc: "旧版官方网站，已于 2026 年 8 月 20 日关停。",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">友情链接</h1>
        <p class="text-gray-400 mb-8">
          想要交换友链？欢迎在
          <a
            href="https://github.com/NanoTurtle1145/nanoturtle1145.github.io/issues"
            target="_blank"
            rel="noopener"
            class="text-blue-400 hover:text-blue-300 underline"
          >
            仓库 Issues
          </a>
          中留下站点名称、地址与简介。
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            v-for="l in links"
            :key="l.url"
            :href="l.url"
            target="_blank"
            rel="noopener"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-gray-800 transition-colors"
          >
            <h2 class="text-xl font-bold text-white mb-2">{{ l.name }}</h2>
            <p class="text-gray-400 mb-3">{{ l.desc }}</p>
            <p class="text-sm text-blue-400 break-all">{{ l.url }}</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
