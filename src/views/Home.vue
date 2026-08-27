<template>
  <ServiceField /> 
  <v-container>
    <PortalGallery />
    <PortalPerson />
    <PortalKstb />
  </v-container>
  <Rating />  
  <News />
</template>
<script setup>
import ServiceField from './home/service-field.vue'
import PortalGallery from './home/portal-gallery.vue'
import PortalPerson from './home/portal-person.vue'
import PortalKstb from './home/portal-kstb.vue'
import Rating from './home/rating.vue'
import News from './home/news.vue'
</script>