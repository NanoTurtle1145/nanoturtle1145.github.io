<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "关于我们 | 希望工作室",
  meta: [
    {
      name: "description",
      content: "希望工作室（Hope Studio）介绍：一个由学生组成的技术兴趣团队。",
    },
  ],
});

const timeline = [
  { date: "2025-09", text: "希望工作室官方网站上线，开始持续发布技术笔记与分享。" },
  { date: "2025-11", text: "站点完成一次重构（涅槃重生），内容与结构全面整理。" },
  { date: "2025-12", text: "发布 WinUI 笔记系列，并确定 2026 年的项目计划。" },
  { date: "2026-01", text: "WinUI 笔记迭代至 1.1.4.6，支持深色模式与更好的 Markdown 体验。" },
  { date: "2026-07", text: "宣布旧站于 8 月 20 日关停，内容迁移至新的静态站点。" },
  { date: "2026-08", text: "新版官网上线，采用 Vue 3 + Vite-SSG 静态生成，托管于 GitHub Pages。" },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-6">关于我们</h1>

        <div class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 sm:p-10 mb-8">
          <p class="text-2xl font-bold text-white mb-2">
            Where there is a hope, there is a way.
          </p>
          <p class="text-lg text-gray-300 mb-6">有希望者，事竟成。</p>
          <div class="text-gray-400 space-y-4 leading-8">
            <p>
              希望工作室（Hope Studio）是一个由学生组成的技术兴趣团队。我们把课余时间投入到自己真正感兴趣的事情上：写桌面应用、折腾操作系统与设备、搭建服务、整理资料，并把过程中的经验记录下来。
            </p>
            <p>
              我们不追求规模，也不以盈利为目标。做出来的东西尽可能开源，写下来的笔记尽可能公开——因为我们自己就是从别人公开的资料里学会这些的。
            </p>
            <p>
              旧版官网（hopestudio.top）自 2025 年 9 月起运营了约一年，于 2026 年 8 月 20
              日关停。本站是它的延续：所有仍有价值的文章都已迁移至此，文中引用的图片也一并做了本地归档，以免随原站一起消失。
            </p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-white mb-6">大事记</h2>
        <div class="space-y-4">
          <div
            v-for="item in timeline"
            :key="item.date"
            class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6"
          >
            <time class="text-blue-300 font-mono whitespace-nowrap">{{ item.date }}</time>
            <p class="text-gray-400">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
