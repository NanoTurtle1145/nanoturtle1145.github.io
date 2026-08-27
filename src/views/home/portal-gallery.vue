<template>
  <section id="portalGallery" class="portalGallery">

    <a class="header-1" href="/projects">
      <span>工作室特色</span>
      <v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon>
    </a>      
    <!-- content -->
    <v-slide-group class="mt-6" v-model="galleryModel">
      <template v-slot:next><v-btn icon='mdi-chevron-right'></v-btn></template>
      <template v-slot:prev><v-btn icon='mdi-chevron-left'></v-btn></template>      
      <v-slide-group-item v-for='gallery in gallerys' v-slot='{ isSelected, toggle, selectedClass }'>
        <v-hover><template v-slot:default="{ isHovering, props }">
        <v-card 
          class="gallery" 
          :class="isHovering ? 'bg-primary bg-hover' : undefined"
          :href="gallery.href"
          v-bind="props"
          elevation="2"
          :width="xs ? 460 : 280" 
          rounded="0" 
        >
          <v-img cover :src="gallery.src" :alt="gallery.title">
            <v-chip 
              v-if="gallery.chip" 
              class="ma-2 float-right"
              color="red" 
              variant="flat" 
              size="small" 
            >{{gallery.chip}}</v-chip>
          </v-img>
          <v-card-item>
            <div 
              class="gallery-title" 
              :class="isHovering ? 'text-white' : undefined"
            >
              {{gallery.title}}
            </div>
            <div 
              class="gallery-text" 
              :class="isHovering ? 'text-white' : undefined"
            >
              {{gallery.text}}
            </div>
          </v-card-item>
        </v-card>
        </template></v-hover>
      </v-slide-group-item>
    </v-slide-group>
  </section>
</template>
<script setup>
        import { ref } from 'vue'
    import { useDisplay } from 'vuetify'

    const { xs } = useDisplay()
    const gallerys = ref([
    { src: "/media/hopeos/desktop.png", href: "/hopeos", title: "HopeOS 操作系统", text: "从零编写的 UEFI 操作系统，用于学习操作系统运行原理", chip: "进行中" },
    { src: "/media/placeholders/security.svg", href: "https://github.com/NanoTurtle1145/root-my-s9280", title: "RootMyS9280", text: "三星 S24 Ultra 免解锁 Root：CVE-2026-43499 提权 + KernelSU", chip: "开源" },
    { src: "/media/image-5-17beee60.png", href: "/posts/winui-notes", title: "WinUI 笔记", text: "面向 WinUI 3 的学习笔记系列，持续迭代更新" },
    { src: "/media/hope-group.jpg", href: "/about", title: "希望工作室", text: "一个由学生组成的技术兴趣团队，有希望者，事竟成" },
    { src: "/media/1757775592-xiaoguo-a797a3c7.png", href: "/posts", title: "技术分享", text: "从设备刷机到多线程网络编程，把踩过的坑写成可复用经验" },
    { src: "/media/placeholders/game.svg", href: "https://github.com/BusyMitten/HopeCraft", title: "HopeCraft", text: "NT & BM 联合推出的 Minecraft 服务器插件", chip: "开源" },
    ])
    const galleryModel = ref()
</script>
<style lang="sass" scoped>
@use "@/styles/variable" as *  
.portalGallery
  padding: 2rem 0 0
  .gallery
    margin-right: 24px
    margin-bottom: 4px
    transition: all .3s ease !important
    &-title
      font-size: $header-6-font-size !important
      font-weight: $header-font-weight !important
      line-height: $header-6-line-height !important
      letter-spacing: normal
      font-family: $body-font-family
      text-transform: none
      display: block      
      overflow: hidden
      text-overflow: ellipsis
      text-align: left
      color: $header-color
    &-text
      font-size: $body-1-font-size !important
      font-weight: normal
      line-height: $body-1-line-height !important
      letter-spacing: normal
      font-family: $body-font-family
      text-transform: none
      display: -webkit-box
      -webkit-box-orient: vertical
      -webkit-line-clamp: 2
      overflow: hidden
      text-overflow: ellipsis
      text-align: left
      height: auto
      color: $body-2-color
</style>