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
    title: "动手实践",
    desc: "比起空谈，我们更愿意把想法做成真正能用的东西。",
  },
  {
    title: "自由探索",
    desc: "没有硬性路线，感兴趣的方向就大胆去钻。",
  },
  {
    title: "一起成长",
    desc: "遇到难题大家一起琢磨、互相补位，比一个人扛着走得快。",
  },
  {
    title: "长期留存",
    desc: "老站虽然关了，但好内容都搬过来了，妥妥存好，随时都能翻出来看。",
    link: "去归档站逛逛"
  },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Hero -->
    <div class="pt-16 relative">
      <div class="hero-container">
        <div class="cover flex items-center justify-center p-8 lg:p-16">
          <img src="/banner.png" alt="希望工作室" class="image max-h-514" />
        </div>
        <div class="body">
          <div class="container">
            <h1 class="title">HopeOS正在火热开发中！</h1>
            <p class="subtitle">一个用于学习操作系统运行原理的项目。</p>
          </div>
          <router-link to="/hopeos" class="link-button">前往详情页面</router-link>
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
        <h2 class="text-4xl font-bold text-white mb-6 px-6">我们的特点</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="adv in advantages"
            :key="adv.title"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6"
          >

            <h3 class="text-xl font-bold text-white mb-4">{{ adv.title }}</h3>
            <p class="text-gray-400">{{ adv.desc }}</p>
            <router-link v-if="adv.link" to="/archive" class="text-blue-400 hover:text-blue-300 transition-colors">
              {{ adv.link }}
            </router-link>




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
