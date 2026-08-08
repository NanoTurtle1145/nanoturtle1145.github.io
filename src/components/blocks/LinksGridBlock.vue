<script setup lang="ts">
defineProps<{
  title?: string;
  items?: { name: string; url: string; desc: string }[];
}>();
</script>

<template>
  <section class="py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-4xl font-bold text-white mb-2">{{ title }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <a
          v-for="(it, i) in items"
          :key="i"
          :href="it.url"
          target="_blank"
          rel="noopener"
          class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 hover:bg-gray-800 transition-colors"
        >
          <h2 class="text-xl font-bold text-white mb-2">{{ it.name }}</h2>
          <p class="text-gray-400 mb-3">{{ it.desc }}</p>
          <p class="text-sm text-blue-400 break-all">{{ it.url }}</p>
        </a>
      </div>
    </div>
  </section>
</template>
