/**
 * 主题模式 composable：浅色/深色切换 + 持久化 + 系统偏好默认。
 *
 * - 首帧主题由 index.html 内联脚本写入 html[data-theme]，本模块负责与
 *   Vuetify 主题系统同步。
 * - 用户选择保存到 localStorage("hope-studio-theme")；无选择时跟随系统。
 * - isDark 为模块级单例，多处调用共享同一状态。
 */
import { useTheme } from "vuetify";
import { ref, watch } from "vue";

const STORAGE_KEY = "hope-studio-theme";

export type ThemeName = "light" | "dark";

// 模块级单例：App.vue 与各组件共享
const isDark = ref(false);
let syncDocument: (() => void) | null = null;

function readStoredTheme(): ThemeName | null {
  if (typeof window === "undefined") return null;
  try {
    const t = window.localStorage.getItem(STORAGE_KEY);
    return t === "dark" || t === "light" ? t : null;
  } catch {
    return null;
  }
}

function systemTheme(): ThemeName {
  if (typeof window === "undefined") return "light";
  try {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

export function useThemeMode() {
  const theme = useTheme();

  if (!syncDocument) {
    syncDocument = () => {
      if (typeof document === "undefined") return;
      document.documentElement.dataset.theme = theme.global.name.value;
    };
  }

  /** 与 html[data-theme]（预加载脚本设定的值）对齐，避免挂载时闪跳 */
  function initFromDocument() {
    const docTheme =
      typeof document !== "undefined"
        ? document.documentElement.dataset.theme
        : undefined;
    if (docTheme === "dark" || docTheme === "light") {
      theme.global.name.value = docTheme;
    } else {
      theme.global.name.value = readStoredTheme() ?? systemTheme();
    }
    isDark.value = theme.global.name.value === "dark";
  }

  function apply(name: ThemeName) {
    theme.global.name.value = name;
    isDark.value = name === "dark";
    try {
      window.localStorage.setItem(STORAGE_KEY, name);
    } catch {
      /* 忽略隐私模式下的存储异常 */
    }
    syncDocument?.();
  }

  function toggle() {
    apply(theme.global.name.value === "dark" ? "light" : "dark");
  }

  // 跟随系统偏好（仅当用户未显式选择时）
  if (typeof window !== "undefined" && window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!readStoredTheme()) {
        theme.global.name.value = mq.matches ? "dark" : "light";
        isDark.value = theme.global.name.value === "dark";
        syncDocument?.();
      }
    };
    mq.addEventListener?.("change", onChange);
  }

  watch(
    () => theme.global.name.value,
    (name) => {
      isDark.value = name === "dark";
    }
  );

  return { isDark, toggle, initFromDocument };
}