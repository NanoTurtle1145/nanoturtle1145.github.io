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
  <footer class="text-left text-white bg-gray-800/50 backdrop-blur-md">
    <section class="px-4 relative">
      <div class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="fastguide in fastguides"
            :key="fastguide.parentdex"
            class="relative rounded-2xl"
          >
            <p class="text-xl font-semibold text-gray-200 py-2">
              {{ fastguide.parentdex }}
            </p>
            <template v-for="eindex in fastguide.eindexs" :key="eindex.text">
              <router-link v-if="!eindex.link.startsWith('http')" :to="eindex.link">
                <p class="text-gray-400 hover:text-white transition-colors duration-200 py-1">
                  {{ eindex.text }}
                </p>
              </router-link>
              <a v-else :href="eindex.link" target="_blank" rel="noopener">
                <p class="text-gray-400 hover:text-white transition-colors duration-200 py-1">
                  {{ eindex.text }}
                </p>
              </a>
            </template>
          </div>
        </div>
      </div>
    </section>

    <div class="py-8 text-center text-gray-400">
      <p>有希望者，事竟成。Where there is a hope, there is a way.</p>
      <p class="mt-2">版权所有 © 希望工作室 Hope Studio 2025 - {{ year }} 保留所有权利。</p>
    </div>
  </footer>
</template>
