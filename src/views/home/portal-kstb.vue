<template>
  <section id="kstb" class="kstb">
    <v-tabs v-model="state.model" color="primary" slider-color="primary" height="64"  mandatory>
      <v-tab class="header-1" key="project" value="project">开源项目</v-tab>
      <v-tab class="header-1" key="resource" value="resource">学习资源</v-tab>
      <v-tab class="header-1" key="convenient_service" value="convenient_service">常用链接</v-tab>
    </v-tabs>
    <!-- content -->
    <v-window class="kstb__content mt-6" v-model="state.model" mandatory>
      <v-window-item key="across_handle" value="across_handle">
        <!-- LeftBox -->
        <v-hover><template v-slot:default="{ isHovering, props }">
        <v-list 
          @click="onSkip('/projects', false)"
          class="kstb-leftbox" 
          :class="isHovering ? 'bg-primary bg-hover' : undefined"
          v-bind="props"
          lines="three"
          width="14rem"
        >
          <v-list-subheader class="kstb-leftbox-title" :class="isHovering ? 'text-white' : 'text-header-color'" >GitHub 组织<v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon></v-list-subheader>
          <v-list-item :class="isHovering ? 'text-white' : 'text-body-1-color'">
            <v-icon icon="mdi-check-circle-outline" size="x-small" :color="isHovering ? 'white' : 'green'"></v-icon><br>
            <v-list-item-title class="kstb-leftbox-text font-weight-black">RootMyS9280</v-list-item-title>
            <v-list-item-subtitle class="kstb-leftbox-text">三星 S24 Ultra 免解锁 Root 工具</v-list-item-subtitle>
          </v-list-item>
          <v-list-item :class="isHovering ? 'text-white' : 'text-body-1-color'">
            <v-icon icon="mdi-check-circle-outline" size="x-small" :color="isHovering ? 'white' : 'green'"></v-icon><br>
            <v-list-item-title class="kstb-leftbox-text font-weight-black">HopeCraft</v-list-item-title>
            <v-list-item-subtitle class="kstb-leftbox-text">Minecraft 服务器插件</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        </template></v-hover>
        <!-- RightBox -->
        <v-sheet class="kstb-rightbox px-8">
          <a class="header-2" href="/projects">
            <span>热门开源</span>
            <v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon>
          </a>      
          <v-tabs v-model="state.acrossHandleModel" color="primary" slider-color="primary" mandatory>
            <v-tab class="kstb-rightbox-tab" v-for="(item, i) in state.across_handle" :key="i" :value="i">{{item.tab}}</v-tab>
          </v-tabs>          
          <v-window class="mt-6" v-model="state.acrossHandleModel" mandatory>
            <v-window-item v-for="(item, i) in state.across_handle" :key="i" :value="i">
              <v-img class="float-left" :src="item.src" width="14rem"></v-img>
              <div class="kstb-rightbox-info"><template v-for="(link, i) in item.links">
                <p v-if="i === 0"><a class="kstb-rightbox-info-title" :href="item.href">{{link}}</a></p>
                <p v-else-if="i === 1" class="my-1"><a class="kstb-rightbox-info-subtitle my-2" :href="item.href">以 <span class="font-weight-bold">{{link}}</span> 为例</a></p>
                <p v-else><a class="kstb-rightbox-info-text" :href="item.href">{{link}}</a></p>
              </template></div>
            </v-window-item>
          </v-window>
        </v-sheet>
      </v-window-item>
      <!-- 学习资源 -->
      <v-window-item key="business_environment" value="business_environment">
        <!-- LeftBox -->
        <v-hover><template v-slot:default="{ isHovering, props }">
        <v-list
          class="kstb-leftbox" 
          :class="isHovering ? 'bg-primary bg-hover' : undefined"
          @click="onSkip('/posts', false)"
          v-bind="props"
          width="268"
        >
          <v-list-subheader class="kstb-leftbox-title" :class="isHovering ? 'text-white' : 'text-header-color'">
            {{ state.business_environment_left.title }}
            <v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon>
          </v-list-subheader>
          <v-list-item 
            class="kstb-leftbox-text" 
            :class="isHovering ? 'text-white' : 'text-body-1-color'" 
            v-for="item in state.business_environment_left.items"
          >
          {{ item }}</v-list-item>
        </v-list>
        </template></v-hover>
        <!-- RightBox -->
        <v-sheet class="kstb-rightbox">
          <v-row  class="kstb-rightbox__content">
          <v-col class="kstb-rightbox-column" v-for="column in state.business_environment_right" cols="4">
            <v-list lines="one">           
              <v-list-item-title class="kstb-rightbox-column-title">{{ column.title }}<v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon></v-list-item-title>
              <v-list-item-title v-for="item in column.items"><a class="kstb-rightbox-column-item" :href="item.href">{{ item.text }}</a></v-list-item-title>
            </v-list>
          </v-col>
        </v-row>
      </v-sheet>
      </v-window-item>
      <!-- 常用链接 -->
      <v-window-item key="convenient_service" value="convenient_service">
        <v-row>
        <v-col v-for="item in state.convenient_service" cols="3">
          <v-hover><template v-slot:default="{ isHovering, props }">
          <a class="kstb-convenient_service-item" :class="isHovering ? 'bg-primary bg-hover text-white' : undefined" v-bind="props" :href="item.href">{{item.text}}</a>
          </template></v-hover>
        </v-col>
      </v-row></v-window-item>
    </v-window>
  </section>  
