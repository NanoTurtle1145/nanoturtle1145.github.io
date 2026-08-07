<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({ title: "页面未找到 | 希望工作室" });
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 flex items-center justify-center px-4"
  >
    <div class="text-center py-24">
      <p class="text-7xl font-bold text-white mb-4">404</p>
      <p class="text-gray-400 mb-8">页面不存在，或已随旧站一起归档。</p>
      <router-link
        to="/"
        class="inline-block border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-[#00a2e8] hover:border-[#00a2e8] transition-all duration-200"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>
