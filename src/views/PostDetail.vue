<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "@vueuse/head";
import { posts, getPost } from "../data/posts";

const route = useRoute();
const post = computed(() => getPost(route.params.slug as string));

const siblings = computed(() => {
  const idx = posts.findIndex((p) => p.slug === route.params.slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return { prev: posts[idx + 1], next: posts[idx - 1] };
});

useHead(
  computed(() => ({
    title: post.value ? `${post.value.title} | 希望工作室` : "文章未找到 | 希望工作室",
    meta: [{ name: "description", content: post.value?.excerpt ?? "希望工作室官方网站" }],
  }))
);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-3xl mx-auto">
        <template v-if="post">
          <router-link
            to="/posts"
            class="inline-block text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            ← 返回文章列表
          </router-link>

          <header class="mb-8">
            <div class="flex flex-wrap items-center gap-3 mb-3 text-sm">
              <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                {{ post.category }}
              </span>
              <time class="text-gray-500">{{ post.date }}</time>
            </div>
            <h1 class="text-4xl font-bold text-white leading-tight">{{ post.title }}</h1>
            <div v-if="post.tags.length" class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="text-xs px-2 py-0.5 rounded bg-gray-700/60 text-gray-400"
              >
                #{{ tag }}
              </span>
            </div>
          </header>

          <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-10">
            <!-- 内容来自已归档的自有站点，构建期静态注入 -->
            <div class="post-body" v-html="post.content"></div>
          </div>

          <p class="text-sm text-gray-600 mt-6">
            本文迁移自旧版官网，原始链接：
            <a
              :href="post.origin"
              target="_blank"
              rel="noopener"
              class="text-gray-500 hover:text-gray-300 break-all underline"
            >
              {{ post.origin }}
            </a>
          </p>

          <nav class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            <router-link
              v-if="siblings.prev"
              :to="`/posts/${siblings.prev.slug}`"
              class="bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 transition-colors"
            >
              <p class="text-xs text-gray-500 mb-1">上一篇</p>
              <p class="text-white">{{ siblings.prev.title }}</p>
            </router-link>
            <span v-else></span>
            <router-link
              v-if="siblings.next"
              :to="`/posts/${siblings.next.slug}`"
              class="bg-gray-800/50 hover:bg-gray-800 rounded-2xl p-4 transition-colors sm:text-right"
            >
              <p class="text-xs text-gray-500 mb-1">下一篇</p>
              <p class="text-white">{{ siblings.next.title }}</p>
            </router-link>
          </nav>
        </template>

        <template v-else>
          <h1 class="text-3xl font-bold text-white mb-4">文章未找到</h1>
          <p class="text-gray-400 mb-6">该文章可能已被移除，或链接有误。</p>
          <router-link to="/posts" class="text-blue-400 hover:text-blue-300">
            ← 返回文章列表
          </router-link>
        </template>
      </div>
    </section>
  </div>
</template>
