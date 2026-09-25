<script setup lang="ts">
/**
 * 归档处 · 资料阅读器
 *
 * 双模式：
 *   clean —— 站点排版（旧式标签已归一为语义结构，按站点字体排版，可调字号）
 *   raw   —— 原文模式（2004 年原书排版原样呈现，用 iframe 隔离其样式）
 *
 * 全文检索为段落级：命中后直接滚动到对应段落并高亮。
 */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@vueuse/head";

interface Chapter {
  id: string;
  title: string;
  anchors: { id: string; text: string }[];
}
interface Volume {
  name: string;
  index: number;
  chapters: Chapter[];
}
interface Toc {
  slug: string;
  title: string;
  volumes: Volume[];
}
interface Meta {
  slug: string;
  title: string;
  author: string;
  desc: string;
  year: string;
  tags: string[];
  chapters: number;
  hasSearch: boolean;
  hasRaw: boolean;
  source: { file: string; size: number; format: string };
}
interface SearchChapter {
  c: string;
  t: string;
  p: { i: number; t: string }[];
}
interface Hit {
  cid: string;
  ctitle: string;
  bi: number;
  pre: string;
  hit: string;
  post: string;
}

const route = useRoute();
const router = useRouter();

const slug = computed(() => String(route.params.slug ?? ""));

const meta = ref<Meta | null>(null);
const toc = ref<Toc | null>(null);
const loading = ref(true);
const missing = ref(false);

const chapterId = ref("");
const mode = ref<"clean" | "raw">("clean");
const html = ref("");
const contentLoading = ref(false);
const fontSize = ref(17);
const navOpen = ref(false);
const collapsed = ref<Record<string, boolean>>({});

const articleRef = ref<HTMLElement | null>(null);
const iframeRef = ref<HTMLIFrameElement | null>(null);

const cache = new Map<string, string>();
const base = computed(() => `/archive/library/${slug.value}`);

/* ------------------------------------------------------------------ 目录 */
const flat = computed<Chapter[]>(
  () => toc.value?.volumes.flatMap((v) => v.chapters) ?? []
);
const index = computed(() => flat.value.findIndex((c) => c.id === chapterId.value));
const current = computed<Chapter | null>(() => flat.value[index.value] ?? null);
const prev = computed<Chapter | null>(
  () => (index.value > 0 ? flat.value[index.value - 1] : null)
);
const next = computed<Chapter | null>(
  () => (index.value >= 0 && index.value < flat.value.length - 1
    ? flat.value[index.value + 1]
    : null)
);
const currentVolume = computed(
  () =>
    toc.value?.volumes.find((v) => v.chapters.some((c) => c.id === chapterId.value))
      ?.name ?? ""
);

// 注意：必须放在上面的 computed 之后——useHead 会立即求值标题，
// 放在前面会踩到 const 的暂时性死区。
useHead(
  computed(() => ({
    title: meta.value
      ? `${current.value?.title ?? meta.value.title} | 归档处 | 希望工作室`
      : "归档处 | 希望工作室",
    meta: [
      {
        name: "description",
        content: meta.value?.desc ?? "希望工作室归档处在线阅读。",
      },
    ],
  }))
);

/* ---------------------------------------------------------------- 数据加载 */
async function bootstrap() {
  loading.value = true;
  missing.value = false;
  cache.clear();

  if (slug.value === "legacy") {
    // /archive/legacy/ 是静态存档页，交给浏览器直接访问
    if (typeof window !== "undefined") window.location.replace("/archive/legacy/");
    return;
  }

  try {
    const [mr, tr] = await Promise.all([
      fetch(`${base.value}/meta.json`),
      fetch(`${base.value}/toc.json`),
    ]);
    if (!mr.ok || !tr.ok) throw new Error("not found");
    meta.value = (await mr.json()) as Meta;
    const t = (await tr.json()) as Toc;
    toc.value = t;

    const q = typeof route.query.c === "string" ? route.query.c : "";
    const all = t.volumes.flatMap((v) => v.chapters);
    const pick = q && all.some((c) => c.id === q) ? q : all[0]?.id ?? "";
    chapterId.value = pick;
    mode.value = route.query.mode === "raw" ? "raw" : "clean";

    // 默认只展开当前章所在卷，避免第三卷 50+ 章把目录撑得过长
    const vol = t.volumes.find((v) => v.chapters.some((c) => c.id === pick))?.name;
    const fold: Record<string, boolean> = {};
    t.volumes.forEach((v) => (fold[v.name] = v.name !== vol));
    collapsed.value = fold;

    await loadChapter(pick);
  } catch {
    missing.value = true;
  } finally {
    loading.value = false;
  }
}

