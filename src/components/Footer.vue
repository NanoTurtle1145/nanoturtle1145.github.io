<template><v-footer class="d-flex flex-column pa-0">
  <div class="bg-background-color w-100 py-4">
    <v-container>
      <v-row>
        <v-col class="pa-lg-3 pa-1" cols="6" lg="3">
          <v-sheet class="information">
            <div class="information-title">站点导航</div>
            <v-row class="information-items">
              <v-col v-for="info in state.website_information" cols="6">
                <a href="">{{info}}</a>
              </v-col>
            </v-row>        
          </v-sheet>
        </v-col>
        <v-col class="pa-lg-3 pa-1" cols="6" lg="3">
          <v-sheet class="contactUS">
            <div class="contactUS-title">联系方式</div>
            <div class="contactUS-content">
              <a class="contactUS-ysx" href="/join">
                <v-avatar class="mr-2" size="24" color="primary" icon="mdi-email"></v-avatar>
                <span>发送邮件给我们</span>
              </a>                        
              <div  class="mt-4">
                <span class="mr-12">邮箱：guixiabaifo2022@outlook.com</span>
                <a class="text-black" href="/join">联系信息</a>
              </div>
            </div>
          </v-sheet>
        </v-col>

        <v-col class="pa-lg-3 pa-1" cols="6" lg="3">
          <a href="" class="quickMark-item" v-for="item in state.quickMark.list">
            <v-avatar size="24" rounded="0" :image="state.quickMark.icon"></v-avatar>
            <span class="pl-4">{{item.title}}</span>            
          </a>
        </v-col>

        <v-col class="pa-lg-3 pa-1" cols="6" lg="3">
          <a class="quickMark-item" href="https://github.com/NanoTurtle1145">
            <v-avatar size="24" rounded="0" icon="mdi-github" color="primary"></v-avatar>
            <span class="pl-4">GitHub</span>
          </a>
          <a class="quickMark-item" href="https://blog.nanoturtle.cn">
            <v-avatar size="24" rounded="0" icon="mdi-blog" color="primary"></v-avatar>
            <span class="pl-4">博客</span>
          </a>
          <a class="quickMark-item" href="http://hopeoj.asia/">
            <v-avatar size="24" rounded="0" icon="mdi-school" color="primary"></v-avatar>
            <span class="pl-4">HopeOJ</span>
          </a>
          <a class="quickMark-item" href="/archive/">
            <v-avatar size="24" rounded="0" icon="mdi-archive" color="primary"></v-avatar>
            <span class="pl-4">归档站</span>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div class="copyright">
    <div class="d-flex justify-center" :class="name === 'xs' || name === 'sm' ? 'flex-column' : 'flex-row'">
      <div class="copyright-item" v-for="copyright in state.copyright">
        {{copyright.title}}: <a href="">{{copyright.value}}</a>
      </div>
    </div>
    <div class="d-flex justify-center" :class="name === 'xs' || name === 'sm' ? 'flex-column' : 'flex-row'">
      <div class="copyright-item" v-for="licence in state.licence">
        {{licence.title}}: <a href="">{{licence.value}}</a>
      </div>
    </div>
  </div>
</v-footer></template>
<script setup>
    
    import { reactive } from 'vue'
    import { useDisplay } from 'vuetify'
    const { name } = useDisplay()
    const state = reactive({
      website_information: ["关于我们", "加入我们", "友情链接", "归档官网"],
      quickMark: {
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABZ9sFAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD2SURBVHgB7ZixDoIwEIZ7jYkOJDqY+AiO/gMfQYd2cuAf8BlceQYXXV18BhNHBhMHBhI39NqrdC0cAu1d+CVN6d3XK3cXwDB8BAJ2MAzDMAzDMAzDMEwM3tsAj8cD7/c7Xq9X1Go1FItFVKtVHMcx3djE4w8PD5hMJhBCoNfrodfr/X6AEmk0Gj8/53I5VKtVWJblZ7PZ4GAyHhIbrVYr3u/3sG0b5XIZq9UKpVJJH4kQAvv9Xn8+Pp9PWC6X2G63sCyLRCQSiUQikUgkEolEIpFIJBKJRCKRSCQS6U/0BQAA//8qJm/gQqY4EAAAAABJRU5ErkJggg==",
        list: [
          {title: "GitHub 组织", url: "https://github.com/NanoTurtle1145"},
          {title: "个人博客", url: "https://blog.nanoturtle.cn"},
          {title: "HopeOJ", url: "http://hopeoj.asia/"}
        ]
      },
      copyright: [
        {title: "主办", value: "希望工作室"},
        {title: "承办", value: "Hope Studio"},
        {title: "技术支持", value: "NanoTurtle1145"},
        {title: "版权所有", value: "希望工作室"}
      ],
      licence: [
        {title: "浙ICP备", value: "2025195202号-1"},
        {title: "网站标识码", value: "440000084"}
      ]
    })

</script>
<style lang="sass" scoped>
  @use "@/styles/variable" as *  
  .information
    font-size: $body-1-font-size !important
    line-height: $body-1-line-height !important
    font-family: $body-font-family
    background: $sheet-color
    height: 100%
    &-title
      display: block
      font-weight: $header-font-weight !important
      line-height: $body-1-line-height !important
      color: var(--gov-header-color)
      padding: 1.2rem
    &-items
      line-height: $body-2-line-height !important
      padding: 0px 1.2rem
      margin-bottom: .4rem
      a
        color: var(--gov-header-color)

  .contactUS
    font-size: $body-1-font-size !important
    background: $sheet-color
    height: 100%
    &-title
      display: block
      font-weight: $header-font-weight !important
      line-height: $body-1-line-height !important
      color: var(--gov-header-color)
      padding: 1.2rem
    &-content
      padding: 0px 1.2rem
    &-ysx
      display: block
      color: var(--gov-header-color)
      padding-bottom: .8rem
      border-bottom: 1px dashed rgb(var(--v-theme-outline-variant))

  .quickMark-item
    display: block
    background: $sheet-color
    color: var(--gov-header-color)
    font-size: $body-1-font-size !important
    height: 60px
    line-height: 60px
    padding-left: 1.2rem
    &:not(:last-child)
      margin-bottom: 4px

  .support-left
    display: inline-block
    height: 100%
    width: 59%
    background: url(https://www.gdzwfw.gov.cn/portal/assets/img/cavil.501536e.jpg) no-repeat 50% var(--gov-sheet)
    background-size: 4.8rem 2.4rem
    color: transparent
    text-indent: 100%

  .support-right
    display: inline-block
    height: 100%
    width: 40%
    background: url(https://www.gdzwfw.gov.cn/portal/assets/img/red.19c24b7.png) no-repeat 50% var(--gov-sheet)
    background-size: 1.4rem auto
    white-space: nowrap
    overflow: hidden
    text-indent: 100%
    float: right

  .copyright
    padding: .4rem 0px
    text-align: center
    width: 100%
    background: $sheet-color
    &-item
      padding-right: .4rem
      font-size: $body-1-font-size !important      
      a
        color: var(--gov-header-color)
      .beian-img 
        width: 1rem
        height: 1rem
        vertical-align: text-bottom
</style>