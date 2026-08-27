<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "友情链接 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室友情链接。" }],
});

const links = [
  {
    name: "HopeOJ",
    url: "http://hopeoj.asia/",
    desc: "希望工作室 OJ 系统，基于 Hydro。",
  },
  {
    name: "HopeOJ 交流区",
    url: "http://forum.hopeoj.asia/",
    desc: "这个网站有一点死了。",
  },
  {
    name: "Lincol29's Blog",
    url: "https://www.lincol29.cn",
    desc: "一名 Java 转 C# 开发的码农，分享一些项目中使用的技术和知识，以及 WordPress 建站技巧。",
  },
  {
    name: "洛元の小屋",
    url: "https://blog.dimeta.top/",
    desc: "洛元の小屋，以科技、游戏、生活为主的 blog。",
  },
  {
    name: "站长的博客",
    url: "https://blog.nanoturtle.cn",
    desc: "NanoTurtle 的个人博客。",
  },
];
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 896px">
    <div class="mb-8">
      <div class="gov-header-1 mb-2">
        <span>友情链接</span>
        <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
      </div>
      <div class="text-body-1" style="color: #3c4852; font-family: var(--gov-font-family);">
        想要交换友链？欢迎通过
        <router-link to="/join" class="text-primary text-decoration-none">加入我们</router-link>
        页面留下站点名称、地址与简介。
      </div>
    </div>

    <v-row>
      <v-col v-for="l in links" :key="l.url" cols="12" sm="6">
        <a
          :href="l.url"
          target="_blank"
          rel="noopener"
          class="text-decoration-none"
        >
          <v-card elevation="0" hover class="h-100 pa-3">
            <v-card-text>
              <div class="text-title-medium font-weight-bold text-on-surface mb-2">{{ l.name }}</div>
              <div class="text-body-2 text-medium-emphasis mb-3">{{ l.desc }}</div>
              <div class="text-caption text-primary text-break">{{ l.url }}</div>
            </v-card-text>
          </v-card>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>


