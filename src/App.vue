<script setup lang="ts">
import { ref } from "vue";
import GovHeader from "./components/GovHeader.vue";
import Footer from "./components/Footer.vue";

// 回到顶部 FAB
const showFab = ref(false);

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
  <v-app>
    <GovHeader />
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="md3e-route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    <Footer />

    <!-- 回到顶部 -->
    <v-fab
      v-model="showFab"
      appear
      icon="mdi-arrow-up"
      location="bottom end"
      offset
      color="primary-container"
      aria-label="回到顶部"
      @click="scrollTop"
    />
  </v-app>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* 路由过渡：轻微淡入 + 上移 */
.md3e-route-enter-active {
  transition: opacity var(--md3e-duration-medium) var(--md3e-motion-emphasized),
    transform var(--md3e-duration-medium) var(--md3e-motion-emphasized-decelerate);
}
.md3e-route-leave-active {
  transition: opacity var(--md3e-duration-short) var(--md3e-motion-emphasized-accelerate);
}
.md3e-route-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.md3e-route-leave-to {
  opacity: 0;
}
</style>
