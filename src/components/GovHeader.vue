<template>
  <header class="site-nav">
    <div class="wrap nav">
      <router-link class="brand" to="/">
        <span class="brand-mark" aria-hidden="true"></span>
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
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
  </script>
<style lang="sass" scoped>
  $ink: #f7f8f8
  $muted: #8a8f98
  $subtle: #62666d
  $line: #23252a

  .site-nav
    position: sticky
    top: 0
    z-index: 100
    border-bottom: 1px solid $line
    background: rgba(1, 1, 2, .72)
    backdrop-filter: blur(14px)
    -webkit-backdrop-filter: blur(14px)
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
    em
      font-style: normal
      color: $subtle
      font-weight: 400
      font-size: 13px
  .brand-mark
    width: 18px
    height: 18px
    border-radius: 5px
    background: linear-gradient(135deg, #fff 0%, #9aa3ff 55%, #8b94f5 100%)
    box-shadow: 0 0 0 1px rgba(255, 255, 255, .14) inset, 0 0 18px rgba(94, 106, 210, .5)
  .links
    display: flex
    gap: 4px
    margin-left: 6px
    a
      font-size: 13.5px
      color: $muted
      padding: 7px 10px
      border-radius: 6px
      transition: color .15s, background .15s
      &:hover
        color: $ink
        background: rgba(255, 255, 255, .045)
      &.router-link-active
        color: $ink
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
    border-radius: 6px
    color: $muted
    border: 1px solid transparent
    background: transparent
    cursor: pointer
    padding: 0
    &:hover
      color: $ink
      border-color: $line
      background: rgba(255, 255, 255, .03)
  .btn
    display: inline-flex
    align-items: center
    justify-content: center
    height: 30px
    padding: 0 13px
    border-radius: 999px
    font-size: 12.5px
    font-weight: 500
    border: 1px solid transparent
    &.btn-white
      background: #fff
      color: #08090a
      &:hover
        background: #e9eaee

  @media (max-width: 820px)
    .wrap
      padding: 0 18px
    .links
      display: none
    .brand em
      display: none
</style>