async function loadChapter(cid: string, opts: { keepScroll?: boolean } = {}) {
  if (!cid) return;
  chapterId.value = cid;
  contentLoading.value = true;
  try {
    if (cache.has(cid)) {
      html.value = cache.get(cid)!;
    } else {
      const res = await fetch(`${base.value}/text/${cid}.html`);
      const text = res.ok ? await res.text() : "<p>本章内容读取失败。</p>";
      cache.set(cid, text);
      html.value = text;
    }
  } finally {
    contentLoading.value = false;
    // 检索跳转时不回顶部，否则会与「滚到命中段落」互相打断
    if (!opts.keepScroll && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}

function openChapter(cid: string) {
  navOpen.value = false;
  router.replace({
    query: { ...route.query, c: cid, ...(mode.value === "raw" ? { mode: "raw" } : {}) },
  });
  // 同章重复点击不再重新拉取
  if (cid !== chapterId.value) loadChapter(cid);
}

/**
 * 拦截正文内的章节链接（导入器已改写成 href="?c=<章节号>" + data-cid）。
 * 不拦截的话会整页刷新；拦截后走站内切换，保留阅读器状态与滚动位置缓存。
 */
function onArticleClick(e: MouseEvent) {
  const a = (e.target as HTMLElement | null)?.closest?.(
    "a[data-cid]"
  ) as HTMLAnchorElement | null;
  if (!a) return;
  const cid = a.dataset.cid ?? "";
  if (cid && flat.value.some((c) => c.id === cid)) {
    e.preventDefault();
    openChapter(cid);
  }
}

/* ------------------------------------------------------------------ 模式 */
function setMode(m: "clean" | "raw") {
  mode.value = m;
  router.replace({
    query: { ...route.query, ...(m === "raw" ? { mode: "raw" } : { mode: undefined }) },
  });
}

const rawUrl = computed(() =>
  chapterId.value ? `${base.value}/raw/${chapterId.value}.htm` : "about:blank"
);

/**
 * 原文模式用固定视口高度 + iframe 内部滚动。
 * 不用「高度贴合内容」：单章原文排版后可达 3 万 px 以上，超过部分浏览器
 * 约 32767px 的渲染上限，会出现内容截断。
 */
function onRawLoad() {
  // 原书相对链接（cap1_02.htm 等）需改写成同一阅读器的章节跳转
  const doc = iframeRef.value?.contentDocument;
  if (!doc) return;
  doc.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (/\.(htm|html)$/i.test(href) && !href.startsWith("http")) {
      const cid = href.replace(/^.*\//, "").replace(/\.(htm|html)$/i, "");
      if (cid && cid !== chapterId.value) {
        a.addEventListener("click", (e) => {
          if (flat.value.some((c) => c.id === cid)) {
            e.preventDefault();
            openChapter(cid);
          }
        });
      }
    }
  });
}

/* ---------------------------------------------------------------- 全文检索 */
const searchOpen = ref(false);
const query = ref("");
const hits = ref<Hit[]>([]);
const truncated = ref(false);
const indexData = ref<SearchChapter[] | null>(null);
const indexLoading = ref(false);
const indexError = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

async function ensureIndex() {
  if (indexData.value || indexLoading.value || !meta.value?.hasSearch) return;
  indexLoading.value = true;
  try {
    const res = await fetch(`${base.value}/search.json`);
    if (!res.ok) throw new Error("no index");
    indexData.value = (await res.json()) as SearchChapter[];
    // 索引体积较大（可达数 MB）。若用户在索引到达前就已输入，此前那次检索
    // 因无索引而返回空且不会自行重跑，这里补跑一次，否则界面会一直空着。
    if (query.value.trim()) runSearch();
  } catch {
    indexError.value = true;
  } finally {
    indexLoading.value = false;
  }
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (searchOpen.value) {
    ensureIndex();
    // v-text-field 的模板 ref 拿到的是组件实例而非 input 元素，直接查 DOM 更稳妥
    nextTick(() => {
      document
        .querySelector<HTMLInputElement>(".reader-search input")
        ?.focus();
    });
  }
}

function runSearch() {
  const needle = query.value.trim().toLowerCase();
  truncated.value = false;
  if (!needle || !indexData.value) {
    hits.value = [];
    return;
  }
  const out: Hit[] = [];
  const MAX = 300;
  outer: for (const ch of indexData.value) {
    for (const p of ch.p) {
      const at = p.t.toLowerCase().indexOf(needle);
      if (at < 0) continue;
      const from = Math.max(0, at - 26);
      const to = Math.min(p.t.length, at + needle.length + 46);
      out.push({
        cid: ch.c,
        ctitle: ch.t,
        bi: p.i,
        pre: (from > 0 ? "…" : "") + p.t.slice(from, at),
        hit: p.t.slice(at, at + needle.length),
        post: p.t.slice(at + needle.length, to) + (to < p.t.length ? "…" : ""),
      });
      if (out.length >= MAX) {
        truncated.value = true;
        break outer;
      }
    }
  }
  hits.value = out;
}

watch(query, () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(runSearch, 180);
});

