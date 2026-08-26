import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

/**
 * Material Design 3 Expressive (MD3E) 主题
 *
 * 依据 mfskys/md3e-skill 中引用的官方 M3 色板（m3.material.io static baseline），
 * 补全全部 48 个 color roles：
 *   - primary / secondary / tertiary + container + on-* + inverse-*
 *   - MD3E 新增 *Fixed 系列（明暗两态保持一致，用于品牌元素）
 *   - 7 个 surface container 角色（surfaceDim/Bright/Lowest..Highest），
 *     用色调分层替代旧的阴影层级（tonal elevation → container grouping）
 * 默认深色主题（页面默认 dark），字体走 Roboto Flex + Noto Sans SC 变量字体。
 */
export default createVuetify({
  components,
  directives,
  ssr: true,
  defaults: {
    VCard: {
      // MD3 升高卡片：使用 surface 色 + 投影分离（Vuetify 4 默认行为）
      rounded: "xl",
    },
    VBtn: { rounded: "pill" },
    VChip: { rounded: "pill" },
    VTextField: { variant: "outlined" },
    VSelect: { variant: "outlined" },
    VTextarea: { variant: "outlined" },
    VAlert: { rounded: "lg", variant: "tonal" },
    VNavigationDrawer: { rounded: "lg" },
    VList: { rounded: "lg" },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        dark: false,
        colors: {
          // primary
          primary: "#6750A4",
          "on-primary": "#FFFFFF",
          "primary-container": "#EADDFF",
          "on-primary-container": "#21005D",
          "inverse-primary": "#D0BCFF",
          "primary-fixed": "#EADDFF",
          "on-primary-fixed": "#21005D",
          "primary-fixed-dim": "#D0BCFF",
          "on-primary-fixed-variant": "#4F378B",
          // secondary
          secondary: "#625B71",
          "on-secondary": "#FFFFFF",
          "secondary-container": "#E8DEF8",
          "on-secondary-container": "#1D192B",
          "secondary-fixed": "#E8DEF8",
          "on-secondary-fixed": "#1D192B",
          "secondary-fixed-dim": "#CCC2DC",
          "on-secondary-fixed-variant": "#4A4458",
          // tertiary
          tertiary: "#7D5260",
          "on-tertiary": "#FFFFFF",
          "tertiary-container": "#FFD8E4",
          "on-tertiary-container": "#31111D",
          "tertiary-fixed": "#FFD8E4",
          "on-tertiary-fixed": "#31111D",
          "tertiary-fixed-dim": "#EFB8C8",
          "on-tertiary-fixed-variant": "#633B48",
          // error
          error: "#B3261E",
          "on-error": "#FFFFFF",
          "error-container": "#F9DEDC",
          "on-error-container": "#410E0B",
          // surface / background
          background: "#FEF7FF",
          "on-background": "#1D1B20",
          surface: "#FEF7FF",
          "on-surface": "#1D1B20",
          "surface-dim": "#DED8E1",
          "surface-bright": "#FEF7FF",
          "surface-container-lowest": "#FFFFFF",
          "surface-container-low": "#F7F2FA",
          "surface-container": "#F3EDF7",
          "surface-container-high": "#ECE6F0",
          "surface-container-highest": "#E6E0E9",
          "surface-variant": "#E7E0EC",
          "on-surface-variant": "#49454F",
          "inverse-surface": "#322F35",
          "inverse-on-surface": "#F5EFF7",
          "surface-tint": "#6750A4",
          outline: "#79747E",
          "outline-variant": "#CAC4D0",
          scrim: "#000000",
        },
      },
      dark: {
        dark: true,
        colors: {
          // primary
          primary: "#D0BCFF",
          "on-primary": "#381E72",
          "primary-container": "#4F378B",
          "on-primary-container": "#EADDFF",
          "inverse-primary": "#6750A4",
          "primary-fixed": "#EADDFF",
          "on-primary-fixed": "#21005D",
          "primary-fixed-dim": "#D0BCFF",
          "on-primary-fixed-variant": "#4F378B",
          // secondary
          secondary: "#CCC2DC",
          "on-secondary": "#332D41",
          "secondary-container": "#4A4458",
          "on-secondary-container": "#E8DEF8",
          "secondary-fixed": "#E8DEF8",
          "on-secondary-fixed": "#1D192B",
          "secondary-fixed-dim": "#CCC2DC",
          "on-secondary-fixed-variant": "#4A4458",
          // tertiary
          tertiary: "#EFB8C8",
          "on-tertiary": "#492532",
          "tertiary-container": "#633B48",
          "on-tertiary-container": "#FFD8E4",
          "tertiary-fixed": "#FFD8E4",
          "on-tertiary-fixed": "#31111D",
          "tertiary-fixed-dim": "#EFB8C8",
          "on-tertiary-fixed-variant": "#633B48",
          // error
          error: "#F2B8B5",
          "on-error": "#601410",
          "error-container": "#8C1D18",
          "on-error-container": "#F9DEDC",
          // surface / background
          background: "#141218",
          "on-background": "#E6E0E9",
          surface: "#141218",
          "on-surface": "#E6E0E9",
          "surface-dim": "#141218",
          "surface-bright": "#3B383E",
          "surface-container-lowest": "#0F0D13",
          "surface-container-low": "#1D1B20",
          "surface-container": "#211F26",
          "surface-container-high": "#2B2930",
          "surface-container-highest": "#36343B",
          "surface-variant": "#49454F",
          "on-surface-variant": "#CAC4D0",
          "inverse-surface": "#E6E0E9",
          "inverse-on-surface": "#322F35",
          "surface-tint": "#D0BCFF",
          outline: "#938F99",
          "outline-variant": "#49454F",
          scrim: "#000000",
        },
      },
    },
  },
});
