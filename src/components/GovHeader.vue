<template>
  <header class="site-nav">
    <div class="wrap nav">
      <router-link class="brand" to="/">
        <span class="brand-mark" aria-hidden="true">
          <img src="/logo.svg" alt="" class="brand-mark-img" width="22" height="22" />
        </span>
        <span>希望工作室</span>
        <em>Hope Studio</em>
      </router-link>

      <nav class="links" aria-label="主导航">
        <router-link to="/">首页</router-link>
        <router-link to="/posts">文章</router-link>
        <router-link to="/projects">项目</router-link>
        <router-link to="/members">成员</router-link>
        <router-link to="/archive">归档处</router-link>
        <router-link to="/hopeos">HopeOS</router-link>
      </nav>

      <div class="nav-right">
        <router-link class="icon-btn" to="/posts" aria-label="搜索" title="搜索">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        </router-link>
        <router-link class="btn btn-white btn-sm" to="/join">加入我们</router-link>
        <button
          class="menu-toggle"
          :class="{ open: menuOpen }"
          aria-label="打开菜单"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <transition name="m-menu">
      <nav v-if="menuOpen" class="m-menu" aria-label="移动端导航">
        <router-link to="/" @click="menuOpen = false">首页</router-link>
        <router-link to="/posts" @click="menuOpen = false">文章</router-link>
        <router-link to="/projects" @click="menuOpen = false">项目</router-link>
        <router-link to="/members" @click="menuOpen = false">成员</router-link>
        <router-link to="/archive" @click="menuOpen = false">归档处</router-link>
        <router-link to="/hopeos" @click="menuOpen = false">HopeOS</router-link>
        <router-link to="/join" class="m-menu-cta" @click="menuOpen = false">加入我们</router-link>
      </nav>
    </transition>
  </header>
</template>
<script setup lang="ts">
  import { ref, watch } from "vue";
  import { useRoute } from "vue-router";

  const menuOpen = ref(false);
  const route = useRoute();
  // 路由变化后自动收起移动端菜单
  watch(
    () => route.fullPath,
    () => {
      menuOpen.value = false;
    }
  );
