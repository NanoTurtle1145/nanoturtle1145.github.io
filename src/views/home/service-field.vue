<template>
  <section id="serviceField" class="notice" aria-label="最新动态">
    <v-container>
      <div class="notice-inner">
        <span class="notice-label">最新动态</span>
        <div class="notice-list">
          <router-link
            v-for="post in latest"
            :key="post.slug"
            class="notice-item"
            :to="`/posts/${post.slug}`"
          >
            <span class="notice-dot" aria-hidden="true"></span>
            <span class="notice-title" :title="post.title">{{ post.title }}</span>
            <time class="notice-date" :datetime="post.date">{{ post.shortDate }}</time>
          </router-link>
        </div>
        <router-link class="notice-more" to="/posts">
          <span>全部文章</span>
          <v-icon icon="mdi-arrow-right" size="14" />
        </router-link>
      </div>
    </v-container>
  </section>
</template>
<script setup>
  import { computed } from 'vue'
  import { posts } from '../../data/posts'

  // 首页首屏下方的一条「最新动态」：3 条最新文章，作为 hero 与正文之间的过渡带
  const latest = computed(() =>
    [...posts]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 3)
      .map((p) => ({ ...p, shortDate: p.date.slice(5) }))
  )
</script>
<style lang="sass" scoped>
  @use "@/styles/variable" as *

  .notice
    background: #0f1011
    border-top: 1px solid #23252a
    border-bottom: 1px solid #23252a
    &-inner
      display: flex
      align-items: center
      gap: 2rem
      min-height: 3.4rem
      padding: .55rem 0
    &-label
      flex: none
      display: inline-flex
      align-items: center
      color: rgb(var(--v-theme-primary))
      font-family: $heading-font-family
      font-size: $body-1-font-size
      font-weight: 600
      &::before
        content: ""
        display: inline-block
        width: .3rem
        height: 1rem
        margin-right: .5rem
        background: linear-gradient(180deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-primary)))
    &-list
      display: flex
      flex: 1
      gap: 2.2rem
      min-width: 0
    &-item
      display: inline-flex
      flex: 1 1 0
      align-items: center
      gap: .45rem
      min-width: 0
      color: #d0d6e0
      font-family: $body-font-family
      font-size: .78rem
      &:hover
        color: #8b94f5
    &-dot
      flex: none
      width: .3rem
      height: .3rem
      border-radius: 50%
      background: rgba(var(--v-theme-primary), .5)
    &-title
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    &-date
      flex: none
      color: #62666d
      font-size: .7rem
      font-variant-numeric: tabular-nums
    &-more
      flex: none
      display: inline-flex
      align-items: center
      gap: .2rem
      color: #8a8f98
      font-size: .72rem
      &:hover
        color: #8b94f5

  @media (max-width: 960px)
    .notice-inner
      gap: 1rem
    .notice-item:nth-child(n+2)
      display: none
    .notice-date
      display: none
    .notice-more
      font-size: .7rem
</style>
