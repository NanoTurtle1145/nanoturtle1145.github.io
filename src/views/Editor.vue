<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useHead } from "@vueuse/head";
import HeroBlock from "../components/blocks/HeroBlock.vue";
import FeatureGridBlock from "../components/blocks/FeatureGridBlock.vue";
import MemberGridBlock from "../components/blocks/MemberGridBlock.vue";
import TimelineBlock from "../components/blocks/TimelineBlock.vue";
import TextBlock from "../components/blocks/TextBlock.vue";
import CtaBlock from "../components/blocks/CtaBlock.vue";
import LinksGridBlock from "../components/blocks/LinksGridBlock.vue";

useHead({
  title: "页面编辑器 | 希望工作室",
  meta: [{ name: "description", content: "基于本站设计系统的可视化页面编辑器（组件式）。" }],
});

// 区块类型 -> 渲染组件（预览与导出共用，均为 Vue 组件，而非 HTML 字符串）
const BLOCK_COMPONENTS: Record<string, any> = {
  hero: HeroBlock,
  featureGrid: FeatureGridBlock,
  memberGrid: MemberGridBlock,
  timeline: TimelineBlock,
  textBlock: TextBlock,
  cta: CtaBlock,
  linksGrid: LinksGridBlock,
};
const COMP_NAME: Record<string, string> = {
  hero: "HeroBlock",
  featureGrid: "FeatureGridBlock",
  memberGrid: "MemberGridBlock",
  timeline: "TimelineBlock",
  textBlock: "TextBlock",
  cta: "CtaBlock",
  linksGrid: "LinksGridBlock",
};

interface Block {
  id: string;
  type: string;
  [k: string]: any;
}

const STORAGE_KEY = "hope-studio-page-editor";
const blocks = ref<Block[]>([]);
const selectedId = ref<string | null>(null);

let _uid = 0;
const genId = () => "b" + Date.now().toString(36) + (_uid++).toString(36);

// 页面元信息：名称 -> 菜单项与路由
const pageSettings = ref({ name: "新页面", slug: "", showInMenu: true });
function slugify(s: string) {
  const base = (s || "page").trim().toLowerCase().replace(/\s+/g, "-");
  return base.replace(/[^\w一-龥-]/g, "") || "page";
}
const pageSlug = computed(() => pageSettings.value.slug.trim() || slugify(pageSettings.value.name));

// 区块定义：调色板标签、默认数据、检查器表单
const BLOCK_DEFS: Record<string, any> = {
  hero: {
    label: "Hero 头图",
    defaults: () => ({ title: "标题", subtitle: "副标题", buttonText: "按钮", buttonLink: "/", image: "/banner.png" }),
    fields: [
      { key: "title", label: "主标题", type: "text" },
      { key: "subtitle", label: "副标题", type: "text" },
      { key: "buttonText", label: "按钮文字", type: "text" },
      { key: "buttonLink", label: "按钮链接", type: "text" },
      { key: "image", label: "图片路径", type: "text" },
    ],
  },
  featureGrid: {
    label: "特性卡片",
    defaults: () => ({ title: "我们的特点", columns: 2, items: [{ title: "特性一", desc: "描述", link: "" }] }),
    fields: [
      { key: "title", label: "标题", type: "text" },
      { key: "columns", label: "列数", type: "number" },
      {
        key: "items",
        label: "卡片",
        type: "list",
        itemFields: [
          { key: "title", label: "标题", type: "text" },
          { key: "desc", label: "描述", type: "textarea" },
          { key: "link", label: "链接(可空)", type: "text" },
        ],
      },
    ],
  },
  memberGrid: {
    label: "成员网格",
    defaults: () => ({ title: "成员列表", items: [{ name: "姓名", role: "角色", desc: "简介", avatar: "" }] }),
    fields: [
      { key: "title", label: "标题", type: "text" },
      {
        key: "items",
        label: "成员",
        type: "list",
        itemFields: [
          { key: "name", label: "昵称", type: "text" },
          { key: "role", label: "角色", type: "text" },
          { key: "desc", label: "简介", type: "textarea" },
          { key: "avatar", label: "头像路径(可空)", type: "text" },
        ],
      },
    ],
  },
  timeline: {
    label: "时间线",
    defaults: () => ({ title: "大事记", items: [{ date: "2025", text: "事件描述" }] }),
    fields: [
      { key: "title", label: "标题", type: "text" },
      {
        key: "items",
        label: "条目",
        type: "list",
        itemFields: [
          { key: "date", label: "日期", type: "text" },
          { key: "text", label: "描述", type: "textarea" },
        ],
      },
    ],
  },
  textBlock: {
    label: "文字段落",
    defaults: () => ({ title: "", content: "在这里写点什么。" }),
    fields: [
      { key: "title", label: "小标题(可空)", type: "text" },
      { key: "content", label: "正文", type: "textarea" },
    ],
  },
  cta: {
    label: "行动号召",
    defaults: () => ({ title: "想了解更多？", buttonText: "联系我们", link: "/join" }),
    fields: [
      { key: "title", label: "标题", type: "text" },
      { key: "buttonText", label: "按钮文字", type: "text" },
      { key: "link", label: "链接", type: "text" },
    ],
  },
  linksGrid: {
    label: "链接卡片",
    defaults: () => ({ title: "友情链接", items: [{ name: "名称", url: "https://example.com", desc: "简介" }] }),
    fields: [
      { key: "title", label: "标题", type: "text" },
      {
        key: "items",
        label: "链接",
        type: "list",
        itemFields: [
          { key: "name", label: "名称", type: "text" },
          { key: "url", label: "网址", type: "text" },
          { key: "desc", label: "简介", type: "textarea" },
        ],
      },
    ],
  },
};