</script>
<style lang="sass" scoped>
  $ink: #f7f8f8
  $muted: #8a8f98
  $subtle: #62666d
  $line: #23252a
  $accent: #8b94f5

  .site-nav
    position: sticky
    top: 0
    z-index: 100
    border-bottom: 1px solid $line
    background: rgba(1, 1, 2, .72)
    backdrop-filter: blur(14px)
    -webkit-backdrop-filter: blur(14px)
    // 滚动微光：底部发丝线下叠一层极淡的薰衣草辉光
    &::after
      content: ""
      position: absolute
      inset: auto 0 -1px 0
      height: 1px
      background: linear-gradient(90deg, transparent 0%, rgba(139, 148, 245, .5) 50%, transparent 100%)
      opacity: .6
      pointer-events: none
  .wrap
    max-width: 1120px
    margin: 0 auto
    padding: 0 32px
  .nav
    display: flex
    align-items: center
    gap: 26px
    height: 62px
  .brand
    display: inline-flex
    align-items: center
    gap: 10px
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Microsoft YaHei", Arial, sans-serif
    font-size: 15px
    font-weight: 600
    letter-spacing: -.01em
    white-space: nowrap
    color: $ink
    transition: opacity .15s ease
    &:hover
      opacity: .88
    em
      font-style: normal
      color: $subtle
      font-weight: 400
      font-size: 13px
  // 品牌徽章：真实 logo 收进圆角「应用图标」里（自带白底，两种主题下都成立）
  .brand-mark
    position: relative
    display: inline-flex
    align-items: center
    justify-content: center
    width: 22px
    height: 22px
    border-radius: var(--shape-sm)
    overflow: hidden
    background: #fff
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .18), 0 4px 14px rgba(0, 0, 0, .45), 0 0 16px rgba(94, 106, 210, .35)
    transition: box-shadow .25s ease, transform .25s ease
  .brand-mark-img
    width: 100%
    height: 100%
    display: block
    object-fit: cover
  .brand:hover .brand-mark
    transform: scale(1.08)
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .28), 0 6px 20px rgba(0, 0, 0, .5), 0 0 26px rgba(94, 106, 210, .75)
  .links
    display: flex
    gap: 4px
    margin-left: 6px
    a
      position: relative
      font-size: 13.5px
      color: $muted
      padding: 7px 10px
      border-radius: var(--shape-sm)
      transition: color .15s, background .15s
      &:hover
        color: $ink
        background: rgba(255, 255, 255, .045)
      &.router-link-active
        color: $ink
        &::after
          content: ""
          position: absolute
          left: 10px
          right: 10px
          bottom: 2px
          height: 2px
          border-radius: 1px
          background: linear-gradient(90deg, #5e6ad2, #9aa3ff)
          box-shadow: 0 0 8px rgba(94, 106, 210, .6)
  .nav-right
    margin-left: auto
    display: flex
    align-items: center
    gap: 8px
  .icon-btn
    display: inline-flex
    align-items: center
    justify-content: center
    width: 32px
    height: 32px
    border-radius: var(--shape-sm)
    color: $muted
    border: 1px solid transparent
    background: transparent
    cursor: pointer
    padding: 0
    transition: color .15s, border-color .15s, background .15s, transform .15s
    &:hover
      color: $ink
      border-color: $line
      background: rgba(255, 255, 255, .03)
      transform: scale(1.06)
  .btn
    display: inline-flex
    align-items: center
    justify-content: center
    height: 30px
    padding: 0 13px
    border-radius: var(--shape-full)
    font-size: 12.5px
    font-weight: 500
    border: 1px solid transparent
    transition: transform .15s ease, background .15s ease, box-shadow .2s ease
    &.btn-white
      background: #fff
      color: #08090a
      &:hover
        background: #e9eaee
        transform: translateY(-1px)
        box-shadow: 0 4px 16px rgba(255, 255, 255, .12)

  // 移动端汉堡按钮
  .menu-toggle
    display: none
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 4px
    width: 32px
    height: 32px
    border: 1px solid transparent
    border-radius: var(--shape-sm)
    background: transparent
    cursor: pointer
    padding: 0
    transition: border-color .15s, background .15s
    span
      display: block
      width: 14px
      height: 1.5px
      border-radius: 1px
      background: $ink
      transition: transform .25s ease, opacity .2s ease
    &:hover
      border-color: $line
      background: rgba(255, 255, 255, .03)
    &.open
      span:nth-child(1)
        transform: translateY(5.5px) rotate(45deg)
      span:nth-child(2)
        opacity: 0
      span:nth-child(3)
        transform: translateY(-5.5px) rotate(-45deg)

  // 移动端下拉菜单
  .m-menu
    display: flex
    flex-direction: column
    border-bottom: 1px solid $line
    background: rgba(1, 1, 2, .96)
    backdrop-filter: blur(14px)
    padding: 8px 18px 14px
    a
      font-size: 14px
      color: $muted
      padding: 10px 10px
      border-radius: var(--shape-sm)
      border-bottom: 1px solid rgba(255, 255, 255, .04)
      transition: color .15s, background .15s, padding-left .2s
      &:hover
        color: $ink
        background: rgba(255, 255, 255, .04)
        padding-left: 14px
      &.router-link-active
        color: $ink
        background: rgba(94, 106, 210, .1)
    .m-menu-cta
      margin-top: 10px
      justify-content: center
      background: #fff
      color: #08090a
      font-weight: 600
      border-radius: var(--shape-full)
      border-bottom: none
      &:hover
        background: #e9eaee
        color: #08090a
        padding-left: 10px
  .m-menu-enter-active
    transition: opacity .22s ease, transform .22s ease
  .m-menu-leave-active
    transition: opacity .16s ease, transform .16s ease
  .m-menu-enter-from,
  .m-menu-leave-to
    opacity: 0
    transform: translateY(-8px)

  @media (max-width: 820px)
    .wrap
      padding: 0 18px
    .links
      display: none
    .brand em
      display: none
    .menu-toggle
      display: flex
</style>