/** 命中跳转：clean 模式滚动到 data-b 块；raw 模式在 iframe 内按文本定位 */
/**
 * 瞬时滚动到目标元素。
 * 站点全局设了 html{scroll-behavior:smooth}，会让 scrollIntoView 也变成平滑滚动；
 * 跨章检索跳转常常相隔上万像素，平滑滚动又慢又难定向，这里临时关掉平滑。
 */
function instantScroll(el: HTMLElement) {
  const root = el.ownerDocument.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  el.scrollIntoView({ block: "center" });
  root.style.scrollBehavior = prev;
}

async function jump(h: Hit) {
  searchOpen.value = false;
  if (h.cid !== chapterId.value) {
    await loadChapter(h.cid, { keepScroll: true });
    // 跳转会换章，URL 必须跟着走，否则刷新或分享会回到旧章
    router.replace({
      query: {
        ...route.query,
        c: h.cid,
        ...(mode.value === "raw" ? { mode: "raw" } : {}),
      },
    });
  }
  await nextTick();

  if (mode.value === "clean") {
    const el = articleRef.value?.querySelector<HTMLElement>(`[data-b="${h.bi}"]`);
    if (el) {
      instantScroll(el);
      el.classList.add("is-hit");
      setTimeout(() => el.classList.remove("is-hit"), 2600);
    }
    return;
  }
  scrollRawTo(h.hit);
}

function scrollRawTo(needle: string) {
  const doc = iframeRef.value?.contentDocument;
  if (!doc?.body || !needle) return;
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.data.includes(needle)) {
      const parent = node.parentElement;
      if (parent) {
        instantScroll(parent);
        parent.style.transition = "background .3s";
        parent.style.background = "rgba(255, 214, 0, .45)";
        setTimeout(() => (parent.style.background = ""), 2600);
      }
      return;
    }
  }
}

/* -------------------------------------------------------------- 字号与键盘 */
function bump(delta: number) {
  fontSize.value = Math.min(24, Math.max(14, fontSize.value + delta));
  try {
    localStorage.setItem("archive-font-size", String(fontSize.value));
  } catch {
    /* 隐私模式忽略 */
  }
}

function onKey(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowLeft" && prev.value) openChapter(prev.value.id);
  if (e.key === "ArrowRight" && next.value) openChapter(next.value.id);
  if (e.key === "/" && !searchOpen.value) {
    e.preventDefault();
    toggleSearch();
  }
}

onMounted(() => {
  try {
    const saved = Number(localStorage.getItem("archive-font-size"));
    if (saved >= 14 && saved <= 24) fontSize.value = saved;
  } catch {
    /* 忽略 */
  }
  window.addEventListener("keydown", onKey);
  bootstrap();
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKey);
  if (timer) clearTimeout(timer);
});

