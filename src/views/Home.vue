<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@vueuse/head";
import { posts } from "../data/posts";

useHead({
  title: "希望工作室 | Hope Studio",
  meta: [
    {
      name: "description",
      content:
        "希望工作室（Hope Studio）是一个由学生组成的技术兴趣团队，专注于桌面应用开发、操作系统探索与开源分享。有希望者，事竟成。",
    },
  ],
});

const latestPosts = computed(() => posts.slice(0, 3));

const products = [
  {
    title: "桌面应用",
    description: "基于 WinUI 3 / UWP 的现代 Windows 应用开发实践与笔记。",
    link: "/posts",
  },
  {
    title: "开源项目",
    description: "HopeCraft、HopeOJ、HPSS 等项目，代码与文档持续开放。",
    link: "/projects",
  },
  {
    title: "技术分享",
    description: "从设备刷机到多线程网络编程，把踩过的坑写成可复用的经验。",
    link: "/posts",
  },
  {
    title: "资料存档",
    description: "对有价值的历史文献与资料进行整理、校对与长期保存。",
    link: "/posts",
  },
];

const advantages = [
  {
    title: "学生团队，共同进步",
    desc: "团队中的每个成员为共同的目标贡献自己的力量，在协作中不断提升自我。",
  },
  {
    title: "涉猎广泛",
    desc: "从桌面应用、服务端到资料整理，我们的项目覆盖多个领域，全方位扩展探索范围。",
  },
  {
    title: "开放共享",
    desc: "我们相信知识应当自由流动，笔记与代码尽可能以开源、公开的形式发布。",
  },
  {
    title: "长期留存",
    desc: "旧站关停后内容并未消失——所有有价值的文章都已迁移到这里，并做了本地化归档。",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Hero -->
    <div class="pt-16 relative">
      <div class="hero-container">
        <div class="cover flex items-center justify-center p-8 lg:p-16">
          <img src="/logo.svg" alt="希望工作室" class="image max-h-72" />
        </div>
        <div class="body">
          <div class="container">
            <h1 class="title">Where there is a hope, there is a way.</h1>
            <p class="subtitle">有希望者，事竟成。</p>
          </div>
          <router-link to="/posts" class="link-button">浏览全部文章</router-link>
        </div>
      </div>
    </div>

    <!-- 我们在做什么 -->
    <section class="py-12 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6 px-6">我们在做什么</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="product in products" :key="product.title" class="group relative">
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"
            ></div>
            <div
              class="relative bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col justify-between"
            >
              <div>
                <h3 class="text-xl font-bold text-white mb-2">{{ product.title }}</h3>
                <p class="text-gray-400 mb-4">{{ product.description }}</p>
              </div>
              <router-link
                :to="product.link"
                class="inline-flex items-center text-blue-400 fill-blue-400 hover:text-blue-300 hover:fill-blue-300 transition-all duration-200 leading-4"
              >
                <span>了解更多</span>
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path
                    d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
                  />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="py-12 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-baseline justify-between mb-6 px-6">
          <h2 class="text-4xl font-bold text-white">最新文章</h2>
          <router-link to="/posts" class="text-blue-400 hover:text-blue-300 transition-colors">
            查看全部 →
          </router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <router-link
            v-for="post in latestPosts"
            :key="post.slug"
            :to="`/posts/${post.slug}`"
            class="group relative block"
          >
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"
            ></div>
            <div
              class="relative bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-3 mb-3 text-sm">
                  <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {{ post.category }}
                  </span>
                  <time class="text-gray-500">{{ post.date }}</time>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">{{ post.title }}</h3>
                <p class="text-gray-400 mb-4 line-clamp-3">{{ post.excerpt }}</p>
              </div>
              <span
                class="inline-flex items-center text-blue-400 fill-blue-400 group-hover:text-blue-300 group-hover:fill-blue-300 transition-all duration-200 leading-4"
              >
                <span>阅读全文</span>
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path
                    d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
                  />
                </svg>
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 亮点 -->
    <section class="py-12 px-4 relative">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-white mb-6 px-6">我们有什么亮点？</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="adv in advantages"
            :key="adv.title"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h3 class="text-xl font-bold text-white mb-4">{{ adv.title }}</h3>
            <p class="text-gray-400">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
