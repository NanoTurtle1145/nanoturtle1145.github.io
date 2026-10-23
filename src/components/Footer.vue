<template>
  <footer class="site-foot">
    <div class="footer-wrap foot">
      <div class="footer-content">
        <div class="footer-logo-section">
          <span class="footer-logo-badge">
            <img src="/logo.svg" alt="Hope Studio" class="footer-logo" width="30" height="30" />
          </span>
          <p class="footer-tagline">有希望者，事竟成</p>
        </div>
        <div class="footer-links-section">
          <p class="footer-links">
            <a href="https://github.com/NanoTurtle1145" target="_blank" rel="noopener" class="footer-link">
              <v-icon icon="mdi-github" size="small" class="footer-link-icon" />
              GitHub
            </a>
            <span class="footer-link-divider">•</span>
            <a href="https://blog.nanoturtle.cn" target="_blank" rel="noopener" class="footer-link">
              <v-icon icon="mdi-web" size="small" class="footer-link-icon" />
              个人博客
            </a>
            <span class="footer-link-divider">•</span>
            <a href="/archive" class="footer-link">
              <v-icon icon="mdi-folder-multiple" size="small" class="footer-link-icon" />
              归档处
            </a>
          </p>
        </div>
      </div>
      <div class="footer-copyright">
        <p>© 2026 希望工作室 · 浙ICP备2025195202号-1</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-foot {
  position: relative;
  background: linear-gradient(180deg, rgb(var(--v-theme-surface-container-low)) 0%, rgb(var(--v-theme-surface)) 100%);
  border-top: 1px solid rgb(var(--v-theme-outline-variant), 0.4);
  overflow: hidden;
}

.site-foot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(180deg, rgba(var(--v-theme-primary), 0.05) 0%, transparent 100%);
  pointer-events: none;
}

.site-foot::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 50%, rgb(var(--v-theme-primary)) 100%);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.footer-wrap {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: 3rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.footer-logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--shape-sm);
  overflow: hidden;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(var(--v-theme-outline-variant), 0.8),
    0 4px 14px rgba(0, 0, 0, 0.18);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.footer-logo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.footer-logo-badge:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary), 0.6),
    0 6px 20px rgba(var(--v-theme-primary), 0.3);
}

.footer-tagline {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.footer-links-section {
  width: 100%;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin: 0;
  font-family: var(--md3e-font-mono);
  font-size: 0.8125rem;
  color: rgb(var(--v-theme-on-surface-variant));
  letter-spacing: 0.03em;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgb(var(--v-theme-on-surface-variant));
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--shape-sm);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
  border: 1px solid transparent;
}

.footer-link:hover {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
  color: rgb(var(--v-theme-primary));
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.footer-link-icon {
  color: rgb(var(--v-theme-primary));
  transition: transform 0.3s ease;
}

.footer-link:hover .footer-link-icon {
  transform: scale(1.1);
}

.footer-link-divider {
  color: rgb(var(--v-theme-outline-variant));
  font-size: 0.75rem;
  opacity: 0.6;
}

.footer-copyright {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgb(var(--v-theme-outline-variant), 0.3);
}

.footer-copyright p {
  margin: 0;
  font-family: var(--md3e-font-mono);
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.8;
  letter-spacing: 0.03em;
}

/* 深色模式：只加深辉光，徽章仍为白底墨色 logo */
html[data-theme="dark"] .footer-logo-badge {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.5);
}

html[data-theme="dark"] .site-foot::before {
  background: linear-gradient(180deg, rgba(var(--v-theme-primary), 0.08) 0%, transparent 100%);
}

/* 响应式优化 */
@media (max-width: 820px) {
  .footer-wrap {
    padding: 2rem 1.5rem 1.5rem;
  }

  .footer-links {
    gap: 1rem;
  }

  .footer-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .footer-tagline {
    font-size: 0.8125rem;
  }
}

@media (max-width: 600px) {
  .footer-wrap {
    padding: 1.5rem 1rem 1rem;
    gap: 1.5rem;
  }

  .footer-links {
    gap: 0.75rem;
  }

  .footer-link {
    padding: 0.375rem 0.625rem;
    font-size: 0.6875rem;
  }

  .footer-link-divider {
    display: none;
  }
}
</style>