watch(() => route.params.slug, bootstrap);
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- 未找到 -->
    <v-container v-if="missing" class="py-16 px-4 text-center" style="max-width: 640px">
      <v-icon icon="mdi-bookshelf" size="48" class="mb-4" style="opacity: 0.5" />
      <div class="text-headline-small font-weight-bold mb-3" style="color: var(--gov-header-color)">
        档案未找到
      </div>
      <p class="text-body-2 mb-6" style="color: var(--gov-body-1)">
        归档处没有名为「{{ slug }}」的资料，可能链接已失效或档案已下架。
      </p>
      <v-btn to="/archive" color="primary" rounded="0" prepend-icon="mdi-arrow-left">
        返回归档处
      </v-btn>
    </v-container>

    <div v-else class="reader" :class="{ 'reader--search': searchOpen }">
      <!-- 目录 -->
      <aside class="reader-nav" :class="{ 'reader-nav--open': navOpen }">
        <div class="reader-nav__head">
          <router-link to="/archive" class="reader-nav__back">
            <v-icon icon="mdi-arrow-left" size="small" />
            归档处
          </router-link>
          <div class="reader-nav__title">{{ meta?.title ?? "载入中…" }}</div>
          <div v-if="meta" class="reader-nav__byline">
            {{ meta.author || "佚名" }}<template v-if="meta.year"> · {{ meta.year }}</template>
          </div>
        </div>

        <div class="reader-nav__scroll">
          <div v-for="vol in toc?.volumes ?? []" :key="vol.name" class="reader-vol">
            <button
              class="reader-vol__head"
              type="button"
              @click="collapsed[vol.name] = !collapsed[vol.name]"
            >
              <v-icon
                :icon="collapsed[vol.name] ? 'mdi-chevron-right' : 'mdi-chevron-down'"
                size="small"
              />
              <span>{{ vol.name }}</span>
              <span class="reader-vol__count">{{ vol.chapters.length }}</span>
            </button>
            <ul v-show="!collapsed[vol.name]" class="reader-list">
              <li v-for="ch in vol.chapters" :key="ch.id">
                <button
                  type="button"
                  class="reader-item"
                  :class="{ 'reader-item--active': ch.id === chapterId }"
                  @click="openChapter(ch.id)"
                >
                  {{ ch.title }}
                </button>
                <!-- 当前章的章内小节 -->
                <ul v-if="ch.id === chapterId && ch.anchors.length" class="reader-anchors">
                  <li v-for="a in ch.anchors" :key="a.id">
                    <a :href="`#${a.id}`" @click="navOpen = false">{{ a.text }}</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <!-- 正文 -->
      <div class="reader-body">
        <div class="reader-toolbar">
          <v-btn
            class="d-lg-none"
            icon="mdi-menu"
            variant="text"
            size="small"
            aria-label="打开目录"
            @click="navOpen = !navOpen"
          />
          <div class="reader-crumb">
            <span v-if="currentVolume" class="reader-crumb__vol">{{ currentVolume }}</span>
            <span class="reader-crumb__ch">{{ current?.title ?? "" }}</span>
          </div>

          <div class="reader-actions">
            <v-btn-toggle
              :model-value="mode"
              mandatory
              density="compact"
              variant="outlined"
              divided
              @update:model-value="setMode($event as 'clean' | 'raw')"
            >
              <v-btn value="clean" size="small" prepend-icon="mdi-format-align-left">
                站点排版
              </v-btn>
              <v-btn value="raw" size="small" prepend-icon="mdi-file-eye-outline">
                原文模式
              </v-btn>
            </v-btn-toggle>

            <v-btn
              v-if="mode === 'clean'"
              icon="mdi-format-font-size-decrease"
              variant="text"
              size="small"
              aria-label="减小字号"
              @click="bump(-1)"
            />
            <v-btn
              v-if="mode === 'clean'"
              icon="mdi-format-font-size-increase"
              variant="text"
              size="small"
              aria-label="增大字号"
              @click="bump(1)"
            />
            <v-btn
              :color="searchOpen ? 'primary' : undefined"
              icon="mdi-magnify"
              variant="text"
              size="small"
              aria-label="全文检索"
              @click="toggleSearch"
            />
          </div>
        </div>

        <!-- 检索面板 -->
        <div v-if="searchOpen" class="reader-search">
          <div class="reader-search__bar">
            <v-text-field
              v-model="query"
              density="compact"
              variant="outlined"
              hide-details
              rounded="0"
              placeholder="在全书范围内检索…（按 / 唤起）"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </div>
          <div class="reader-search__meta">
            <template v-if="indexLoading">正在建立检索索引…</template>
            <template v-else-if="indexError">该资料暂无检索索引。</template>
            <template v-else-if="!query.trim()">输入关键词后自动检索，命中段落可直接跳转。</template>
            <template v-else-if="!hits.length">没有找到「{{ query }}」。</template>
            <template v-else>
              找到 {{ hits.length }}{{ truncated ? "+" : "" }} 处命中
            </template>
          </div>
          <ul v-if="hits.length" class="reader-hits">
            <li v-for="(h, i) in hits" :key="`${h.cid}-${h.bi}-${i}`">
              <button type="button" class="reader-hit" @click="jump(h)">
                <span class="reader-hit__ch">{{ h.ctitle }}</span>
                <span class="reader-hit__tx">
                  {{ h.pre }}<mark>{{ h.hit }}</mark>{{ h.post }}
                </span>
              </button>
            </li>
          </ul>
        </div>

        <!-- 内容区 -->
        <div v-if="loading" class="reader-skeleton">
          <v-progress-linear indeterminate color="primary" />
          <p class="text-body-2 mt-4" style="color: var(--gov-body-2)">正在载入档案…</p>
        </div>

        <template v-else>
          <div class="reader-chapter-head">
            <div v-if="currentVolume" class="reader-chapter-head__vol">{{ currentVolume }}</div>
            <h1 class="reader-chapter-head__title">{{ current?.title }}</h1>
          </div>

          <div v-if="contentLoading" class="reader-inline-loading">
            <v-progress-circular indeterminate size="22" width="2" color="primary" />
          </div>

          <!-- 站点排版模式 -->
          <article
            v-if="mode === 'clean'"
            ref="articleRef"
            class="book-body"
            :style="{ fontSize: fontSize + 'px' }"
            v-html="html"
            @click="onArticleClick"
          />

          <!-- 原文模式 -->
          <iframe
            v-else
            ref="iframeRef"
            class="reader-raw"
            :src="rawUrl"
            title="原文模式"
            @load="onRawLoad"
          />

          <!-- 上一章 / 下一章 -->
          <nav class="reader-pager">
            <button
              v-if="prev"
              type="button"
              class="reader-pager__btn"
              @click="openChapter(prev.id)"
            >
              <span class="reader-pager__dir">上一章</span>
              <span class="reader-pager__t">{{ prev.title }}</span>
            </button>
            <span v-else />
            <button
              v-if="next"
              type="button"
              class="reader-pager__btn reader-pager__btn--next"
              @click="openChapter(next.id)"
            >
              <span class="reader-pager__dir">下一章</span>
              <span class="reader-pager__t">{{ next.title }}</span>
            </button>
          </nav>

          <div v-if="meta" class="reader-source">
            <span>原件：{{ meta.source.file }}</span>
            <a :href="`${base}/source/${encodeURIComponent(meta.source.file)}`" download>
              下载原始档案
            </a>
          </div>
        </template>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
