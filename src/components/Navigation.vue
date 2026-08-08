<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

const isOpen = ref(false);
const route = useRoute();

const menuItems = ref([
  { name: "首页", link: "/" },
  { name: "文章", link: "/posts" },
  { name: "项目", link: "/projects" },
  { name: "成员", link: "/members" },
  { name: "关于我们", link: "/about" },
  { name: "加入我们", link: "/join" },
  { name: "友情链接", link: "/friends" },
  { name: "页面编辑器", link: "/editor", devOnly: true },
  { name: "归档官网", link: "/archive/" },
]);

// 页面编辑器仅在本地（localhost）显示，不发布到生产站点
const isLocal =
  typeof location !== "undefined" &&
  (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const menu = computed(() =>
  menuItems.value.filter((i) => !(i.devOnly && !isLocal))
);

// 归档站是静态 HTML，需用原生 <a> 直接跳转，不能走 vue-router
const isRawLink = (link: string) => link.startsWith("http") || link.startsWith("/archive");

// 首页 "/" 是其他所有路径的前缀，需用精确匹配，否则会常驻高亮
const isActive = (link: string) =>
  link === "/" ? route.path === "/" : route.path.startsWith(link);

watch(isOpen, (newVal) => {
  if (typeof document === "undefined") return;
  if (newVal) {
    document.body.classList.add("overflow-hidden", "lg:overflow-auto");
  } else {
    document.body.classList.remove("overflow-hidden", "lg:overflow-auto");
  }
});

defineProps({
  navName: {
    type: String,
    default: "希望工作室",
  },
});
</script>

<template>
  <nav class="fixed min-w-full z-50 backdrop-blur-md bg-gray-900/50">
    <ul class="flex h-16 items-center w-full">
      <li class="flex flex-row h-16 w-full justify-between pr-4">
        <section class="flex items-center justify-start h-full">
          <ul class="flex items-center justify-start h-full">
            <li class="h-full whitespace-nowrap">
              <router-link
                to="/"
                class="flex items-center justify-center outline-none pl-4 pr-4 h-full w-max"
              >
                <img src="/logo.svg" alt="Hope Studio" class="h-8 mr-1" />
                <span class="ml-1 text-2xl font-bold text-white/90">
                  {{ navName }}
                </span>
              </router-link>
            </li>
            <template v-for="item in menu" :key="item.name">
              <li class="hidden lg:block whitespace-nowrap h-full">
                <router-link
                  v-if="!isRawLink(item.link)"
                  :to="item.link"
                  class="pl-4 pr-4 h-full w-max flex items-center justify-center group text-sm font-medium hover:bg-gray-400/10 transition-all duration-200 item"
                  :class="{ 'item-active': isActive(item.link) }"
                >
                  <span
                    class="text-gray-300 group-hover:text-white transition-colors duration-200"
                  >
                    {{ item.name }}
                  </span>
                </router-link>
                <a
                  v-else
                  :href="item.link"
                  :target="item.link.startsWith('http') ? '_blank' : undefined"
                  rel="noopener"
                  class="pl-4 pr-4 h-full w-max flex items-center justify-center group text-sm font-medium hover:bg-gray-400/10 transition-all duration-200 item"
                  :class="{ 'item-active': isActive(item.link) }"
                >
                  <span
                    class="text-gray-300 group-hover:text-white transition-colors duration-200"
                  >
                    {{ item.name }}
                  </span>
                </a>
              </li>
            </template>
          </ul>
        </section>
      </li>
      <li class="lg:hidden nav-right w-16 h-16">
        <button
          @click="isOpen = !isOpen"
          class="nav-menu-button"
          :class="{ active: isOpen }"
        >
          <span class="sr-only">打开菜单</span>
          <div class="menu-icon">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
          </div>
        </button>
      </li>
    </ul>
  </nav>
  <nav
    id="mobile-navbar"
    class="fixed top-16 z-50 w-full h-[calc(100%-4rem)] lg:hidden backdrop-blur-md bg-gray-900/50 transition-all duration-500 overflow-auto dark"
    :class="{ 'invisible opacity-0 -left-full': !isOpen, 'left-0': isOpen }"
  >
    <ul>
      <template v-for="(item, idx) in menu" :key="item.name">
        <router-link
          v-if="!isRawLink(item.link)"
          :to="item.link"
          @click="isOpen = false"
          class="p-4 px-6 h-full w-full flex items-center group font-medium hover:bg-gray-400/10 transition-all duration-200 item"
          :class="{ 'item-active': isActive(item.link), 'visible-anim': isOpen, 'opacity-0': !isOpen }"
          :style="{ '--delay': `${(idx + 1) * 50 + 250}ms` }"
        >
          <span
            class="text-gray-300 group-hover:text-white transition-colors duration-200"
          >
            {{ item.name }}
          </span>
        </router-link>
        <a
          v-else
          :href="item.link"
          @click="isOpen = false"
          :target="item.link.startsWith('http') ? '_blank' : undefined"
          rel="noopener"
          class="p-4 px-6 h-full w-full flex items-center group font-medium hover:bg-gray-400/10 transition-all duration-200 item"
          :class="{ 'item-active': isActive(item.link), 'visible-anim': isOpen, 'opacity-0': !isOpen }"
          :style="{ '--delay': `${(idx + 1) * 50 + 250}ms` }"
        >
          <span
            class="text-gray-300 group-hover:text-white transition-colors duration-200"
          >
            {{ item.name }}
          </span>
        </a>
      </template>
    </ul>
  </nav>
</template>

<style scoped>
.item.item-active span {
  @apply text-white;
}

.item.item-active {
  @apply bg-white/10;
}

.item.visible-anim {
  opacity: 0;
  animation: 200ms ease-in-out var(--delay) forwards visible-anim;
}

@keyframes visible-anim {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
