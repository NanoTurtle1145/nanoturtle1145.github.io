<template>
  <section id="portalPerson" class="portalPerson">
    <v-tabs 
      v-model="state.model" 
      slider-color="primary"
      color="primary" 
      height="64" 
      mandatory
    >
      <v-tab class="header-1" key="personal" value="personal">开发服务</v-tab>
      <v-tab class="header-1" key="legal" value="legal">学习方向</v-tab>
    </v-tabs>
    <a class="header-2 mt-6" href="/projects">
      <span>热门项目</span>
      <v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon>
    </a>
    <v-window v-model="state.model" mandatory>
      <v-window-item key="personal" value="personal">
        <v-row>
          <v-col class="mt-6" v-for="service in state.person.service" cols="6" lg="3">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-sheet 
                  class="service-box" 
                  :class="isHovering ? 'bg-primary-darken-1 bg-hover' : undefined" 
                  v-bind="props"
                >
                  <v-icon class="float-left" :icon="service.icon" color="primary" size="48"></v-icon>
                  <div class="service-right">
                    <a class="service-title" :href="service.href">{{service.title}}</a>
                    <div class="mt-2">
                      <a class="service-text" :href="link.href" v-for="link in service.links">{{link.text}}</a>
                    </div>
                  </div>
                </v-sheet>                
              </template>
            </v-hover>
          </v-col>
        </v-row>
        <div class="process">
          <a class="header-2" href="/posts">
            <span>热门主题</span><v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon>
          </a>
          <div class="process-item" v-for="event in state.person.life_event">
            <div class="process-item__line"></div>
            <a class="process-item__text" :href="event.href">{{ event.text }}</a>
          </div>
          <div class="process-item"><div class="process-item__line"></div></div>
        </div>
      </v-window-item>
      <v-window-item key="legal" value="legal">
        <v-row>
          <v-col class="mt-6"  v-for="service in state.legal.service" cols="6" lg="3">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-sheet 
                  class="service-box" 
                  :class="isHovering ? 'bg-primary-darken-1 bg-hover' : undefined" 
                  v-bind="props"
                >
                  <v-icon class="float-left" :icon="service.icon" color="primary" size="48"></v-icon>
                  <div class="service-right">
                    <a class="service-title" :href="service.href">{{service.title}}</a>
                    <div class="mt-2"><a class="service-text" :href="link.href" v-for="link in service.links">{{link.text}}</a></div>
                  </div>
                </v-sheet>                
              </template>
            </v-hover>            
          </v-col>          
        </v-row>
        <div class="process">
          <a class="header-2" href="/join">
            <span>快速浏览</span><v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon>
          </a>
          <div class="process-item" v-for="history in state.legal.enterprise_history">
            <div class="process-item__line"></div>
            <a class="process-item__text" :href="history.href">{{ history.text }}</a>
          </div>
          <div class="process-item"><div class="process-item__line"></div></div>
        </div>        
      </v-window-item>
    </v-window>    
  </section>  
