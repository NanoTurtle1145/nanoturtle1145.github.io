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
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
    <article class="max-w-4xl mx-auto px-6 py-12 text-gray-300 leading-relaxed">
      <h1 class="text-4xl font-bold text-white mb-4">HopeOS 第三方组件许可证说明</h1>
      <p class="text-gray-400 mb-6">
        本页汇总 HopeOS 项目在构建与运行中使用的第三方代码、字体与工具链及其许可证。
        HopeOS 自身的许可证目前尚未在仓库中标注（TBD）；下述仅罗列<strong class="text-gray-200">第三方</strong>依赖。
      </p>

      <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8 text-sm">
        <p class="text-blue-200">
          HopeOS 在用户态移植了 StarDustUI 作为图形界面工具包，并内嵌了若干字体。
          内核与构建系统（clang / lld / nasm / QEMU / OVMF / mtools 等）仅用于编译与测试，
          不随 HopeOS 发行镜像一起分发，其许可证仅作信息性说明。
        </p>
      </div>

      <h2 class="text-2xl font-bold text-white mt-10 mb-4">1. 随镜像分发的第三方代码</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">1.1 StarDustUI</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><span class="text-gray-200">用途</span>：C++17 跨平台 UI 框架，已被移植到 HopeOS 用户态（freestanding ABI），用于 <code class="px-1 rounded bg-gray-800">stardustui_helloworld</code> / <code class="px-1 rounded bg-gray-800">stardustui_duckchat</code> / <code class="px-1 rounded bg-gray-800">stardustui_desktop</code> 等 GUI 程序。</li>
        <li><span class="text-gray-200">来源</span>：<code class="px-1 rounded bg-gray-800">xingji-studio/StardustUI</code>（XINGJI 工作室）</li>
        <li><span class="text-gray-200">许可证</span>：<span class="font-semibold text-green-300">MIT</span></li>
        <li><span class="text-gray-200">位置</span>：<code class="px-1 rounded bg-gray-800">user/stardustui/</code>（vendored + HopeOS 移植层 <code class="px-1 rounded bg-gray-800">platforms/hopeos.cpp</code>）</li>
        <li class="text-gray-400">备注：上游仓库为 MIT；当前 vendored 树内未附带 LICENSE 文件，建议后续 vendoring 时补回上游 LICENSE。</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">1.2 rapidjson</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><span class="text-gray-200">用途</span>：JSON 解析器，被 StarDustUI（DuckChat 示例）使用。</li>
        <li><span class="text-gray-200">来源</span>：Tencent</li>
        <li><span class="text-gray-200">许可证</span>：<span class="font-semibold text-green-300">MIT</span></li>
        <li><span class="text-gray-200">位置</span>：<code class="px-1 rounded bg-gray-800">user/stardustui/includes/rapidjson/</code></li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">1.3 ab_glyph_rasterizer（C API 头文件）</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><span class="text-gray-200">用途</span>：TrueType 解析/光栅化的 C 语言接口声明；在 HopeOS 构建中实际走自带的 freestanding 软件 TrueType 光栅器，Rust 的 <code class="px-1 rounded bg-gray-800">ab_glyph</code> crate 未链接，仅 vendored 头文件。</li>
        <li><span class="text-gray-200">来源</span>：<code class="px-1 rounded bg-gray-800">ab_glyph</code>（Rust）项目</li>
        <li><span class="text-gray-200">许可证</span>：<span class="font-semibold text-green-300">MIT OR Apache-2.0</span>（双许可，上游 Rust crate）</li>
        <li><span class="text-gray-200">位置</span>：<code class="px-1 rounded bg-gray-800">user/stardustui/third_party/ab_glyph_rasterizer/</code></li>
        <li class="text-gray-400">备注：HopeOS 仅包含其 C ABI 头文件，不引入 Rust 工具链；如启用 Linux 构建的 STARDUSTUI_USE_AB_GLYPH_RASTERIZER 则需要遵守 MIT/Apache-2.0。</li>
      </ul>

      <h2 class="text-2xl font-bold text-white mt-10 mb-4">2. 随镜像内嵌的字体</h2>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">2.1 Noto Sans（NotoSans-Regular.ttf）</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><span class="text-gray-200">用途</span>：StarDustUI 的默认 UI 字体，构建时通过 <code class="px-1 rounded bg-gray-800">objcopy</code> 链接进每个 StarDustUI ELF。</li>
        <li><span class="text-gray-200">来源</span>：Google</li>
        <li><span class="text-gray-200">许可证</span>：<span class="font-semibold text-green-300">SIL Open Font License 1.1（OFL-1.1）</span></li>
        <li><span class="text-gray-200">位置</span>：构建期取自系统字体（默认 <code class="px-1 rounded bg-gray-800">/usr/share/fonts/noto/NotoSans-Regular.ttf</code>，可用 <code class="px-1 rounded bg-gray-800">FONT_FILE=...</code> 覆盖）。</li>
        <li class="text-gray-400">合规要点：OFL-1.1 允许自由分发与内嵌，但要求保留版权与许可声明，且不得单独以字体名义售卖，也不得修改后仍以 "Noto Sans" 原名发布。原始字体文件不随 HopeOS 源码仓库提交，仅内嵌其二进制位图/轮廓数据。</li>
      </ul>

      <h3 class="text-xl font-semibold text-white mt-6 mb-2">2.2 GB2312 点阵字体（assets/gb2312.fnt）</h3>
      <ul class="list-disc list-inside space-y-1">
        <li><span class="text-gray-200">用途</span>：内核 16px 中文显示（启动加载，非链接进内核）。</li>
        <li><span class="text-gray-200">来源</span>：由系统上安装的 CJK 轮廓字体（默认 SimSun / 宋体）内嵌的 16×16 1-bit 字 strikes，经 <code class="px-1 rounded bg-gray-800">tools/mkfont.py</code> 在构建期栅格化生成。</li>
        <li><span class="text-gray-200">许可证</span>：<span class="font-semibold text-yellow-300">派生自专有字体（SimSun 属 Microsoft / 北大方正）</span></li>
        <li class="text-gray-400">合规要点：<code class="px-1 rounded bg-gray-800">gb2312.fnt</code> 是构建产物（已被 .gitignore 忽略），HopeOS 不提交也不分发 SimSun 原始字体文件。若构建机上未安装合适的字体，构建不会失败，内核仅禁用 16px 中文显示。使用专有字体栅格化出的点阵用于再分发前，需确认你拥有该字体的使用授权；替代方案是用 OFL-1.1 / 开源的中文字体（如 Noto Sans CJK、文泉驿等）重新生成 <code class="px-1 rounded bg-gray-800">gb2312.fnt</code>（通过 <code class="px-1 rounded bg-gray-800">FONT_FILE=...</code> 指定）以规避专有授权问题。</li>
      </ul>

      <h2 class="text-2xl font-bold text-white mt-10 mb-4">3. 构建与测试工具链（信息性，不随镜像分发）</h2>
      <div class="overflow-x-auto rounded-xl border border-gray-700">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-800/60 text-gray-200">
            <tr>
              <th class="px-4 py-2">工具</th>
              <th class="px-4 py-2">用途</th>
              <th class="px-4 py-2">许可证</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in toolchain" :key="t.name" class="border-t border-gray-800">
              <td class="px-4 py-2 text-white">{{ t.name }}</td>
              <td class="px-4 py-2">{{ t.use }}</td>
              <td class="px-4 py-2 text-green-300">{{ t.license }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-2xl font-bold text-white mt-10 mb-4">4. 许可证全文获取</h2>
      <ul class="space-y-1">
        <li v-for="l in fullText" :key="l.name">
          <span class="text-gray-200">{{ l.name }}</span>：
          <a v-if="l.url !== '#'" :href="l.url" target="_blank" rel="noopener" class="text-blue-400 hover:text-blue-300 underline">{{ l.url }}</a>
          <span v-else class="text-gray-400">见各上游仓库</span>
        </li>
      </ul>

      <p class="text-gray-500 text-sm mt-10">
        生成日期：2026-08-09。如有缺漏或版本更新，请同步更新本页。
      </p>
    </article>
  </div>
</template>