function addBlock(type: string) {
  const def = BLOCK_DEFS[type];
  const b: Block = { id: genId(), type, ...def.defaults() };
  blocks.value.push(b);
  selectedId.value = b.id;
}
function removeBlock(id: string) {
  blocks.value = blocks.value.filter((b) => b.id !== id);
  if (selectedId.value === id) selectedId.value = null;
}
function move(dir: number, id: string) {
  const i = blocks.value.findIndex((b) => b.id === id);
  const j = i + dir;
  if (j < 0 || j >= blocks.value.length) return;
  const arr = blocks.value;
  const t = arr[i];
  arr.splice(i, 1);
  arr.splice(j, 0, t);
}
function duplicateBlock(id: string) {
  const i = blocks.value.findIndex((b) => b.id === id);
  if (i < 0) return;
  const copy: Block = { ...blocks.value[i], id: genId() };
  blocks.value.splice(i + 1, 0, copy);
  selectedId.value = copy.id;
}

const selected = computed(() => blocks.value.find((b) => b.id === selectedId.value) || null);
const selectedDef = computed(() => (selected.value ? BLOCK_DEFS[selected.value.type] : null));

function defaultItem(itemFields: any[]) {
  const o: any = {};
  itemFields.forEach((f) => (o[f.key] = ""));
  return o;
}
function addItem(block: any, field: any) {
  if (!block[field.key]) block[field.key] = [];
  block[field.key].push(defaultItem(field.itemFields));
}
function removeItem(block: any, field: any, idx: number) {
  block[field.key].splice(idx, 1);
}

// 拖拽排序
const dragIndex = ref<number | null>(null);
function onDragStart(i: number) {
  dragIndex.value = i;
}
function onDrop(i: number) {
  const from = dragIndex.value;
  if (from === null || from === i) return;
  const arr = blocks.value;
  const [t] = arr.splice(from, 1);
  arr.splice(i, 0, t);
  dragIndex.value = null;
}

