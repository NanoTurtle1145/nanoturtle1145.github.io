<script setup lang="ts">
defineProps<{
  title?: string;
  items?: { name: string; role: string; desc: string; avatar?: string }[];
}>();
</script>

<template>
  <!-- MD3E 成员网格：头像形状多样（圆 / 圆角），角色用 tertiary 强调 -->
  <section class="member-section py-12 px-4">
    <div class="container mx-auto">
      <h2 class="section-title mb-6">{{ title }}</h2>
      <div
        style="
          display: grid;
          gap: 32px;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        "
      >
        <v-card v-for="(it, i) in items" :key="i" elevation="0" hover class="member-card">
          <v-card-text class="member-content">
            <div class="member-avatar-wrapper">
              <v-avatar
                v-if="it.avatar"
                size="88"
                :rounded="i % 2 === 0 ? 'lg' : 'circle'"
                class="member-avatar"
              >
                <v-img :src="it.avatar" alt="" loading="lazy" decoding="async" />
              </v-avatar>
              <div
                v-else
                class="member-avatar-placeholder"
                :class="{'member-avatar-placeholder--secondary': i % 2 !== 0}"
              >
                <span class="member-avatar-text">{{ (it.name || "?").charAt(0) }}</span>
              </div>
              <!-- 光晕效果 -->
              <div class="member-avatar-glow" :class="{'member-avatar-glow--secondary': i % 2 !== 0}" />
            </div>
            <div class="member-name text-title-medium font-weight-bold text-on-surface mb-1">
              {{ it.name }}
            </div>
            <div class="member-role text-body-2 text-tertiary mb-3">{{ it.role }}</div>
            <p class="member-desc text-body-2 text-medium-emphasis mb-0">{{ it.desc }}</p>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.member-section {
  position: relative;
}

.member-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 100%, rgba(var(--v-theme-primary), 0.05) 0%, transparent 70%);
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

.member-card {
  position: relative;
  z-index: 1;
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgb(var(--v-theme-outline-variant), 0.6) !important;
  border-radius: var(--shape-lg) !important;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.member-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(var(--v-theme-primary), 0.15),
    0 24px 64px rgba(var(--v-theme-primary), 0.1) !important;
  border-color: rgb(var(--v-theme-primary), 0.8) !important;
}

.member-content {
  padding: 2rem !important;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.member-avatar-wrapper {
  position: relative;
  width: 88px;
  height: 88px;
  margin-bottom: 1rem;
}

.member-avatar {
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.member-card:hover .member-avatar {
  transform: scale(1.08);
}

.member-avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: inherit;
  opacity: 0;
  transition: all 0.4s ease;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.3) 0%, transparent 70%);
}

.member-avatar-glow--secondary {
  background: radial-gradient(circle, rgba(var(--v-theme-tertiary), 0.35) 0%, transparent 70%);
}

.member-card:hover .member-avatar-glow {
  opacity: 1;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.member-avatar-placeholder {
  position: relative;
  z-index: 1;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.12) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  color: rgb(var(--v-theme-primary));
  font-size: 2rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.member-avatar-placeholder--secondary {
  background: linear-gradient(135deg, rgba(var(--v-theme-tertiary), 0.14) 0%, rgba(var(--v-theme-tertiary), 0.06) 100%);
  color: rgb(var(--v-theme-tertiary));
  box-shadow: 0 4px 12px rgba(var(--v-theme-tertiary), 0.15);
}

.member-card:hover .member-avatar-placeholder {
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.25);
}

.member-card:hover .member-avatar-placeholder--secondary {
  box-shadow: 0 8px 24px rgba(var(--v-theme-tertiary), 0.25);
}

.member-name {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.member-card:hover .member-name {
  color: rgb(var(--v-theme-primary));
}

.member-role {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.member-card:hover .member-role {
  color: rgb(var(--v-theme-primary));
}

.member-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  opacity: 0.9;
}

/* 深色模式：光晕更明显、卡片半透明底 + 更深投影 */
html[data-theme="dark"] .member-section::before {
  background: radial-gradient(circle at 50% 100%, rgba(var(--v-theme-primary), 0.09) 0%, transparent 70%);
}

html[data-theme="dark"] .member-card {
  background: rgba(20, 21, 22, 0.8) !important;
}

html[data-theme="dark"] .member-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4),
    0 24px 64px rgba(var(--v-theme-primary), 0.15) !important;
}

/* 响应式优化 */
@media (max-width: 960px) {
  .section-title {
    font-size: 1.75rem;
  }

  .member-content {
    padding: 1.5rem !important;
  }

  .member-avatar-wrapper {
    width: 72px;
    height: 72px;
  }

  .member-avatar,
  .member-avatar-placeholder {
    width: 72px;
    height: 72px;
    font-size: 1.75rem;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.5rem;
  }

  .member-card {
    border-radius: var(--shape-md) !important;
  }

  .member-avatar-wrapper {
    width: 64px;
    height: 64px;
  }

  .member-avatar,
  .member-avatar-placeholder {
    width: 64px;
    height: 64px;
    font-size: 1.5rem;
  }

  .member-name {
    font-size: 1rem;
  }

  .member-role {
    font-size: 0.8125rem;
  }
}
</style>