/* ============================ 布局 ============================ */
.reader {
  display: grid;
  grid-template-columns: 19rem minmax(0, 1fr);
  gap: 0;
  align-items: start;
  min-height: 70vh;
  background: var(--gov-background);
}
.reader--search {
  grid-template-columns: 19rem minmax(0, 1fr);
}

/* ---------------------------- 目录 ---------------------------- */
.reader-nav {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border-right: 1px solid rgb(var(--v-theme-outline-variant), 0.6);
}
.reader-nav__head {
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant), 0.6);
}
.reader-nav__back {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.78rem;
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  margin-bottom: 0.75rem;
}
.reader-nav__back:hover {
  text-decoration: underline;
}
.reader-nav__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--gov-header-color);
  line-height: 1.5;
}
.reader-nav__byline {
  font-size: 0.76rem;
  color: var(--gov-body-2);
  margin-top: 0.2rem;
}
.reader-nav__scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0 3rem;
}

.reader-vol__head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gov-header-color);
  background: none;
  border: 0;
  cursor: pointer;
  text-align: left;
}
.reader-vol__head:hover {
  background: rgb(var(--v-theme-primary), 0.06);
}
.reader-vol__count {
  margin-left: auto;
  font-weight: 400;
  font-size: 0.72rem;
  color: var(--gov-body-2);
}
.reader-list,
.reader-anchors {
  list-style: none;
  margin: 0;
  padding: 0;
}
.reader-item {
  width: 100%;
  text-align: left;
  padding: 0.45rem 1rem 0.45rem 1.9rem;
  font-size: 0.79rem;
  line-height: 1.6;
  color: var(--gov-body-1);
  background: none;
  border: 0;
  border-left: 3px solid transparent;
  cursor: pointer;
}
.reader-item:hover {
  background: rgb(var(--v-theme-primary), 0.07);
  color: rgb(var(--v-theme-primary));
}
.reader-item--active {
  background: rgb(var(--v-theme-primary), 0.1);
  border-left-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
  font-weight: 700;
}
.reader-anchors a {
  display: block;
  padding: 0.3rem 1rem 0.3rem 2.8rem;
  font-size: 0.74rem;
  color: var(--gov-body-2);
  text-decoration: none;
}
.reader-anchors a:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

