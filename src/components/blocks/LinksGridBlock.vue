<script setup lang="ts">
defineProps<{
  title?: string;
  items?: { name: string; url: string; desc: string }[];
}>();
</script>

<template>
  <!-- MD3E 链接卡片：surfaceContainerLowest 卡片 + 弹簧抬升 -->
  <section class="py-12 px-4">
    <div class="mx-auto" style="max-width: 1080px">
      <h2 class="gov-header-1 mb-2">{{ title }}</h2>
      <div
        style="
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        "
      >
        <a
          v-for="(it, i) in items"
          :key="i"
          :href="it.url"
          target="_blank"
          rel="noopener"
          class="text-decoration-none"
        >
          <v-card elevation="0" hover class="h-100 pa-2">
            <v-card-text>
              <div class="text-title-medium font-weight-bold text-on-surface mb-2">
                {{ it.name }}
              </div>
              <p class="text-body-2 text-medium-emphasis mb-3">{{ it.desc }}</p>
              <div class="text-caption text-primary text-break">{{ it.url }}</div>
            </v-card-text>
          </v-card>
        </a>
      </div>
    </div>
  </section>
</template>
