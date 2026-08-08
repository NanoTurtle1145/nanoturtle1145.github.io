<script setup lang="ts">
defineProps<{
  title?: string;
  items?: { name: string; role: string; desc: string; avatar?: string }[];
}>();
</script>

<template>
  <section class="py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-4xl font-bold text-white mb-6">{{ title }}</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div
          v-for="(it, i) in items"
          :key="i"
          class="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6"
        >
          <img
            v-if="it.avatar"
            :src="it.avatar"
            class="w-20 h-20 rounded-xl object-cover mb-3"
            alt=""
          />
          <div
            v-else
            class="w-20 h-20 rounded-xl bg-gray-700 flex items-center justify-center text-gray-400 text-lg mb-3"
          >
            {{ (it.name || "?").charAt(0) }}
          </div>
          <h3 class="text-xl font-bold text-white mb-1">{{ it.name }}</h3>
          <p class="text-sm text-blue-300 mb-3">{{ it.role }}</p>
          <p class="text-gray-400">{{ it.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
