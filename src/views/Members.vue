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
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-2">成员列表</h1>
        <p class="text-gray-400 mb-8">由于一些特殊原因，此处某些成员仅有昵称的缩写。</p>

        <h2 class="text-2xl font-bold text-white mb-4">管理员</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div
            v-for="m in admins"
            :key="m.name"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6"
          >
            <!-- 有头像则显示图片，无头像则显示名字首字母占位 -->
            <img
              v-if="m.avatar"
              :src="m.avatar"
              class="w-24 h-24 rounded-xl object-cover"
              alt=""
            />
            <div
              v-else
              class="w-24 h-24 rounded-xl bg-gray-700 flex items-center justify-center text-gray-400 text-lg"
            >
              {{ m.name.charAt(0) }}
            </div>
            <h3 class="text-xl font-bold text-white mb-1">{{ m.name }}</h3>
            <p class="text-sm text-blue-300 mb-3">{{ m.role }}</p>
            <p class="text-gray-400">{{ m.desc }}</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-white mb-4">成员</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div
            v-for="m in members"
            :key="m.name"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 text-center"
          >
            <h3 class="text-xl font-bold text-white">{{ m.name }}</h3>
            <p class="text-sm text-blue-300">{{ m.role }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
