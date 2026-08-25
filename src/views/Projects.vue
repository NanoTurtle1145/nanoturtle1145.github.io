<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "项目 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室的项目一览。" }],
});

const projects = [
  {
    name: "BusyMitten/HopeCraft",
    desc: "NT & BM 联合推出的 Minecraft 服务器插件，适用于 Bukkit 核心，实现了服务器菜单等一些功能。",
    status: ["开源", "归档"],
    link: "https://github.com/BusyMitten/HopeCraft",
    external: true,
  },
  {
    name: "WinUI 笔记",
    desc: "面向 WinUI 3 的学习笔记系列，持续迭代更新。",
    status: ["开源", "更新中"],
    link: "/posts/winui-notes",
    external: false,
  },
  {
    name: "HopeOS",
    desc: "一个从零编写的 UEFI 操作系统，用于学习操作系统运行原理。",
    status: ["闭源", "内部开发中"],
    link: "/hopeos",
    external: false,
  },
  {
    name: "RootMyS9280",
    desc: "三星 Galaxy S24 Ultra 免解锁 Root 工具：基于 CVE-2026-43499 的临时提权 + KernelSU 加载，不熔断 KNOX。",
    status: ["开源", "更新中"],
    link: "https://github.com/NanoTurtle1145/root-my-s9280",
    external: true,
  },
];

const statusColor = (s: string) =>
  ({
    更新中: "success",
    归档: "grey",
    开源: "info",
    闭源: "error",
    内部开发中: "warning",
  })[s] ?? "grey";
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 1024px">
    <div class="mb-8">
      <div class="md3e-eyebrow mb-1">项目一览 · Projects</div>
      <div class="md3e-display-sm text-h3 text-on-surface mb-2">项目</div>
      <div class="text-body-1 text-medium-emphasis">
        Under Construction… 工作室做过和正在做的一些东西。
      </div>
    </div>

    <v-row>
      <v-col v-for="p in projects" :key="p.name" cols="12" md="6">
        <v-card elevation="0" hover class="h-100 d-flex flex-column justify-space-between">
          <v-card-text>
            <div class="d-flex align-center ga-3 mb-3">
              <div class="text-h6 font-weight-bold text-on-surface">{{ p.name }}</div>
              <v-chip
                v-for="(st, idx) in p.status"
                :key="idx"
                size="x-small"
                :color="statusColor(st)"
                variant="tonal"
              >
                {{ st }}
              </v-chip>
            </div>
            <div class="text-body-2 text-medium-emphasis mb-4">{{ p.desc }}</div>
          </v-card-text>
          <v-card-actions>
            <a
              v-if="p.external"
              :href="p.link"
              target="_blank"
              rel="noopener"
              class="text-decoration-none"
            >
              <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
                前往
              </v-btn>
            </a>
            <router-link v-else :to="p.link" class="text-decoration-none">
              <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
                了解更多
              </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


