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
        <button
          class="icon-btn theme-toggle"
          type="button"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          :aria-pressed="isDark"
          @click="toggle"
        >
          <!-- 深色下显示太阳（点它变浅色），浅色下显示月亮 -->
          <svg v-if="isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
        </button>
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
  import { useThemeMode } from "../composables/useThemeMode";

  const menuOpen = ref(false);
  const route = useRoute();
  const { isDark, toggle } = useThemeMode();
  // 路由变化后自动收起移动端菜单
  watch(
    () => route.fullPath,
    () => {
      menuOpen.value = false;
    }
  );
</script>
<style lang="sass" scoped>
  // 颜色全部走 style.css 的 --site-* 令牌（浅色/深色两套）
  $ink: var(--site-text)
  $muted: var(--site-muted)
  $subtle: var(--site-subtle)
  $line: var(--site-line)
  $accent: var(--site-accent)
  $tint-1: var(--site-tint-1)
  $tint-2: var(--site-tint-2)

  .site-nav
    position: sticky
    top: 0
    z-index: 100
    border-bottom: 1px solid $line
    background: var(--site-nav-bg)
    backdrop-filter: blur(14px)
    -webkit-backdrop-filter: blur(14px)
    // 滚动微光：底部发丝线下叠一层极淡的强调色辉光
    &::after
      content: ""
      position: absolute
      inset: auto 0 -1px 0
      height: 1px
      background: linear-gradient(90deg, transparent 0%, var(--site-nav-glow) 50%, transparent 100%)
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
    background: #fff /* logo 自带白底，徽章底色在两种主题下都保持白色 */
    box-shadow: 0 0 0 1px var(--site-line), 0 4px 14px rgba(0, 0, 0, .22), 0 0 16px var(--site-accent-soft)
    transition: box-shadow .25s ease, transform .25s ease
  .brand-mark-img
    width: 100%
    height: 100%
    display: block
    object-fit: cover
  .brand:hover .brand-mark
    transform: scale(1.08)
    box-shadow: 0 0 0 1px var(--site-accent-line), 0 6px 20px rgba(0, 0, 0, .24), 0 0 26px var(--site-accent-line)
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
        background: $tint-2
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
          background: linear-gradient(90deg, var(--site-accent), var(--site-accent-strong))
          box-shadow: 0 0 8px var(--site-accent-line)
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
      background: $tint-1
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
      background: var(--site-solid-btn-bg)
      color: var(--site-solid-btn-ink)
      &:hover
        background: var(--site-solid-btn-bg-hover)
        transform: translateY(-1px)
        box-shadow: 0 4px 16px var(--site-glow)

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
      background: $tint-1
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
    background: var(--site-nav-bg-strong)
    backdrop-filter: blur(14px)
    padding: 8px 18px 14px
    a
      font-size: 14px
      color: $muted
      padding: 10px 10px
      border-radius: var(--shape-sm)
      border-bottom: 1px solid var(--site-line-soft)
      transition: color .15s, background .15s, padding-left .2s
      &:hover
        color: $ink
        background: $tint-2
        padding-left: 14px
      &.router-link-active
        color: $ink
        background: var(--site-accent-soft)
    .m-menu-cta
      margin-top: 10px
      justify-content: center
      background: var(--site-solid-btn-bg)
      color: var(--site-solid-btn-ink)
      font-weight: 600
      border-radius: var(--shape-full)
      border-bottom: none
      &:hover
        background: var(--site-solid-btn-bg-hover)
        color: var(--site-solid-btn-ink)
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
