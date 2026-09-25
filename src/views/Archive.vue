<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useHead } from "@vueuse/head";

useHead({
  title: "归档处 | 希望工作室",
  meta: [
    {
      name: "description",
      content:
        "希望工作室归档处：旧版官网存档、电子资料与文档库，支持在线全文阅读与原件下载。",
    },
  ],
});

interface LibraryItem {
  slug: string;
  title: string;
  author: string;
  desc: string;
  year: string;
  tags: string[];
  chapters: number;
  volumes: string[];
  hasSearch: boolean;
  hasRaw: boolean;
  source: { file: string; size: number; format: string };
  url: string;
  download: string;
}

const items = ref<LibraryItem[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch("/archive/library/index.json");
    if (res.ok) items.value = (await res.json()) as LibraryItem[];
  } catch {
    /* 清单缺失时保持空列表，不阻塞页面 */
  } finally {
    loading.value = false;
  }
});

function mb(bytes: number): string {
  return bytes ? `${(bytes / 1048576).toFixed(1)} MB` : "";
}

/** 旧版官网存档：政务风格下按时间正序展示 */
const legacyEras = computed(() => [
  { label: "2025 年", desc: "迁站前的内容存档，含早期文章与页面。" },
  { label: "2026 年", desc: "WordPress 时期文章、评论与多媒体资料。" },
]);
</script>

