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
import { nextTick, ref } from "vue";

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

  type ViewTransitionLike = { finished: Promise<void> };
  type ViewTransitionDocument = Document & {
    startViewTransition?: (callback: () => Promise<void> | void) => ViewTransitionLike;
  };

  /**
   * 主题切换动画：用 View Transitions API 把新主题做成一个从按钮中心
   * 辐射出去的圆形，盖住旧主题。不支持 / 用户要求减弱动效时直接切换。
   */
  function toggle(source?: Element | null) {
    const next: ThemeName = isDark.value ? "light" : "dark";
    if (typeof document === "undefined") {
      apply(next, true);
      return;
    }

    const doc = document as ViewTransitionDocument;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!source || reduce || typeof doc.startViewTransition !== "function") {
      apply(next, true);
      return;
    }

    // 圆心 = 按钮中心；半径取到窗口最远角，保证圆能覆盖整屏
    const rect = source.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const root = document.documentElement;
    root.style.setProperty("--theme-origin-x", `${x}px`);
    root.style.setProperty("--theme-origin-y", `${y}px`);
    root.style.setProperty("--theme-reveal-radius", `${Math.ceil(radius)}px`);

    let transition: ViewTransitionLike;
    try {
      transition = doc.startViewTransition(async () => {
        apply(next, true);
        // 等 Vuetify 把主题类名/变量刷到 DOM 上，再让浏览器拍新快照
        await nextTick();
      });
    } catch {
      apply(next, true);
      return;
    }

    transition.finished.finally(() => {
      root.style.removeProperty("--theme-origin-x");
      root.style.removeProperty("--theme-origin-y");
      root.style.removeProperty("--theme-reveal-radius");
    });
  }

  return { isDark, toggle, apply, initFromDocument };
}
