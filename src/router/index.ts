import type { RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { title: "希望工作室 | Hope Studio" },
  },
  {
    path: "/posts",
    name: "posts",
    component: () => import("../views/Posts.vue"),
    meta: { title: "文章 | 希望工作室", navName: "希望工作室" },
  },
  {
    path: "/posts/:slug",
    name: "post-detail",
    component: () => import("../views/PostDetail.vue"),
    meta: { title: "文章 | 希望工作室" },
  },
  {
    path: "/projects",
    name: "projects",
    component: () => import("../views/Projects.vue"),
    meta: { title: "项目 | 希望工作室" },
  },
  {
    path: "/members",
    name: "members",
    component: () => import("../views/Members.vue"),
    meta: { title: "成员 | 希望工作室" },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
    meta: { title: "关于我们 | 希望工作室" },
  },
  {
    path: "/join",
    name: "join",
    component: () => import("../views/Join.vue"),
    meta: { title: "加入我们 | 希望工作室" },
  },
  {
    path: "/friends",
    name: "friends",
    component: () => import("../views/Friends.vue"),
    meta: { title: "友情链接 | 希望工作室" },
  },
  {
    path: "/hopeos",
    name: "HopeOS",
    component: () => import("../views/hopeos.vue"),
    meta: { title: "HopeOS | 希望工作室" },
  },
  {
    path: "/editor",
    name: "editor",
    component: () => import("../views/Editor.vue"),
    meta: { title: "页面编辑器 | 希望工作室" },
  },
  {
    // 供 vite-ssg 预渲染出 GitHub Pages 用的 404 页面
    path: "/404",
    name: "404",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "页面未找到 | 希望工作室" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFound.vue"),
    meta: { title: "页面未找到 | 希望工作室" },
  },
];

// 页面编辑器仅在本地（localhost）可用，不发布到 GitHub Pages 等线上环境
const isLocal =
  typeof location !== "undefined" &&
  (location.hostname === "localhost" || location.hostname === "127.0.0.1");
if (isLocal) {
  routes.push({
    path: "/editor",
    name: "editor",
    component: () => import("../views/Editor.vue"),
    meta: { title: "页面编辑器 | 希望工作室" },
  });
}

export default routes;
