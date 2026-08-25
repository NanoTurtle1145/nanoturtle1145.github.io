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
  <!-- MD3E top app bar：容器色 + 底部细分隔线（见 style.css .v-app-bar） -->
  <v-app-bar>
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        class="d-lg-none"
        @click="drawer = !drawer"
        aria-label="打开菜单"
      />
    </template>

    <v-app-bar-title>
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <img src="/logo.svg" alt="Hope Studio" class="mr-2" style="height: 32px" />
        <span class="text-h6 font-weight-bold text-on-surface">{{ navName }}</span>
      </router-link>
    </v-app-bar-title>

    <!-- 桌面端：MD3E 胶囊导航（激活项 secondary-container + 弹簧切换） -->
    <template v-slot:append>
      <div class="d-none d-lg-flex align-center ga-2 pr-4">
        <template v-for="item in menu" :key="item.name">
          <router-link
            v-if="!isRawLink(item.link)"
            :to="item.link"
            class="text-decoration-none"
          >
            <v-chip
              :color="isActive(item.link) ? 'secondary-container' : undefined"
              :text-color="isActive(item.link) ? 'on-secondary-container' : undefined"
              :variant="isActive(item.link) ? 'flat' : 'text'"
              rounded="pill"
              label
              size="small"
              class="pa-3 nav-chip"
            >
              {{ item.name }}
            </v-chip>
          </router-link>
          <a
            v-else
            :href="item.link"
            :target="item.link.startsWith('http') ? '_blank' : undefined"
            rel="noopener"
            class="text-decoration-none"
          >
            <v-chip
              :color="isActive(item.link) ? 'secondary-container' : undefined"
              :text-color="isActive(item.link) ? 'on-secondary-container' : undefined"
              :variant="isActive(item.link) ? 'flat' : 'text'"
              rounded="pill"
              label
              size="small"
              class="pa-3 nav-chip"
            >
              {{ item.name }}
            </v-chip>
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
            :color="isActive(item.link) ? 'secondary-container' : undefined"
            rounded="lg"
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
            :color="isActive(item.link) ? 'secondary-container' : undefined"
            rounded="lg"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </a>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.nav-chip {
  transition: transform var(--md3e-duration-short) var(--md3e-motion-spring),
    background-color var(--md3e-duration-short) var(--md3e-motion-emphasized),
    color var(--md3e-duration-short) var(--md3e-motion-emphasized);
}
.nav-chip:hover {
  transform: translateY(-1px);
}
</style>
