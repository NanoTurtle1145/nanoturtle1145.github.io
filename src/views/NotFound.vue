<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({ title: "页面未找到 | 希望工作室" });
</script>

<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 70vh">
    <div class="text-center py-24">
      <!-- Hero 时刻：大号渐变数字 + 弹性入场 -->
      <div
        class="md3e-display mb-4 md3e-rise-in"
        style="
          font-size: clamp(5rem, 16vw, 9rem);
          background: linear-gradient(
            135deg,
            rgb(var(--v-theme-primary)),
            rgb(var(--v-theme-tertiary))
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        "
      >
        404
      </div>
      <div class="text-body-1 text-medium-emphasis mb-8 md3e-rise-in" style="animation-delay: 120ms">
        页面不存在，或已随旧站一起归档。
      </div>
      <div class="md3e-rise-in" style="animation-delay: 240ms">
        <router-link to="/" class="text-decoration-none">
          <v-btn color="primary" size="large" variant="outlined">返回首页</v-btn>
        </router-link>
      </div>
    </div>
  </v-container>
</template>