/* ---------------------------- 正文区 ---------------------------- */
.reader-body {
  min-width: 0;
  padding: 0 2.5rem 5rem;
  background: var(--gov-background);
}
.reader-toolbar {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0;
  margin-bottom: 1.25rem;
  background: var(--gov-background);
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant), 0.6);
}
.reader-crumb {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.reader-crumb__vol {
  font-size: 0.68rem;
  color: var(--gov-body-2);
  letter-spacing: 0.04em;
}
.reader-crumb__ch {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--gov-header-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 30rem;
}
.reader-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* ---------------------------- 检索 ---------------------------- */
.reader-search {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline-variant), 0.6);
  box-shadow: var(--gov-card-shadow);
}
.reader-search__meta {
  font-size: 0.75rem;
  color: var(--gov-body-2);
  padding: 0.6rem 0.15rem 0;
}
.reader-hits {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  max-height: 24rem;
  overflow-y: auto;
}
.reader-hit {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.6rem 0.5rem;
  background: none;
  border: 0;
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant), 0.4);
  cursor: pointer;
}
.reader-hit:hover {
  background: rgb(var(--v-theme-primary), 0.07);
}
.reader-hit__ch {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 0.2rem;
}
.reader-hit__tx {
  display: block;
  font-size: 0.79rem;
  line-height: 1.75;
  color: var(--gov-body-1);
}
.reader-hit mark {
  background: rgba(255, 214, 0, 0.5);
  color: inherit;
  padding: 0 0.15em;
}

/* ---------------------------- 章节内容 ---------------------------- */
.reader-chapter-head {
  padding: 0.5rem 0 1rem;
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant), 0.5);
  margin-bottom: 1.25rem;
}
.reader-chapter-head__vol {
  font-size: 0.72rem;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.06em;
  margin-bottom: 0.35rem;
}
.reader-chapter-head__title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--gov-header-color);
  margin: 0;
}
.reader-inline-loading {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}
.reader-skeleton {
  padding: 4rem 0;
  max-width: 40rem;
}

