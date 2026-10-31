<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "许可证 | 希望工作室",
  meta: [
    {
      name: "description",
      content:
        "HopeOS 项目本体与随镜像分发的第三方代码、字体、构建工具链的许可证说明，含 GPL 合规提示与 OpenXJ380 归属声明。",
    },
  ],
});

// 项目本体
const project = {
  name: "HopeOS",
  copyright: "Copyright (c) 2026 HopeOS contributors",
  license: "Apache License 2.0",
  locations: ["LICENSE", "NOTICE", "LICENSES/"],
};

// 随镜像分发 / 链接进用户的第三方代码
type Component = {
  name: string;
  version?: string;
  use: string;
  license: string;
  tone?: "ok" | "warn" | "copyleft";
  location: string;
  note?: string;
};

const runtime: Component[] = [
  {
    name: "StarDustUI",
    version: "vendored",
    use: "C++17 跨平台 UI 框架，移植到 HopeOS 用户态（platforms/hopeos.cpp）；StarDust Desktop、HopeOS 95 与自研窗口管理器客户端都基于它绘制。",
    license: "MIT",
    tone: "ok",
    location: "user/stardustui/",
    note: "上游 xingji-studio/StardustUI，Copyright (c) 2026 XINGJI Studios。vendored 树未附带 LICENSE 文件，全文见 LICENSES/MIT.txt。",
  },
  {
    name: "rapidjson",
    use: "JSON 解析器，被 StarDustUI 示例使用。",
    license: "MIT",
    tone: "ok",
    location: "user/stardustui/includes/rapidjson/",
  },
  {
    name: "ab_glyph_rasterizer（C API 头文件）",
    use: "TrueType 光栅化接口声明；HopeOS 实际使用自带的 freestanding 光栅化实现，只保留头文件兼容层。",
    license: "MIT / Apache-2.0",
    tone: "ok",
    location: "user/stardustui/…",
  },
  {
    name: "Dear ImGui",
    use: "原生 GUI 应用与调试界面的即时模式控件库。",
    license: "MIT",
    tone: "ok",
    location: "user/imgui/",
    note: "Copyright (c) 2014-2026 Omar Cornut；全文见 user/imgui/LICENSE.txt。",
  },
  {
    name: "IceWM",
    version: "1.4.2",
    use: "X11 窗口管理器：窗口收养、标题栏、任务栏、开始菜单。",
    license: "LGPL-2.0",
    tone: "copyleft",
    location: "user/icewm/（构建期 third_party/icewm-1.4.2/，不提交）",
    note: "GNU Library GPL v2；全文见 LICENSES/LGPL-2.0.txt。以静态方式链接进 HopeOS 用户态，分发镜像时须保证接收者可以替换该库（对应源码与构建脚本已提供）。",
  },
  {
    name: "GNU nano",
    version: "2.2.6",
    use: "文本编辑器 /bin/nano（GUI 与 TTY 均可用）。",
    license: "GPL-3.0-or-later",
    tone: "copyleft",
    location: "user/nano/",
    note: "Copyright (C) 1999-2011 Free Software Foundation, Inc.；全文见 user/nano/COPYING。",
  },
  {
    name: "BusyBox",
    version: "1.36.1",
    use: "/bin/busybox：POSIX 用户态工具集（sh、ls、cat 等），也是 /bin/gnu/ 包装脚本的解释器。",
    license: "GPL-2.0 only",
    tone: "copyleft",
    location: "third_party/（third_party/build_busybox.sh 构建期获取，不提交）",
  },
  {
    name: "GNU coreutils",
    version: "9.5",
    use: "单个 multicall 二进制 /bin/coreutils + /bin/gnu/ 下 105 个 applet 包装脚本。",
    license: "GPL-3.0-or-later",
    tone: "copyleft",
    location: "third_party/（third_party/build_coreutils.sh 构建期获取，不提交）",
    note: "Copyright (C) 1989-2024 Free Software Foundation, Inc.；全文见 LICENSES/GPL-3.0-or-later.txt。",
  },
  {
    name: "musl libc",
    version: "1.2.5",
    use: "用户态 libc，所有第三方用户程序以 static PIE 方式链接它。",
    license: "MIT",
    tone: "ok",
    location: "third_party/musl-1.2.5/ + musl-cc 交叉编译包装器",
  },
  {
    name: "lwIP",
    version: "2.2.0",
    use: "内核 IPv4 协议栈（ARP/IP/ICMP/UDP/TCP/DHCP/DNS）。",
    license: "BSD-3-Clause",
    tone: "ok",
    location: "kernel/net/ + third_party/lwip/（源码构建期获取，不提交）",
    note: "Copyright (c) 2001-2004 Swedish Institute of Computer Science；移植层 kernel/net/lwip_port/ 为本项目新写。",
  },
  {
    name: "TRE 正则引擎",
    use: "musl 版 regex 实现，供 grep/sed 等使用。",
    license: "BSD-2-Clause",
    tone: "ok",
    location: "user/regex/",
    note: "Copyright (c) 2001-2009 Ville Laurikari；声明见各源文件头部。",
  },
  {
    name: "dwm / dmenu / tinywm 派生代码",
    use: "X 工具（dmenu）与测试客户端，取自 suckless 系最小实现后移植。",
    license: "MIT / X11",
    tone: "ok",
    location: "user/x/",
    note: "Copyright (c) 2006-2011 suckless.org 及各自作者；全文见 LICENSES/X11.txt。",
  },
  {
    name: "fastfetch",
    version: "2.70.0",
    use: "/bin/fastfetch 系统信息展示。",
    license: "MIT",
    tone: "ok",
    location: "third_party/build_fastfetch.sh（构建期获取，不提交）",
    note: "Copyright (c) 2022-2025 Linus Dierheimer 及贡献者。构建脚本对上游 GPU 探测打了一个无 libdrm 时的局部补丁。",
  },
];

