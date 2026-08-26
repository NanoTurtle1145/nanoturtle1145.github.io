<script setup lang="ts">
defineProps<{
  title?: string;
  buttonText?: string;
  link?: string;
}>();
</script>

<template>
  <section class="py-12 px-4">
    <div class="mx-auto md3e-group text-center pa-10" style="max-width: 1080px">
      <h2 class="text-h4 text-on-surface mb-6" style="font-weight: 700">{{ title }}</h2>
      <a v-if="link" :href="link" class="text-decoration-none d-inline-block">
        <v-btn color="primary" size="large" append-icon="mdi-arrow-right">
          {{ buttonText }}
        </v-btn>
      </a>
    </div>
  </section>
</template>