// 导出
function download(content: string, name: string, type: string) {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
function exportJSON() {
  download(JSON.stringify(blocks.value, null, 2), "page.json", "application/json");
}
function escAttr(s: string) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
// 生成组件式 Vue 页面（导入项目内的 blocks 组件）
function buildVue(name: string, slug: string) {
  const imports = Object.keys(BLOCK_COMPONENTS)
    .map((t) => `import ${COMP_NAME[t]} from '../components/blocks/${COMP_NAME[t]}.vue'`)
    .join("\n");
  const loops = Object.keys(BLOCK_COMPONENTS)
    .map((t) => `    <${COMP_NAME[t]} v-for="b in byType('${t}')" :key="b.id" v-bind="b" />`)
    .join("\n");
  return `<script setup>
import { useHead } from "@vueuse/head"
${imports}

useHead({ title: "${escAttr(name)} | 希望工作室" })

const blocks = ${JSON.stringify(blocks.value, null, 2)}
const byType = (t) => blocks.filter((b) => b.type === t)
<\/script>

<template>
  <div class="min-h-screen bg-surface md3e-bg-ambient">
${loops}
  </div>
</template>
`;
}
function exportVue() {
  download(buildVue(pageSettings.value.name.trim() || "新页面", pageSlug.value), pageSlug.value + ".vue", "text/plain");
}

// ---- 直接写入工程（File System Access API，仅本地工具使用）----
async function fsWrite(dir: any, path: string, content: string) {
  const parts = path.split("/");
  let h = dir;
  for (let i = 0; i < parts.length - 1; i++) {
    h = await h.getDirectoryHandle(parts[i], { create: true });
  }
  const f = await h.getFileHandle(parts[parts.length - 1], { create: true });
  const w = await f.createWritable();
  await w.write(content);
  await w.close();
}
async function fsRead(dir: any, path: string): Promise<string> {
  const parts = path.split("/");
  let h = dir;
  for (const p of parts.slice(0, -1)) h = await h.getDirectoryHandle(p);
  const f = await h.getFileHandle(parts[parts.length - 1]);
  return await (await f.getFile()).text();
}
async function patchRoute(dir: any, slug: string, name: string) {
  const file = "src/router/index.ts";
  let c = await fsRead(dir, file);
  if (c.includes(`path: "/${slug}"`)) return; // 已存在则跳过
  const anchor = `  {\n    path: "/:pathMatch(.*)*",`;
  const route = `  {\n    path: "/${slug}",\n    name: "${slug}",\n    component: () => import("../views/${slug}.vue"),\n    meta: { title: "${escAttr(name)} | 希望工作室" },\n  },\n`;
  if (c.includes(anchor)) c = c.replace(anchor, route + anchor);
  await fsWrite(dir, file, c);
}
async function patchNav(dir: any, slug: string, name: string) {
  const file = "src/components/Navigation.vue";
  let c = await fsRead(dir, file);
  if (c.includes(`link: "/${slug}"`)) return;
  const anchor = `  { name: "归档官网", link: "/archive/" },`;
  const item = `  { name: "${escAttr(name)}", link: "/${slug}" },`;
  if (c.includes(anchor)) c = c.replace(anchor, `${anchor}\n${item}`);
  await fsWrite(dir, file, c);
}
async function saveToProject() {
  const name = pageSettings.value.name.trim() || "新页面";
  const slug = pageSlug.value;
  const picker = (window as any).showDirectoryPicker;
  if (typeof picker !== "function") {
    alert("当前浏览器不支持直接写入工程，已改为下载 Vue 文件，请手动放入 src/views/ 并补充路由与菜单。");
    exportVue();
    return;
  }
  try {
    const dir = await picker({ mode: "readwrite" });
    await fsWrite(dir, `src/views/${slug}.vue`, buildVue(name, slug));
    await patchRoute(dir, slug, name);
    if (pageSettings.value.showInMenu) await patchNav(dir, slug, name);
    alert(
      `已写入工程：\n  src/views/${slug}.vue\n  src/router/index.ts（路由 /${slug}）\n  src/components/Navigation.vue（菜单：${pageSettings.value.showInMenu ? name : "未勾选，未添加"}）`
    );
  } catch (e: any) {
    if (e && e.name === "AbortError") return; // 用户取消
    alert("写入失败：" + (e?.message || e));
  }
}
function save() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ blocks: blocks.value, page: pageSettings.value }));
}
function load() {
  if (typeof localStorage === "undefined") return;
  const s = localStorage.getItem(STORAGE_KEY);
  if (s) {
    try {
      const data = JSON.parse(s);
      if (data.blocks) blocks.value = data.blocks;
      if (data.page) pageSettings.value = { ...pageSettings.value, ...data.page };
    } catch {
      /* ignore */
    }
  }
}
function clearAll() {
  if (typeof window !== "undefined" && !window.confirm("确定清空当前页面？此操作不可撤销。")) return;
  blocks.value = [];
  selectedId.value = null;
  save();
}

watch(blocks, () => save(), { deep: true });
onMounted(() => load());
</script>

