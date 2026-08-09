# HopeOS 第三方组件许可证说明（Third-Party Notices）

本文件汇总 HopeOS 项目在构建与运行中使用的第三方代码、字体与工具链及其许可证。
HopeOS 自身的许可证目前尚未在仓库中标注（TBD）；下述仅罗列**第三方**依赖。

> 说明：HopeOS 在用户态移植了 StarDustUI 作为图形界面工具包，并内嵌了若干字体。
> 内核与构建系统（clang / lld / nasm / QEMU / OVMF / mtools 等）仅用于编译与测试，
> 不随 HopeOS 发行镜像一起分发，其许可证仅作信息性说明。

---

## 1. 随镜像分发的第三方代码

### 1.1 StarDustUI
- **用途**：C++17 跨平台 UI 框架，已被移植到 HopeOS 用户态（freestanding ABI），
  用于 `stardustui_helloworld` / `stardustui_duckchat` / `stardustui_desktop` 等 GUI 程序。
- **来源**：`xingji-studio/StardustUI`（XINGJI 工作室）
- **许可证**：**MIT**
- **位置**：`user/stardustui/`（vendored + HopeOS 移植层 `platforms/hopeos.cpp`）
- **备注**：上游仓库为 MIT；当前 vendored 树内未附带 LICENSE 文件，建议后续 vendoring 时补回上游 `LICENSE`。

### 1.2 rapidjson
- **用途**：JSON 解析器，被 StarDustUI（DuckChat 示例）使用。
- **来源**：Tencent
- **许可证**：**MIT**
- **位置**：`user/stardustui/includes/rapidjson/`

### 1.3 ab_glyph_rasterizer（C API 头文件）
- **用途**：TrueType 解析/光栅化的 C 语言接口声明；在 HopeOS 构建中实际走自带的
  freestanding 软件 TrueType 光栅器（`src/text/rasterizer/rasterizer.cpp`），Rust 的
  `ab_glyph` crate **未链接**，仅 vendored 头文件。
- **来源**：`ab_glyph` (Rust) 项目
- **许可证**：**MIT OR Apache-2.0**（双许可，上游 Rust crate）
- **位置**：`user/stardustui/third_party/ab_glyph_rasterizer/`
- **备注**：HopeOS 仅包含其 C ABI 头文件，不引入 Rust 工具链；如启用 Linux 构建的
  `STARDUSTUI_USE_AB_GLYPH_RASTERIZER` 则需要遵守 MIT/Apache-2.0。

---

## 2. 随镜像内嵌的字体

### 2.1 Noto Sans（NotoSans-Regular.ttf）
- **用途**：StarDustUI 的默认 UI 字体，构建时通过 `objcopy` 链接进每个 StarDustUI ELF。
- **来源**：Google
- **许可证**：**SIL Open Font License 1.1（OFL-1.1）**
- **位置**：构建期取自系统字体（默认 `/usr/share/fonts/noto/NotoSans-Regular.ttf`，
  可用 `FONT_FILE=...` 覆盖）。
- **合规要点**：OFL-1.1 允许自由分发与内嵌，但要求保留版权与许可声明，且**不得**单独
  以字体名义售卖，也不得修改后仍以 "Noto Sans" 原名发布。原始字体文件不随 HopeOS 源码
  仓库提交，仅内嵌其二进制位图/轮廓数据。

### 2.2 GB2312 点阵字体（assets/gb2312.fnt）
- **用途**：内核 16px 中文显示（启动加载，非链接进内核）。
- **来源**：由系统上安装的 CJK 轮廓字体（默认 **SimSun / 宋体**）内嵌的 16×16 1-bit
  字 strikes，经 `tools/mkfont.py` 在构建期栅格化生成。
- **许可证**：**派生自专有字体（SimSun 属 Microsoft / 北大方正）**。
- **合规要点**：
  - `gb2312.fnt` 是**构建产物**（由 `mkfont.py` 生成，已被 `.gitignore` 忽略），
    HopeOS 不提交也不分发 SimSun 原始字体文件。
  - 若构建机上未安装合适的字体，构建**不会失败**，内核仅禁用 16px 中文显示。
  - 使用专有字体（如 SimSun）栅格化出的点阵用于再分发前，需确认你拥有该字体的
    使用授权；替代方案是用 **OFL-1.1 / 开源** 的中文字体（如 Noto Sans CJK、文泉驿等）
    重新生成 `gb2312.fnt`（通过 `FONT_FILE=...` 指定）以规避专有授权问题。

---

## 3. 构建与测试工具链（信息性，不随镜像分发）

| 工具 | 用途 | 许可证 |
|------|------|--------|
| LLVM / clang | 内核（UEFI/COFF）与用户态（ELF）编译 | Apache-2.0 with LLVM Exception |
| lld / lld-link | 链接 | Apache-2.0 |
| GCC | 宿主侧单元测试（tools/*_test） | GPL-3.0 |
| NASM | 汇编桩 | BSD-2-Clause |
| QEMU | x86_64 系统模拟（测试） | GPL-2.0 |
| EDK II / OVMF | UEFI 固件 | BSD-2-Clause（为主）+ MIT 等 |
| mtools | FAT32 镜像操作 | GPL-3.0 |
| Python 3 | 字体生成、截图转换、OCR 等脚本 | PSF-2.0 |
| Pillow | 截图/字体处理 | HPND |
| NumPy | 截图 OCR 辅助 | BSD-3-Clause |

---

## 4. 许可证全文获取
- MIT：https://opensource.org/licenses/MIT
- Apache-2.0：https://www.apache.org/licenses/LICENSE-2.0
- OFL-1.1：https://openfontlicense.org/
- GPL-2.0 / GPL-3.0：https://www.gnu.org/licenses/
- BSD / PSF-2.0 / HPND：见各上游仓库。

---
*生成日期：2026-08-09。如有缺漏或版本更新，请同步更新本文件。*
