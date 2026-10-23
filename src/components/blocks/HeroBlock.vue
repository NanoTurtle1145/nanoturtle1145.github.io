<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
}>();
</script>

<template>
  <section class="hero-section py-16 px-4">
    <div class="hero-container mx-auto md3e-group pa-6 pa-md-10" style="max-width: 1080px">
      <div class="hero-content d-flex flex-column flex-md-row align-center ga-8">
        <div class="hero-text flex-1">
          <div class="hero-subtitle text-subtitle-1 text-tertiary font-weight-medium mb-3">
            希望工作室 · Hope Studio
          </div>
          <h1 class="hero-title text-display-medium text-on-surface mb-3" style="font-weight: 700">{{ title }}</h1>
          <p class="hero-description text-body-1 text-medium-emphasis mb-7" style="max-width: 34rem">
            {{ subtitle }}
          </p>
          <a
            v-if="buttonLink"
            :href="buttonLink"
            class="hero-button text-decoration-none d-inline-block"
          >
            <v-btn color="primary" size="large" append-icon="mdi-arrow-right" variant="elevated">
              {{ buttonText }}
            </v-btn>
          </a>
        </div>
        <div class="hero-image flex-1 w-100">
          <v-img
            v-if="image"
            :src="image"
            alt=""
            class="hero-image-inner rounded-xl"
            max-height="360"
            cover
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
}

/* 渐变背景效果（跟随主题色） */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.09) 0%,
    rgba(var(--v-theme-primary), 0.04) 55%,
    transparent 100%);
  z-index: 0;
  pointer-events: none;
}

/* 浮动光晕装饰 */
.hero-section::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(var(--v-theme-primary), 0.14) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
  animation: float-glow 8s ease-in-out infinite;
}

@keyframes float-glow {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-20px, 20px) scale(1.1);
    opacity: 0.8;
  }
}

.hero-container {
  position: relative;
  z-index: 1;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-subtitle {
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* 标题：主题色渐晕（浅色：深藏青→政务蓝；深色：亮白→薰衣草） */
.hero-title {
  font-size: 2.5rem;
  line-height: 1.2;
  background: linear-gradient(135deg, rgb(var(--v-theme-on-surface)) 0%, rgb(var(--v-theme-primary)) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fade-in-up 0.8s ease-out;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.7;
}

.hero-button .v-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.35);
}

.hero-button .v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.35), 0 8px 24px rgba(var(--v-theme-primary), 0.25);
}

.hero-image-inner {
  animation: fade-in-left 0.8s ease-out 0.2s both;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-image-inner:hover {
  transform: scale(1.02);
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 深色模式：光晕更明显 */
html[data-theme="dark"] .hero-section::before {
  background: linear-gradient(135deg,
    rgba(var(--v-theme-primary), 0.12) 0%,
    rgba(var(--v-theme-primary), 0.06) 55%,
    transparent 100%);
}

html[data-theme="dark"] .hero-image-inner {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* 响应式优化 */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 0.975rem;
  }
}
</style>
