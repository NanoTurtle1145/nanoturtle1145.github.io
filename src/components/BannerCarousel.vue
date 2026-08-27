<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  images: string[];
  interval?: number; // ms between auto-advances
  alt?: string;
}>();

const current = ref(0);
const paused = ref(false);
</script>

<template>
  <v-carousel
    v-model="current"
    :interval="interval ?? 4000"
    :cycle="images.length > 1 && !paused"
    height="514"
    show-arrows="hover"
    hide-delimiters
    class="rounded-0 overflow-hidden"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <v-carousel-item v-for="(img, i) in images" :key="i">
      <v-img
        :src="img"
        :alt="alt ?? 'banner'"
        height="100%"
        cover
        class="select-none"
        draggable="false"
      />
    </v-carousel-item>
  </v-carousel>
</template>
