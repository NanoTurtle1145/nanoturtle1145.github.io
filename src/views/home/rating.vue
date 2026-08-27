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

.rating
  margin: 3.2rem 0 0
  padding: 2.8rem 0 3.2rem
  width: 100%
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, #143d6e 100%)
  background-size: 100% 100%
  background-position: 50%

  &__content
    display: flex
    align-items: center
    justify-content: space-between
    @media screen and (max-width: 1279px)
      >
        :nth-child(1)
          border-right: 1px solid #e1e4e8
        :nth-child(2)
          border-bottom: 1px solid #e1e4e8      
        :nth-child(3)
          border-top: 1px solid #e1e4e8
        :nth-child(4)
          border-left: 1px solid #e1e4e8
  &-star
    vertical-align: bottom
    padding-bottom: 6px
  &-item
    background: hsla(0,0%,100%,.15)
    padding: 1.5rem 1.3rem 1.5rem 1.4rem !important
    color: white
    border: 1px solid hsla(0,0%,100%,.28)
    backdrop-filter: blur(10px)
    -webkit-backdrop-filter: blur(10px)
    transition: background .35s var(--md3e-motion-emphasized), transform .35s var(--md3e-motion-emphasized-decelerate)
    &:hover
      background: hsla(0,0%,100%,.24)
      transform: translateY(-4px)
    &-tip
      font-size: $body-1-font-size
      line-height: $body-1-line-height
      color: inherit
    &-data
      font-size: $body-1-font-size
      line-height: $body-1-line-height
      color: inherit
      margin-top: .8rem
      white-space: nowrap
      a
        font-size: 2.4rem
        line-height: 2.8rem
        color: inherit
        margin-right: .3rem
        &:hover
          color: rgb(var(--v-theme-primary))  
</style>