// 字体
const fonts = [
  {
    name: "Noto Sans（NotoSans-Regular.ttf）",
    use: "StarDustUI 默认 UI 字体，构建时用 objcopy 链接进 StarDustUI ELF。",
    license: "SIL Open Font License 1.1（OFL-1.1）",
    tone: "ok" as const,
    note: "构建期取自系统字体（默认 /usr/share/fonts/noto/NotoSans-Regular.ttf，可用 FONT_FILE= 覆盖）。OFL-1.1 允许内嵌与再分发，要求保留版权声明、不得单独售卖字体、修改后不得沿用原名。",
  },
  {
    name: "GB2312 16×16 点阵（build/assets/gb2312.fnt）",
    use: "内核 16px 中文显示（构建产物，启动时随 /fonts 装入 ramfs）。",
    license: "派生自系统 CJK 轮廓字体（SimSun 属专有字体）",
    tone: "warn" as const,
    note: "由 tools/mkfont.py 在构建期从构建机上的中文字体栅格化生成，源字体文件不提交也不随仓库分发。若需再分发含该点阵的镜像，请确认字体授权，或用开源中文字体重新生成（FONT_FILE=…）以规避专有授权问题。",
  },
];

// 构建 / 测试工具链（信息性，不随镜像分发）
const toolchain = [
  { name: "LLVM / clang", use: "内核（UEFI/COFF）与用户态（ELF）编译", license: "Apache-2.0 WITH LLVM-exception" },
  { name: "lld / lld-link", use: "链接", license: "Apache-2.0" },
  { name: "GCC", use: "宿主侧单元测试（tools/*_test）", license: "GPL-3.0-or-later" },
  { name: "NASM", use: "汇编桩", license: "BSD-2-Clause" },
  { name: "GNU Make", use: "构建编排", license: "GPL-3.0-or-later" },
  { name: "QEMU", use: "x86_64 系统模拟（测试）", license: "GPL-2.0" },
  { name: "EDK II / OVMF", use: "UEFI 固件", license: "BSD-2-Clause（为主）+ MIT 等" },
  { name: "mtools", use: "FAT32 镜像操作（mmd / mcopy）", license: "GPL-3.0-or-later" },
  { name: "Python 3", use: "字体生成、截图、测试驱动脚本", license: "PSF-2.0" },
  { name: "Pillow", use: "截图 / 字体处理", license: "HPND" },
  { name: "NumPy", use: "截图 OCR 辅助", license: "BSD-3-Clause" },
];

const gplNotice = [
  "HopeOS 的发行镜像里包含 GPL 程序（BusyBox 1.36.1、GNU coreutils 9.5、GNU nano 2.2.6）。分发镜像时，必须按 GPL 第 3 条提供完整对应源码，或提供有效的书面要约。",
  "本仓库不提交上述程序的源码包，但提供可复现的获取/构建脚本：third_party/build_busybox.sh、third_party/build_coreutils.sh（nano 源码随 user/nano/ 提交）。任何人拿到镜像后应能通过这些脚本从上游官方发布地址重新构建出相同二进制。",
  "LGPL 组件（IceWM 1.4.2）以静态链接方式进入用户态程序；HopeOS 提供对应源码与可重新链接的构建系统，满足 LGPL-2.0 第 6 条的替换要求。",
];

