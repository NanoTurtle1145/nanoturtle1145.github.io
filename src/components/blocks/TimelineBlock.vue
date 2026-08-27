<script setup lang="ts">
defineProps<{
  title?: string;
  items?: { date: string; text: string }[];
}>();
</script>

<template>
  <!-- MD3E 时间线：日期 mono 主色 + 内容容器分组 -->
  <section class="py-12 px-4">
    <div class="mx-auto" style="max-width: 896px">
      <h2 class="gov-header-1 mb-6">{{ title }}</h2>
      <div class="d-flex flex-column ga-3">
        <v-card
          v-for="(it, i) in items"
          :key="i"
          elevation="0"
          hover
          class="pa-2"
        >
          <v-card-text class="d-flex flex-column flex-sm-row align-sm-baseline ga-2 ga-sm-5">
            <time class="text-primary text-no-wrap" style="font-family: var(--md3e-font-mono); font-weight: 600">
              {{ it.date }}
            </time>
            <span class="text-body-1 text-medium-emphasis">{{ it.text }}</span>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </section>
</template>
