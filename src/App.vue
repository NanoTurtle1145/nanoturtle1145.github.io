<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import GovHeader from "./components/GovHeader.vue";
import Footer from "./components/Footer.vue";
import { useThemeMode } from "./composables/useThemeMode";

const { initFromDocument } = useThemeMode();

// 回到顶部 FAB
const showFab = ref(false);

function onScroll() {
  showFab.value = typeof window !== "undefined" && window.scrollY > 480;
}
function scrollTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- 滚动入场动画：观察 main 下的区块，进入视口时添加 .is-visible ---- */
let revealObserver: IntersectionObserver | null = null;
if (typeof window !== "undefined" && "IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
}

function observeReveals() {
  if (!revealObserver) return;
  document
    .querySelectorAll("main section[id]")
    .forEach((el) => {
      if (!el.classList.contains("is-visible")) revealObserver?.observe(el);
    });
}

const route = useRoute();
onMounted(() => {
  initFromDocument(); // 与 html[data-theme] 对齐，避免主题闪烁
  if (typeof window !== "undefined") window.addEventListener("scroll", onScroll, { passive: true });
  // 首次渲染可能尚未完成，给一帧缓冲
  requestAnimationFrame(observeReveals);
});
// 路由切换后重新观察（等 md3e-route 过渡结束）
watch(
  () => route.fullPath,
  () => setTimeout(observeReveals, 450)
);
</script>

<template>
  <v-app>
    <GovHeader />
    <v-main>
      <!--
        <Transition> 要求单一根节点。此前直接包 <component :is>，
        一旦路由组件是多根（fragment，例如首页由 4 个区块组成），
        离开时过渡状态机会卡死：旧内容移除后新路由再也不插入，
        表现为点导航后正文空白、必须 F5 才能恢复。
        这里固定包一层带 key 的单根容器，路由组件无论几个根都安全；
        key 用 path（不含 query），避免阅读器切章节时被整个卸载重建。
      -->
      <router-view v-slot="{ Component, route }">
        <transition name="md3e-route" mode="out-in">
          <div :key="route.path" class="route-view">
            <component :is="Component" />
          </div>
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
