<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";

const navName = ref("希望工作室");
const route = useRoute();

watch(
  () => route.meta.navName,
  (newName) => {
    navName.value = newName ? (newName as string) : "希望工作室";
  },
  { immediate: true }
);

// 回到顶部 FAB（MD3E 形态：滚动后弹性浮现，悬停时扩展出文字标签）
const showFab = ref(false);
const fabExtended = ref(false);

function onScroll() {
  showFab.value = typeof window !== "undefined" && window.scrollY > 480;
}
function scrollTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
if (typeof window !== "undefined") {
  window.addEventListener("scroll", onScroll, { passive: true });
}
</script>

<template>
  <v-app class="md3e-bg-ambient">
    <Navigation :nav-name="navName" />
    <v-main>
      <router-view v-slot="{ Component }">
        <!-- MD3E 路由过渡：进入时弹性上升（spatial spring），离开时加速淡出 -->
        <transition name="md3e-route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <Footer />

    <!-- 回到顶部：MD3E 弹性浮现 + 悬停扩展（ToggleFAB 的形态变体） -->
    <v-fab
      v-model="showFab"
      :extended="fabExtended"
      appear
      icon="mdi-arrow-up"
      location="bottom end"
      offset
      color="primary-container"
      aria-label="回到顶部"
      @mouseenter="fabExtended = true"
      @mouseleave="fabExtended = false"
      @click="scrollTop"
    >
      回到顶部
    </v-fab>
  </v-app>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* 路由过渡：MD3E spring-based motion */
.md3e-route-enter-active {
  transition: opacity var(--md3e-duration-medium) var(--md3e-motion-emphasized),
    transform var(--md3e-duration-medium) var(--md3e-motion-spring);
}
.md3e-route-leave-active {
  transition: opacity var(--md3e-duration-short) var(--md3e-motion-emphasized-accelerate),
    transform var(--md3e-duration-short) var(--md3e-motion-emphasized-accelerate);
}
.md3e-route-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.995);
}
.md3e-route-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* FAB 悬停扩展的弹性过渡 */
.v-fab__content {
  transition: opacity var(--md3e-duration-short) var(--md3e-motion-emphasized);
}
</style>
