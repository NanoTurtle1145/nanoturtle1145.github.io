<template>
<div class="header">
  <v-container>

    <!-- Toolbar -->

    <v-toolbar class="toolbar" color="transparent">
      <template v-slot:default>
        <a class="toolbar-logo" href="/">希望工作室</a>
        <span class="toolbar-title">Hope Studio</span>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn 
              class="ml-1" 
              variant="tonal" 
              rounded="0" 
              color="white" 
              v-bind="props" 
              size="small"
            >切换</v-btn>
          </template>
          <v-list>
            <v-list-item><v-list-item-title>希望工作室</v-list-item-title></v-list-item>
            <v-list-item><v-list-item-title>开发者专区</v-list-item-title></v-list-item>
            <v-list-item><v-list-item-title>其他公共服务</v-list-item-title></v-list-item>            
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <a class="toolbar-link d-none d-md-flex" v-for="link in links" :href="link.href">{{ link.name }}</a>
      </template>
      <template v-slot:extension>
        <v-tabs
          color="white"
          mandatory 
          align-tabs="center" 
          fixed-tabs
          height="48"
          ><v-tab  v-for="route in routes" :to="route.path">{{ route.name }}</v-tab>
        </v-tabs>                
      </template>
    </v-toolbar>

    <!-- Hero -->

    <v-row class="hero">
      <v-col>
        <a class="zwfw" href="/">希望工作室</a>
        <p class="hero-title">欢迎来到希望工作室</p>
        <v-text-field 
          class="mb-2"
          label="搜索文章或项目…" 
          variant="solo" 
          single-line
          hide-details
          append-inner-icon="mdi-magnify"
        >
        </v-text-field>
        <div class="popular">
          <span class="popular-title">热门搜索：</span>
          <v-chip 
            v-for="popular in populars" 
            class="ma-1" 
            href="/" 
            color="black"
            size="small" 
            label
          >{{popular}}</v-chip>             
        </div>
      </v-col>

      <v-sheet class="hero-rightbox d-none d-sm-flex flex-column" color="white">
        <v-banner class="pa-5" lines="two">
          <template v-slot:prepend>
            <v-avatar color="primary" icon="mdi-account"></v-avatar>
          </template>
          <v-banner-text class="px-0">
            <a class="text-primary" href="/join">加入工作室</a>
            ，和一群有趣的人一起写代码
          </v-banner-text>
        </v-banner>                       
        <v-tabs color="primary" bg-color="white" v-model="universalModel">
          <v-tab class="font-weight-black" value="personal">常用功能</v-tab>
          <v-tab class="font-weight-black" value="legal">快捷入口</v-tab>
        </v-tabs>
        <v-window v-model="universalModel" class="pb-6">
          <v-window-item class="universal" v-for="(universal, key) in universals" :value="key">          
            <v-row class="mt-2">
              <v-col  v-for="item in universal" cols="6" sm="12" md="12" lg="6" class="py-0">
                <v-list-item class="universal-item" href="/">{{item}}</v-list-item>
              </v-col>            
            </v-row>
          </v-window-item>
        </v-window>
      </v-sheet>  
    </v-row>
  </v-container>
</div>
</template>
<script setup lang="ts">
  import { useDisplay } from 'vuetify';
  import { ref } from 'vue';
    const routes = [
    {path: '/', name: '首页'},
    {path: '/posts', name: '文章'},
    {path: '/projects', name: '项目'},
    {path: '/members', name: '成员'},
    {path: '/about', name: '关于我们'},
    {path: '/join', name: '加入我们'},
    {path: '/friends', name: '友情链接'},
    {path: '/archive/', name: '归档官网'},
  ]
  const { name } = useDisplay()  
  const isEditing = false
  const links = [
    {name: '无障碍阅读', href: '/about'},
    {name: '个人博客', href: 'https://blog.nanoturtle.cn'},
    {name: '本站源码', href: 'https://github.com/NanoTurtle1145/nanoturtle1145.github.io'},
    {name: '加入我们', href: '/join'},
  ]
  const universalModel = ref()
  const populars = ref(["工作室公告", "技术笔记", "分享", "历史资料"])
  const universals = ref({
    personal: [ "查看全部文章", "最新文章", "项目一览", "HopeOS 详情", "成员列表", "关于我们", "加入我们", "友情链接" ],
    legal: [ "开源项目", "技术笔记", "归档官网", "个人博客", "GitHub 组织", "HopeOJ", "WinUI 笔记", "RootMyS9280" ]
  })
</script>
<style lang="sass" scoped>
  @use "@/styles/variable" as *
  .header
    background: linear-gradient(160deg, rgba(13,42,94,0.4) 0%, rgba(20,61,110,0.15) 100%), url("/media/placeholders/banner.svg") no-repeat center
    background-origin: padding-box
    background-position: 100% 100%
    background-size: cover
    .toolbar
      &-logo
        display: inline-block
        color: #ffffff !important
        font-size: $header-6-font-size !important
        font-weight: $header-font-weight
        line-height: $header-6-line-height !important
        height: 3rem
        line-height: 3rem
        text-decoration: none
      &-title
        color: white
        margin-right: .25rem
        // font
        font-size: $header-6-font-size !important
        font-weight: $header-font-weight
        line-height: $header-6-line-height !important
        &:before
          content: ""
          display: inline-block
          position: relative
          top: .2rem
          margin-right: 0.7rem
          width: .05rem
          height: .7rem
          background-color: white    
      &-link
        display: inline-block
        padding-left: 16px
        color: white
        // font
        font-size: $body-1-font-size
        font-family: $body-font-family
        &:not(:last-child):after
          content: ""
          display: inline-block
          position: relative
          background-color: #c5c8ca
          height: 16px
          width: 1px
          left: 8px
          top: 2px
    .hero
      padding: 2rem 0rem 2rem 0rem
      @media(min-width: 1280px)
        padding: 4rem 6rem 2rem 6rem
      &-title
        margin-bottom: 1.4rem
        line-height: 1
        overflow: hidden
        color: white
        // font
        font-size: 2.3rem
        font-family: $body-font-family
        text-overflow: ellipsis
        text-align: left
      .zwfw
        display: block
        vertical-align: bottom
        color: #ffffff
        font-size: $body-1-font-size
        font-weight: $header-font-weight
        font-family: $body-font-family
        height: 36px
        line-height: 36px
        margin-bottom: 16px
        text-decoration: none
      .popular
        &-title
          color: white
          // font
          font-size: $body-1-font-size !important
          line-height: $body-1-line-height !important
          font-weight: 500
      &-rightbox
        width: 18rem
        margin-left: 2rem
        .universal
          max-height: 156px
          &-item
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap 
            color: $body-1-color
            // font
            font-family: $body-font-family
            font-size: $body-1-font-size !important
            line-height: $body-1-line-height !important
            &:before
              content: "●"
              margin-right: .5rem
</style>