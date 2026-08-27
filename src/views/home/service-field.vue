<template>
  <section id="serviceField" class="service-field">
    <v-container>
      <v-row>
        <v-banner class="bg-transparent" border="none">
          <template v-slot:prepend>
            <v-avatar icon="mdi-room-service-outline"></v-avatar>
          </template>       
          <template v-slot:text>
            <p class="service-field-title">有希望者，事竟成。</p>
            <p class="service-field-text">Where there is a hope, there is a way.</p>            
          </template>          
        </v-banner>
        <v-col class="d-none d-md-flex align-center">
          <v-hover v-for="link in outLinks"><template v-slot:default="{ isHovering, props }">
            <a :href="link.href" class="text-decoration-none">
              <v-btn
                v-bind="props"
                :class="isHovering ? 'bg-primary' : undefined"
                class="service-field-item mr-2" 
                variant="flat" 
                rounded="0" 
                density="comfortable">{{link.text}}</v-btn>
            </a>
          </template></v-hover>
          
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn class="service-field-item" size="x-small" height="28" width="28" rounded="0" variant="flat" density="comfortable" v-bind="props">
                <v-icon icon="mdi-chevron-down"></v-icon>        
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(link, index) in innerLinks" :key="index" :value="index">
                <a :href="link.href" class="text-decoration-none">
                  <v-list-item-title class="service-field-item">{{ link.text }}</v-list-item-title>
                </a>
              </v-list-item>
            </v-list>
          </v-menu>          
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script setup>
  const outLinks = [
    {text: "全部文章", href: "/posts"},
    {text: "项目一览", href: "/projects"},
    {text: "成员列表", href: "/members"},
    {text: "关于我们", href: "/about"},
    {text: "加入我们", href: "/join"},
    {text: "友情链接", href: "/friends"}
  ]
  const innerLinks = [
    {text: "归档官网", href: "/archive"},
    {text: "HopeOS", href: "/hopeos"},
    {text: "个人博客", href: "https://ntblog.cn"}
  ]
</script>
<style lang="sass" scoped>
  @use "@/styles/variable" as *
  .service-field
    background: $background-color
    &-title
      font-size: $body-1-font-size !important
      font-weight: $header-font-weight !important
      line-height: $body-1-line-height !important
      letter-spacing: normal
      font-family: $body-font-family
      color: $header-color
    &-text
      font-size: $body-2-font-size !important
      font-weight: normal
      line-height: $body-2-line-height !important
      letter-spacing: normal
      font-family: $body-font-family
      color: $body-2-color
    &-item
      font-size: $body-1-font-size !important
      font-weight: $header-font-weight !important
      line-height: $body-1-line-height !important
      letter-spacing: normal
      font-family: $body-font-family
      color: $header-color
</style>




