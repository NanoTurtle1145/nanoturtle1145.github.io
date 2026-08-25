<script setup lang="ts">
defineProps<{
  title?: string;
  columns?: number;
  items?: { title: string; desc: string; link?: string }[];
}>();
</script>

<template>
  <!-- MD3E 特性网格：rich color（序号徽标用 primary/tertiary 交替）+ 弹性卡片 -->
  <section class="py-12 px-4">
    <div class="mx-auto" style="max-width: 1080px">
      <h2 class="md3e-display-sm text-h4 text-on-surface mb-6">{{ title }}</h2>
      <div
        :style="{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: `repeat(${columns || 2}, minmax(0, 1fr))`,
        }"
      >
        <v-card
          v-for="(it, i) in items"
          :key="i"
          elevation="0"
          hover
          class="pa-2"
        >
          <v-card-text>
            <div
              class="d-inline-flex align-center justify-center font-weight-bold mb-4"
              :class="i % 2 === 0 ? 'text-primary' : 'text-tertiary'"
              style="font-family: var(--md3e-font-mono); font-size: 0.9rem"
            >
              {{ String(i + 1).padStart(2, "0") }}
            </div>
            <div class="text-h6 font-weight-bold text-on-surface mb-2">
              {{ it.title }}
            </div>
            <p class="text-body-2 text-medium-emphasis mb-3">{{ it.desc }}</p>
            <a
              v-if="it.link"
              :href="it.link"
              class="text-primary text-decoration-none md3e-nudge d-inline-flex align-center"
            >
              了解更多
              <v-icon icon="mdi-arrow-right" size="small" class="ml-1" />
            </a>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </section>
</template>
