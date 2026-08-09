<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

export interface ProjectSlide {
  title: string;
  desc: string;
  link: string;
  external: boolean;
  image?: string; // 可选：项目配图，覆盖在 banner 上
  gradient?: string; // 可选：无配图时的背景渐变（Tailwind 类）
}

const props = defineProps<{
  items: ProjectSlide[];
  interval?: number; // 自动切换间隔（毫秒）
}>();

const current = ref(0);
const paused = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const count = () => Math.max(props.items.length, 1);

function go(i: number) {
  const n = count();
  current.value = ((i % n) + n) % n;
}
function next() {
  go(current.value + 1);
}
function prev() {
  go(current.value - 1);
}
function start() {
  stop();
  if (paused.value || props.items.length <= 1) return;
  timer = setInterval(next, props.interval ?? 5000);
}
function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
function onEnter() {
  paused.value = true;
  stop();
}
function onLeave() {
  paused.value = false;
  start();
}

onMounted(start);
onBeforeUnmount(stop);
</script>

<template>
  <div
    class="relative w-full h-[514px] max-h-[514px] overflow-hidden rounded-2xl bg-gray-900"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <Transition name="fade" mode="out-in">
      <div :key="current" class="absolute inset-0">
        <!-- 背景：配图或渐变 -->
        <img
          v-if="items[current]?.image"
          :src="items[current].image"
          :alt="items[current].title"
          class="absolute inset-0 w-full h-full object-cover object-center select-none"
          draggable="false"
        />
        <div
          v-else
          class="absolute inset-0"
          :class="items[current]?.gradient ?? 'bg-gradient-to-br from-gray-800 to-gray-950'"
        ></div>

        <!-- 底部暗化，保证文字可读 -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
        ></div>

        <!-- 文案 + 按钮 -->
        <div class="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
          <h2 class="text-3xl lg:text-5xl font-bold text-white mb-3 drop-shadow">
            {{ items[current]?.title }}
          </h2>
          <p class="text-base lg:text-lg text-gray-200 max-w-2xl mb-5 drop-shadow">
            {{ items[current]?.desc }}
          </p>
          <component
            :is="items[current]?.external ? 'a' : 'router-link'"
            :href="items[current]?.external ? items[current].link : undefined"
            :to="items[current]?.external ? undefined : items[current]?.link"
            :target="items[current]?.external ? '_blank' : undefined"
            :rel="items[current]?.external ? 'noopener' : undefined"
            class="self-start inline-flex items-center gap-1 bg-[#00a2e8] hover:bg-[#0089c2] text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            查看项目
            <svg
              v-if="items[current]?.external"
              class="w-4 h-4"
              viewBox="0 0 384 512"
              fill="currentColor"
            >
              <path
                d="M320 464c8.8 0 16-7.2 16-16V160c0-5.1-2.4-9.9-6.5-13L216.9 41.5c-3.6-3.9-8.4-6.5-13.5-6.5H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320zM224 64l64 64H224V64zM64 416H320V160H192c-8.8 0-16-7.2-16-16V96H64V416z"
              />
            </svg>
          </component>
        </div>
      </div>
    </Transition>

    <!-- 左右切换 -->
    <button
      v-if="items.length > 1"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center transition-colors"
      aria-label="上一个项目"
      @click.stop="prev"
    >
      <svg class="w-5 h-5" viewBox="0 0 320 512" fill="currentColor">
        <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
    </button>
    <button
      v-if="items.length > 1"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center transition-colors"
      aria-label="下一个项目"
      @click.stop="next"
    >
      <svg class="w-5 h-5" viewBox="0 0 320 512" fill="currentColor">
        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
      </svg>
    </button>

    <!-- 指示点 -->
    <div
      v-if="items.length > 1"
      class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
    >
      <button
        v-for="(it, i) in items"
        :key="i"
        class="w-2.5 h-2.5 rounded-full transition-all"
        :class="i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'"
        :aria-label="`第 ${i + 1} 个项目：${it.title}`"
        @click.stop="go(i)"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
