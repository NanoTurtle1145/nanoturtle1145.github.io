<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "第三方组件许可证 | 希望工作室",
  meta: [
    {
      name: "description",
      content:
        "HopeOS 项目在构建与运行中使用的第三方代码、字体与工具链及其许可证说明。",
    },
  ],
});

// 许可证表（构建与测试工具链）
const toolchain = [
  { name: "LLVM / clang", use: "内核（UEFI/COFF）与用户态（ELF）编译", license: "Apache-2.0 with LLVM Exception" },
  { name: "lld / lld-link", use: "链接", license: "Apache-2.0" },
  { name: "GCC", use: "宿主侧单元测试（tools/*_test）", license: "GPL-3.0" },
  { name: "NASM", use: "汇编桩", license: "BSD-2-Clause" },
  { name: "QEMU", use: "x86_64 系统模拟（测试）", license: "GPL-2.0" },
  { name: "EDK II / OVMF", use: "UEFI 固件", license: "BSD-2-Clause（为主）+ MIT 等" },
  { name: "mtools", use: "FAT32 镜像操作", license: "GPL-3.0" },
  { name: "Python 3", use: "字体生成、截图转换、OCR 等脚本", license: "PSF-2.0" },
  { name: "Pillow", use: "截图/字体处理", license: "HPND" },
  { name: "NumPy", use: "截图 OCR 辅助", license: "BSD-3-Clause" },
];

