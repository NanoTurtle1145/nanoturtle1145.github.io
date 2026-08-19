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
  <v-container class="py-12 px-4" style="max-width: 1024px">
    <div class="text-h4 font-weight-bold text-on-surface mb-2">文章</div>
    <div class="text-body-1 text-medium-emphasis mb-8">
      共 {{ posts.length }} 篇。内容迁移自旧版官网 hopestudio.top，已做本地归档。
    </div>

    <!-- 分类筛选 -->
    <div class="d-flex flex-wrap ga-2 mb-10">
      <v-chip
        v-for="c in filters"
        :key="c"
        :color="active === c ? 'primary' : undefined"
        variant="tonal"
        class="cursor-pointer"
        @click="active = c"
      >
        {{ c }}
      </v-chip>
    </div>

    <!-- 列表 -->
    <div class="d-flex flex-column ga-4">
      <router-link
        v-for="post in filtered"
        :key="post.slug"
        :to="`/posts/${post.slug}`"
        class="text-decoration-none"
      >
        <v-card elevation="0" hover class="w-100">
          <v-card-text class="pa-6">
            <div class="d-flex flex-wrap align-center ga-3 mb-2">
              <v-chip size="small" color="primary" variant="tonal">
                {{ post.category }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">{{ post.date }}</span>
            </div>
            <div class="text-h6 font-weight-bold text-on-surface mb-2">
              {{ post.title }}
            </div>
            <div class="text-body-2 text-medium-emphasis">{{ post.excerpt }}</div>
            <div v-if="post.tags.length" class="d-flex flex-wrap ga-2 mt-3">
              <v-chip
                v-for="tag in post.tags"
                :key="tag"
                size="x-small"
                variant="flat"
                color="grey-darken-2"
              >
                #{{ tag }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </router-link>
    </div>
  </v-container>
</template>


