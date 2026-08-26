<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
}>();
</script>

<template>
  <section class="py-16 px-4">
    <div class="mx-auto md3e-group pa-6 pa-md-10" style="max-width: 1080px">
      <div class="d-flex flex-column flex-md-row align-center ga-8">
        <div class="flex-1">
          <div class="text-subtitle-1 text-tertiary font-weight-medium mb-3">
            希望工作室 · Hope Studio
          </div>
          <h1 class="text-h3 text-on-surface mb-3" style="font-weight: 700">{{ title }}</h1>
          <p class="text-body-1 text-medium-emphasis mb-7" style="max-width: 34rem">
            {{ subtitle }}
          </p>
          <a
            v-if="buttonLink"
            :href="buttonLink"
            class="text-decoration-none d-inline-block"
          >
            <v-btn color="primary" size="large" append-icon="mdi-arrow-right">
              {{ buttonText }}
            </v-btn>
          </a>
        </div>
        <div class="flex-1 w-100">
          <v-img
            v-if="image"
            :src="image"
            alt=""
            class="rounded-xl"
            max-height="360"
            cover
          />
        </div>
      </div>
    </div>
  </section>
</template>
