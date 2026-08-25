<script setup lang="ts">
defineProps<{
  title?: string;
  content?: string;
}>();
</script>

<template>
  <!-- MD3E 文字段落：surfaceContainer 分组容器 + 编辑式排版 -->
  <section class="py-12 px-4">
    <div class="mx-auto md3e-group pa-6 pa-md-10" style="max-width: 896px">
      <h2 v-if="title" class="md3e-display-sm text-h5 text-on-surface mb-4">
        {{ title }}
      </h2>
      <p class="text-body-1 text-medium-emphasis mb-0" style="line-height: 2; white-space: pre-line">
        {{ content }}
      </p>
    </div>
  </section>
</template>