const fullText = [
  { name: "MIT", url: "https://opensource.org/licenses/MIT" },
  { name: "Apache-2.0", url: "https://www.apache.org/licenses/LICENSE-2.0" },
  { name: "OFL-1.1", url: "https://openfontlicense.org/" },
  { name: "GPL-2.0 / GPL-3.0", url: "https://www.gnu.org/licenses/" },
  { name: "BSD / PSF-2.0 / HPND", url: "#" },
];
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 896px">
    <div class="mb-8">
      <div class="text-subtitle-1 text-tertiary font-weight-medium mb-1">许可证 · Licenses</div>
      <div class="text-h3 text-on-surface mb-2">
        HopeOS 第三方组件许可证说明
      </div>
      <div class="text-body-1 text-medium-emphasis" style="line-height: 1.8">
        本页汇总 HopeOS 项目在构建与运行中使用的第三方代码、字体与工具链及其许可证。
        HopeOS 自身的许可证目前尚未在仓库中标注（TBD）；下述仅罗列
        <strong class="text-on-surface">第三方</strong>依赖。
      </div>
    </div>

    <v-alert type="info" variant="tonal" class="mb-8">
      HopeOS 在用户态移植了 StarDustUI 作为图形界面工具包，并内嵌了若干字体。
      内核与构建系统（clang / lld / nasm / QEMU / OVMF / mtools 等）仅用于编译与测试，
      不随 HopeOS 发行镜像一起分发，其许可证仅作信息性说明。
    </v-alert>

    <div class="text-h5 font-weight-bold text-on-surface mt-6 mb-4">
      1. 随镜像分发的第三方代码
    </div>

    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold text-on-surface mb-3">1.1 StarDustUI</div>
        <ul class="license-list">
          <li><span class="text-on-surface">用途</span>：C++17 跨平台 UI 框架，已被移植到 HopeOS 用户态（freestanding ABI），用于 <code>stardustui_helloworld</code> / <code>stardustui_duckchat</code> / <code>stardustui_desktop</code> 等 GUI 程序。</li>
          <li><span class="text-on-surface">来源</span>：<code>xingji-studio/StardustUI</code>（XINGJI 工作室）</li>
          <li><span class="text-on-surface">许可证</span>：<span class="text-success font-weight-semibold">MIT</span></li>
          <li><span class="text-on-surface">位置</span>：<code>user/stardustui/</code>（vendored + HopeOS 移植层 <code>platforms/hopeos.cpp</code>）</li>
          <li class="text-medium-emphasis">备注：上游仓库为 MIT；当前 vendored 树内未附带 LICENSE 文件，建议后续 vendoring 时补回上游 LICENSE。</li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold text-on-surface mb-3">1.2 rapidjson</div>
        <ul class="license-list">
          <li><span class="text-on-surface">用途</span>：JSON 解析器，被 StarDustUI（DuckChat 示例）使用。</li>
          <li><span class="text-on-surface">来源</span>：Tencent</li>
          <li><span class="text-on-surface">许可证</span>：<span class="text-success font-weight-semibold">MIT</span></li>
          <li><span class="text-on-surface">位置</span>：<code>user/stardustui/includes/rapidjson/</code></li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold text-on-surface mb-3">1.3 ab_glyph_rasterizer（C API 头文件）</div>
        <ul class="license-list">
          <li><span class="text-on-surface">用途</span>：TrueType 解析/光栅化的 C 语言接口声明；在 HopeOS 构建中实际走自带的 freestanding 软件 TrueType 光栅器，Rust 的 <code>ab_glyph</code> crate 未链接，仅 vendored 头文件。</li>
          <li><span class="text-on-surface">来源</span>：<code>ab_glyph</code>（Rust）项目</li>
          <li><span class="text-on-surface">许可证</span>：<span class="text-success font-weight-semibold">MIT OR Apache-2.0</span>（双许可，上游 Rust crate）</li>
          <li><span class="text-on-surface">位置</span>：<code>user/stardustui/third_party/ab_glyph_rasterizer/</code></li>
          <li class="text-medium-emphasis">备注：HopeOS 仅包含其 C ABI 头文件，不引入 Rust 工具链；如启用 Linux 构建的 STARDUSTUI_USE_AB_GLYPH_RASTERIZER 则需要遵守 MIT/Apache-2.0。</li>
        </ul>
      </v-card-text>
    </v-card>

    <div class="text-h5 font-weight-bold text-on-surface mt-6 mb-4">
      2. 随镜像内嵌的字体
    </div>

    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold text-on-surface mb-3">2.1 Noto Sans（NotoSans-Regular.ttf）</div>
        <ul class="license-list">
          <li><span class="text-on-surface">用途</span>：StarDustUI 的默认 UI 字体，构建时通过 <code>objcopy</code> 链接进每个 StarDustUI ELF。</li>
          <li><span class="text-on-surface">来源</span>：Google</li>
          <li><span class="text-on-surface">许可证</span>：<span class="text-success font-weight-semibold">SIL Open Font License 1.1（OFL-1.1）</span></li>
          <li><span class="text-on-surface">位置</span>：构建期取自系统字体（默认 <code>/usr/share/fonts/noto/NotoSans-Regular.ttf</code>，可用 <code>FONT_FILE=...</code> 覆盖）。</li>
          <li class="text-medium-emphasis">合规要点：OFL-1.1 允许自由分发与内嵌，但要求保留版权与许可声明，且不得单独以字体名义售卖，也不得修改后仍以 "Noto Sans" 原名发布。原始字体文件不随 HopeOS 源码仓库提交，仅内嵌其二进制位图/轮廓数据。</li>
        </ul>
      </v-card-text>
    </v-card>

    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold text-on-surface mb-3">2.2 GB2312 点阵字体（assets/gb2312.fnt）</div>
        <ul class="license-list">
          <li><span class="text-on-surface">用途</span>：内核 16px 中文显示（启动加载，非链接进内核）。</li>
          <li><span class="text-on-surface">来源</span>：由系统上安装的 CJK 轮廓字体（默认 SimSun / 宋体）内嵌的 16×16 1-bit 字 strikes，经 <code>tools/mkfont.py</code> 在构建期栅格化生成。</li>
          <li><span class="text-on-surface">许可证</span>：<span class="text-warning font-weight-semibold">派生自专有字体（SimSun 属 Microsoft / 北大方正）</span></li>
          <li class="text-medium-emphasis">合规要点：<code>gb2312.fnt</code> 是构建产物（已被 .gitignore 忽略），HopeOS 不提交也不分发 SimSun 原始字体文件。若构建机上未安装合适的字体，构建不会失败，内核仅禁用 16px 中文显示。使用专有字体栅格化出的点阵用于再分发前，需确认你拥有该字体的使用授权；替代方案是用 OFL-1.1 / 开源的中文字体（如 Noto Sans CJK、文泉驿等）重新生成 <code>gb2312.fnt</code>（通过 <code>FONT_FILE=...</code> 指定）以规避专有授权问题。</li>
        </ul>
      </v-card-text>
    </v-card>

    <div class="text-h5 font-weight-bold text-on-surface mt-6 mb-4">
      3. 构建与测试工具链（信息性，不随镜像分发）
    </div>
    <v-card elevation="0" class="mb-6">
      <v-table>
        <thead>
          <tr>
            <th>工具</th>
            <th>用途</th>
            <th>许可证</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in toolchain" :key="t.name">
            <td class="text-on-surface">{{ t.name }}</td>
            <td class="text-medium-emphasis">{{ t.use }}</td>
            <td class="text-success">{{ t.license }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="text-h5 font-weight-bold text-on-surface mt-6 mb-4">4. 许可证全文获取</div>
    <div class="d-flex flex-column ga-2">
      <div v-for="l in fullText" :key="l.name" class="text-body-1">
        <span class="text-on-surface">{{ l.name }}</span>：
        <a
          v-if="l.url !== '#'"
          :href="l.url"
          target="_blank"
          rel="noopener"
          class="text-primary text-decoration-underline"
        >
          {{ l.url }}
        </a>
        <span v-else class="text-medium-emphasis">见各上游仓库</span>
      </div>
    </div>

    <div class="text-caption text-medium-emphasis mt-10">
      生成日期：2026-08-09。如有缺漏或版本更新，请同步更新本页。
    </div>
  </v-container>
</template>

<style scoped>
.page-root {
  min-height: 100vh;
}
.license-list {
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.9;
}
.license-list li {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.9rem;
}
.license-list code {
  background: rgb(var(--v-theme-surface-variant));
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.85em;
}
</style>
