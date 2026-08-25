<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "加入我们 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室成员招募。" }],
});
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 896px">
    <div class="mb-8">
      <div class="md3e-eyebrow mb-1">加入我们 · Join Us</div>
      <div class="md3e-display-sm text-h3 text-on-surface mb-2">加入我们</div>
      <div class="text-body-1 text-medium-emphasis">Under Construction…</div>
    </div>

    <v-card elevation="0">
      <v-card-text class="pa-6 pa-sm-10">
        <div class="text-h6 font-weight-bold text-on-surface mb-4">联系我们</div>
        <div class="text-body-1 text-medium-emphasis" style="line-height: 2">
          Email me：
          <a
            href="mailto:guixiabaifo2022@outlook.com"
            class="text-primary text-decoration-underline text-break"
          >
            guixiabaifo2022@outlook.com
          </a>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>


