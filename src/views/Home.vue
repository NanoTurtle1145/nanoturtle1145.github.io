<template>
  <div class="home">
    <!-- Hero：全幅 banner —— 整屏背景图 + 左侧渐变遮罩 + 左下文案 + 底部探索条 -->
    <section id="hero" class="hero">
      <div class="hero-bg" aria-hidden="true">
        <img src="/media/hopeos/hero-banner.webp" alt="" fetchpriority="high" decoding="async" />
      </div>
      <div class="wrap hero-content">
        <div class="hero-intro">
          <p class="eyebrow"><i aria-hidden="true"></i>HOPE STUDIO — 学生技术兴趣团队</p>
          <h1>把好奇心写成<br /><span class="grad">能跑起来的东西。</span></h1>
          <p class="subtitle">HopeOS 0.2.0 · 从零手写的 UEFI 操作系统</p>
          <p class="lead">写桌面应用、折腾操作系统、把踩过的坑整理成文章。不追热点，只做能留下来的东西。</p>
          <div class="cta">
            <router-link class="btn btn-white" to="/hopeos">
              <span>了解 HopeOS</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </router-link>
            <router-link class="btn btn-ghost" to="/archive">看看我们做了什么</router-link>
          </div>
          <p class="meta"><b>2019</b> 年成立 · 浙江 · <b>{{ posts.length }}</b> 篇文章 / <b>4</b> 个项目 / <b>5</b> 名成员</p>
        </div>
      </div>
      <div class="wrap hero-bottom">
        <a class="explore" href="#panel">
          <span>探索我们的作品</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19.5 8.25-7.5 7.5-7.5-7.5"/></svg>
        </a>
        <span class="caption">QEMU 实拍 · HopeOS 0.2.0</span>
      </div>
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

    <!-- HopeOS：真实截图墙 + 能力清单 -->
    <section id="hopeos" class="wrap sec hopeos">
      <div class="sec-head">
        <p class="eyebrow"><i aria-hidden="true"></i>操作系统项目</p>
        <h2>从零手写的 <span class="grad">HopeOS</span></h2>
        <p class="lead">
          一个 x86-64 的 UEFI 操作系统：自己接管分页、中断与抢占式调度，写 VFS 与 ring 3
          的 POSIX 用户态，再把 GUI 栈一层层搭起来。最近连 X11 服务器和 IceWM
          窗口管理器都在里面跑起来了。
        </p>
        <div class="chips">
          <span>抢占式调度</span>
          <span>ring 3 + syscall</span>
          <span>VFS / ramfs</span>
          <span>自绘 GUI 桌面</span>
          <span>IceWM + X11</span>
          <span>GNU nano 移植</span>
          <span>StarDustUI C++17</span>
        </div>
      </div>

      <div class="shot-grid">
        <figure
          v-for="(s, i) in shots"
          :key="s.src"
          class="shot"
          :class="{ 'shot-lg': i === 0 }"
        >
          <img
            :src="s.src"
            :alt="s.alt"
            width="640"
            height="480"
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <b>{{ s.title }}</b>{{ s.text }}
          </figcaption>
        </figure>
      </div>

      <div class="cta cta-left">
        <router-link class="btn btn-white" to="/hopeos">
          <span>了解 HopeOS</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </router-link>
        <router-link class="btn btn-ghost" to="/hopeos">在线体验模拟器</router-link>
      </div>
    </section>

    <!-- 项目一览 -->
    <section id="projects" class="wrap sec">
      <div class="sec-head">
        <h2>项目一览</h2>
        <p class="lead">做过和正在做的一些东西，都还活着。</p>
      </div>
      <div class="proj-grid">
        <template v-for="p in projects" :key="p.name">
          <a
            v-if="p.external"
            class="proj"
            :href="p.link"
            target="_blank"
            rel="noopener"
          >
            <div class="proj-top">
              <h3>{{ p.name }}</h3>
              <span class="proj-arrow" aria-hidden="true">&#8599;</span>
            </div>
            <p>{{ p.desc }}</p>
            <div class="proj-tags">
              <span v-for="st in p.status" :key="st" class="tag" :class="`tag-${statusColor(st)}`">{{ st }}</span>
            </div>
          </a>
          <router-link v-else class="proj" :to="p.link">
            <div class="proj-top">
              <h3>{{ p.name }}</h3>
              <span class="proj-arrow" aria-hidden="true">&#8594;</span>
            </div>
            <p>{{ p.desc }}</p>
            <div class="proj-tags">
              <span v-for="st in p.status" :key="st" class="tag" :class="`tag-${statusColor(st)}`">{{ st }}</span>
            </div>
          </router-link>
        </template>
      </div>
      <router-link class="more" to="/projects">全部项目 →</router-link>
    </section>

    <!-- 团队 -->
    <section id="team" class="wrap sec">
      <div class="sec-head">
        <h2>做这些事的人</h2>
        <p class="lead">两个人起了个头，后来有人陆续加入。有些名字只留缩写。</p>
      </div>
      <div class="member-grid">
        <div v-for="m in admins" :key="m.name" class="member">
          <img
            v-if="m.avatar"
            class="member-avatar"
            :src="m.avatar"
            :alt="m.name"
            width="52"
            height="52"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="member-avatar member-avatar--text">{{ m.name.charAt(0) }}</div>
          <div class="member-body">
            <div class="member-name">{{ m.name }}</div>
            <div class="member-role">{{ m.role }}</div>
            <p class="member-desc">{{ m.desc }}</p>
          </div>
        </div>
      </div>
      <div class="chips member-chips">
        <span v-for="m in members" :key="m.name">{{ m.name }} · {{ m.role }}</span>
      </div>
      <router-link class="more" to="/members">全部成员 →</router-link>
    </section>

    <!-- 加入我们 -->
    <section id="join" class="wrap sec">
      <div class="join-band">
        <h2>有希望者，事竟成。</h2>
        <p>
          如果你也在折腾系统、写工具，或者只是想把踩过的坑记下来，
          欢迎进来一起做点能留下来的东西。
        </p>
        <div class="cta">
          <router-link class="btn btn-white" to="/join">
            <span>加入工作室</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </router-link>
          <router-link class="btn btn-ghost" to="/archive">逛逛归档处</router-link>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
  import { computed } from "vue";
  import { posts } from "../data/posts";
  import { projects, statusColor } from "../data/projects";
  import { admins, members } from "../data/members";

  const recent = computed(() =>
    [...posts]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 4)
      .map((p) => ({ ...p, shortDate: p.date.slice(5) }))
  );

  // HopeOS 截图墙：首图是桌面横幅，其余来自项目 docs/shots 的真实截屏
  const shots = [
    {
      src: "/media/hopeos/banner-hopeos.webp",
      alt: "HopeOS 桌面：计算器、系统信息、时钟与 IceWM 管理的 X11 窗口",
      title: "HopeOS 0.2.0 桌面",
      text: "计算器、系统信息、时钟和 IceWM 接管的 X11 窗口同时跑着，底部是 IceWM 与 HopeOS 两套任务栏。",
    },
    {
      src: "/media/hopeos/icewm-first-paint.png",
      alt: "IceWM 桌面首帧",
      title: "桌面首帧",
      text: "黑色桌面、底部任务栏与右侧 LED 时钟。",
    },
    {
      src: "/media/hopeos/icewm-managed-client.png",
      alt: "IceWM 接管的客户端窗口",
      title: "窗口管理",
      text: "收养窗口、标题、任务栏按钮与客户端内容渲染都已工作。",
    },
    {
      src: "/media/hopeos/gui-desktop.png",
      alt: "HopeOS 自绘图形桌面",
      title: "自绘 GUI 桌面",
      text: "gfx → wm → compositor → desktop 一整套自己写。",
    },
    {
      src: "/media/hopeos/start-menu.png",
      alt: "HopeOS 开始菜单",
      title: "开始菜单",
      text: "点「开始」拉起应用列表，Terminal / Notepad / FileMgr / Snake。",
    },
  ];
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

  // hero 入场：逐级上浮淡入
  @keyframes rise-in
    from
      opacity: 0
      transform: translateY(18px)
    to
      opacity: 1
      transform: translateY(0)

  // hero 背景：淡入 + 极缓慢推近（Ken Burns）
  @keyframes hero-fade
    from
      opacity: 0
    to
      opacity: 1

  @keyframes hero-zoom
    from
      transform: scale(1.06)
    to
      transform: scale(1)

  // 底部「探索我们的作品」箭头轻微浮动
  @keyframes hero-bounce
    0%, 100%
      transform: translateY(0)
    50%
      transform: translateY(4px)

  .home
    position: relative
    // 首页整体固定在近黑 Linear 画布上，避免任何浅色主题把白字 hero 顶成白底
    background: #010102
    min-height: 100vh
    overflow: clip

  .wrap
    width: 100%
    max-width: 1120px
    margin: 0 auto
    padding: 0 32px

  // 通用胶囊按钮（hero / HopeOS / 加入我们 共用）
  .btn
    display: inline-flex
    align-items: center
    gap: 8px
    height: 40px
    padding: 0 18px
    border-radius: var(--shape-full)
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

  // Hero：全幅 banner —— 整屏背景图 + 左侧渐变遮罩 + 左下文案 + 底部探索条
  .hero
    position: relative
    isolation: isolate
    display: flex
    align-items: flex-end
    min-height: calc(100svh - 63px) // 减掉 sticky 导航高度，首屏正好铺满
    overflow: hidden
    .hero-bg
      position: absolute
      inset: 0
      z-index: -1
      overflow: hidden
      background: #05060a
      img
        width: 100%
        height: 100%
        object-fit: cover
        object-position: right center
        animation: hero-fade 1.2s cubic-bezier(.05, .7, .1, 1) both, hero-zoom 22s cubic-bezier(.05, .7, .1, 1) both
      // 三层遮罩：顶部保导航可读 / 底部融入页面底色 / 左侧强力压暗给文案让位
      &::after
        content: ""
        position: absolute
        inset: 0
        background: linear-gradient(180deg, rgba(1, 1, 2, .78) 0%, rgba(1, 1, 2, .32) 12%, rgba(1, 1, 2, 0) 30%), linear-gradient(0deg, #010102 0%, rgba(1, 1, 2, .86) 14%, rgba(1, 1, 2, .46) 34%, rgba(1, 1, 2, .12) 58%, rgba(1, 1, 2, 0) 80%), linear-gradient(90deg, rgba(1, 1, 2, .98) 0%, rgba(1, 1, 2, .96) 30%, rgba(1, 1, 2, .86) 45%, rgba(1, 1, 2, .55) 62%, rgba(1, 1, 2, .18) 78%, rgba(1, 1, 2, 0) 92%)
    .hero-content
      position: relative
      width: 100%
      padding-top: 120px
      padding-bottom: 148px
    .hero-intro
      max-width: 660px
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
      border-radius: var(--shape-full)
      padding: 7px 14px
      background: rgba(255, 255, 255, .02)
      backdrop-filter: blur(6px)
      animation: rise-in .7s cubic-bezier(.05, .7, .1, 1) both
      i
        width: 6px
        height: 6px
        border-radius: 50%
        background: $accent
        box-shadow: 0 0 10px $accent
    h1
      margin: 0
      max-width: 820px
      font-size: clamp(40px, 5.2vw, 76px)
      line-height: 1.06
      letter-spacing: -.022em
      font-weight: 600
      color: $ink
      text-wrap: balance
      animation: rise-in .7s .12s cubic-bezier(.05, .7, .1, 1) both
      .grad
        background: linear-gradient(180deg, #f7f8f8 0%, #8a8f98 100%)
        -webkit-background-clip: text
        background-clip: text
        color: transparent
    .subtitle
      margin: 22px 0 0
      font-size: clamp(16px, 1.5vw, 20px)
      font-weight: 500
      letter-spacing: .01em
      color: $ink-2
      animation: rise-in .7s .18s cubic-bezier(.05, .7, .1, 1) both
    .lead
      max-width: 520px
      margin: 16px 0 0
      color: $muted
      font-size: 16px
      line-height: 1.75
      animation: rise-in .7s .24s cubic-bezier(.05, .7, .1, 1) both
    .cta
      display: flex
      gap: 12px
      margin-top: 30px
      animation: rise-in .7s .32s cubic-bezier(.05, .7, .1, 1) both
    .meta
      margin: 30px 0 0
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
      font-size: 11.5px
      letter-spacing: .06em
      color: $muted
      animation: rise-in .7s .42s cubic-bezier(.05, .7, .1, 1) both
      b
        color: $ink-2
        font-weight: 500
    // 底部探索条：左「探索我们的作品 ↓」+ 右落款
    .hero-bottom
      position: absolute
      left: 0
      right: 0
      bottom: 26px
      display: flex
      align-items: center
      justify-content: space-between
      gap: 24px
      animation: rise-in .8s .5s cubic-bezier(.05, .7, .1, 1) both
      .explore
        display: inline-flex
        align-items: center
        gap: 12px
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
        font-size: 12px
        letter-spacing: .08em
        color: $muted
        transition: color .2s ease
        svg
          width: 14px
          height: 14px
          stroke: currentColor
          fill: none
          stroke-width: 1.6
          animation: hero-bounce 2.4s ease-in-out infinite
        &:hover
          color: $ink
      .caption
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
        font-size: 11.5px
        letter-spacing: .08em
        color: $subtle

  .panel
    margin-top: 40px
    border: 1px solid $line
    border-radius: var(--shape-md)
    background: linear-gradient(180deg, rgba(21, 22, 23, .92), rgba(12, 13, 14, .96))
    box-shadow: 0 40px 90px -40px rgba(0, 0, 0, .9), 0 1px 0 rgba(255, 255, 255, .04) inset
    overflow: hidden
    animation: rise-in .8s .5s cubic-bezier(.05, .7, .1, 1) both
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
        border-radius: var(--shape-xs)
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
          border-radius: var(--shape-sm)
          display: flex
          align-items: center
          gap: 9px
          &::before
            content: ""
            width: 13px
            height: 13px
            border-radius: var(--shape-xs)
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
            transition: background .2s ease, padding-left .2s ease
            &:last-child
              border-bottom: 0
            &:hover
              background: rgba(255, 255, 255, .022)
              padding-left: 6px
            .cat
              flex: none
              font-size: 10.5px
              color: #a9b0f4
              background: $accent-soft
              border: 1px solid rgba(94, 106, 210, .28)
              border-radius: var(--shape-xs)
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
            border-radius: var(--shape-sm)
            padding: 13px 14px
            background: rgba(255, 255, 255, .012)
            transition: border-color .25s ease, background .25s ease, transform .25s ease
            &:hover
              border-color: rgba(139, 148, 245, .45)
              background: rgba(139, 148, 245, .06)
              transform: translateY(-2px)
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
    // features 区逐级入场
    > .feature:nth-child(1)
      animation: rise-in .7s .55s cubic-bezier(.05, .7, .1, 1) both
    > .feature:nth-child(2)
      animation: rise-in .7s .65s cubic-bezier(.05, .7, .1, 1) both
    > .feature:nth-child(3)
      animation: rise-in .7s .75s cubic-bezier(.05, .7, .1, 1) both

  // ---------- 新增板块通用 ----------
  .sec
    margin-top: 96px

  .sec-head
    max-width: 720px
    margin-bottom: 34px
    h2
      margin: 0
      font-size: clamp(26px, 3vw, 38px)
      line-height: 1.15
      letter-spacing: -.022em
      font-weight: 600
      color: $ink
      .grad
        background: linear-gradient(180deg, #f7f8f8 0%, #8a8f98 100%)
        -webkit-background-clip: text
        background-clip: text
        color: transparent
    .lead
      margin: 16px 0 0
      font-size: 15px
      line-height: 1.8
      color: $muted
    .eyebrow
      display: inline-flex
      align-items: center
      gap: 9px
      margin: 0 0 18px
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
      font-size: 11px
      letter-spacing: .16em
      text-transform: uppercase
      color: $muted
      i
        width: 6px
        height: 6px
        border-radius: 50%
        background: $accent
        box-shadow: 0 0 10px $accent

  .chips
    display: flex
    flex-wrap: wrap
    gap: 8px
    margin-top: 20px
    span
      font-size: 12px
      color: $ink-2
      border: 1px solid $line
      border-radius: var(--shape-full)
      padding: 5px 11px
      background: rgba(255, 255, 255, .015)
      transition: border-color .2s ease, color .2s ease, background .2s ease
      &:hover
        border-color: rgba(139, 148, 245, .5)
        color: #fff
        background: rgba(139, 148, 245, .08)

  .more
    display: inline-block
    margin-top: 20px
    font-size: 13px
    color: $muted
    transition: color .2s ease, transform .2s ease
    &:hover
      color: $accent
      transform: translateX(3px)

  // ---------- HopeOS 截图墙 ----------
  .hopeos
    .cta
      display: flex
      gap: 12px
      margin-top: 28px

  .shot-grid
    display: grid
    grid-template-columns: repeat(3, minmax(0, 1fr))
    gap: 14px

  .shot
    margin: 0
    border: 1px solid $line
    border-radius: var(--shape-md)
    overflow: hidden
    background: linear-gradient(180deg, rgba(21, 22, 23, .9), rgba(12, 13, 14, .95))
    transition: transform .3s cubic-bezier(.4, 0, .2, 1), border-color .3s ease, box-shadow .3s ease
    &:hover
      transform: translateY(-4px)
      border-color: rgba(139, 148, 245, .45)
      box-shadow: 0 20px 44px -24px rgba(94, 106, 210, .7)
    img
      display: block
      width: 100%
      aspect-ratio: 4 / 3
      object-fit: cover
      border-bottom: 1px solid $line-soft
      background: #000
    figcaption
      padding: 12px 14px 14px
      font-size: 12.5px
      line-height: 1.7
      color: $muted
      b
        display: block
        margin-bottom: 3px
        font-size: 13px
        font-weight: 600
        color: $ink-2

  .shot-lg
    grid-column: span 2

  // ---------- 项目一览 ----------
  .proj-grid
    display: grid
    grid-template-columns: repeat(2, minmax(0, 1fr))
    gap: 14px

  .proj
    display: block
    border: 1px solid $line
    border-radius: var(--shape-md)
    padding: 22px
    background: rgba(255, 255, 255, .012)
    transition: transform .3s cubic-bezier(.4, 0, .2, 1), border-color .3s ease, background .3s ease, box-shadow .3s ease
    &:hover
      transform: translateY(-4px)
      border-color: rgba(139, 148, 245, .45)
      background: rgba(139, 148, 245, .05)
      box-shadow: 0 20px 44px -26px rgba(94, 106, 210, .8)
      .proj-arrow
        color: $accent
        transform: translate(2px, -2px)
    .proj-top
      display: flex
      align-items: center
      justify-content: space-between
      gap: 12px
      h3
        margin: 0
        font-size: 15px
        font-weight: 600
        letter-spacing: -.005em
        color: $ink
    .proj-arrow
      flex: none
      font-size: 14px
      color: $subtle
      transition: color .2s ease, transform .2s ease
    p
      margin: 10px 0 16px
      font-size: 13px
      line-height: 1.75
      color: $muted
    .proj-tags
      display: flex
      flex-wrap: wrap
      gap: 6px
      .tag
        font-size: 10.5px
        padding: 2px 8px
        border-radius: var(--shape-xs)
        border: 1px solid transparent
        letter-spacing: .02em
      .tag-info
        color: #9fc4ff
        background: rgba(96, 165, 250, .12)
        border-color: rgba(96, 165, 250, .3)
      .tag-success
        color: #8ee2b0
        background: rgba(74, 222, 128, .12)
        border-color: rgba(74, 222, 128, .3)
      .tag-warning
        color: #f0cd86
        background: rgba(250, 204, 21, .12)
        border-color: rgba(250, 204, 21, .3)
      .tag-error
        color: #f3a3a3
        background: rgba(248, 113, 113, .12)
        border-color: rgba(248, 113, 113, .3)
      .tag-grey
        color: $muted
        background: rgba(255, 255, 255, .05)
        border-color: $line

  // ---------- 团队 ----------
  .member-grid
    display: grid
    grid-template-columns: repeat(2, minmax(0, 1fr))
    gap: 14px

  .member
    display: flex
    gap: 14px
    border: 1px solid $line
    border-radius: var(--shape-md)
    padding: 20px
    background: rgba(255, 255, 255, .012)
    transition: transform .3s cubic-bezier(.4, 0, .2, 1), border-color .3s ease, background .3s ease
    &:hover
      transform: translateY(-3px)
      border-color: rgba(139, 148, 245, .4)
      background: rgba(139, 148, 245, .05)
    .member-avatar
      flex: none
      width: 52px
      height: 52px
      border-radius: var(--shape-md)
      object-fit: cover
      border: 1px solid $line
      background: $surface-2
    .member-avatar--text
      display: flex
      align-items: center
      justify-content: center
      font-size: 18px
      color: $ink-2
    .member-body
      min-width: 0
    .member-name
      font-size: 14px
      font-weight: 600
      color: $ink
    .member-role
      margin-top: 3px
      font-size: 11.5px
      color: #a9b0f4
    .member-desc
      margin: 9px 0 0
      font-size: 12.5px
      line-height: 1.7
      color: $muted
      display: -webkit-box
      -webkit-line-clamp: 3
      -webkit-box-orient: vertical
      overflow: hidden

  .member-chips
    margin-top: 14px

  // ---------- 加入我们 ----------
  .join-band
    position: relative
    border: 1px solid $line
    border-radius: var(--shape-xl)
    padding: 52px 40px
    text-align: center
    overflow: hidden
    background: linear-gradient(180deg, rgba(21, 22, 23, .92), rgba(12, 13, 14, .96))
    box-shadow: 0 40px 90px -50px rgba(0, 0, 0, .95)
    &::before
      content: ""
      position: absolute
      inset: 0
      pointer-events: none
      background: radial-gradient(ellipse 60% 120% at 50% 0%, rgba(94, 106, 210, .22) 0%, transparent 68%)
    > *
      position: relative
    h2
      margin: 0
      font-size: clamp(24px, 3vw, 34px)
      letter-spacing: -.02em
      font-weight: 600
      color: $ink
    p
      max-width: 560px
      margin: 16px auto 0
      font-size: 14.5px
      line-height: 1.8
      color: $muted
    .cta
      display: flex
      justify-content: center
      gap: 12px
      margin-top: 28px

  @media (max-width: 820px)
    .wrap
      padding: 0 20px
    .hero
      min-height: calc(100svh - 62px)
      .hero-bg img
        object-position: 62% center
      // 移动端：文案占满宽度，加大整体压暗，让图只在上半部透气
      .hero-bg::after
        background: linear-gradient(180deg, rgba(1, 1, 2, .5) 0%, rgba(1, 1, 2, .68) 28%, rgba(1, 1, 2, .92) 54%, #010102 76%), linear-gradient(90deg, rgba(1, 1, 2, .92) 0%, rgba(1, 1, 2, .8) 48%, rgba(1, 1, 2, .6) 100%)
      .hero-content
        padding-top: 92px
        padding-bottom: 112px
      h1
        font-size: clamp(32px, 8.6vw, 46px)
      .subtitle
        font-size: 15px
        margin-top: 16px
      .lead
        font-size: 15px
        margin-top: 14px
      .cta
        flex-direction: column
        align-items: stretch
        max-width: 320px
        margin-top: 24px
        .btn
          justify-content: center
      .meta
        font-size: 10.5px
        line-height: 1.9
      .hero-bottom
        bottom: 18px
        .caption
          display: none
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
    .hero-bg img,
    .explore svg,
    .hero .eyebrow,
    .hero h1,
    .hero .subtitle,
    .hero .lead,
    .hero .cta,
    .hero .meta,
    .hero-bottom,
    .panel,
    .features > .feature
      animation: none

  @media (max-width: 900px)
    .sec
      margin-top: 72px
    .shot-grid
      grid-template-columns: repeat(2, minmax(0, 1fr))
    .proj-grid,
    .member-grid
      grid-template-columns: 1fr

  @media (max-width: 820px)
    .join-band
      padding: 36px 20px
    .hopeos .cta,
    .join-band .cta
      flex-direction: column
      align-items: stretch
      max-width: 320px
      margin-left: auto
      margin-right: auto
      .btn
        justify-content: center

  @media (max-width: 560px)
    .shot-grid
      grid-template-columns: 1fr
    .shot-lg
      grid-column: span 1
    .sec-head
      margin-bottom: 24px
</style>