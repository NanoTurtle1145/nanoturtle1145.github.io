<script setup lang="ts">
export interface MarqueeItem {
  title: string;
  desc: string;
  link: string;
  external: boolean;
}

defineProps<{
  items: MarqueeItem[];
  duration?: number; // seconds for one full loop
}>();
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <!-- 左右渐隐遮罩 -->
    <div class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
    <div class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

    <div class="marquee-track flex gap-6 w-max hover:[animation-play-state:paused]">
      <template v-for="pass in 2" :key="pass">
        <component
          :is="item.external ? 'a' : 'router-link'"
          v-for="(item, i) in items"
          :key="pass + '-' + i"
          :to="item.external ? undefined : item.link"
          :href="item.external ? item.link : undefined"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener' : undefined"
          class="shrink-0 w-80 bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 hover:border-cyan-400/40 transition-colors"
        >
          <h3 class="text-xl font-bold text-white mb-2">{{ item.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ item.desc }}</p>
          <span class="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300 transition-colors">
            {{ item.external ? "前往 →" : "了解更多 →" }}
          </span>
        </component>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  animation: marquee 30s linear infinite;
}
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
