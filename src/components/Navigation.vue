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
  { name: "归档处", link: "/archive" },
  { name: "页面编辑器", link: "/editor", devOnly: true },
]);

// 页面编辑器仅在本地（localhost）显示，不发布到生产站点
const isLocal =
  typeof location !== "undefined" &&
  (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const menu = computed(() =>
  menuItems.value.filter((i) => !(i.devOnly && !isLocal))
);

// 旧站存档 / 资料原件是静态 HTML，需用原生 <a> 直接跳转，不能走 vue-router
const isRawLink = (link: string) =>
  link.startsWith("http") ||
  link.startsWith("/archive/legacy") ||
  link.startsWith("/archive/library");

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
  <!-- 政务门户顶部导航：现代渐变风格 + 玻璃态效果 -->
  <v-app-bar color="primary" elevation="0" class="nav-app-bar">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        class="d-lg-none text-white nav-menu-btn"
        @click="drawer = !drawer"
        aria-label="打开菜单"
      />
    </template>

    <v-app-bar-title>
      <router-link to="/" class="d-flex align-center text-decoration-none logo-link">
        <img src="/logo.svg" alt="Hope Studio" class="nav-logo" style="height: 34px" />
        <span class="nav-title">{{ navName }}</span>
      </router-link>
    </v-app-bar-title>

    <!-- 桌面端：现代化导航链接 -->
    <template v-slot:append>
      <div class="d-none d-lg-flex align-center h-100 nav-links">
        <template v-for="item in menu" :key="item.name">
          <router-link
            v-if="!isRawLink(item.link)"
            :to="item.link"
            class="nav-link"
            :class="{ 'nav-link--active': isActive(item.link) }"
          >
            <span class="nav-link-text">{{ item.name }}</span>
            <span v-if="isActive(item.link)" class="nav-link-indicator" />
          </router-link>
          <a
            v-else
            :href="item.link"
            :target="item.link.startsWith('http') ? '_blank' : undefined"
            rel="noopener"
            class="nav-link"
            :class="{ 'nav-link--active': isActive(item.link) }"
          >
            <span class="nav-link-text">{{ item.name }}</span>
            <span v-if="isActive(item.link)" class="nav-link-indicator" />
          </a>
        </template>
      </div>
    </template>
  </v-app-bar>

  <!-- 移动端抽屉：现代化设计 -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    class="nav-drawer"
    elevation="4"
  >
    <div class="nav-drawer-header">
      <div class="nav-drawer-logo">
        <img src="/logo.svg" alt="Hope Studio" class="nav-drawer-logo-icon" />
        <span class="nav-drawer-logo-text">{{ navName }}</span>
      </div>
    </div>
    <v-divider />
    <v-list class="nav-drawer-list">
      <template v-for="item in menu" :key="item.name">
        <router-link
          v-if="!isRawLink(item.link)"
          :to="item.link"
          @click="drawer = false"
          class="nav-drawer-link"
          :class="{ 'nav-drawer-link--active': isActive(item.link) }"
        >
          <span class="nav-drawer-link-text">{{ item.name }}</span>
          <v-icon v-if="isActive(item.link)" icon="mdi-check" class="nav-drawer-link-icon" />
        </router-link>
        <a
          v-else
          :href="item.link"
          @click="drawer = false"
          :target="item.link.startsWith('http') ? '_blank' : undefined"
          rel="noopener"
          class="nav-drawer-link"
          :class="{ 'nav-drawer-link--active': isActive(item.link) }"
        >
          <span class="nav-drawer-link-text">{{ item.name }}</span>
          <v-icon v-if="isActive(item.link)" icon="mdi-check" class="nav-drawer-link-icon" />
        </a>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
/* 浅色：政务蓝底 + 白字；深色 Linear 皮肤：近黑底 + 薰衣草强调 */
.nav-app-bar {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary)) 0%,
    color-mix(in srgb, rgb(var(--v-theme-primary)) 82%, #0d1c28) 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  transition: box-shadow 0.3s ease;
}

.nav-app-bar:hover {
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.3);
}

.nav-menu-btn {
  transition: transform 0.3s ease;
}

.nav-menu-btn:hover {
  transform: scale(1.1);
}

.logo-link {
  transition: opacity 0.3s ease;
}

