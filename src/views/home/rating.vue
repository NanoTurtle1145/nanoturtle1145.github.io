<template>
  <section id="rating" class="rating">
  <v-container>
    <a class="header-1 text-white" href="/about">
      <span>工作室数据</span>
      <v-icon icon="mdi-arrow-right-thick" size="x-small" end></v-icon>
    </a>      
    <!-- content -->
    <v-row class="rating__content mt-6">
      <v-col v-for="rating in ratingData" cols="6" lg="3">
        <div  class="rating-item" :class="mdAndDown ? 'ma-n3' : undefined" >
          <a class="rating-item-tip" :href="rating.href">{{rating.title}}</a>        
          <div class="rating-item-data">
            <a :href="rating.href">{{rating.value}}</a>{{rating.unit}}
          </div>          
        </div>
      </v-col>
    </v-row>
  </v-container>  
  </section>  
</template>
<script setup>
  
  import { computed } from 'vue' 
  import { useDisplay } from 'vuetify';
  import { posts } from '../../data/posts'
  const { mdAndDown } = useDisplay()   
  const ratingData = computed(() => [
    { "title": "文章", "value": `${posts.length}+`, "unit": "篇", "href": "/posts" },
    { "title": "项目", "value": "4", "unit": "个+", "href": "/projects" },
    { "title": "成员", "value": "5", "unit": "人+", "href": "/members" },
    { "title": "成立", "value": "2019", "unit": "年", "href": "/about" }
  ])  
</script>
<style lang="sass">
@use "@/styles/variable" as *

// 数据条：近黑 + 薰衣草辉光（Linear），排版仍为政务的四格数据
.rating
  margin: 3.2rem 0 0
  padding: 2.8rem 0 3.2rem
  width: 100%
  background: radial-gradient(120% 180% at 85% -10%, rgba(94,106,210,.18) 0%, transparent 55%), #0b0c0e
  border-top: 1px solid #23252a
  border-bottom: 1px solid #23252a

  &__content
    display: flex
    align-items: center
    justify-content: space-between

  &-item
    padding: .6rem 1.3rem
    &-tip
      font-size: $body-1-font-size
      line-height: $body-1-line-height
      color: #8a8f98
    &-data
      font-size: $body-1-font-size
      line-height: $body-1-line-height
      color: #f7f8f8
      margin-top: .35rem
      white-space: nowrap
      a
        font-size: 2.4rem
        line-height: 2.8rem
        color: #ffffff
        margin-right: .3rem
        &:hover
          color: #8b94f5
</style>