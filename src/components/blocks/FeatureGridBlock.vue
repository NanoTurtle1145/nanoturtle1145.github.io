<script setup lang="ts">
defineProps<{
  title?: string;
  columns?: number;
  items?: { title: string; desc: string; link?: string }[];
}>();
</script>

<template>
  <section class="feature-section py-12 px-4">
    <div class="container mx-auto">
      <h2 class="section-title mb-6">{{ title }}</h2>
      <div
        :style="{
          display: 'grid',
          gap: '32px',
          gridTemplateColumns: `repeat(${columns || 2}, minmax(0, 1fr))`,
        }"
      >
        <v-card
          v-for="(it, i) in items"
          :key="i"
          elevation="0"
          hover
          class="feature-card"
          :class="{'feature-card--active': i === 0}"
        >
          <v-card-text class="feature-content">
            <div
              class="feature-number d-inline-flex align-center justify-center font-weight-bold mb-4"
              :class="i % 2 === 0 ? 'feature-number--primary' : 'feature-number--secondary'"
              style="font-family: var(--md3e-font-mono); font-size: 1.25rem"
            >
              {{ String(i + 1).padStart(2, "0") }}
            </div>
            <div class="feature-title text-title-medium font-weight-bold text-on-surface mb-2">
              {{ it.title }}
            </div>
            <p class="feature-description text-body-2 text-medium-emphasis mb-4">{{ it.desc }}</p>
            <a
              v-if="it.link"
              :href="it.link"
              class="feature-link text-primary text-decoration-none d-inline-flex align-center"
            >
              了解更多
              <v-icon icon="mdi-arrow-right" size="small" class="ml-1 feature-link-icon" />
            </a>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-section {
  position: relative;
}

.feature-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(var(--v-theme-primary), 0.05) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1080px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, transparent 100%);
  border-radius: var(--shape-xs);
}

.feature-card {
  position: relative;
  z-index: 1;
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgb(var(--v-theme-outline-variant), 0.6) !important;
  border-radius: var(--shape-md) !important;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-tertiary)) 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.15),
    0 16px 48px rgba(var(--v-theme-primary), 0.1) !important;
  border-color: rgb(var(--v-theme-primary), 0.8) !important;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-content {
  padding: 2rem !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.feature-number {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--shape-md);
  transition: all 0.3s ease;
}

.feature-number--primary {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.feature-number--secondary {
  background: linear-gradient(135deg, rgba(var(--v-theme-tertiary), 0.14) 0%, rgba(var(--v-theme-tertiary), 0.06) 100%);
  color: rgb(var(--v-theme-tertiary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-tertiary), 0.15);
}

.feature-card:hover .feature-number--primary {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.3);
}

.feature-card:hover .feature-number--secondary {
  background: rgb(var(--v-theme-tertiary));
  color: rgb(var(--v-theme-on-tertiary));
  box-shadow: 0 6px 16px rgba(var(--v-theme-tertiary), 0.3);
}

.feature-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.feature-card:hover .feature-title {
  color: rgb(var(--v-theme-primary));
}

.feature-description {
  flex: 1;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.feature-link {
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: var(--shape-sm);
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-primary), 0.04) 100%);
}

.feature-link:hover {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary)) !important;
  padding-left: 24px;
}

.feature-link-icon {
  transition: transform 0.3s ease;
}

.feature-link:hover .feature-link-icon {
  transform: translateX(4px);
}

/* 深色模式：光晕更明显、卡片半透明底 + 更深投影 */
html[data-theme="dark"] .feature-section::before {
  background: radial-gradient(circle at 50% 0%, rgba(var(--v-theme-primary), 0.09) 0%, transparent 70%);
}

html[data-theme="dark"] .feature-card {
  background: rgba(20, 21, 22, 0.8) !important;
}

html[data-theme="dark"] .feature-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4),
    0 16px 48px rgba(var(--v-theme-primary), 0.15) !important;
}

/* 响应式优化 */
@media (max-width: 960px) {
  .section-title {
    font-size: 1.75rem;
  }

  .feature-content {
    padding: 1.5rem !important;
  }

  .feature-number {
    width: 48px;
    height: 48px;
    font-size: 1.125rem;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.5rem;
  }

  .feature-card {
    border-radius: var(--shape-sm) !important;
  }

  .feature-number {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .feature-title {
    font-size: 1.125rem;
  }
}
</style>
