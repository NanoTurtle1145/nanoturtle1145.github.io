<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "加入我们 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室成员招募。" }],
});

const roles = [
  { title: "后端开发", desc: "Node.js / Rust / C++，熟悉 Web 框架或系统编程" },
  { title: "前端开发", desc: "Vue / React，有作品或项目经验" },
  { title: "桌面应用开发", desc: "WinUI 3 / .NET / C#，或愿意学习" },
  { title: "操作系统 / 内核", desc: "对操作系统原理有兴趣，或参与 HopeOS 开发" },
  { title: "Minecraft 插件", desc: "Bukkit / Paper 插件开发，或想参与 HopeCraft" },
  { title: "UI / 视觉设计", desc: "有审美，能设计图标、海报、网页布局" },
];
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 896px">
    <div class="mb-8">
      <div class="gov-header-1">
        <span>加入我们</span>
        <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
      </div>
    </div>

    <v-card elevation="0" class="mb-8">
      <v-card-text class="pa-6 pa-sm-10">
        <div class="text-title-large font-weight-bold text-on-surface mb-2">
          有希望者，事竟成。
        </div>
        <div class="text-body-1 text-medium-emphasis" style="line-height: 2">
          <p class="mb-4">
            希望工作室是一个由学生组成的技术兴趣团队。我们做桌面应用、写操作系统、研究安全、开 Minecraft
            服务器——一切源于「没事写点代码」的初心。
          </p>
          <p class="mb-4">
            如果你和我们一样，对技术有热情、愿意花课余时间做点有意思的东西，欢迎加入。
          </p>
          <p class="text-primary font-weight-medium">不限年级、不限基础，只要愿意学。</p>
        </div>
      </v-card-text>
    </v-card>

    <div class="gov-header-2 mb-4" style="font-weight: 700">招募方向</div>
    <v-row>
      <v-col v-for="role in roles" :key="role.title" cols="12" sm="6">
        <v-card elevation="0" class="mb-3">
          <v-card-text class="pa-4">
            <div class="text-title-medium font-weight-bold text-on-surface mb-1">{{ role.title }}</div>
            <div class="text-body-1 text-medium-emphasis">{{ role.desc }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="gov-header-2 mt-6 mb-4" style="font-weight: 700">联系方式</div>
    <v-card elevation="0" class="mb-8">
      <v-card-text class="pa-6 pa-sm-10">
        <div class="text-body-1 text-medium-emphasis" style="line-height: 2">
          <p class="mb-3">
            发送邮件至
            <a href="mailto:guixiabaifo2022@outlook.com" class="text-primary text-decoration-underline">
              guixiabaifo2022@outlook.com
            </a>
            ，附上你的自我介绍和想参与的方向，我们会尽快回复。
          </p>
          <p class="mb-3">
            你也可以通过 GitHub 联系：
            <a href="https://github.com/NanoTurtle1145" target="_blank" rel="noopener" class="text-primary text-decoration-none">@NanoTurtle1145</a>
          </p>
          <p>
            或直接浏览我们的
            <RouterLink to="/projects" class="text-primary text-decoration-none">项目一览</RouterLink>
            ，看看有没有感兴趣的。
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>