<template>
  <div class="archive-page">
    <!-- 页头 -->
    <section class="archive-hero">
      <v-container class="px-4">
        <div class="gov-header-1 mb-3">
          <span>归档处</span>
          <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
        </div>
        <p class="archive-hero__lead">
          归档处长期保存本工作室的旧版站点、电子资料与文献。
          所有条目均保留原件，并提供在线全文阅读；
          扫描件与编译文档会先做编码与结构还原，再按站点排版呈现，可随时切换回原始排版。
        </p>
      </v-container>
    </section>

    <v-container class="px-4 pb-16">
      <!-- 旧版官网存档 -->
      <section class="mb-14">
        <div class="gov-header-2 mb-5">旧版官网存档</div>
        <v-row>
          <v-col cols="12" md="6">
            <a href="/archive/legacy/" class="text-decoration-none">
              <v-card elevation="0" hover class="h-100">
                <v-card-text class="pa-6">
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-avatar color="primary" variant="tonal" rounded="0" size="42">
                      <v-icon icon="mdi-history" />
                    </v-avatar>
                    <div>
                      <div class="text-title-medium font-weight-bold text-on-surface">
                        旧版官网（完整静态存档）
                      </div>
                      <div class="text-body-2" style="color: var(--gov-body-2)">
                        2025 – 2026 · WordPress 时期
                      </div>
                    </div>
                  </div>
                  <p class="text-body-2 mb-4" style="color: var(--gov-body-1); line-height: 1.9">
                    原站 <code>hopestudio.top</code> 的完整静态快照，保留当时的页面结构、
                    文章正文、评论区与主题资源，按年月分层归档，可离线浏览。
                  </p>
                  <div class="d-flex flex-wrap ga-2 mb-4">
                    <v-chip
                      v-for="era in legacyEras"
                      :key="era.label"
                      size="small"
                      variant="tonal"
                      color="primary"
                    >
                      {{ era.label }}
                    </v-chip>
                  </div>
                  <span class="archive-link">
                    进入存档
                    <v-icon icon="mdi-arrow-right" size="x-small" />
                  </span>
                </v-card-text>
              </v-card>
            </a>
          </v-col>
        </v-row>
      </section>

      <!-- 电子资料 -->
      <section class="mb-14">
        <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-5">
          <div class="gov-header-2">电子资料</div>
          <span class="text-body-2" style="color: var(--gov-body-2)">
            共 {{ items.length }} 种
          </span>
        </div>

        <v-row v-if="items.length">
          <v-col v-for="item in items" :key="item.slug" cols="12" md="6">
            <v-card elevation="0" class="h-100 d-flex flex-column">
              <v-card-text class="pa-6 d-flex flex-column h-100">
                <div class="d-flex align-center ga-3 mb-3">
                  <v-avatar color="primary" variant="tonal" rounded="0" size="42">
                    <v-icon icon="mdi-book-open-page-variant-outline" />
                  </v-avatar>
                  <div class="flex-1">
                    <div class="text-title-medium font-weight-bold text-on-surface">
                      {{ item.title }}
                    </div>
                    <div class="text-body-2" style="color: var(--gov-body-2)">
                      {{ item.author || "佚名" }}<template v-if="item.year"> · {{ item.year }}</template>
                    </div>
                  </div>
                </div>

                <p class="text-body-2 mb-4 flex-1" style="color: var(--gov-body-1); line-height: 1.9">
                  {{ item.desc }}
                </p>

                <div class="d-flex flex-wrap ga-2 mb-4">
                  <v-chip size="small" variant="flat" color="primary">
                    {{ item.chapters }} 篇
                  </v-chip>
                  <v-chip
                    v-for="vol in item.volumes"
                    :key="vol"
                    size="small"
                    variant="tonal"
                  >
                    {{ vol }}
                  </v-chip>
                  <v-chip v-if="item.hasSearch" size="small" variant="outlined">
                    可全文检索
                  </v-chip>
                </div>

                <div class="d-flex flex-wrap align-center ga-3">
                  <v-btn
                    :to="item.url"
                    color="primary"
                    variant="flat"
                    rounded="0"
                    prepend-icon="mdi-book-open-variant"
                  >
                    在线阅读
                  </v-btn>
                  <a :href="item.download" download class="text-decoration-none">
                    <v-btn
                      variant="outlined"
                      rounded="0"
                      prepend-icon="mdi-download"
                    >
                      原件下载
                    </v-btn>
                  </a>
                  <span
                    v-if="item.source"
                    class="text-caption"
                    style="color: var(--gov-body-2)"
                  >
                    {{ item.source.format.toUpperCase() }} · {{ mb(item.source.size) }}
                  </span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card v-else elevation="0">
          <v-card-text class="pa-8 text-center">
            <v-icon icon="mdi-inbox-outline" size="40" class="mb-3" style="opacity: 0.5" />
            <div class="text-body-1" style="color: var(--gov-body-2)">
              <template v-if="loading">正在读取归档清单…</template>
              <template v-else>资料库当前为空。</template>
            </div>
          </v-card-text>
        </v-card>
      </section>

      <!-- 归档规范 -->
      <section>
        <div class="gov-header-2 mb-5">归档说明</div>
        <v-card elevation="0">
          <v-card-text class="pa-6 pa-md-8">
            <v-row>
              <v-col v-for="rule in [
                { icon: 'mdi-file-document-outline', t: '原件留存',
                  d: '每一种资料都完整保留原始文件，可随时下载核对，不做有损改动。' },
                { icon: 'mdi-translate', t: '编码还原',
                  d: '早期中文电子文档多为 GB2312/GBK 编码，归档时统一转为 UTF-8，避免乱码。' },
                { icon: 'mdi-format-letter-case', t: '排版重排',
                  d: '旧式标签（FONT/ALIGN 等）归一到语义结构，按站点字体与字号重新排版，便于长时间阅读。' },
                { icon: 'mdi-book-search-outline', t: '全文检索',
                  d: '为全套资料建立段落级检索索引，命中后可直接跳转到对应段落。' }
              ]" :key="rule.t" cols="12" md="6">
                <div class="d-flex ga-3">
                  <v-icon :icon="rule.icon" color="primary" class="mt-1" />
                  <div>
                    <div class="text-body-1 font-weight-bold mb-1" style="color: var(--gov-header-color)">
                      {{ rule.t }}
                    </div>
                    <div class="text-body-2" style="color: var(--gov-body-1); line-height: 1.9">
                      {{ rule.d }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </section>
    </v-container>
  </div>
</template>

<style scoped>
.archive-hero {
  padding: 3rem 0 2rem;
  background: linear-gradient(180deg, rgba(24, 103, 192, 0.06) 0%, transparent 100%);
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant), 0.5);
  margin-bottom: 2.5rem;
}
.archive-hero__lead {
  max-width: 52rem;
  margin: 0;
  color: var(--gov-body-1);
  font-size: 0.95rem;
  line-height: 2;
}
.archive-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: rgb(var(--v-theme-primary));
  font-size: 0.85rem;
  font-weight: 600;
}
a:hover .archive-link {
  text-decoration: underline;
}
</style>
