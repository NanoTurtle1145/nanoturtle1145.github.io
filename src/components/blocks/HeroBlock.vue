<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
}>();
</script>

<template>
  <section class="py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
      <div class="flex-1">
        <h1 class="text-4xl font-bold text-white mb-2">{{ title }}</h1>
        <p class="text-xl text-gray-300 mb-6">{{ subtitle }}</p>
        <a
          :href="buttonLink"
          class="inline-block border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-[#00a2e8] hover:border-[#00a2e8] transition-all"
          >{{ buttonText }}</a
        >
      </div>
      <div class="flex-1">
        <img :src="image" alt="" class="rounded-2xl w-full object-cover" />
      </div>
    </div>
  </section>
</template>