// 许可证全文
const fullText = [
  { name: "Apache-2.0（HopeOS 本体）", url: "https://www.apache.org/licenses/LICENSE-2.0" },
  { name: "GPL-2.0", url: "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html" },
  { name: "GPL-3.0-or-later", url: "https://www.gnu.org/licenses/gpl-3.0.html" },
  { name: "LGPL-2.0", url: "https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html" },
  { name: "MIT", url: "https://opensource.org/license/mit" },
  { name: "BSD-2-Clause / BSD-3-Clause", url: "https://opensource.org/license/bsd-3-clause" },
  { name: "X11", url: "https://opensource.org/license/x11" },
  { name: "SIL OFL-1.1", url: "https://openfontlicense.org/" },
];

const toneClass = (t?: string) =>
  t === "copyleft" || t === "warn" ? "text-warning" : "text-success";
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 896px">
    <div class="mb-8">
      <div class="text-subtitle-1 text-tertiary font-weight-medium mb-1">许可证 · Licenses</div>
      <div class="text-display-medium text-on-surface mb-2">HopeOS 许可证说明</div>
      <div class="text-body-1 text-medium-emphasis" style="line-height: 1.8">
        本页汇总 HopeOS 项目本体、随镜像分发的第三方组件、内嵌字体与构建工具链的许可证。
        项目采用 <strong class="text-on-surface">Apache-2.0</strong>；镜像中另含 GPL / LGPL /
        MIT 等多种第三方代码，分发时请按第 4 节履行对应义务。
      </div>
    </div>

    <v-alert type="warning" variant="tonal" class="mb-8">
      <strong>分发含镜像的 HopeOS 之前请读第 4 节。</strong>
      镜像包含 GPLv2/BusyBox、GPLv3/coreutils 与 nano、LGPL/IceWM 等 copyleft 组件，
      再分发时必须一并提供对应源码的获取方式。
    </v-alert>

    <!-- 1. 项目本体 -->
    <div class="text-title-large font-weight-bold text-on-surface mt-6 mb-4">1. HopeOS 项目本体</div>
    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <ul class="license-list">
          <li><span class="text-on-surface">许可证</span>：<span class="text-success font-weight-semibold">{{ project.license }}</span></li>
          <li><span class="text-on-surface">版权</span>：{{ project.copyright }}</li>
          <li><span class="text-on-surface">位置</span>：<code>LICENSE</code>（全文）、<code>NOTICE</code>（第三方归属汇总）、<code>LICENSES/</code>（各组件许可证全文）</li>
          <li class="text-medium-emphasis">
            Apache-2.0 第 4 条要求再分发时保留 <code>NOTICE</code> 中的归属声明；
            第 6 条不授予商标许可，详见第 5 节。
          </li>
        </ul>
      </v-card-text>
    </v-card>

    <!-- 2. 随镜像分发的第三方代码 -->
    <div class="text-title-large font-weight-bold text-on-surface mt-6 mb-4">
      2. 随镜像分发 / 链接进用户的第三方代码
    </div>
    <v-card v-for="c in runtime" :key="c.name" elevation="0" class="mb-4">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold text-on-surface mb-2">
          {{ c.name }}<span v-if="c.version" class="text-medium-emphasis"> · {{ c.version }}</span>
        </div>
        <ul class="license-list">
          <li><span class="text-on-surface">用途</span>：{{ c.use }}</li>
          <li><span class="text-on-surface">许可证</span>：<span :class="toneClass(c.tone)" class="font-weight-semibold">{{ c.license }}</span></li>
          <li><span class="text-on-surface">位置</span>：<code>{{ c.location }}</code></li>
          <li v-if="c.note" class="text-medium-emphasis">{{ c.note }}</li>
        </ul>
      </v-card-text>
    </v-card>

    <!-- 3. 字体 -->
    <div class="text-title-large font-weight-bold text-on-surface mt-6 mb-4">3. 随镜像内嵌的字体</div>
    <v-card v-for="f in fonts" :key="f.name" elevation="0" class="mb-4">
      <v-card-text>
        <div class="text-subtitle-1 font-weight-bold text-on-surface mb-2">{{ f.name }}</div>
        <ul class="license-list">
          <li><span class="text-on-surface">用途</span>：{{ f.use }}</li>
          <li><span class="text-on-surface">许可证</span>：<span :class="toneClass(f.tone)" class="font-weight-semibold">{{ f.license }}</span></li>
          <li class="text-medium-emphasis">{{ f.note }}</li>
        </ul>
      </v-card-text>
    </v-card>

    <!-- 4. GPL 合规 -->
    <div class="text-title-large font-weight-bold text-on-surface mt-6 mb-4">4. GPL / LGPL 合规提示</div>
    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <ul class="license-list">
          <li v-for="(g, i) in gplNotice" :key="i" class="mb-2">{{ g }}</li>
        </ul>
      </v-card-text>
    </v-card>

    <!-- 5. 来自 OpenXJ380 -->
    <div class="text-title-large font-weight-bold text-on-surface mt-6 mb-4">5. 来自 OpenXJ380 的参考与派生</div>
    <v-card elevation="0" class="mb-6">
      <v-card-text>
        <ul class="license-list">
          <li><span class="text-on-surface">上游</span>：OpenXJ380（XJ380 内核），Copyright (c) XINGJI Studios 2017-2026</li>
          <li><span class="text-on-surface">许可证</span>：<span class="text-success font-weight-semibold">Apache License 2.0</span>（全文见 LICENSES/Apache-2.0.txt）</li>
          <li><span class="text-on-surface">快照</span>：<code>6a52c7bce805</code>（2026-10-28 捐赠）</li>
          <li>
            <span class="text-on-surface">修改声明（Apache-2.0 §4(b)）</span>：HopeOS 按
            <code>docs/fusion/ROADMAP.md</code> 融合 OpenXJ380 的硬件/内核子系统（ACPI、PCI/PCIe、
            AHCI、FAT32、APIC/HPET、网络栈接口等）。这些实现均<strong class="text-on-surface">
            经过实质性修改</strong>：按 HopeOS 的内核接口、VFS 层、内存模型与构建系统重写或适配，
            与 OpenXJ380 原文件在结构、命名、错误处理和并发模型上均不相同；不是原样拷贝。
            若将来直接导入其源文件，会保留原版权头、在文件头标注修改说明，并逐文件登记。
          </li>
          <li class="text-medium-emphasis">
            逐文件追溯（HopeOS 路径 / 参考的 OpenXJ380 位置 / 差异说明）见
            <code>docs/fusion/PROVENANCE.md</code>；导入检查清单要求每个文件标注
            “Derived from OpenXJ380 … 修改说明”并同步 NOTICE。
          </li>
          <li class="text-medium-emphasis">
            网络栈为上游 lwIP 2.2.0 + HopeOS 自写的 NO_SYS 移植层（<code>kernel/net/lwip_port/</code>）；
            FAT32 解析按 Microsoft FAT 规范新写，未引入 FatFs 源码。
          </li>
          <li class="text-medium-emphasis">
            商标：“XJ380”、“XINGJI”、“星纪”及其标识是 XINGJI Studios 的商标/名称。
            Apache-2.0 第 6 条不授予商标许可；HopeOS 不在产品名、域名、图标或宣传中使用上述标识，
            仅在事实性说明中提及。
          </li>
        </ul>
      </v-card-text>
    </v-card>

    <!-- 6. 构建与测试工具链 -->
    <div class="text-title-large font-weight-bold text-on-surface mt-6 mb-4">
      6. 构建与测试工具链（信息性，不随镜像分发）
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

    <!-- 7. 全文 -->
    <div class="text-title-large font-weight-bold text-on-surface mt-6 mb-4">7. 许可证全文获取</div>
    <div class="d-flex flex-column ga-2">
      <div v-for="l in fullText" :key="l.name" class="text-body-1">
        <span class="text-on-surface">{{ l.name }}</span>：
        <a :href="l.url" target="_blank" rel="noopener" class="text-primary text-decoration-underline">
          {{ l.url }}
        </a>
      </div>
      <div class="text-body-1">
        <span class="text-on-surface">仓库内全文</span>：
        <code>LICENSE</code>、<code>NOTICE</code>、<code>LICENSES/</code>
        （Apache-2.0、GPL-2.0、GPL-3.0-or-later、LGPL-2.0、MIT、X11、lwIP BSD-3-Clause）。
      </div>
    </div>

    <div class="text-caption text-medium-emphasis mt-10">
      更新日期：2026-11-01。上游版本与许可证如有变化，请同步更新本页与仓库内 NOTICE。
    </div>
  </v-container>
</template>

<style scoped>
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
  border-radius: var(--shape-xs);
  font-size: 0.85em;
}
</style>
