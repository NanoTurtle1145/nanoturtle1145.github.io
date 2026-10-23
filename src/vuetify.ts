import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

/**
 * 政务服务门户风格主题（参照 qin-weijin/gd-government —— 广东政务服务网）
 *
 * 视觉基调取自政府门户网站：
 *   - 浅灰页面背景 (#F1F2F3) + 白色卡片（带柔和投影）
 *   - 主色为政务蓝（Vuetify 默认 #1867C0）
 *   - 深藏青标题 (#0D1C28)，正文灰 (#3C4852 / #727475)
 *   - 红色用于「热门/重要」强调
 *   - 默认浅色主题（与政务门户一致），保留深色主题作为可选项
 */
export default createVuetify({
  components,
  directives,
  ssr: true,
  defaults: {
    // 圆角统一走 src/style.css 的 --shape-* 刻度（对齐 MD3 / mdui）：
    // card 12 / btn pill / chip 8 / field 8。这里与之一致，
    // 样式冲突时由「统一控件形状层」兜底（!important + unlayered）。
    VCard: {
      // Linear：medium 圆角 + 无投影（层级靠发丝描边/灰阶），排版沿用政务区块
      rounded: "12",
      elevation: 0,
      border: true,
    },
    VBtn: {
      rounded: "pill",
      textTransform: "none",
    },
    VChip: { rounded: "8" },
    VTextField: { variant: "outlined", rounded: "8" },
    VSelect: { variant: "outlined", rounded: "8" },
    VTextarea: { variant: "outlined", rounded: "8" },
    VAlert: { rounded: "12", variant: "tonal" },
    VNavigationDrawer: { rounded: "0" },
    VList: { rounded: "8" },
    VTabs: { color: "primary" },
  },
  theme: {
    defaultTheme: "dark", // Linear 皮肤为默认；浅色为政务阅读模式（排版不变）
    themes: {
      light: {
        dark: false,
        colors: {
          // 政务蓝 primary
          primary: "#1867C0",
          "on-primary": "#FFFFFF",
          "primary-container": "#D6E3FF",
          "on-primary-container": "#0D1C28",
          "inverse-primary": "#A8C7FA",
          "primary-fixed": "#D6E3FF",
          "on-primary-fixed": "#0D1C28",
          "primary-fixed-dim": "#A8C7FA",
          "on-primary-fixed-variant": "#1E4E8C",
          // secondary：蓝灰色
          secondary: "#3C4852",
          "on-secondary": "#FFFFFF",
          "secondary-container": "#E8ECEF",
          "on-secondary-container": "#0D1C28",
          "secondary-fixed": "#E8ECEF",
          "on-secondary-fixed": "#0D1C28",
          "secondary-fixed-dim": "#C9D2D9",
          "on-secondary-fixed-variant": "#2E3A45",
          // tertiary：暖灰（辅助强调）
          tertiary: "#727475",
          "on-tertiary": "#FFFFFF",
          "tertiary-container": "#EFEFEF",
          "on-tertiary-container": "#2A2B2C",
          "tertiary-fixed": "#EFEFEF",
          "on-tertiary-fixed": "#2A2B2C",
          "tertiary-fixed-dim": "#D4D4D4",
          "on-tertiary-fixed-variant": "#5A5C5E",
          // error：政务红
          error: "#C6001B",
          "on-error": "#FFFFFF",
          "error-container": "#FFDAD6",
          "on-error-container": "#410002",
          // surface / background：浅灰页面
          background: "#F1F2F3",
          "on-background": "#0D1C28",
          surface: "#FFFFFF",
          "on-surface": "#0D1C28",
          "surface-dim": "#D9DCDE",
          "surface-bright": "#FFFFFF",
          "surface-container-lowest": "#FFFFFF",
          "surface-container-low": "#F7F8F9",
          "surface-container": "#F1F2F3",
          "surface-container-high": "#EAECEE",
          "surface-container-highest": "#E1E4E6",
          "surface-variant": "#EEEEEE",
          "on-surface-variant": "#3C4852",
          "inverse-surface": "#2A2B2C",
          "inverse-on-surface": "#F5F7F8",
          "surface-tint": "#1867C0",
          outline: "#A6AEB5",
          "outline-variant": "#DFE1E2",
          scrim: "#000000",
        },
      },
      dark: {
        dark: true,
        // Linear 风皮肤：近黑画布 + 发丝描边 + 单一薰衣草强调色 + 多层灰阶文字
        colors: {
          primary: "#8B94F5",
          "on-primary": "#0B0C12",
          "primary-container": "#20224A",
          "on-primary-container": "#E3E6FF",
          "inverse-primary": "#5E6AD2",
          "primary-fixed": "#DEE1FF",
          "on-primary-fixed": "#13142A",
          "primary-fixed-dim": "#8B94F5",
          "on-primary-fixed-variant": "#20224A",
          // secondary：蓝灰
          secondary: "#D0D6E0",
          "on-secondary": "#15161A",
          "secondary-container": "#23252A",
          "on-secondary-container": "#E6EAF0",
          "secondary-fixed": "#E0E4EA",
          "on-secondary-fixed": "#15161A",
          "secondary-fixed-dim": "#C2C8D2",
          "on-secondary-fixed-variant": "#2A2D33",
          // tertiary：中灰（第三层文字）
          tertiary: "#8A8F98",
          "on-tertiary": "#101113",
          "tertiary-container": "#23252A",
          "on-tertiary-container": "#C9CDD4",
          "tertiary-fixed": "#8A8F98",
          "on-tertiary-fixed": "#101113",
          "tertiary-fixed-dim": "#6C717A",
          "on-tertiary-fixed-variant": "#3A3D44",
          // error：克制一点的红
          error: "#F07178",
          "on-error": "#18070A",
          "error-container": "#4A1B1E",
          "on-error-container": "#FFDAD6",
          // surface / background：近黑画布（Linear）
          background: "#010102",
          "on-background": "#F7F8F8",
          surface: "#0F1011",
          "on-surface": "#F7F8F8",
          "surface-dim": "#0A0B0C",
          "surface-bright": "#1B1C1E",
          "surface-container-lowest": "#08090A",
          "surface-container-low": "#121314",
          "surface-container": "#151617",
          "surface-container-high": "#1A1B1D",
          "surface-container-highest": "#202124",
          "surface-variant": "#161719",
          "on-surface-variant": "#8A8F98",
          "inverse-surface": "#F7F8F8",
          "inverse-on-surface": "#0B0C0E",
          "surface-tint": "#8B94F5",
          outline: "#2E3138",
          "outline-variant": "#23252A",
          scrim: "#000000",
        },
      },
    },
  },
});