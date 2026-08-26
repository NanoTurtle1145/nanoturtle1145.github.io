<script setup lang="ts">
defineProps<{
  title?: string;
  items?: { name: string; role: string; desc: string; avatar?: string }[];
}>();
</script>

<template>
  <!-- MD3E 成员网格：头像形状多样（圆 / 圆角），角色用 tertiary 强调 -->
  <section class="py-12 px-4">
    <div class="mx-auto" style="max-width: 1080px">
      <h2 class="text-h4 text-on-surface mb-6" style="font-weight: 700">{{ title }}</h2>
      <div
        style="
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        "
      >
        <v-card v-for="(it, i) in items" :key="i" elevation="0" hover class="pa-2">
          <v-card-text>
            <v-avatar
              v-if="it.avatar"
              size="72"
              :rounded="i % 2 === 0 ? 'lg' : 'circle'"
              class="mb-3"
            >
              <v-img :src="it.avatar" alt="" />
            </v-avatar>
            <div
              v-else
              class="d-inline-flex align-center justify-center mb-3"
              style="
                width: 72px;
                height: 72px;
                border-radius: 50%;
                background: rgb(var(--v-theme-primary-container));
                color: rgb(var(--v-theme-on-primary-container));
                font-size: 1.5rem;
                font-weight: 700;
              "
            >
              {{ (it.name || "?").charAt(0) }}
            </div>
            <div class="text-h6 font-weight-bold text-on-surface mb-1">
              {{ it.name }}
            </div>
            <div class="text-body-2 text-tertiary mb-3">{{ it.role }}</div>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ it.desc }}</p>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </section>
</template>
