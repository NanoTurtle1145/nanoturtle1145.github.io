<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@vueuse/head";
import { posts, categories } from "../data/posts";

const route = useRoute();
const router = useRouter();

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

// 首页搜索框/热门分类会带 ?q= 跳转过来
const search = ref<string>("");
watch(
  () => route.query.q,
  (q) => {
    search.value = typeof q === "string" ? q : "";
    if (search.value) {
      // 命中某个分类则联动分类筛选
      const hit = filters.value.find(
        (c) => c !== "全部" && search.value === c
      );
      active.value = hit ?? "全部";
    }
  },
  { immediate: true }
);

const normalized = computed(() => search.value.trim().toLowerCase());

const filtered = computed(() => {
  let list = active.value === "全部" ? posts : posts.filter((p) => p.category === active.value);
  if (normalized.value) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(normalized.value) ||
        p.excerpt.toLowerCase().includes(normalized.value) ||
        p.category.toLowerCase().includes(normalized.value) ||
        p.tags.some((t) => t.toLowerCase().includes(normalized.value))
    );
  }
  return list;
});

function clearSearch() {
  search.value = "";
  active.value = "全部";
  router.replace({ query: {} });
}
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 1024px">
    <div class="mb-8">
      <div class="gov-header-1 mb-2">
        <span>全部文章</span>
        <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
      </div>
      <div class="text-body-1" style="color: #3c4852; font-family: var(--gov-font-family);">
        共 {{ posts.length }} 篇。内容迁移自旧版官网 hopestudio.top，已做本地归档。
        <template v-if="normalized">
          — 搜索「{{ search }}」找到 {{ filtered.length }} 篇
          <a href="#" class="text-primary" @click.prevent="clearSearch">清除</a>
        </template>
      </div>
    </div>

    <!-- 分类筛选（政务风格：选中填充 primary，未选中描边） -->
    <div class="d-flex flex-wrap ga-2 mb-10">
      <v-chip
        v-for="c in filters"
        :key="c"
        :color="active === c ? 'primary' : undefined"
        :text-color="active === c ? 'on-primary' : undefined"
        :variant="active === c ? 'flat' : 'outlined'"
        class="cursor-pointer"
        @click="active = c"
      >
        {{ c }}
      </v-chip>
    </div>

    <!-- 列表 -->
    <div v-if="filtered.length" class="d-flex flex-column ga-4">
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
            <div class="text-title-medium font-weight-bold text-on-surface mb-2">
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
    <div v-else class="text-body-1 text-medium-emphasis">
      没有找到相关文章，换个关键词试试。
    </div>
  </v-container>
</template>
