<script setup lang="ts">
defineProps<{
  title?: string;
  buttonText?: string;
  link?: string;
}>();
</script>

<template>
  <section class="py-12 px-4">
    <div class="max-w-5xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl p-10 text-center">
      <h2 class="text-3xl font-bold text-white mb-6">{{ title }}</h2>
      <a
        :href="link"
        class="inline-block border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-[#00a2e8] hover:border-[#00a2e8] transition-all"
        >{{ buttonText }}</a
      >
    </div>
  </section>
</template>
