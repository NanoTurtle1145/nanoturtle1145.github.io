<script setup lang="ts">
defineProps<{
  title?: string;
  buttonText?: string;
  link?: string;
}>();
</script>

<template>
  <!-- MD3E CTA：渐变容器（rich color）+ 主色行动按钮 -->
  <section class="py-12 px-4">
    <div
      class="mx-auto text-center pa-10"
      style="
        max-width: 1080px;
        border-radius: var(--md3e-shape-xl);
        background: linear-gradient(
          135deg,
          rgb(var(--v-theme-primary-container), 0.65),
          rgb(var(--v-theme-tertiary-container), 0.55)
        );
        border: 1px solid rgb(var(--v-theme-outline-variant), 0.4);
      "
    >
      <h2 class="md3e-display text-h4 text-on-surface mb-6">{{ title }}</h2>
      <a v-if="link" :href="link" class="text-decoration-none d-inline-block">
        <v-btn color="primary" size="large" append-icon="mdi-arrow-right" class="md3e-nudge">
          {{ buttonText }}
        </v-btn>
      </a>
    </div>
  </section>
</template>