</template>
<script setup>
    
    import { reactive } from 'vue'
    const state = reactive({
      model: 'across_handle',
      acrossHandleModel: 0,
      across_handle: [
        {tab: "操作系统", src: "/media/hopeos/desktop.png", href: "/hopeos", links: ["HopeOS 操作系统", "从零手写 UEFI", "内存管理 / 调度器 / GUI / ring3 POSIX，一个学习操作系统原理的项目。"]},
        {tab: "安全研究", src: "/media/placeholders/security.svg", href: "https://github.com/NanoTurtle1145/root-my-s9280", links: ["RootMyS9280", "CVE-2026-43499 提权", "基于 CVE-2026-43499 临时提权 + KernelSU，不熔断 KNOX。"]},
        {tab: "游戏开发", src: "/media/placeholders/game.svg", href: "https://github.com/BusyMitten/HopeCraft", links: ["HopeCraft", "Minecraft 服务器插件", "NT & BM 联合推出的 Bukkit 插件，实现服务器菜单等功能。"]},
        {tab: "在线评测", src: "/media/placeholders/techshare.svg", href: "http://hopeoj.asia/", links: ["HopeOJ", "Hydro 内核", "工作室的 OJ 系统，基于 Hydro，持续开放。"]}
      ],
      business_environment_left: {
        title: "学习路线",
        items: ["操作系统原理", "桌面应用开发", "网络编程", "逆向与安全"]
      },
      business_environment_right: [
        {title: "技术笔记", items: [
          {text: "WinUI 3 笔记", href: "/posts/winui-notes"},
          {text: "刷机经验", href: "/posts?q=刷机"},
          {text: "网络编程", href: "/posts/uwp-multithreaded-chatroom"},
          {text: "开发工具", href: "/posts"}
        ]},
        {title: "文章归档", items: [
          {text: "工作室公告", href: "/posts?q=工作室公告"},
          {text: "历史资料", href: "/posts?q=历史资料"},
          {text: "日常分享", href: "/posts?q=分享"},
          {text: "技术分享", href: "/posts"}
        ]},
        {title: "项目文档", items: [
          {text: "HopeOS", href: "/hopeos"},
          {text: "HopeCraft", href: "https://github.com/BusyMitten/HopeCraft"},
          {text: "RootMyS9280", href: "https://github.com/NanoTurtle1145/root-my-s9280"},
          {text: "HopeOJ", href: "http://hopeoj.asia/"}
        ]}
      ],
      convenient_service: [
        {text: "归档官网", href: "/archive"},
        {text: "个人博客", href: "https://ntblog.cn"},
        {text: "友情链接", href: "/friends"},
        {text: "HopeOJ", href: "http://hopeoj.asia/"},
        {text: "GitHub 组织", href: "https://github.com/NanoTurtle1145"},
        {text: "本站源码", href: "https://github.com/NanoTurtle1145/nanoturtle1145.github.io"},
        {text: "WinUI 笔记", href: "/posts/winui-notes"},
        {text: "加入我们", href: "/join"}
      ]
    })
    function onSkip(href, self) {
      if (self) { open(href, '_self')
      } else { open(href) }
    } 
