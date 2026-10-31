<script setup lang="ts">
import { onMounted } from "vue";

import GovHeader from "./components/GovHeader.vue";
import Footer from "./components/Footer.vue";
import { useThemeMode } from "./composables/useThemeMode";

const { initFromDocument } = useThemeMode();

onMounted(() => {
  initFromDocument(); // 与 html[data-theme] 对齐，避免主题闪烁
});
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

/* 路由过渡：只做 120ms 淡入，不位移 */
.md3e-route-enter-active {
  transition: opacity 0.12s ease;
}
.md3e-route-leave-active {
  transition: opacity 0.1s ease;
}
.md3e-route-enter-from {
  opacity: 0;
}
.md3e-route-leave-to {
  opacity: 0;
}
</style>
