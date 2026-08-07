<script setup lang="ts">
import { computed, ref } from "vue";
import { useHead } from "@vueuse/head";
import { posts, categories } from "../data/posts";

useHead({
  title: "文章 | 希望工作室",
  meta: [
    {
      name: "description",
      content: "希望工作室的全部文章，含技术笔记、工作室公告、历史资料与日常分享。",
    },
  ],
});

const active = ref<string>("全部");
const filters = computed(() => ["全部", ...categories]);

const filtered = computed(() =>
  active.value === "全部" ? posts : posts.filter((p) => p.category === active.value)
);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">文章</h1>
        <p class="text-gray-400 mb-8">
          共 {{ posts.length }} 篇。内容迁移自旧版官网 hopestudio.top，已做本地归档。
        </p>

        <!-- 分类筛选 -->
        <div class="flex flex-wrap gap-2 mb-10">
          <button
            v-for="c in filters"
            :key="c"
            @click="active = c"
            class="px-4 py-1.5 rounded-full text-sm transition-all duration-200 border"
            :class="
              active === c
                ? 'bg-blue-500/20 border-blue-400 text-white'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
            "
          >
            {{ c }}
          </button>
        </div>

        <!-- 列表 -->
        <div class="space-y-4">
          <router-link
            v-for="post in filtered"
            :key="post.slug"
            :to="`/posts/${post.slug}`"
            class="group relative block"
          >
            <div
              class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur"
            ></div>
            <article
              class="relative bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-200"
            >
              <div class="flex flex-wrap items-center gap-3 mb-2 text-sm">
                <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  {{ post.category }}
                </span>
                <time class="text-gray-500">{{ post.date }}</time>
              </div>
              <h2
                class="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors"
              >
                {{ post.title }}
              </h2>
              <p class="text-gray-400">{{ post.excerpt }}</p>
              <div v-if="post.tags.length" class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="text-xs px-2 py-0.5 rounded bg-gray-700/60 text-gray-400"
                >
                  #{{ tag }}
                </span>
              </div>
            </article>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>
