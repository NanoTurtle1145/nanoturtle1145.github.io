<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@vueuse/head";
import { posts } from "../data/posts";
import ProjectBanner from "../components/ProjectBanner.vue";

// 首页 banner 轮播展示的项目（含 HopeOS 与若干工作室项目）
const showcaseProjects = [
  {
    title: "HopeOS",
    desc: "从零编写的 UEFI 操作系统，用于学习操作系统运行原理。",
    link: "/hopeos",
    external: false,
    image: "/media/hopeos/desktop.png",
  },
  {
    title: "HopeCraft",
    desc: "NT & BM 联合推出的 Minecraft 服务器插件，实现服务器菜单等功能。",
    link: "https://github.com/BusyMitten/HopeCraft",
    external: true,
    gradient: "linear-gradient(135deg, #0f5132, #022c22)",
  },
  {
    title: "WinUI 笔记",
    desc: "面向 WinUI 3 的学习笔记系列，持续迭代更新。",
    link: "/posts/winui-notes",
    external: false,
    gradient: "linear-gradient(135deg, #0369a1, #1e1b4b)",
  },
  {
    title: "HopeOJ",
    desc: "在线评测系统相关项目，代码与文档持续开放。",
    link: "/projects",
    external: false,
    gradient: "linear-gradient(135deg, #be123c, #4c0519)",
  },
  {
    title: "HPSS",
    desc: "工作室持续开放的开源工具与脚本集合。",
    link: "/projects",
    external: false,
    gradient: "linear-gradient(135deg, #d97706, #7c2d12)",
  },
  {
    title: "RootMyS9280",
    desc: "三星 S24 Ultra 免解锁 Root：CVE-2026-43499 提权 + KernelSU，不熔断 KNOX。",
    link: "https://github.com/NanoTurtle1145/root-my-s9280",
    external: true,
    gradient: "linear-gradient(135deg, #0e7490, #172554)",
  },
  {
    title: "技术分享",
    desc: "从设备刷机到多线程网络编程，把踩过的坑写成可复用经验。",
    link: "/posts",
    external: false,
    gradient: "linear-gradient(135deg, #6d28d9, #4a044e)",
  },
];

useHead({
  title: "希望工作室 | Hope Studio",
  meta: [
    {
      name: "description",
      content:
        "希望工作室（Hope Studio）是一个由学生组成的技术兴趣团队，专注于桌面应用开发、操作系统探索与开源分享。有希望者，事竟成。",
    },
  ],
});

const latestPosts = computed(() => posts.slice(0, 3));

// 亮点：每个图标用不同容器色，形成丰富的配色层次
const advantages = [
  {
    title: "动手实践",
    desc: "比起空谈，我们更愿意把想法做成真正能用的东西。",
    icon: "mdi-hammer-wrench",
    color: "primary-container",
    onColor: "on-primary-container",
  },
  {
    title: "自由探索",
    desc: "没有硬性路线，感兴趣的方向就大胆去钻。",
    icon: "mdi-compass-outline",
    color: "tertiary-container",
    onColor: "on-tertiary-container",
  },
  {
    title: "一起成长",
    desc: "遇到难题大家一起琢磨、互相补位，比一个人扛着走得快。",
    icon: "mdi-account-group",
    color: "secondary-container",
    onColor: "on-secondary-container",
  },
  {
    title: "长期留存",
    desc: "老站虽然关了，但好内容都搬过来了，妥妥存好，随时都能翻出来看。",
    link: "去归档站逛逛",
    icon: "mdi-archive-outline",
    color: "primary",
    onColor: "on-primary",
  },
];
</script>

