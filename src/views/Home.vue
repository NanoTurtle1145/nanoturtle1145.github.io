<template>
  <div class="home">
    <section id="hero" class="wrap hero">
      <p class="eyebrow"><i aria-hidden="true"></i>HOPE STUDIO — 学生技术兴趣团队</p>
      <h1>把好奇心写成<br /><span class="grad">能跑起来的东西。</span></h1>
      <p class="lead">写桌面应用、折腾操作系统、把踩过的坑整理成文章。不追热点，只做能留下来的东西。</p>
      <div class="cta">
        <router-link class="btn btn-white" to="/archive">
          <span>看看我们做了什么</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </router-link>
        <router-link class="btn btn-ghost" to="/join">加入工作室</router-link>
      </div>
      <p class="meta"><b>2019</b> 年成立 · 浙江 · <b>{{ posts.length }}</b> 篇文章 / <b>4</b> 个项目 / <b>5</b> 名成员</p>
    </section>

    <section id="panel" class="wrap">
      <div class="panel">
        <div class="panel-bar">
          <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="addr">hopestudio.top</span>
          <span class="ver">2026.10</span>
        </div>
        <div class="panel-body">
          <aside class="rail" aria-hidden="true">
            <router-link class="rail-item is-active" to="/">首页</router-link>
            <router-link class="rail-item" to="/posts">文章</router-link>
            <router-link class="rail-item" to="/projects">项目</router-link>
            <router-link class="rail-item" to="/archive">归档处</router-link>
            <div class="rail-sep"></div>
            <router-link class="rail-item" to="/hopeos">HopeOS</router-link>
            <router-link class="rail-item" to="/about">关于我们</router-link>
          </aside>
          <div class="panel-main">
            <div class="panel-head">
              <span class="panel-title">最近更新</span>
              <router-link class="panel-link" to="/posts">全部文章 →</router-link>
            </div>
            <ul class="list">
              <li v-for="p in recent" :key="p.slug">
                <span class="cat">{{ p.category }}</span>
                <router-link class="t" :to="`/posts/${p.slug}`" :title="p.title">{{ p.title }}</router-link>
                <span class="d">{{ p.shortDate }}</span>
              </li>
            </ul>
            <div class="stats">
              <div class="stat"><b>{{ posts.length }}</b><span>篇文章</span></div>
              <div class="stat"><b>4</b><span>个项目</span></div>
              <div class="stat"><b>5</b><span>名成员</span></div>
              <div class="stat"><b>2019</b><span>年成立</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="wrap features">
      <div class="feature">
        <h3>写出来</h3>
        <p>WinUI 笔记、UWP 多线程聊天室、Minecraft 服务器插件——从作业做到能用的工具。</p>
      </div>
      <div class="feature">
        <h3>留下来</h3>
        <p>{{ posts.length }} 篇文章与配图整理进归档处，链接失效前先备份，资料比流量重要。</p>
      </div>
      <div class="feature">
        <h3>传下去</h3>
        <p>踩过的坑写成文档：三星 root 研究、系统美化、驱动移植，都在 GitHub 上。</p>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
  import { computed } from "vue";
  import { posts } from "../data/posts";

  const recent = computed(() =>
    [...posts]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 4)
      .map((p) => ({ ...p, shortDate: p.date.slice(5) }))
  );