.logo-link:hover {
  opacity: 0.85;
}

.nav-title {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: rgb(var(--v-theme-on-primary));
}

.nav-links {
  gap: 4px;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 1.25rem;
  color: rgba(var(--v-theme-on-primary), 0.85);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: var(--gov-font-family);
  letter-spacing: normal;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-link:hover {
  color: rgb(var(--v-theme-on-primary));
  background: rgba(var(--v-theme-on-primary), 0.1);
}

.nav-link--active {
  color: rgb(var(--v-theme-on-primary));
  font-weight: 600;
}

.nav-link-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgb(var(--v-theme-on-primary));
  box-shadow: 0 2px 8px rgba(var(--v-theme-on-primary), 0.5);
}

/* 移动端抽屉：与顶栏同色 */
.nav-drawer {
  background: rgb(var(--v-theme-primary));
}

.nav-drawer-header {
  padding: 1.5rem;
  background: rgba(var(--v-theme-on-primary), 0.08);
}

.nav-drawer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-drawer-logo-icon {
  height: 32px;
}

.nav-drawer-logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-primary));
  letter-spacing: -0.01em;
}

.nav-drawer-list {
  padding: 0.5rem 0;
}

.nav-drawer-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  color: rgba(var(--v-theme-on-primary), 0.85);
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  margin: 0 0.5rem;
  border-radius: 0 8px 8px 0;
}

.nav-drawer-link:hover {
  background: rgba(var(--v-theme-on-primary), 0.1);
  color: rgb(var(--v-theme-on-primary));
  border-left-color: rgb(var(--v-theme-inverse-primary));
}

.nav-drawer-link--active {
  background: rgba(var(--v-theme-on-primary), 0.15);
  color: rgb(var(--v-theme-on-primary));
  border-left-color: rgb(var(--v-theme-inverse-primary));
  font-weight: 600;
}

.nav-drawer-link-icon {
  color: rgb(var(--v-theme-inverse-primary));
  transition: transform 0.3s ease;
}

.nav-drawer-link--active .nav-drawer-link-icon {
  transform: scale(1.1);
}

/* 深色 Linear 皮肤：近黑顶栏 + 薰衣草指示条（白 logo 在两种主题下均成立） */
html[data-theme="dark"] .nav-app-bar {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant), 0.7);
}

html[data-theme="dark"] .nav-app-bar:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

html[data-theme="dark"] .nav-title {
  color: rgb(var(--v-theme-on-surface));
}

html[data-theme="dark"] .nav-link {
  color: rgb(var(--v-theme-on-surface-variant));
}

html[data-theme="dark"] .nav-link:hover {
  color: rgb(var(--v-theme-on-surface));
  background: rgba(255, 255, 255, 0.06);
}

html[data-theme="dark"] .nav-link--active {
  color: rgb(var(--v-theme-on-surface));
}

html[data-theme="dark"] .nav-link-indicator {
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 2px 10px rgba(var(--v-theme-primary), 0.6);
}

html[data-theme="dark"] .nav-drawer {
  background: rgb(var(--v-theme-surface));
}

html[data-theme="dark"] .nav-drawer-header {
  background: rgba(255, 255, 255, 0.03);
}

html[data-theme="dark"] .nav-drawer-logo-text {
  color: rgb(var(--v-theme-on-surface));
}

html[data-theme="dark"] .nav-drawer-link {
  color: rgb(var(--v-theme-on-surface-variant));
}

html[data-theme="dark"] .nav-drawer-link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgb(var(--v-theme-on-surface));
  border-left-color: rgb(var(--v-theme-primary));
}

html[data-theme="dark"] .nav-drawer-link--active {
  background: rgba(var(--v-theme-primary), 0.12);
  color: rgb(var(--v-theme-on-surface));
  border-left-color: rgb(var(--v-theme-primary));
}

html[data-theme="dark"] .nav-drawer-link-icon {
  color: rgb(var(--v-theme-primary));
}

/* 响应式优化 */
@media (max-width: 960px) {
  .nav-title {
    font-size: 1rem;
  }

  .nav-link {
    padding: 0 1rem;
    font-size: 0.8125rem;
  }

  .nav-drawer-link {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .nav-drawer-link {
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
    margin: 0 0.25rem;
  }
}
</style>