<template>
  <div class="pb-8">
    <!-- Hero -->
    <v-container class="pt-16 pb-8">
      <v-row align="center">
        <v-col cols="12" lg="7">
          <ProjectBanner :items="showcaseProjects" :interval="5000" />
        </v-col>
        <v-col cols="12" lg="5">
          <div class="pa-6 pa-lg-10">
            <div class="text-subtitle-1 text-primary font-weight-medium mb-3">
              希望工作室 · Hope Studio
            </div>
            <div class="text-h3 text-xl-h2 font-weight-bold text-on-surface mb-4">
              HopeOS 正在火热开发中！
            </div>
            <div class="text-subtitle-1 text-medium-emphasis mb-7">
              一个用于学习操作系统运行原理的项目。
            </div>

            <div class="d-inline-flex align-center ga-2 mb-8">
              <span class="d-inline-block rounded-circle bg-tertiary" style="width: 10px; height: 10px"></span>
              <span class="text-body-2 text-on-surface-variant font-weight-medium">正在开发中 · 敬请期待</span>
            </div>

            <div class="d-flex flex-wrap align-center ga-3">
              <router-link to="/hopeos" class="text-decoration-none">
                <v-btn color="primary" size="large" append-icon="mdi-arrow-right">
                  前往详情页面
                </v-btn>
              </router-link>
              <router-link to="/about" class="text-decoration-none">
                <v-btn variant="tonal" color="secondary-container" size="large">
                  了解工作室
                </v-btn>
              </router-link>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 最新文章 -->
    <v-container class="py-8">
      <div class="d-flex align-end justify-space-between mb-6">
        <div>
          <div class="text-subtitle-1 text-tertiary font-weight-medium mb-1">
            最新文章 · Latest
          </div>
          <div class="text-h4 font-weight-bold text-on-surface">最近在写什么</div>
        </div>
        <router-link to="/posts" class="text-decoration-none">
          <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
            查看全部
          </v-btn>
        </router-link>
      </div>
      <v-row>
        <v-col v-for="post in latestPosts" :key="post.slug" cols="12" md="6" lg="4">
          <router-link :to="`/posts/${post.slug}`" class="text-decoration-none">
            <v-card class="h-100" elevation="2" hover>
              <v-card-text class="d-flex flex-column justify-space-between h-100">
                <div>
                  <div class="d-flex align-center ga-3 mb-3">
                    <v-chip size="small" color="primary" variant="tonal">
                      {{ post.category }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis">{{ post.date }}</span>
                  </div>
                  <div class="text-h6 font-weight-bold text-on-surface mb-2">
                    {{ post.title }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis line-clamp-3 mb-4">
                    {{ post.excerpt }}
                  </div>
                </div>
                <span class="d-inline-flex align-center text-primary text-body-2">
                  阅读全文
                  <v-icon icon="mdi-arrow-right" size="small" class="ml-1" />
                </span>
              </v-card-text>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
    </v-container>

    <!-- 亮点 -->
    <v-container class="py-8">
      <div class="mb-6">
        <div class="text-subtitle-1 text-tertiary font-weight-medium mb-1">
          工作室理念 · Why Us
        </div>
        <div class="text-h4 font-weight-bold text-on-surface">我们的特点</div>
      </div>

      <div class="md3e-group pa-6 pa-md-8">
        <v-row>
          <v-col v-for="adv in advantages" :key="adv.title" cols="12" md="6">
            <v-card elevation="0" color="transparent" class="h-100">
              <v-card-text>
                <v-avatar :color="adv.color" size="44" class="mb-4 rounded-lg">
                  <v-icon :icon="adv.icon" :color="adv.onColor" />
                </v-avatar>
                <div class="text-h6 font-weight-bold text-on-surface mb-2">
                  {{ adv.title }}
                </div>
                <div class="text-body-2 text-medium-emphasis mb-2">{{ adv.desc }}</div>
                <router-link
                  v-if="adv.link"
                  to="/archive"
                  class="text-primary text-decoration-none d-inline-flex align-center"
                >
                  {{ adv.link }}
                  <v-icon icon="mdi-arrow-right" size="small" class="ml-1" />
                </router-link>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