</script>
<style lang="sass" scoped>
  $bg: #010102
  $surface: #0f1011
  $surface-2: #151617
  $line: #23252a
  $line-soft: #1a1c20
  $ink: #f7f8f8
  $ink-2: #d0d6e0
  $muted: #8a8f98
  $subtle: #62666d
  $accent: #8b94f5
  $accent-soft: rgba(94, 106, 210, .16)

  .home
    position: relative
    // Linear 标志性的顶部薰衣草辉光（叠加在近黑画布上，制造纵深）
    &::before
      content: ""
      position: fixed
      inset: 0
      z-index: 0
      pointer-events: none
      background: radial-gradient(ellipse 72% 46% at 50% -6%, rgba(94, 106, 210, .16) 0%, transparent 62%)

  .wrap
    width: 100%
    max-width: 1120px
    margin: 0 auto
    padding: 0 32px

  .hero
    padding: 104px 32px 56px
    text-align: center
    position: relative
    .eyebrow
      display: inline-flex
      align-items: center
      gap: 9px
      margin: 0 0 26px
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
      font-size: 11.5px
      letter-spacing: .16em
      text-transform: uppercase
      color: $muted
      border: 1px solid $line
      border-radius: 999px
      padding: 7px 14px
      background: rgba(255, 255, 255, .02)
      i
        width: 6px
        height: 6px
        border-radius: 50%
        background: $accent
        box-shadow: 0 0 10px $accent
    h1
      margin: 0 auto
      max-width: 900px
      font-size: clamp(40px, 5.5vw, 80px)
      line-height: 1.06
      letter-spacing: -.022em
      font-weight: 600
      color: $ink
      .grad
        background: linear-gradient(180deg, #f7f8f8 0%, #8a8f98 100%)
        -webkit-background-clip: text
        background-clip: text
        color: transparent
    .lead
      max-width: 600px
      margin: 26px auto 0
      color: $muted
      font-size: 16px
      line-height: 1.75
    .cta
      display: flex
      justify-content: center
      gap: 12px
      margin-top: 32px
      .btn
        display: inline-flex
        align-items: center
        gap: 8px
        height: 40px
        padding: 0 18px
        border-radius: 999px
        font-size: 14px
        font-weight: 500
        border: 1px solid transparent
        transition: transform .15s ease, background .15s ease, border-color .15s ease
        svg
          width: 14px
          height: 14px
          stroke: currentColor
          stroke-width: 2
          fill: none
      .btn-white
        background: #fff
        color: #08090a
        &:hover
          background: #e9eaee
          transform: translateY(-1px)
      .btn-ghost
        border-color: $line
        color: $ink-2
        background: rgba(255, 255, 255, .015)
        &:hover
          border-color: #3a3d45
          color: #fff
          background: rgba(255, 255, 255, .04)
    .meta
      margin: 34px 0 0
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
      font-size: 11.5px
      letter-spacing: .06em
      color: $muted
      b
        color: $ink-2
        font-weight: 500

  .panel
    margin-top: 40px
    border: 1px solid $line
    border-radius: 14px
    background: linear-gradient(180deg, rgba(21, 22, 23, .92), rgba(12, 13, 14, .96))
    box-shadow: 0 40px 90px -40px rgba(0, 0, 0, .9), 0 1px 0 rgba(255, 255, 255, .04) inset
    overflow: hidden
    .panel-bar
      display: flex
      align-items: center
      gap: 14px
      height: 42px
      padding: 0 16px
      border-bottom: 1px solid $line-soft
      background: rgba(255, 255, 255, .012)
      .dots
        display: flex
        gap: 6px
        i
          width: 9px
          height: 9px
          border-radius: 50%
          background: #2a2c31
      .addr
        margin: 0 auto
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
        font-size: 11px
        color: $subtle
        border: 1px solid $line-soft
        border-radius: 6px
        padding: 4px 12px
        background: rgba(0, 0, 0, .35)
      .ver
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
        font-size: 10.5px
        color: $subtle
        letter-spacing: .08em
    .panel-body
      display: grid
      grid-template-columns: 194px minmax(0, 1fr)
      min-height: 352px
      .rail
        border-right: 1px solid $line-soft
        padding: 18px 12px
        display: flex
        flex-direction: column
        gap: 2px
        background: rgba(255, 255, 255, .008)
        .rail-item
          font-size: 13px
          color: $muted
          padding: 8px 10px
          border-radius: 7px
          display: flex
          align-items: center
          gap: 9px
          &::before
            content: ""
            width: 13px
            height: 13px
            border-radius: 4px
            border: 1px solid #2c2f35
            background: rgba(255, 255, 255, .02)
          &.is-active
            color: $ink
            background: rgba(255, 255, 255, .055)
            &::before
              background: linear-gradient(135deg, #5e6ad2, #9aa3ff)
              border-color: transparent
        .rail-sep
          height: 1px
          background: $line-soft
          margin: 10px 4px
      .panel-main
        padding: 22px 24px 24px
        .panel-head
          display: flex
          align-items: baseline
          justify-content: space-between
          gap: 16px
          margin-bottom: 8px
          .panel-title
            font-size: 13px
            color: $ink-2
            font-weight: 600
          .panel-link
            font-size: 12px
            color: $muted
            &:hover
              color: $accent
        .list
          list-style: none
          margin: 0
          padding: 0
          li
            display: flex
            align-items: center
            gap: 12px
            padding: 11px 0
            border-bottom: 1px solid $line-soft
            &:last-child
              border-bottom: 0
            .cat
              flex: none
              font-size: 10.5px
              color: #a9b0f4
              background: $accent-soft
              border: 1px solid rgba(94, 106, 210, .28)
              border-radius: 5px
              padding: 2px 7px
              letter-spacing: .02em
            .t
              flex: 1
              min-width: 0
              font-size: 13.5px
              color: $ink-2
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
              &:hover
                color: #fff
            .d
              flex: none
              font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
              font-size: 11px
              color: $subtle
        .stats
          display: grid
          grid-template-columns: repeat(4, minmax(0, 1fr))
          gap: 10px
          margin-top: 20px
          .stat
            border: 1px solid $line-soft
            border-radius: 8px
            padding: 13px 14px
            background: rgba(255, 255, 255, .012)
            b
              display: block
              font-size: 21px
              font-weight: 600
              letter-spacing: -.02em
              color: $ink
            span
              display: block
              margin-top: 3px
              font-size: 11px
              color: $subtle

  .features
    display: grid
    grid-template-columns: repeat(3, minmax(0, 1fr))
    gap: 0
    margin-top: 72px
    border-top: 1px solid $line-soft
    .feature
      padding: 30px 28px 8px 0
      & + .feature
        padding-left: 28px
        border-left: 1px solid $line-soft
      h3
        margin: 0 0 10px
        font-size: 15px
        font-weight: 600
        letter-spacing: -.005em
        display: flex
        align-items: center
        gap: 9px
        color: $ink
        &::before
          content: ""
          width: 5px
          height: 5px
          border-radius: 50%
          background: $accent
          box-shadow: 0 0 10px $accent
      p
        margin: 0
        font-size: 13.5px
        line-height: 1.75
        color: $muted

  @media (max-width: 820px)
    .wrap
      padding: 0 20px
    .hero
      padding: 64px 20px 40px
      .lead
        font-size: 15px
        margin-top: 20px
      .cta
        flex-direction: column
        align-items: stretch
        max-width: 320px
        margin: 26px auto 0
        .btn
          justify-content: center
      .meta
        font-size: 10.5px
        line-height: 1.9
    .panel
      .panel-body
        grid-template-columns: 1fr
        .rail
          display: none
        .panel-main
          padding: 18px 16px 20px
          .stats
            grid-template-columns: repeat(2, minmax(0, 1fr))
    .features
      grid-template-columns: 1fr
      margin-top: 52px
      .feature
        padding: 22px 0 0
        & + .feature
          padding-left: 0
          border-left: 0
          border-top: 1px solid $line-soft
          margin-top: 20px

  @media (prefers-reduced-motion: reduce)
    .hero .cta .btn
      transition: none
</style>