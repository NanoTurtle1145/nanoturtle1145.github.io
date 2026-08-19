<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";

const navName = ref("希望工作室");
const route = useRoute();

watch(
  () => route.meta.navName,
  (newName) => {
    navName.value = newName ? (newName as string) : "希望工作室";
  },
  { immediate: true }
);
</script>

<template>
  <v-app>
    <Navigation :nav-name="navName" />
    <v-main>
      <router-view></router-view>
    </v-main>
    <Footer />
  </v-app>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>