/* 书籍正文排版：中文长文（首行缩进 2 字、宽行距） */
.book-body {
  max-width: 42rem;
  color: var(--gov-body-1);
  line-height: 2.15;
  font-family: var(--gov-font-family);
}
.book-body :deep(h2) {
  font-size: 1.28em;
  font-weight: 700;
  color: var(--gov-header-color);
  text-align: center;
  margin: 2.4em 0 1em;
  line-height: 1.55;
}
/* 书内标题紧贴章头时不再叠加外边距，避免正文被推到首屏之外 */
.book-body :deep(> h2:first-child),
.book-body :deep(> h3:first-child) {
  margin-top: 0.2em;
}
.book-body :deep(h3) {
  font-size: 1.08em;
  font-weight: 700;
  color: var(--gov-header-color);
  margin: 1.9em 0 0.8em;
  line-height: 1.6;
}
.book-body :deep(p) {
  margin: 0 0 0.85em;
  text-indent: 2em;
}
/* 批阅者笔记：保留原书蓝色语义 */
.book-body :deep(.note) {
  color: #1668c4;
}
.book-body :deep(.note)::before {
  content: "〔批注〕";
  font-size: 0.82em;
  opacity: 0.65;
  margin-right: 0.15em;
}
/* 原书页码：行内上标 */
.book-body :deep(sup.pg) {
  font-size: 0.6em;
  color: var(--gov-body-2);
  margin: 0 0.3em;
  vertical-align: super;
  font-weight: 400;
}
.book-body :deep(.book-pg) {
  text-indent: 0;
  text-align: center;
  font-size: 0.72em;
  color: var(--gov-body-2);
  letter-spacing: 0.1em;
  margin: 1.2em 0;
}
.book-body :deep(hr) {
  border: 0;
  border-top: 1px solid rgb(var(--v-theme-outline-variant), 0.7);
  margin: 2.4em 0;
}
.book-body :deep(.book-link) {
  color: rgb(var(--v-theme-primary));
}
/* 原书死链：保留原文但标注为不可跳转，避免读者点了必然 404 */
.book-body :deep(.book-deadlink) {
  text-decoration: underline dotted;
  text-decoration-color: rgb(var(--v-theme-outline));
  text-underline-offset: 0.2em;
  cursor: help;
}
.book-body :deep(.book-table) {
  overflow-x: auto;
  margin: 1.2em 0;
}
.book-body :deep(table) {
  border-collapse: collapse;
  font-size: 0.9em;
}
.book-body :deep(td),
.book-body :deep(th) {
  border: 1px solid rgb(var(--v-theme-outline-variant), 0.8);
  padding: 0.35em 0.6em;
}
.book-body :deep(.is-hit) {
  background: rgba(255, 214, 0, 0.35);
  transition: background 0.4s;
}
.book-body :deep(strong) {
  font-weight: 700;
}

/* 原文模式 */
.reader-raw {
  width: 100%;
  /* 定高 + iframe 内滚动：单章原文排版可达 3 万 px 以上，
     超过浏览器约 32767px 的渲染上限会被截断，故不贴合内容高度 */
  height: clamp(560px, calc(100vh - 240px), 1400px);
  border: 1px solid rgb(var(--v-theme-outline-variant), 0.6);
  background: #fff;
  box-shadow: var(--gov-card-shadow);
}

/* ---------------------------- 翻页 ---------------------------- */
.reader-pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(var(--v-theme-outline-variant), 0.6);
}
.reader-pager__btn {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
  padding: 0.85rem 1rem;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline-variant), 0.7);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.reader-pager__btn:hover {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: var(--gov-card-shadow);
}
.reader-pager__btn--next {
  text-align: right;
  align-items: flex-end;
}
.reader-pager__dir {
  font-size: 0.7rem;
  color: var(--gov-body-2);
}
.reader-pager__t {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--gov-header-color);
  line-height: 1.55;
}
.reader-source {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: space-between;
  margin-top: 2.5rem;
  font-size: 0.75rem;
  color: var(--gov-body-2);
}
.reader-source a {
  color: rgb(var(--v-theme-primary));
}

/* ---------------------------- 响应式 ---------------------------- */
@media (max-width: 1279px) {
  .reader,
  .reader--search {
    grid-template-columns: 1fr;
  }
  .reader-nav {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    width: min(20rem, 86vw);
    z-index: 1002;
    transform: translateX(-102%);
    transition: transform 0.26s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: var(--gov-card-shadow);
  }
  .reader-nav--open {
    transform: translateX(0);
  }
  .reader-body {
    padding: 0 1.1rem 4rem;
  }
  .reader-toolbar {
    top: 0;
    padding: 0.5rem 0;
  }
  .reader-crumb__ch {
    max-width: 11rem;
  }
}
</style>
