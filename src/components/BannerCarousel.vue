<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  images: string[];
  interval?: number; // ms between auto-advances
  alt?: string;
}>();

const current = ref(0);
const paused = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const count = () => Math.max(props.images.length, 1);

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
  if (paused.value || props.images.length <= 1) return;
  timer = setInterval(next, props.interval ?? 4000);
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
    class="relative w-full overflow-hidden rounded-2xl bg-gray-900/40"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <Transition name="fade" mode="out-in">
      <img
        :key="current"
        :src="images[current]"
        :alt="alt ?? 'banner'"
        class="w-full h-full max-h-[514px] object-contain object-center select-none"
        draggable="false"
      />
    </Transition>

    <!-- 左右切换 -->
    <button
      v-if="images.length > 1"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center transition-colors"
      aria-label="上一张"
      @click.stop="prev"
    >
      <svg class="w-5 h-5" viewBox="0 0 320 512" fill="currentColor">
        <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
    </button>
    <button
      v-if="images.length > 1"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center transition-colors"
      aria-label="下一张"
      @click.stop="next"
    >
      <svg class="w-5 h-5" viewBox="0 0 320 512" fill="currentColor">
        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
      </svg>
    </button>

    <!-- 指示点 -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
    >
      <button
        v-for="(img, i) in images"
        :key="i"
        class="w-2.5 h-2.5 rounded-full transition-all"
        :class="i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'"
        :aria-label="`第 ${i + 1} 张`"
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
