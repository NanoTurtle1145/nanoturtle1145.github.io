<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import GovHeader from "./components/GovHeader.vue";
import Footer from "./components/Footer.vue";
import { useThemeMode } from "./composables/useThemeMode";

const { initFromDocument } = useThemeMode();

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
  </v-app>
</template>

<style>
html {
  scroll-behavior: smooth;
}

/* 路由过渡：淡入 + 轻微上浮 */
.md3e-route-enter-active {
  transition: opacity 0.4s cubic-bezier(0.05, 0.7, 0.1, 1),
    transform 0.5s cubic-bezier(0.05, 0.7, 0.1, 1);
}
.md3e-route-leave-active {
  transition: opacity 0.18s cubic-bezier(0.3, 0, 0.8, 0.15);
}
.md3e-route-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.md3e-route-leave-to {
  opacity: 0;
}
</style>
