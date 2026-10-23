<script setup lang="ts">
import { useHead } from "@vueuse/head";
import { projects, statusColor } from "../data/projects";

useHead({
  title: "项目 | 希望工作室",
  meta: [{ name: "description", content: "希望工作室的项目一览。" }],
});
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 1024px">
    <div class="mb-8">
      <div class="gov-header-1 mb-2">
        <span>项目</span>
        <v-icon icon="mdi-arrow-right-thick" size="x-small" end />
      </div>
      <div class="text-body-1" style="color: var(--gov-body-1); font-family: var(--gov-font-family);">
        Under Construction… 工作室做过和正在做的一些东西。
      </div>
    </div>

    <v-row>
      <v-col v-for="p in projects" :key="p.name" cols="12" md="6">
        <v-card elevation="0" hover class="h-100 d-flex flex-column justify-space-between">
          <v-card-text>
            <div class="d-flex align-center ga-3 mb-3">
              <div class="text-title-medium font-weight-bold text-on-surface">{{ p.name }}</div>
              <v-chip
                v-for="(st, idx) in p.status"
                :key="idx"
                size="x-small"
                :color="statusColor(st)"
                variant="tonal"
              >
                {{ st }}
              </v-chip>
            </div>
            <div class="text-body-2 text-medium-emphasis mb-4">{{ p.desc }}</div>
          </v-card-text>
          <v-card-actions>
            <a
              v-if="p.external"
              :href="p.link"
              target="_blank"
              rel="noopener"
              class="text-decoration-none"
            >
              <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
                前往
              </v-btn>
            </a>
            <router-link v-else :to="p.link" class="text-decoration-none">
              <v-btn variant="text" color="primary" append-icon="mdi-arrow-right">
                了解更多
              </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


