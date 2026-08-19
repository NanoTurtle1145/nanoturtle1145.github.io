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
  <v-container class="py-12 px-4" style="max-width: 768px">
    <template v-if="post">
      <router-link to="/posts" class="text-decoration-none">
        <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" class="mb-6 px-0">
          返回文章列表
        </v-btn>
      </router-link>

      <header class="mb-8">
        <div class="d-flex flex-wrap align-center ga-3 mb-3">
          <v-chip size="small" color="primary" variant="tonal">
            {{ post.category }}
          </v-chip>
          <span class="text-caption text-medium-emphasis">{{ post.date }}</span>
        </div>
        <h1 class="text-h4 font-weight-bold text-on-surface" style="line-height: 1.3">
          {{ post.title }}
        </h1>
        <div v-if="post.tags.length" class="d-flex flex-wrap ga-2 mt-4">
          <v-chip v-for="tag in post.tags" :key="tag" size="x-small" variant="flat" color="grey-darken-2">
            #{{ tag }}
          </v-chip>
        </div>
      </header>

      <v-card elevation="0">
        <v-card-text class="pa-6 pa-sm-10">
          <!-- 内容来自已归档的自有站点，构建期静态注入 -->
          <div class="post-body" v-html="post.content"></div>
        </v-card-text>
      </v-card>

      <div class="text-caption text-medium-emphasis mt-6">
        本文迁移自旧版官网，原始链接：
        <a
          :href="post.origin"
          target="_blank"
          rel="noopener"
          class="text-primary text-decoration-underline text-break"
        >
          {{ post.origin }}
        </a>
      </div>

      <v-row class="mt-8">
        <v-col cols="12" sm="6">
          <router-link
            v-if="siblings.prev"
            :to="`/posts/${siblings.prev.slug}`"
            class="text-decoration-none"
          >
            <v-card hover class="pa-4">
              <div class="text-caption text-medium-emphasis mb-1">上一篇</div>
              <div class="text-body-1 text-on-surface">{{ siblings.prev.title }}</div>
            </v-card>
          </router-link>
        </v-col>
        <v-col cols="12" sm="6">
          <router-link
            v-if="siblings.next"
            :to="`/posts/${siblings.next.slug}`"
            class="text-decoration-none"
          >
            <v-card hover class="pa-4 text-sm-right">
              <div class="text-caption text-medium-emphasis mb-1">下一篇</div>
              <div class="text-body-1 text-on-surface">{{ siblings.next.title }}</div>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <div class="text-h4 font-weight-bold text-on-surface mb-4">文章未找到</div>
      <div class="text-body-1 text-medium-emphasis mb-6">该文章可能已被移除，或链接有误。</div>
      <router-link to="/posts" class="text-decoration-none">
        <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left">返回文章列表</v-btn>
      </router-link>
    </template>
  </v-container>
</template>


