/**
 * 主题模式 composable —— 站点支持两套皮肤：
 *   dark  = Linear 风（近黑画布 + 薰衣草强调，默认）
 *   light = 政务风（浅灰画布 + 白卡 + 政务蓝）
 *
 * 规则：首次访问跟随系统偏好（prefers-color-scheme），用户点过开关后以
 * localStorage 为准。html[data-theme]、Vuetify 主题、<meta name="theme-color">
 * 三者同步更新；index.html 里的内联脚本用同一套优先级先行设定，避免首屏闪烁。
 */
import { useTheme } from "vuetify";
import { ref } from "vue";

export type ThemeName = "light" | "dark";

/** 与 index.html 内联脚本共用的存储键 */
export const THEME_STORAGE_KEY = "hope-theme";

const isDark = ref(true);

function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStored(): ThemeName | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function syncDocument(name: ThemeName) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = name;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", name === "dark" ? "#010102" : "#f5f6f8");
}

export function useThemeMode() {
  const theme = useTheme();

  /** 应用主题；persist 为 true 时写入 localStorage（只有用户主动切换才写） */
  function apply(name: ThemeName, persist = false) {
    theme.global.name.value = name;
    isDark.value = name === "dark";
    syncDocument(name);
    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, name);
      } catch {
        /* 隐私模式下忽略 */
      }
    }
  }

  /** 挂载时对齐：已保存选择 > 系统偏好 > 深色 */
  function initFromDocument() {
    apply(readStored() ?? (systemPrefersDark() ? "dark" : "light"));
  }

  function toggle() {
    apply(isDark.value ? "light" : "dark", true);
  }

  return { isDark, toggle, apply, initFromDocument };
}
