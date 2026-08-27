<script setup lang="ts">
import { ref } from "vue";

export interface ProjectSlide {
  title: string;
  desc: string;
  link: string;
  external: boolean;
  image?: string; // 可选：项目配图，覆盖在 banner 上
  gradient?: string; // 可选：无配图时的背景渐变（内联 CSS 渐变）
}

defineProps<{
  items: ProjectSlide[];
  interval?: number; // 自动切换间隔（毫秒）
}>();

const current = ref(0);
const paused = ref(false);
</script>

<template>
  <v-carousel
    v-model="current"
    :interval="interval ?? 5000"
    :cycle="items.length > 1 && !paused"
    height="514"
    show-arrows="hover"
    hide-delimiters
    class="rounded-0 overflow-hidden"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <v-carousel-item v-for="(item, i) in items" :key="i">
      <div class="position-relative w-100 h-100 bg-surface-container-highest">
        <!-- 背景：配图或渐变 -->
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.title"
          class="position-absolute w-100 h-100 object-cover object-center select-none"
          draggable="false"
        />
        <div
          v-else
          class="position-absolute w-100 h-100"
          :style="item.gradient ? { background: item.gradient } : undefined"
        ></div>

        <!-- 底部暗化，保证文字可读 -->
        <div
          class="position-absolute w-100 h-100"
          style="background: linear-gradient(to top, rgba(0,0,0,.8), rgba(0,0,0,.3), transparent)"
        ></div>

        <!-- 文案 + 按钮 -->
        <div
          class="position-absolute w-100 h-100 d-flex flex-column justify-end pa-8 pa-lg-12"
        >
          <div class="text-headline-large text-lg-display-small font-weight-bold text-white mb-3">
            {{ item.title }}
          </div>
          <div class="text-body-1 text-lg-subtitle-1 text-grey-lighten-3 mb-5" style="max-width: 42rem">
            {{ item.desc }}
          </div>
          <component
            :is="item.external ? 'a' : 'router-link'"
            :href="item.external ? item.link : undefined"
            :to="item.external ? undefined : item.link"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener' : undefined"
            class="align-self-start"
          >
            <v-btn color="primary" prepend-icon="mdi-open-in-new" v-if="item.external">
              查看项目
            </v-btn>
            <v-btn color="primary" v-else>查看项目</v-btn>
          </component>
        </div>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>
