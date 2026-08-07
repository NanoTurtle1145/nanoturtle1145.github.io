<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "友情链接 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室友情链接。" }],
});

const links = [
  {
    name: "HopeOJ",
    url: "http://hopeoj.asia/",
    desc: "希望工作室 OJ 系统，基于 Hydro。",
  },
  {
    name: "HopeOJ 交流区",
    url: "http://forum.hopeoj.asia/",
    desc: "这个网站有一点死了。",
  },
  {
    name: "Lincol29's Blog",
    url: "https://www.lincol29.cn",
    desc: "一名 Java 转 C# 开发的码农，分享一些项目中使用的技术和知识，以及 WordPress 建站技巧。",
  },
  {
    name: "洛元の小屋",
    url: "https://blog.dimeta.top/",
    desc: "洛元の小屋，以科技、游戏、生活为主的 blog。",
  },
  {
    name: "站长的博客",
    url: "https://ntblog.cn",
    desc: "NanoTurtle 的个人博客。",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">友情链接</h1>
        <p class="text-gray-400 mb-8">
          想要交换友链？欢迎通过
          <router-link to="/join" class="text-blue-400 hover:text-blue-300">加入我们</router-link>
          页面留下站点名称、地址与简介。
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
