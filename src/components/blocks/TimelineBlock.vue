<script setup lang="ts">
defineProps<{
  title?: string;
  items?: { date: string; text: string }[];
}>();
</script>

<template>
  <section class="py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-white mb-6">{{ title }}</h2>
      <div class="space-y-4">
        <div
          v-for="(it, i) in items"
          :key="i"
          class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
        >
          <time class="text-blue-300 font-mono whitespace-nowrap">{{ it.date }}</time>
          <p class="text-gray-400">{{ it.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
