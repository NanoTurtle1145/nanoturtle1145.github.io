<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const drawer = ref(false);
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
const isRawLink = (link: string) =>
  link.startsWith("http") || link.startsWith("/archive");

// 首页 "/" 是其他所有路径的前缀，需用精确匹配，否则会常驻高亮
const isActive = (link: string) =>
  link === "/" ? route.path === "/" : route.path.startsWith(link);

defineProps({
  navName: {
    type: String,
    default: "希望工作室",
  },
});
</script>

<template>
  <!-- 政务门户顶部导航：政务蓝底 + 白字 + 激活项白色下划线 -->
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        class="d-lg-none text-white"
        @click="drawer = !drawer"
        aria-label="打开菜单"
      />
    </template>

    <v-app-bar-title>
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <img src="/logo.svg" alt="Hope Studio" class="mr-2" style="height: 34px; filter: brightness(0) invert(1)" />
        <span class="text-title-medium font-weight-bold text-white">{{ navName }}</span>
      </router-link>
    </v-app-bar-title>

    <!-- 桌面端：政务风格文字导航（激活项白色下划线） -->
    <template v-slot:append>
      <div class="d-none d-lg-flex align-center h-100 pr-2">
        <template v-for="item in menu" :key="item.name">
          <router-link
            v-if="!isRawLink(item.link)"
            :to="item.link"
            class="gov-nav-link text-decoration-none"
            :class="{ 'gov-nav-link--active': isActive(item.link) }"
          >
            {{ item.name }}
          </router-link>
          <a
            v-else
            :href="item.link"
            :target="item.link.startsWith('http') ? '_blank' : undefined"
            rel="noopener"
            class="gov-nav-link text-decoration-none"
            :class="{ 'gov-nav-link--active': isActive(item.link) }"
          >
            {{ item.name }}
          </a>
        </template>
      </div>
    </template>
  </v-app-bar>

  <!-- 移动端抽屉 -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    class="d-lg-none"
  >
    <v-list>
      <template v-for="item in menu" :key="item.name">
        <router-link
          v-if="!isRawLink(item.link)"
          :to="item.link"
          @click="drawer = false"
          class="text-decoration-none"
        >
          <v-list-item
            :color="isActive(item.link) ? 'primary-container' : undefined"
            rounded="0"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </router-link>
        <a
          v-else
          :href="item.link"
          @click="drawer = false"
          :target="item.link.startsWith('http') ? '_blank' : undefined"
          rel="noopener"
          class="text-decoration-none"
        >
          <v-list-item
            :color="isActive(item.link) ? 'primary-container' : undefined"
            rounded="0"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </a>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
/* 政务门户导航链接：白字，hover 半透明，激活项白色下划线 */
.gov-nav-link {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.8rem;
  font-weight: 500;
  font-family: var(--gov-font-family);
  letter-spacing: normal;
  position: relative;
  transition: color var(--md3e-duration-short) var(--md3e-motion-emphasized);
}
.gov-nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}
.gov-nav-link--active {
  color: #ffffff;
  font-weight: 600;
}
.gov-nav-link--active::after {
  content: "";
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0;
  height: 3px;
  background: #ffffff;
}
</style>
