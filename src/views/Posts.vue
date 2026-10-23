<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@vueuse/head";
import { posts, categories } from "../data/posts";
import { searchIndex, searchPosts } from "../data/search-index";

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
  // 先按分类筛选（"全部" 不过滤）
  let list = active.value === "全部" ? posts : posts.filter((p) => p.category === active.value);
  // 再用搜索索引做全文匹配（标题/摘要/分类/标签/正文）
  if (normalized.value) {
    const hits = new Set(searchPosts(normalized.value).map((r) => r.slug));
    list = list.filter((p) => hits.has(p.slug));
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
      <div class="text-body-1" style="color: var(--gov-body-1); font-family: var(--gov-font-family);">
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
    <div v-if="filtered.length" class="d-flex flex-column ga-4 post-list">
      <router-link
        v-for="post in filtered"
        :key="post.slug"
        :to="`/posts/${post.slug}`"
        class="text-decoration-none"
      >
        <v-card elevation="0" hover class="w-100 post-card">
          <v-card-text class="pa-6">
            <div class="d-flex flex-wrap align-center ga-3 mb-2">
              <v-chip size="small" color="primary" variant="tonal">
                {{ post.category }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">{{ post.date }}</span>
            </div>
            <div class="text-title-medium font-weight-bold text-on-surface mb-2 post-title">
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
    <div v-else class="text-body-1 text-medium-emphasis empty-state">
      没有找到相关文章，换个关键词试试。
    </div>
  </v-container>
</template>

<style lang="sass" scoped>
  @keyframes post-rise
    from
      opacity: 0
      transform: translateY(12px)
    to
      opacity: 1
      transform: translateY(0)

  // 分类筛选：悬停微浮起，选中项带主题色辉光
  .v-chip
    border-radius: var(--shape-sm)
    font-weight: 500
    transition: transform .2s ease, box-shadow .25s ease, background .2s ease

  .v-chip:hover
    transform: translateY(-1px)

  .v-chip--variant-flat
    box-shadow: 0 4px 14px rgba(var(--v-theme-primary), .3)

  // 文章卡片：左侧主题色描边在悬停时点亮
  .post-card
    position: relative
    border-radius: var(--shape-md) !important
    border: 1px solid rgb(var(--v-theme-outline-variant), .55)
    overflow: hidden
    transition: transform .35s cubic-bezier(.4, 0, .2, 1), box-shadow .35s cubic-bezier(.4, 0, .2, 1), border-color .3s ease
    &::before
      content: ""
      position: absolute
      left: 0
      top: 0
      bottom: 0
      width: 3px
      background: linear-gradient(180deg, rgb(var(--v-theme-primary)), rgba(var(--v-theme-primary), .3))
      transform: scaleY(0)
      transform-origin: top
      transition: transform .35s cubic-bezier(.4, 0, .2, 1)
    &:hover
      transform: translateY(-4px)
      border-color: rgb(var(--v-theme-primary), .5)
      box-shadow: 0 12px 32px rgba(var(--v-theme-primary), .14)
    &:hover::before
      transform: scaleY(1)

  .post-title
    transition: color .25s ease

  .post-card:hover .post-title
    color: rgb(var(--v-theme-primary))

  // 列表逐级入场
  .post-list > a
    animation: post-rise .55s cubic-bezier(.05, .7, .1, 1) both
    &:nth-child(1)
      animation-delay: .02s
    &:nth-child(2)
      animation-delay: .06s
    &:nth-child(3)
      animation-delay: .1s
    &:nth-child(4)
      animation-delay: .14s
    &:nth-child(5)
      animation-delay: .18s
    &:nth-child(6)
      animation-delay: .22s
    &:nth-child(n+7)
      animation-delay: .26s

  .empty-state
    padding: 2rem
    text-align: center
    border: 1px dashed rgb(var(--v-theme-outline-variant), .8)
    border-radius: var(--shape-md)

  @media (max-width: 600px)
    .post-card
      border-radius: var(--shape-md) !important

  @media (prefers-reduced-motion: reduce)
    .post-list > a
      animation: none
</style>
