<template>
  <footer class="site-foot">
    <div class="wrap foot">
      <p>© 2026 希望工作室 · 浙ICP备2025195202号-1</p>
      <p class="foot-links">
        <a href="https://github.com/NanoTurtle1145">GitHub</a>
        <a href="https://blog.nanoturtle.cn">个人博客</a>
        <a href="/archive">归档处</a>
      </p>
    </div>
  </footer>
</template>
<style lang="sass" scoped>
  .site-foot
    border-top: 1px solid #23252a
    margin-top: 72px
    .wrap
      max-width: 1120px
      margin: 0 auto
      padding: 26px 32px 40px
      display: flex
      align-items: center
      justify-content: space-between
      gap: 16px
      flex-wrap: wrap
    p
      margin: 0
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace
      font-size: 11px
      color: #8a8f98
      letter-spacing: .04em
    a
      color: #8a8f98
      &:hover
        color: #f7f8f8
    .foot-links
      display: flex
      gap: 14px

  @media (max-width: 820px)
    .wrap
      padding: 20px 20px 32px
      justify-content: center
      text-align: center
</style>