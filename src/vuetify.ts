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
    VCard: {
      // 政务门户卡片：白底 + 柔和投影，直角
      rounded: "0",
      elevation: 1,
    },
    VBtn: {
      rounded: "0", // 政务风格：直角按钮
      textTransform: "none",
    },
    VChip: { rounded: "0" },
    VTextField: { variant: "outlined", rounded: "0" },
    VSelect: { variant: "outlined", rounded: "0" },
    VTextarea: { variant: "outlined", rounded: "0" },
    VAlert: { rounded: "0", variant: "tonal" },
    VNavigationDrawer: { rounded: "0" },
    VList: { rounded: "0" },
    VTabs: { color: "primary" },
  },
  theme: {
    defaultTheme: "light", // 政务门户：默认浅色
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
        colors: {
          // 政务蓝 primary（深色态提亮）
          primary: "#A8C7FA",
          "on-primary": "#0D1C28",
          "primary-container": "#1E4E8C",
          "on-primary-container": "#D6E3FF",
          "inverse-primary": "#1867C0",
          "primary-fixed": "#D6E3FF",
          "on-primary-fixed": "#0D1C28",
          "primary-fixed-dim": "#A8C7FA",
          "on-primary-fixed-variant": "#1E4E8C",
          // secondary
          secondary: "#C9D2D9",
          "on-secondary": "#2E3A45",
          "secondary-container": "#39454F",
          "on-secondary-container": "#E8ECEF",
          "secondary-fixed": "#E8ECEF",
          "on-secondary-fixed": "#0D1C28",
          "secondary-fixed-dim": "#C9D2D9",
          "on-secondary-fixed-variant": "#2E3A45",
          // tertiary
          tertiary: "#D4D4D4",
          "on-tertiary": "#3A3B3C",
          "tertiary-container": "#4A4B4D",
          "on-tertiary-container": "#EFEFEF",
          "tertiary-fixed": "#EFEFEF",
          "on-tertiary-fixed": "#2A2B2C",
          "tertiary-fixed-dim": "#D4D4D4",
          "on-tertiary-fixed-variant": "#5A5C5E",
          // error
          error: "#FFB4AB",
          "on-error": "#690005",
          "error-container": "#93000A",
          "on-error-container": "#FFDAD6",
          // surface / background：深藏青底
          background: "#12161A",
          "on-background": "#E1E4E6",
          surface: "#12161A",
          "on-surface": "#E1E4E6",
          "surface-dim": "#12161A",
          "surface-bright": "#383D42",
          "surface-container-lowest": "#0D1115",
          "surface-container-low": "#1A1F23",
          "surface-container": "#1E2328",
          "surface-container-high": "#282D33",
          "surface-container-highest": "#33383E",
          "surface-variant": "#3C4852",
          "on-surface-variant": "#C1CAD2",
          "inverse-surface": "#E1E4E6",
          "inverse-on-surface": "#2A2B2C",
          "surface-tint": "#A8C7FA",
          outline: "#8A949C",
          "outline-variant": "#3C4852",
          scrim: "#000000",
        },
      },
    },
  },
});