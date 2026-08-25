<script setup lang="ts">
const fastguides = [
  {
    parentdex: "内容",
    eindexs: [
      { text: "全部文章", link: "/posts" },
      { text: "项目一览", link: "/projects" },
      { text: "成员列表", link: "/members" },
    ],
  },
  {
    parentdex: "工作室",
    eindexs: [
      { text: "关于我们", link: "/about" },
      { text: "加入我们", link: "/join" },
      { text: "友情链接", link: "/friends" },
    ],
  },
  {
    parentdex: "开源",
    eindexs: [
      { text: "GitHub 组织", link: "https://github.com/NanoTurtle1145" },
      { text: "本站源码", link: "https://github.com/NanoTurtle1145/nanoturtle1145.github.io" },
    ],
  },
  {
    parentdex: "存档",
    eindexs: [
      { text: "旧版官网存档", link: "https://www.hopestudio.top" },
      { text: "个人博客", link: "https://ntblog.cn" },
    ],
  },
];

const year = new Date().getFullYear();
</script>

<template>
  <v-footer class="bg-surface-container flex-column pa-0">
    <v-container class="py-10">
      <v-row>
        <v-col
          v-for="fastguide in fastguides"
          :key="fastguide.parentdex"
          cols="6"
          md="3"
        >
          <div class="md3e-eyebrow mb-4">
            {{ fastguide.parentdex }}
          </div>
          <template v-for="eindex in fastguide.eindexs" :key="eindex.text">
            <router-link
              v-if="!eindex.link.startsWith('http')"
              :to="eindex.link"
              class="text-decoration-none"
            >
              <div class="text-body-2 text-medium-emphasis py-1 hover-text">
                {{ eindex.text }}
              </div>
            </router-link>
            <a
              v-else
              :href="eindex.link"
              target="_blank"
              rel="noopener"
              class="text-decoration-none"
            >
              <div class="text-body-2 text-medium-emphasis py-1 hover-text">
                {{ eindex.text }}
              </div>
            </a>
          </template>
        </v-col>
      </v-row>
    </v-container>

    <v-divider />

    <v-container class="py-6 text-center">
      <div class="text-body-2 text-medium-emphasis">
        有希望者，事竟成。Where there is a hope, there is a way.
      </div>
      <div class="text-caption text-medium-emphasis mt-2">
        版权所有 © 希望工作室 Hope Studio 2025 - {{ year }} 保留所有权利。
      </div>
      <div class="text-caption text-medium-emphasis mt-1">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener"
          class="text-decoration-none"
        >
          浙ICP备2025195202号-1
        </a>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.hover-text {
  transition: color var(--md3e-duration-short) var(--md3e-motion-emphasized),
    transform var(--md3e-duration-short) var(--md3e-motion-spring);
  display: inline-block;
}
.hover-text:hover {
  color: rgb(var(--v-theme-primary));
  transform: translateX(2px);
}
</style>