</template>
<script setup>
    
    import { reactive } from 'vue'
    const state = reactive({
      model: 'personal',
      person: {
        service: [
          {title: "HopeOS", icon: "mdi-chip", href: "/hopeos", links: [{text: "项目详情", href: "/hopeos"}, {text: "开发日志", href: "/posts?q=HopeOS"}]},
          {title: "WinUI 笔记", icon: "mdi-notebook", href: "/posts/winui-notes", links: [{text: "阅读笔记", href: "/posts/winui-notes"}, {text: "全部文章", href: "/posts"}]},
          {title: "HopeCraft", icon: "mdi-minecraft", href: "https://github.com/BusyMitten/HopeCraft", links: [{text: "GitHub 仓库", href: "https://github.com/BusyMitten/HopeCraft"}, {text: "项目文档", href: "https://github.com/BusyMitten/HopeCraft"}]},
          {title: "RootMyS9280", icon: "mdi-cellphone", href: "https://github.com/NanoTurtle1145/root-my-s9280", links: [{text: "GitHub", href: "https://github.com/NanoTurtle1145/root-my-s9280"}, {text: "研究资料", href: "https://github.com/NanoTurtle1145/root-my-s9280"}]}
        ],
        life_event: [
          {text: "工作室公告", href: "/posts?q=工作室公告"},
          {text: "技术笔记", href: "/posts?q=技术笔记"},
          {text: "分享", href: "/posts?q=分享"},
          {text: "历史资料", href: "/posts?q=历史资料"}
        ],
      },
      legal: {
        service: [
          {title: "操作系统原理", icon: "mdi-chip", href: "/hopeos", links: [{text: "HopeOS", href: "/hopeos"}, {text: "内核笔记", href: "/posts?q=操作系统"}]},
          {title: "桌面应用开发", icon: "mdi-monitor", href: "/posts/winui-notes", links: [{text: "WinUI 笔记", href: "/posts/winui-notes"}, {text: "全部文章", href: "/posts"}]},
          {title: "网络编程", icon: "mdi-lan", href: "/posts/uwp-multithreaded-chatroom", links: [{text: "聊天室", href: "/posts/uwp-multithreaded-chatroom"}, {text: "文章归档", href: "/posts"}]},
          {title: "逆向与安全", icon: "mdi-shield", href: "https://github.com/NanoTurtle1145/root-my-s9280", links: [{text: "RootMyS9280", href: "https://github.com/NanoTurtle1145/root-my-s9280"}, {text: "副屏教程", href: "/posts/mobile-device-as-second-monitor"}]}
        ],
        enterprise_history: [
          {text: "加入我们", href: "/join"},
          {text: "归档官网", href: "/archive"},
          {text: "个人博客", href: "https://ntblog.cn"},
          {text: "GitHub", href: "https://github.com/NanoTurtle1145"}
        ],        
      }
    })
</script>
<style lang="sass" scoped>
  @use "@/styles/variable" as *
  .portalPerson
    padding-top: 1rem
    .service
      &-box
        width: 13.8rem
        height: 8.8rem
        padding: 1rem .8rem
        cursor: pointer
        transition: all .3s ease
      &-right
        margin-left: 64px
      &-title
        font-size: $header-6-font-size !important
        font-weight: $header-font-weight !important
        line-height: $header-6-line-height !important
        letter-spacing: normal
        font-family: $body-font-family
        text-transform: none
        display: block      
        text-align: baseline
        color: $header-color
      &-text
        display: block
        font-size: $body-1-font-size !important
        font-weight: normal
        line-height: normal
        letter-spacing: normal
        font-family: $body-font-family
        text-transform: none
        overflow: hidden
        text-overflow: ellipsis
        white-space: nowrap
        color: $body-1-color
        width: auto
        margin-top: .4rem
        &:hover
          text-decoration: underline
    .process
      display: flex
      padding-top: 40px
      padding-bottom: 56px  
      align-items: center
      justify-content: flex-start
      flex-wrap: wrap
      position: relative
      z-index: 10
      &-item
        display: inline-flex
        align-items: center
        padding: 0 .6rem
        &__line
          width: 1.6rem
          height: 2px
          background: $body-2-color
          margin-right: 12px
        &__text
          font-size: $body-1-font-size !important
          font-weight: normal
          line-height: $body-1-line-height !important
          letter-spacing: normal
          font-family: $body-font-family
          text-transform: none
          color: $header-color
          align-items: center
          cursor: pointer
          padding: .6rem 1.1rem
          background: #fff
          box-shadow: 0 0 1.5rem 0 rgba(9,41,77,.12)
          border-radius: 1.2rem
          display: flex
          align-items: center
          &:before
            content: " "
            width: 8px
            height: 8px
            background: rgb(var(--v-theme-primary))      
            border-radius: 50%
            margin-right: 12px
          &:hover
            color: rgb(var(--v-theme-primary))  
</style>