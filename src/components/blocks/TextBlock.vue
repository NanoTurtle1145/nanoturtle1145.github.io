<script setup lang="ts">
defineProps<{
  title?: string;
  content?: string;
}>();
</script>

<template>
  <section class="py-12 px-4">
    <div class="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-10">
      <h2 v-if="title" class="text-2xl font-bold text-white mb-4">{{ title }}</h2>
      <p class="text-gray-400 leading-8 whitespace-pre-line">{{ content }}</p>
    </div>
  </section>
</template>
