/**
 * 主题模式 composable —— Linear 皮肤为深色，站点为深色固定（dark-only）。
 *
 * - 本站「完全 Linear」风格，只保留深色皮肤；浅色（政务）仅存于 /archive/legacy
 *   旧站静态快照中，不受 Vue 主题影响。
 * - 为了彻底避免「旧站残留 localStorage(light) / 系统浅色偏好」导致首屏闪成浅色、
 *   白字 hero 隐形的问题，这里强制 isDark 恒为 true，不再读存储或跟随系统。
 * - 保留 isDark / toggle / initFromDocument 三个导出，兼容现有调用点。
 */
import { useTheme } from "vuetify";
import { ref } from "vue";

export type ThemeName = "light" | "dark";

// 模块级单例：始终为深色
const isDark = ref(true);
let syncDocument: (() => void) | null = null;

export function useThemeMode() {
  const theme = useTheme();

  if (!syncDocument) {
    syncDocument = () => {
      if (typeof document === "undefined") return;
      document.documentElement.dataset.theme = "dark";
    };
  }

  function initFromDocument() {
    // 深色固定：无论 html[data-theme] 被预加载脚本写成什么，都归一为深色
    theme.global.name.value = "dark";
    isDark.value = true;
    syncDocument?.();
  }

  function apply(_name: ThemeName) {
    // dark-only：忽略传入的浅色，始终深色
    theme.global.name.value = "dark";
    isDark.value = true;
    syncDocument?.();
  }

  function toggle() {
    // dark-only：开关无意义，保持深色
    apply("dark");
  }

  // 不跟随系统偏好，也不监听其变化，杜绝浅色注入

  return { isDark, toggle, initFromDocument };
}