<template>
  <div class="min-h-screen bg-surface md3e-bg-ambient pt-16 d-flex flex-column">
    <!-- 工具栏 -->
    <div class="border-b border-gray-700 bg-gray-800/60 px-4 py-2 flex flex-wrap items-center gap-2">
      <span class="font-bold mr-2">页面编辑器</span>
      <button @click="save" class="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm">保存</button>
      <button @click="load" class="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm">读取</button>
      <span class="text-gray-500">|</span>
      <button @click="exportJSON" class="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm">导出 JSON</button>
      <button @click="exportVue" class="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm">导出 Vue</button>
      <button @click="saveToProject" class="px-3 py-1 rounded bg-green-600 hover:bg-green-500 text-white text-sm">保存到工程</button>
      <span class="text-gray-500">|</span>
      <button @click="clearAll" class="px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-sm">清空</button>
      <span class="ml-auto text-xs text-gray-500 hidden md:block"
        >组件式编辑器 · 拖拽左侧区块可排序 · 点击区块进行编辑</span
      >
    </div>

    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧：调色板 + 结构 -->
      <aside class="w-60 shrink-0 border-r border-gray-700 bg-gray-800/40 overflow-y-auto p-3">
        <div class="bg-gray-800/60 rounded-2xl p-3 mb-4">
          <h3 class="text-sm text-gray-400 mb-2">页面设置</h3>
          <label class="block text-xs text-gray-400 mb-1">页面名称（菜单显示）</label>
          <input
            v-model="pageSettings.name"
            class="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white mb-2"
          />
          <label class="block text-xs text-gray-400 mb-1">路由 / 文件名（如 about-us）</label>
          <input
            v-model="pageSettings.slug"
            :placeholder="slugify(pageSettings.name)"
            class="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white mb-2"
          />
          <label class="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" v-model="pageSettings.showInMenu" /> 在菜单中显示
          </label>
          <p class="text-[11px] text-gray-500 mt-2">路由：/<span class="text-blue-300">{{ pageSlug }}</span></p>
        </div>

        <h3 class="text-sm text-gray-400 mb-2">添加区块</h3>
        <div class="grid grid-cols-2 gap-2 mb-4">
          <button
            v-for="(def, type) in BLOCK_DEFS"
            :key="type"
            @click="addBlock(type)"
            class="text-xs px-2 py-2 rounded bg-gray-700/60 hover:bg-gray-700 text-left"
          >
            {{ def.label }}
          </button>
        </div>

        <h3 class="text-sm text-gray-400 mb-2">页面结构 ({{ blocks.length }})</h3>
        <ul class="space-y-1">
          <li
            v-for="(b, i) in blocks"
            :key="b.id"
            draggable="true"
            @dragstart="onDragStart(i)"
            @dragover.prevent
            @drop="onDrop(i)"
            @click="selectedId = b.id"
            :class="[
              'flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-sm',
              selectedId === b.id ? 'bg-blue-500/30 text-white' : 'hover:bg-gray-700/60 text-gray-300',
            ]"
          >
            <span class="truncate">{{ BLOCK_DEFS[b.type].label }}</span>
            <span class="flex gap-1 shrink-0">
              <button @click.stop="move(-1, b.id)" class="px-1 hover:text-white" title="上移">↑</button>
              <button @click.stop="move(1, b.id)" class="px-1 hover:text-white" title="下移">↓</button>
              <button @click.stop="duplicateBlock(b.id)" class="px-1 hover:text-white" title="复制">⧉</button>
              <button @click.stop="removeBlock(b.id)" class="px-1 text-red-300 hover:text-red-200" title="删除">✕</button>
            </span>
          </li>
        </ul>
        <p v-if="!blocks.length" class="text-xs text-gray-600 mt-2">还没有区块，点击上方按钮添加。</p>
      </aside>

      <!-- 中间：实时预览（渲染真实 Vue 组件）-->
      <main class="flex-1 overflow-y-auto bg-surface">
        <div v-if="!blocks.length" class="h-full d-flex align-center justify-center text-medium-emphasis">
          预览区 · 从左侧添加区块开始
        </div>
        <div
          v-for="b in blocks"
          :key="b.id"
          @click="selectedId = b.id"
          :class="['relative cursor-pointer group', selectedId === b.id ? 'ring-2 ring-blue-400' : '']"
        >
          <component :is="BLOCK_COMPONENTS[b.type]" v-bind="b" />
          <span
            v-if="selectedId === b.id"
            class="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded"
            >编辑中</span
          >
        </div>
      </main>

      <!-- 右侧：检查器 -->
      <aside
        v-if="selected"
        class="w-80 shrink-0 border-l border-gray-700 bg-gray-800/40 overflow-y-auto p-3"
      >
        <h3 class="text-sm text-gray-400 mb-2">编辑：{{ selectedDef.label }}</h3>
        <div v-for="field in selectedDef.fields" :key="field.key" class="mb-3">
          <label class="block text-xs text-gray-400 mb-1">{{ field.label }}</label>
          <input
            v-if="field.type === 'text' || field.type === 'number'"
            v-model="selected[field.key]"
            :type="field.type"
            class="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
          />
          <textarea
            v-else-if="field.type === 'textarea'"
            v-model="selected[field.key]"
            rows="3"
            class="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
          ></textarea>
          <div v-else-if="field.type === 'list'" class="space-y-2">
            <div v-for="(item, idx) in selected[field.key]" :key="idx" class="border border-gray-700 rounded p-2">
              <div v-for="sub in field.itemFields" :key="sub.key" class="mb-1">
                <label class="block text-[11px] text-gray-500">{{ sub.label }}</label>
                <input
                  v-if="sub.type !== 'textarea'"
                  v-model="item[sub.key]"
                  class="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                />
                <textarea
                  v-else
                  v-model="item[sub.key]"
                  rows="2"
                  class="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                ></textarea>
              </div>
              <button @click="removeItem(selected, field, idx)" class="text-xs text-red-300 hover:text-red-200">
                删除此项
              </button>
            </div>
            <button @click="addItem(selected, field)" class="text-xs text-blue-300 hover:text-blue-200">
              + 添加一项
            </button>
          </div>
        </div>
      </aside>
      <aside
        v-else
        class="w-80 shrink-0 border-l border-gray-700 bg-gray-800/40 flex items-center justify-center text-gray-600 text-sm p-4 text-center"
      >
        在左侧或预览区选择一个区块进行编辑
      </aside>
    </div>
  </div>
</template>
