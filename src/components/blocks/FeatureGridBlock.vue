<script setup lang="ts">
defineProps<{
  title?: string;
  columns?: number;
  items?: { title: string; desc: string; link?: string }[];
}>();
</script>

<template>
  <section class="py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-4xl font-bold text-white mb-6">{{ title }}</h2>
      <div class="grid gap-6" :style="{ gridTemplateColumns: `repeat(${columns || 2}, minmax(0, 1fr))` }">
        <div
          v-for="(it, i) in items"
          :key="i"
          class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6"
        >
          <h3 class="text-xl font-bold text-white mb-2">{{ it.title }}</h3>
          <p class="text-gray-400 mb-3">{{ it.desc }}</p>
          <a
            v-if="it.link"
            :href="it.link"
            class="text-blue-400 hover:text-blue-300 transition-colors"
            >了解更多 →</a
          >
        </div>
      </div>
    </div>
  </section>
</template>
