<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "成员 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室成员列表。" }],
});

const members = [
  {
    name: "NanoTurtle",
    role: "站点运营 / 开发",
    desc: "负责工作室网站的开发与运营，WinUI 笔记等项目的主要作者。",
    link: "https://github.com/NanoTurtle1145",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">成员</h1>
        <p class="text-gray-400 mb-8">
          名单仍在整理中。若你是工作室成员且希望登记信息，欢迎通过
          <router-link to="/join" class="text-blue-400 hover:text-blue-300">加入我们</router-link>
          页面联系。
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            v-for="m in members"
            :key="m.name"
            :href="m.link"
            target="_blank"
            rel="noopener"
            class="group relative bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-gray-800 transition-colors"
          >
            <h2 class="text-xl font-bold text-white mb-1">{{ m.name }}</h2>
            <p class="text-sm text-blue-300 mb-3">{{ m.role }}</p>
            <p class="text-gray-400">{{ m.desc }}</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