</script>
<style lang="sass" scoped>
  @use "@/styles/variable" as *
  .kstb
    margin: 3.2rem 0 0
    &__content
      height: 17.9rem
      padding: 8px
    &-leftbox
      display: block
      float: left
      padding-top: 24px !important
      box-sizing: border-box
      cursor: pointer
      box-shadow: 0 0 1.5rem 0 rgba(9,41,77,.12) !important
      transition: all .3s ease
      &-title
        font-size: $header-6-font-size !important
        font-weight: $header-font-weight !important 
        line-height: $header-6-line-height !important
        font-family: $body-font-family
        letter-spacing: normal
        text-transform: none
      &-text
        font-family: PingFangSC-Regular
        font-size: $body-1-font-size !important
        line-height: $body-1-line-height !important
    &-rightbox
      margin-left: 300px
      border: 1px solid #dfe1e2 !important
      overflow: hidden
      padding-top: 1.6rem
      padding-bottom: 1.6rem      
      &-tab
        font-size: $body-1-font-size !important
        font-weight: $header-font-weight !important 
        line-height: $body-1-line-height !important
        font-family: $body-font-family
        letter-spacing: normal
        text-transform: none
        &:hover
          color: rgb(var(--v-theme-primary)) !important
      &-column
        padding: 0 .8rem 1.5rem 1.6rem !important
        box-sizing: border-box
        position: relative
        &:before
          position: absolute
          content: ""
          height: 10.5rem
          border-left: 1px solid #dfe1e2
          left: 0
        &-title
          font-size: $header-6-font-size !important
          font-weight: $header-font-weight !important 
          line-height: $header-6-line-height !important
          font-family: $body-font-family
          letter-spacing: normal
          text-transform: none
          color: $header-color
          margin-bottom: 1.2rem
        &-item
          font-size: $body-1-font-size !important
          font-weight: normal 
          line-height: $body-1-line-height !important
          font-family: $body-font-family
          letter-spacing: normal
          text-transform: none
          color: $body-1-color
          margin-top: .8rem
          &:hover
            color: rgb(var(--v-theme-primary))
          &:before
            content: "●"
            margin-right: .5rem
      &-info
        margin-left: 15rem
        &-title
          font-size: $header-6-font-size !important
          font-weight: $header-font-weight !important
          line-height: $header-6-line-height !important
          letter-spacing: normal
          font-family: $body-font-family
          text-transform: none
          color: $header-color
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap        
        &-subtitle
          font-size: $body-1-font-size !important
          font-weight: normal
          line-height: normal
          letter-spacing: normal
          font-family: $body-font-family
          text-transform: none
          color: $header-color
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap        
        &-text
          font-size: $body-2-font-size !important
          font-weight: normal
          line-height: $body-2-line-height !important
          letter-spacing: normal
          font-family: $body-font-family
          text-transform: none
          color: $body-1-color
          overflow: hidden
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 6
          -webkit-box-orient: vertical
    &-convenient_service
      &-item
        font-size: $body-1-font-size !important
        font-weight: normal
        line-height: 3rem
        letter-spacing: normal
        font-family: $body-font-family
        text-transform: none
        height: 3rem
        white-space: nowrap
        overflow: hidden
        transition: all .3s ease
        display: block
        text-overflow: ellipsis
        padding: 0 1rem
        color: $header-color
        background: #f1f2f3  
</style>