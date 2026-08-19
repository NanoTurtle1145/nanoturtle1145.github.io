<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({ title: "页面未找到 | 希望工作室" });
</script>

<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 70vh">
    <div class="text-center py-24">
      <div class="text-h1 font-weight-bold text-on-surface mb-4">404</div>
      <div class="text-body-1 text-medium-emphasis mb-8">页面不存在，或已随旧站一起归档。</div>
      <router-link to="/" class="text-decoration-none">
        <v-btn color="primary" size="large" variant="outlined">返回首页</v-btn>
      </router-link>
    </div>
  </v-container>
</template>
