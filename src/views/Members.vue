<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "成员 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室成员列表。" }],
});

const admins = [
  {
    avatar: "/member/nt.png",
    name: "@NanoTurtle",
    role: "管理员 · 创始人",
    desc: "希望工作室创始人之一，元老级人物。是一位十分开朗的人，没了。个人博客 blog.nanoturtle.cn；近期沉迷 S24 Ultra 免解锁 root（开源项目 RootMyS9280）与 HopeOS。",
  },
  {
    avatar: "/member/bs.png", // 可替换为实际头像路径，留空则显示首字母占位
    name: "@BusyMitten / BusySheng",
    role: "管理员 · 创始人",
    desc: "希望工作室创始人之一，依旧元老级人物。他实力超群，超群，超群。",
  },
];

const members = [
  { name: "YP", role: "成员", desc: "" },
  { name: "TP", role: "成员", desc: "" },
];
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 1024px">
    <div class="text-h4 font-weight-bold text-on-surface mb-2">成员列表</div>
    <div class="text-body-1 text-medium-emphasis mb-8">
      由于一些特殊原因，此处某些成员仅有昵称的缩写。
    </div>

    <div class="text-h5 font-weight-bold text-on-surface mb-4">管理员</div>
    <v-row class="mb-10">
      <v-col v-for="m in admins" :key="m.name" cols="12" sm="6">
        <v-card elevation="0" class="h-100">
          <v-card-text>
            <v-avatar v-if="m.avatar" size="96" rounded="lg" class="mb-3">
              <v-img :src="m.avatar" alt="" />
            </v-avatar>
            <div
              v-else
              class="v-avatar mb-3 rounded-lg bg-grey-darken-2 d-flex align-center justify-center"
              style="width: 96px; height: 96px"
            >
              <span class="text-h6 text-grey-lighten-2">{{ m.name.charAt(0) }}</span>
            </div>
            <div class="text-h6 font-weight-bold text-on-surface mb-1">{{ m.name }}</div>
            <div class="text-body-2 text-primary mb-3">{{ m.role }}</div>
            <div class="text-body-2 text-medium-emphasis">{{ m.desc }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-h5 font-weight-bold text-on-surface mb-4">成员</div>
    <v-row>
      <v-col v-for="m in members" :key="m.name" cols="6" sm="3">
        <v-card elevation="0" class="text-center">
          <v-card-text>
            <div class="text-h6 font-weight-bold text-on-surface">{{ m.name }}</div>
            <div class="text-body-2 text-primary">{{ m.role }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


