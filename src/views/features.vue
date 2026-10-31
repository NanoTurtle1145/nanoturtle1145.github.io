<script setup lang="ts">
import { useHead } from "@unhead/vue";

const XJ380_SITE = "https://www.xingjisoft.com/os/xj380";
const XJ380_REPO = "https://github.com/xingji-studio/OpenXJ380";

useHead({
  title: "融合内核 | HopeOS × XJ380OS | 希望工作室",
  meta: [
    {
      name: "description",
      content:
        "HopeOS 融合内核详解：以 HopeOS 为主体，吸收 XJ380OS 的 ACPI/PCI、AHCI、FAT32、e1000、lwIP 与 SMP 基础设施——四个阶段、可复现的验收日志、逐文件来源登记。",
    },
    {
      property: "og:title",
      content: "HopeOS × XJ380OS 融合内核 | 希望工作室",
    },
    {
      property: "og:description",
      content:
        "HopeOS 的内核，装进 XJ380OS 的零件：ACPI/PCI、AHCI、FAT32、lwIP、4 核 SMP 的融合过程与验收记录。",
    },
    { property: "og:image", content: "/media/hopeos/xj380-mark.png" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});

/* 阶段时间线：P1..P4，均来自 docs/fusion/ROADMAP.md 的验收记录 */
const phases = [
  {
    id: "P1",
    date: "2026.10.30",
    title: "基础设施：ACPI + PCI 枚举",
    status: "done",
    body:
      "解析 RSDP → RSDT/XSDT → MADT / MCFG / HPET，校验表和表头 checksum；PCI 走配置机制 #1（0xCF8/0xCFC）扫 0..255 总线，支持多功能设备，把 vendor/device/class/BAR 存进 g_pci，供后面三个阶段使用。",
    logs: [
      "acpi: madt=... cpus=1 ioapics=1",
      "pci 00:1F.2 8086:2922 sata cls=01:06:01",
      "p1: pci=ok ahci=yes(00:1F.2) e1000=yes(00:02.0)",
    ],
    note: "ACPI 48 项 + PCI 43 项宿主单测；没有走 ECAM —— 此刻内核还没有映射 0xE0000000，碰它是三重故障。",
  },
  {
    id: "P2",
    date: "2026.10.30",
    title: "存储：AHCI + FAT32",
    status: "done",
    body:
      "AHCI 从 PCI 找到控制器，COMRESET、启动引擎、IDENTIFY + 扇区读全用轮询，暴露成 struct blkdev；FAT32 只读后端（BPB、FAT 链、8.3 目录项）实现 fs_ops，写操作统一 EROFS。VFS 为此补了挂载表，磁盘挂到 /disk。",
    logs: [
      "ahci: read LBA0 rc=0 sig=0xAA55 ... sectors=131072",
      "fat32: mounted at /disk root_cluster=2 cluster_size=512",
      "hopeos:/$ cat /disk/HELLO.TXT",
    ],
    note: "挂载必须放在 espload 之后、boot menu 之前：AHCI 初始化会 COMRESET 端口，把固件的 SATA 状态打坏。",
  },
  {
    id: "P3",
    date: "2026.10.30",
    title: "网络：e1000 + lwIP + TCP + AF_INET",
    status: "done",
    body:
      "自写 e1000 8254x 轮询驱动（PCI BAR0、RX/TX 环、MAC 从 RAL/EEPROM 读）；移植上游 lwIP 2.2.0（NO_SYS，移植层在 kernel/net/）；再往上补 raw-TCP 客户端与 AF_INET socket 桥，busybox wget / ifconfig 直接可用。",
    logs: [
      "net: lwIP up on e0, ip=10.0.2.15",
      "p3b: ping reply from gateway",
      "p3c: tcp connected, response=HTTP/1.0 200 OK",
    ],
    note: "fs 层只做转发（struct fs_sock_hooks），所以 fs.c 仍能在宿主编译、原有单测不受影响。",
  },
  {
    id: "P4a",
    date: "2026.10.30",
    title: "SMP 第一步：CPU 拓扑 + BSP APIC",
    status: "done",
    body:
      "MADT 扩展成完整拓扑：所有 enabled CPU 的 APIC ID、第一个 IOAPIC 的基址/ID/GSI 基；smp.c 从 IA32_APIC_BASE（MSR 0x1B）读 APIC 基址与 BSP 位。纯读，不改引导行为。",
    logs: [
      "smp: cpus=1 bsp=1 first_apic_id=0 apic_base=...",
      "· -smp 4 时 MADT 正确解出 cpus=4 apic_ids=0,1,2,3",
    ],
    note: "发现 -smp 4 过不了 boot menu：不是 AP 的问题，而是 ExitBootServices 必须在固件自己的 GDT/IDT 下执行。",
  },
  {
    id: "P4b",
    date: "2026.10.31",
    title: "SMP 第二步：4 vCPU 完整启动 + AP 上线",
    status: "done",
    body:
      "take_control 不再提前换 GDT/IDT/TSS；EBS 完成后才 enter_own_descriptors()。新增位置无关的 SIPI trampoline：实模式 → 保护模式 → PAE/LME/NXE → 长模式 → AP 入口。3 个 AP 全部 online 并自增 ticks。",
    logs: [
      "smp: AP1 online (slot 1)",
      "smp: 3 of 3 AP(s) online, ticks=1321959,755687,143676",
      "· ifconfig / fastfetch（CPU 4 核 @2.59 GHz）/ wget 全部正常",
    ],
    note: "顺带修掉 OVMF 留下的 LAPIC spurious vector 0x0F 与空兜底门：补 0x30–0xFF 兜底门，否则杂中断 = 三重故障。",
  },
  {
    id: "P4c",
    date: "下一步",
    title: "SMP 第三步：多核调度",
    status: "next",
    body:
      "AP 先改成 hlt 空闲循环 + IPI 唤醒；中断从 8259 迁到 IOAPIC（24 条重定向表已读出来）；调度器加核间锁与每核 runqueue，单核 irq_save() 的互斥假设要全部复核。",
    logs: ["验收目标：sysmonitor 里看到多核各自跑任务"],
    note: "",
  },
];

/* 已融合能力：每个子系统一张卡 */
const gains = [
  {
    tag: "P1",
    area: "固件 / 总线",
    title: "ACPI 表解析",
    desc: "RSDT / XSDT 自动选择，MADT、MCFG、HPET 全部进 g_acpi；checksum 坏表直接跳过。",
    metric: "ACPI 48 项单测",
  },
  {
    tag: "P1",
    area: "固件 / 总线",
    title: "PCI / PCIe 枚举",
    desc: "0xCF8/0xCFC 机制扫 255 条总线，多功能设备、64 位 BAR、class code 全解析。",
    metric: "PCI 43 项单测",
  },
  {
    tag: "P2",
    area: "存储",
    title: "AHCI 块设备",
    desc: "COMRESET → 引擎启动 → IDENTIFY / 扇区读，轮询实现，不需要中断。",
    metric: "131072 扇区",
  },
  {
    tag: "P2",
    area: "存储",
    title: "FAT32 只读挂载",
    desc: "BPB / FAT 链 / 8.3 目录项解析，实现 fs_ops 的 lookup/readdir/read；写操作 EROFS。",
    metric: "/disk 可 ls、cat",
  },
  {
    tag: "P3",
    area: "网络",
    title: "e1000 网卡驱动",
    desc: "8254x 轮询驱动：PCI BAR0、控制器复位、RX/TX 描述符环、MAC 从 RAL/EEPROM 读。",
    metric: "ARP 自检通过",
  },
  {
    tag: "P3",
    area: "网络",
    title: "lwIP 2.2.0 协议栈",
    desc: "IPv4 / ARP / ICMP / TCP，NO_SYS 模式，sys_now() 用 PIT2 + rdtsc 标定毫秒时钟。",
    metric: "ping 网关通过",
  },
  {
    tag: "P3",
    area: "网络",
    title: "TCP 客户端 + AF_INET",
    desc: "kernel raw-TCP 自检 + fs_sock_hooks 桥接；busybox wget 与 ifconfig 是真实用户态程序。",
    metric: "wget 保存成功",
  },
  {
    tag: "P4",
    area: "SMP",
    title: "4 vCPU 接管",
    desc: "EBS 在固件描述符下完成，SIPI trampoline 拉起 3 个 AP，/proc/cpuinfo 报 4 核。",
    metric: "3 / 3 AP online",
  },
];

/* 工程细节 / 踩坑：这些是融合里真正花时间的部分 */
const notes = [
  {
    title: "AHCI 命令头的 tbl_addr 在 byte 8",
    body:
      "byte 4 是 PRDBC。写错会让控制器从物理地址 0 DMA 128 字节，报 “unhandled FIS type 0x00”。",
    tag: "AHCI",
  },
  {
    title: "PRDT 字节计数在最后一个 dword",
    body:
      "offset 12 才是字节数，offset 8 是 reserved。写反会只 DMA 1 字节——现象是“读成功但全是 0”。",
    tag: "AHCI",
  },
  {
    title: "COMRESET 后先启动引擎再等 ready",
    body:
      "设备要等 FIS 接收使能后才发第一个 D2H FIS；先等 ready 就是死锁。",
    tag: "AHCI",
  },
  {
    title: "e1000 必须先置 PCI COMMAND.BUS_MASTER",
    body:
      "QEMU 对 bus-master 位为 0 的设备直接吞掉 DMA：寄存器可读、link=up、报文永远不动。",
    tag: "e1000",
  },
  {
    title: "ExitBootServices 会把 e1000 复位",
    body:
      "OVMF 的 EBS 清掉 TCTL/RCTL/TDBAL。内核自检在 EBS 之前跑所以没暴露，用户态 wget 才发现 —— 修复是在 sched_init() 之后重做 e1000_reinit()。",
    tag: "e1000",
  },
  {
    title: "EBS 必须跑在固件的 GDT/IDT 下",
    body:
      "多 CPU 时 OVMF 的 EBS 会走 MP 协议停靠 AP 的路径，用我们的描述符就三重故障。take_control 现在只切栈，EBS 之后才换表。",
    tag: "SMP",
  },
  {
    title: "SIPI 入口必须 patch 成绝对物理地址",
    body:
      "SIPI 永远从 page:0000 进入，进入长模式后 CS base 变 0；另外 AP 也要打开 EFER.NXE，否则 PTE 的 NX 位被当 reserved 位。",
    tag: "SMP",
  },
  {
    title: "lwIP raw API 的 pbuf 是 IP 头在内",
    body:
      "raw_input() 在 pbuf_remove_header 之前调用；按“payload 就是 ICMP 头”解析会把 0x45 当成 ICMP type=69。",
    tag: "lwIP",
  },
];

const whyRows = [
  {
    judge: "GUI",
    hope: "内核 GUI + X server + IceWM + StarDustUI 已经能跑",
    reverse: "XJ380 2026-08 已移除 GUI，等于从零重写",
  },
  {
    judge: "用户态 ABI",
    hope: "POSIX 子集 96 个 syscall，nano / busybox / StarDustUI 在跑",
    reverse: "XAPI 私有 ABI + Linux 兼容层，整条用户态要重做",
  },
  {
    judge: "复用率",
    hope: "搬进来的每个子系统都是净增能力",
    reverse: "HopeOS 的 5.5k 行内核 GUI 与调好的用户态全部要重接",
  },
  {
    judge: "许可证 / 品牌",
    hope: "只要署名，产品名仍然是 HopeOS",
    reverse: "叫“XJ380 发行版”要拿商标许可",
  },
];
</script>

<template>
  <div class="features-page">
    <!-- ================= Hero ================= -->
    <header class="hero wrap">
      <div class="hero-copy">
        <p class="eyebrow"><i aria-hidden="true" />FEATURE · FUSION KERNEL</p>
        <h1>融合内核<span class="dot" aria-hidden="true">.</span></h1>
        <p class="tagline">HopeOS 的内核，装进 XJ380OS 的零件。</p>
        <p class="lead">
          HopeOS 保持内核、用户态、GUI 与 POSIX ABI 的主体地位，把
          <a :href="XJ380_SITE" target="_blank" rel="noopener">XJ380OS</a>
          已经打磨过的硬件/内核基础设施按子系统吸收进来：ACPI、PCI、AHCI、
          FAT32、e1000、lwIP 与 SMP。四个阶段都已落地并在 QEMU 验收，本页把
          “融合了什么、怎么验的、踩了哪些坑”一次讲清楚。
        </p>
        <div class="chips">
          <span>4 个阶段已落地</span>
          <span>4×vCPU SMP</span>
          <span>AHCI + FAT32</span>
          <span>lwIP TCP</span>
        </div>
        <div class="actions">
          <router-link class="btn btn-solid" to="/hopeos">回到 HopeOS 项目</router-link>
          <a class="btn btn-ghost" :href="XJ380_SITE" target="_blank" rel="noopener">
            XJ380OS 官网
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div class="hero-art">
        <div class="merge" role="img" aria-label="HopeOS 与 XJ380OS 两个标志部分重叠，重叠的部分代表融合内核">
          <div class="merge-logo merge-logo--hope">
            <img
              class="hope-mark hope-mark--light"
              src="/media/hopeos/hopeos-mark.svg"
              alt=""
              width="216"
              height="216"
              fetchpriority="high"
              decoding="async"
            />
            <img
              class="hope-mark hope-mark--dark"
              src="/media/hopeos/hopeos-mark-inverse.svg"
              alt=""
              width="216"
              height="216"
              fetchpriority="high"
              decoding="async"
            />
          </div>
          <div class="merge-logo merge-logo--xj">
            <img
              src="/media/hopeos/xj380-mark.png"
              alt=""
              width="216"
              height="216"
              fetchpriority="high"
              decoding="async"
            />
          </div>
          <span class="merge-glow" aria-hidden="true" />
        </div>
        <p class="merge-eq">
          <b>HopeOS</b><span aria-hidden="true">×</span><b>XJ380OS</b><span aria-hidden="true">=</span><em>融合内核</em>
        </p>
        <p class="hero-caption">
          两个标志都按原样保留，只在右上 / 左下错开一部分重叠：左边是 HopeOS（桌面 ·
          用户态 · POSIX），右边是 XJ380OS（ACPI · PCI · AHCI · FAT32 · lwIP · SMP）。
          <b>重叠的那块，就是融合内核。</b>
        </p>
      </div>
    </header>

    <!-- ================= 为什么 ================= -->
    <section id="why" class="wrap section">
      <div class="section-head">
        <p class="kicker">WHY FUSION</p>
        <h2>为什么是「融合」，不是「换底座」</h2>
        <p class="section-lead">
          方向是单向的：HopeOS 当主体，XJ380 当零件供应商。反过来做要重写 GUI
          和整条用户态，成本高一个数量级。
        </p>
      </div>

      <div class="split">
        <article class="split-card split-card--hope">
          <p class="split-label">HOPEOS 提供</p>
          <h3>桌面、用户态与 ABI</h3>
          <ul>
            <li>内核 GUI + 自研 X server + IceWM 窗口管理</li>
            <li>StarDustUI 两套原生 shell（StarDust / HopeOS 95）</li>
            <li>ring 3 + POSIX 子集 96 syscall，跑得动 nano、coreutils</li>
            <li>VFS / ramfs / 抢占式调度 / COW 页表</li>
          </ul>
        </article>

        <div class="split-fuse" aria-hidden="true">
          <span class="mini-merge">
            <img
              class="mini-hope hope-mark--light"
              src="/media/hopeos/hopeos-mark.svg"
              alt=""
              width="56"
              height="56"
            />
            <img
              class="mini-hope hope-mark--dark"
              src="/media/hopeos/hopeos-mark-inverse.svg"
              alt=""
              width="56"
              height="56"
            />
            <img class="mini-xj" src="/media/hopeos/xj380-mark.png" alt="" width="56" height="56" />
          </span>
          <span>融合</span>
        </div>

        <article class="split-card split-card--xj">
          <p class="split-label">XJ380OS 提供</p>
          <h3>硬件与内核基础设施</h3>
          <ul>
            <li>ACPI / APIC / HPET / SMP 拓扑与接管</li>
            <li>PCI / PCIe 枚举、AHCI 块设备</li>
            <li>FAT32、e1000 网卡、lwIP 协议栈</li>
            <li>XSK2.1 内核里打磨过的寄存器与协议细节</li>
          </ul>
        </article>
      </div>

      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th scope="col">判据</th>
              <th scope="col">以 HopeOS 为主体（采用）</th>
              <th scope="col">以 XJ380 为底座（否决）</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in whyRows" :key="row.judge">
              <th scope="row">{{ row.judge }}</th>
              <td>{{ row.hope }}</td>
              <td class="muted">{{ row.reverse }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ================= 融合图 ================= -->
    <section id="map" class="wrap section">
      <div class="section-head">
        <p class="kicker">FUSION MAP</p>
        <h2>两条血脉，一个内核</h2>
        <p class="section-lead">
          解法是“按文件搬、不整仓 vendoring”：每个搬进来的单元都要在 HopeOS
          工具链下重编、跑宿主/客机测试，并登记来源。
        </p>
      </div>

      <div class="map">
        <div class="map-col">
          <p class="map-title">HopeOS · 主体</p>
          <span class="map-item">内核 GUI / X server</span>
          <span class="map-item">POSIX syscall / ring 3</span>
          <span class="map-item">VFS · ramfs · 调度器</span>
          <span class="map-item">StarDustUI · IceWM</span>
        </div>
        <div class="map-arrow" aria-hidden="true">
          <span class="mini-merge mini-merge--lg">
            <img
              class="mini-hope hope-mark--light"
              src="/media/hopeos/hopeos-mark.svg"
              alt=""
              width="48"
              height="48"
            />
            <img
              class="mini-hope hope-mark--dark"
              src="/media/hopeos/hopeos-mark-inverse.svg"
              alt=""
              width="48"
              height="48"
            />
            <img class="mini-xj" src="/media/hopeos/xj380-mark.png" alt="" width="48" height="48" />
          </span>
          <span>合并进内核</span>
        </div>
        <div class="map-col map-col--xj">
          <p class="map-title">XJ380OS · 零件</p>
          <span class="map-item">ACPI / APIC / HPET</span>
          <span class="map-item">PCI / PCIe 枚举</span>
          <span class="map-item">AHCI · FAT32</span>
          <span class="map-item">e1000 · lwIP</span>
          <span class="map-item">SMP 接管 · SIPI</span>
        </div>
      </div>
      <div class="map-result">
        <strong>一个内核：HopeOS</strong>
        <span>产品名、GUI、用户态、许可证主体都不变；硬件能力是净增的。</span>
      </div>
    </section>

    <!-- ================= 已融合能力 ================= -->
    <section id="gains" class="wrap section">
      <div class="section-head">
        <p class="kicker">WHAT LANDED</p>
        <h2>已经融合了什么</h2>
        <p class="section-lead">
          八块能力，全部有验收记录；数字都来自 QEMU（q35 + OVMF）的真实串口日志。
        </p>
      </div>
      <div class="gain-grid">
        <article v-for="g in gains" :key="g.title" class="gain-card">
          <div class="gain-top">
            <span class="gain-tag">{{ g.tag }}</span>
            <span class="gain-area">{{ g.area }}</span>
          </div>
          <h3>{{ g.title }}</h3>
          <p>{{ g.desc }}</p>
          <p class="gain-metric">{{ g.metric }}</p>
        </article>
      </div>
    </section>

    <!-- ================= 时间线 ================= -->
    <section id="timeline" class="wrap section">
      <div class="section-head">
        <p class="kicker">TIMELINE</p>
        <h2>四个阶段，逐段可回滚</h2>
        <p class="section-lead">
          每个阶段独立可回滚、可演示；下面的日志片段是验收时真实打印的内容。
        </p>
      </div>

      <ol class="timeline">
        <li v-for="p in phases" :key="p.id" class="tl-item" :class="'tl-item--' + p.status">
          <div class="tl-dot" aria-hidden="true" />
          <div class="tl-body">
            <div class="tl-head">
              <span class="tl-id">{{ p.id }}</span>
              <span class="tl-date">{{ p.date }}</span>
              <span v-if="p.status === 'done'" class="tl-status tl-status--done">已完成</span>
              <span v-else class="tl-status tl-status--next">进行中</span>
            </div>
            <h3>{{ p.title }}</h3>
            <p>{{ p.body }}</p>
            <pre v-if="p.logs.length" class="tl-log">{{ p.logs.join("\n") }}</pre>
            <p v-if="p.note" class="tl-note">{{ p.note }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- ================= 踩坑 ================= -->
    <section id="notes" class="wrap section">
      <div class="section-head">
        <p class="kicker">ENGINEERING NOTES</p>
        <h2>真正花时间的地方</h2>
        <p class="section-lead">
          融合不是“抄过来就能跑”：团队在 QEMU trace 下逐个定位了这些坑，全部写进
          ROADMAP 与代码注释，避免以后再踩。
        </p>
      </div>
      <div class="note-grid">
        <article v-for="n in notes" :key="n.title" class="note-card">
          <span class="note-tag">{{ n.tag }}</span>
          <h3>{{ n.title }}</h3>
          <p>{{ n.body }}</p>
        </article>
      </div>
    </section>

    <!-- ================= 实拍 ================= -->
    <section id="shots" class="wrap section">
      <div class="section-head">
        <p class="kicker">SCREENSHOTS</p>
        <h2>融合后的真实终端</h2>
        <p class="section-lead">
          四 vCPU + e1000 的 QEMU 机器上：ifconfig / wget 走真实的 AF_INET socket；
          /proc/cpuinfo 报 4 核。
        </p>
      </div>
      <div class="shot-grid">
        <figure class="shot-card">
          <img src="/media/hopeos/fusion-net.png" alt="HopeOS 终端里运行 busybox ifconfig 和 wget，wget 从宿主机 HTTP 服务器下载页面成功" loading="lazy" decoding="async" />
          <figcaption>
            <strong>用户态网络</strong>
            busybox ifconfig 读 SIOCGIF*，wget 走 AF_INET socket；内核里是 e1000 → lwIP 2.2.0 → fs_sock_hooks。
          </figcaption>
        </figure>
        <figure class="shot-card">
          <img src="/media/hopeos/fusion-smp.png" alt="HopeOS 的 /proc/cpuinfo 显示 4 个 CPU，串口日志显示 3 of 3 AP online" loading="lazy" decoding="async" />
          <figcaption>
            <strong>四核接管</strong>
            ExitBootServices 在固件描述符下完成，SIPI trampoline 把 3 个 AP 拉起来；/proc/cpuinfo 报 4 核。
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- ================= 许可证 ================= -->
    <section id="license" class="wrap section">
      <div class="section-head">
        <p class="kicker">LICENSE &amp; PROVENANCE</p>
        <h2>来源、修改与署名</h2>
        <p class="section-lead">
          融合代码的许可证边界是清楚的：XJ380OS 以 Apache-2.0 提供，HopeOS
          项目本体也是 Apache-2.0。
        </p>
      </div>
      <div class="license-grid">
        <article class="license-card">
          <h3>逐文件追溯</h3>
          <p>
            搬进来的每个单元都记录原路径、上游 commit、sha256 与改动点，写在
            <code>docs/fusion/PROVENANCE.md</code>；修改过的文件在文件头注明
            “Derived from OpenXJ380 …” 与修改说明（Apache-2.0 §4(b)）。
          </p>
        </article>
        <article class="license-card">
          <h3>第三方与商标</h3>
          <p>
            lwIP 为 BSD-3-Clause，移植层是 HopeOS 自写；XJ380OS 的名称与品牌归
            星际工作室（XINGJI Studio）所有，此页仅作归属说明与技术引用，不暗示
            官方背书。
          </p>
        </article>
        <article class="license-card">
          <h3>镜像分发</h3>
          <p>
            HopeOS 镜像内含 GPL 组件（BusyBox、GNU coreutils、nano 等），再分发
            需提供对应源码获取方式；完整清单见
            <router-link to="/license">第三方组件许可证</router-link>。
          </p>
        </article>
      </div>
      <div class="source-links">
        <a :href="XJ380_SITE" target="_blank" rel="noopener">XJ380OS 官网 ↗</a>
        <a :href="XJ380_REPO" target="_blank" rel="noopener">OpenXJ380 源码（Apache-2.0）↗</a>
        <router-link to="/license">HopeOS 许可证页 →</router-link>
      </div>
    </section>

    <!-- ================= 下一步 ================= -->
    <section id="next" class="wrap section section--last">
      <div class="next-card">
        <div>
          <p class="kicker">WHAT'S NEXT</p>
          <h2>下一步：让四个核真正一起干活</h2>
          <p class="section-lead">
            P4b-2 之后 AP 还在 pause 忙等。接下来把它们改成 hlt 空闲循环 + IPI
            唤醒，中断迁到 IOAPIC，调度器加每核 runqueue 与核间锁——这是融合里
            风险最高的一步，也是“多核操作系统”真正成立的一步。
          </p>
        </div>
        <div class="next-actions">
          <router-link class="btn btn-solid" to="/hopeos">HopeOS 项目页</router-link>
          <router-link class="btn btn-ghost" to="/license">许可证与来源</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ============================================================
   融合内核专题页
   沿用站点 --site-* 令牌；融合配色（青 / 黄）单独用 --fx-* 变量，
   在深色主题下切换成更亮的版本，保证两种主题的对比度。
   ============================================================ */
.features-page {
  --fx-cyan: #0077b0;
  --fx-yellow: #a87900;
  position: relative;
  min-height: 100vh;
  overflow: clip;
  background: var(--site-bg);
}

html[data-theme="dark"] .features-page {
  --fx-cyan: #00c4f8;
  --fx-yellow: #fff200;
}

.features-page::before {
  content: "";
  position: absolute;
  z-index: 0;
  top: -260px;
  left: 50%;
  width: min(1100px, 120vw);
  height: 720px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, var(--site-glow) 0%, transparent 68%);
  pointer-events: none;
}

.wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-left: 32px;
  padding-right: 32px;
}

/* ---------------- Hero ---------------- */
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  align-items: center;
  gap: 54px;
  padding-top: 76px;
  padding-bottom: 68px;
}

.hero-copy {
  min-width: 0;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 22px;
  padding: 7px 13px;
  border: 1px solid var(--site-line);
  border-radius: 999px;
  background: var(--site-tint-1);
  color: var(--site-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.eyebrow i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--fx-cyan);
  box-shadow: 0 0 10px var(--fx-cyan);
}

.hero h1 {
  margin: 0;
  color: var(--site-text);
  font-size: clamp(52px, 7vw, 88px);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.dot {
  color: var(--site-accent);
}

.tagline {
  margin: 18px 0 0;
  color: var(--site-text-2);
  font-size: clamp(18px, 2vw, 23px);
  font-weight: 500;
  line-height: 1.45;
  letter-spacing: -0.012em;
}

.lead {
  max-width: 560px;
  margin: 18px 0 0;
  color: var(--site-muted);
  font-size: 15.5px;
  line-height: 1.82;
}

.lead a {
  color: var(--fx-cyan);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--fx-cyan) 40%, transparent);
}

.lead a:hover {
  border-bottom-color: var(--fx-cyan);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 24px;
}

.chips span {
  padding: 5px 10px;
  border: 1px solid var(--site-line);
  border-radius: 999px;
  background: var(--site-tint-1);
  color: var(--site-muted);
  font-size: 11.5px;
  letter-spacing: 0.01em;
}

.chips span:nth-child(2) {
  border-color: color-mix(in srgb, var(--fx-cyan) 34%, var(--site-line));
  color: color-mix(in srgb, var(--fx-cyan) 70%, var(--site-text));
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.btn-solid {
  background: var(--site-solid-btn-bg);
  color: var(--site-solid-btn-ink);
}

.btn-solid:hover {
  background: var(--site-solid-btn-bg-hover);
}

.btn-ghost {
  border: 1px solid var(--site-line);
  color: var(--site-text-2);
  background: var(--site-tint-1);
}

.btn-ghost:hover {
  border-color: color-mix(in srgb, var(--fx-cyan) 40%, var(--site-line));
  color: var(--site-text);
}

/* Hero 右侧：两个标志部分重叠 —— 重叠处 = 融合内核 */
.hero-art {
  min-width: 0;
  padding: 22px 20px 16px;
  border: 1px solid var(--site-line);
  border-radius: 18px;
  background: var(--site-panel-bg);
  box-shadow: var(--site-panel-shadow);
}

.merge {
  position: relative;
  width: 100%;
  max-width: 370px;
  aspect-ratio: 370 / 320;
  margin: 0 auto;
}

.merge-logo {
  position: absolute;
  width: 58.4%;
  aspect-ratio: 1;
  border-radius: 24%;
  overflow: hidden;
  line-height: 0;
  font-size: 0;
}

.merge-logo img {
  width: 100%;
  height: 100%;
}

.merge-logo--hope {
  left: 0;
  top: 1.9%;
  z-index: 1;
}

.merge-logo--xj {
  right: 1.6%;
  bottom: 1.9%;
  z-index: 2;
  border-radius: 24%;
  overflow: hidden;
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.22),
    0 0 0 1px color-mix(in srgb, var(--fx-cyan) 26%, transparent);
}

/* 重叠区域的一层青色辉光：把两套品牌色“焊”在一起 */
.merge-glow {
  position: absolute;
  z-index: 3;
  left: 34%;
  top: 29%;
  width: 30%;
  height: 42%;
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    color-mix(in srgb, var(--fx-cyan) 50%, transparent),
    transparent
  );
  filter: blur(16px);
  mix-blend-mode: screen;
  pointer-events: none;
}

.merge-eq {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 7px;
  margin: 16px 0 0;
  color: var(--site-text-2);
  font-size: 13.5px;
  letter-spacing: -0.01em;
}

.merge-eq b {
  color: var(--site-text);
  font-weight: 600;
}

.merge-eq span {
  color: var(--site-subtle);
}

.merge-eq em {
  padding: 2px 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--fx-cyan) 14%, transparent);
  color: color-mix(in srgb, var(--fx-cyan) 78%, var(--site-text));
  font-style: normal;
  font-weight: 600;
}

/* HopeOS 标志的明暗两套线稿，按站点主题切换 */
.hope-mark--dark {
  display: none;
}

html[data-theme="dark"] .hope-mark--light {
  display: none;
}

html[data-theme="dark"] .hope-mark--dark {
  display: block;
}

/* 小尺寸的“重叠”图标，用在 why / map / HopeOS 页入口 */
.mini-merge {
  position: relative;
  display: inline-block;
  flex: none;
  width: 82px;
  height: 70px;
}

.mini-merge .mini-hope,
.mini-merge .mini-xj {
  position: absolute;
  width: 56px;
  height: 56px;
  border-radius: 14px;
}

.mini-merge .mini-hope {
  left: 0;
  top: 0;
  z-index: 1;
}

.mini-merge .mini-xj {
  right: 0;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.24);
}

.mini-merge--lg {
  width: 72px;
  height: 62px;
}

.mini-merge--lg .mini-hope,
.mini-merge--lg .mini-xj {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.hero-caption {
  margin: 14px 4px 0;
  color: var(--site-subtle);
  font-size: 11.5px;
  line-height: 1.7;
}

/* ---------------- 通用 section ---------------- */
.section {
  padding-top: 44px;
  padding-bottom: 44px;
  border-top: 1px solid var(--site-line-soft);
}

.section--last {
  padding-bottom: 96px;
}

.section-head {
  max-width: 720px;
  margin-bottom: 30px;
}

.kicker {
  margin: 0 0 10px;
  color: var(--site-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-head h2,
.next-card h2 {
  margin: 0;
  color: var(--site-text);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.22;
}

.section-lead {
  margin: 12px 0 0;
  color: var(--site-muted);
  font-size: 14.5px;
  line-height: 1.8;
}

/* ---------------- 为什么 ---------------- */
.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 18px;
}

.split-card {
  padding: 22px 24px;
  border: 1px solid var(--site-line);
  border-radius: 16px;
  background: var(--site-card-bg);
  box-shadow: var(--site-card-shadow, none);
}

.split-card--hope {
  border-top: 3px solid var(--site-accent);
}

.split-card--xj {
  border-top: 3px solid var(--fx-cyan);
}

.split-label {
  margin: 0 0 8px;
  color: var(--site-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
}

.split-card h3 {
  margin: 0 0 12px;
  color: var(--site-text);
  font-size: 18px;
  font-weight: 600;
}

.split-card ul {
  margin: 0;
  padding-left: 18px;
  color: var(--site-muted);
  font-size: 13.5px;
  line-height: 1.9;
}

.split-fuse {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 92px;
  color: var(--site-subtle);
  font-size: 11px;
  letter-spacing: 0.12em;
}

.table-card {
  margin-top: 22px;
  border: 1px solid var(--site-line);
  border-radius: 16px;
  background: var(--site-card-bg);
  overflow: hidden;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-card th,
.table-card td {
  padding: 12px 16px;
  text-align: left;
  vertical-align: top;
  line-height: 1.65;
  border-bottom: 1px solid var(--site-line-soft);
}

.table-card thead th {
  color: var(--site-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--site-tint-1);
}

.table-card tbody th {
  color: var(--site-text);
  font-weight: 600;
  white-space: nowrap;
}

.table-card tbody td {
  color: var(--site-text-2);
}

.table-card tbody td.muted {
  color: var(--site-subtle);
}

.table-card tbody tr:last-child th,
.table-card tbody tr:last-child td {
  border-bottom: 0;
}

/* ---------------- 融合图 ---------------- */
.map {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  padding: 26px;
  border: 1px solid var(--site-line);
  border-radius: 18px;
  background: var(--site-panel-bg);
  box-shadow: var(--site-panel-shadow);
}

.map-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.map-col--xj {
  border-left: 0;
}

.map-title {
  margin: 0 0 4px;
  color: var(--site-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.map-item {
  padding: 9px 13px;
  border: 1px solid var(--site-line);
  border-radius: 9px;
  background: var(--site-tint-1);
  color: var(--site-text-2);
  font-size: 12.5px;
}

.map-col--xj .map-item {
  border-color: color-mix(in srgb, var(--fx-cyan) 26%, var(--site-line));
}

.map-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 108px;
  color: var(--site-subtle);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-align: center;
}

.map-arrow .mini-merge {
  margin-bottom: 2px;
}

.map-result {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  margin-top: 16px;
  padding: 16px 20px;
  border: 1px solid color-mix(in srgb, var(--fx-cyan) 30%, var(--site-line));
  border-radius: 14px;
  background: color-mix(in srgb, var(--fx-cyan) 6%, var(--site-surface));
}

.map-result strong {
  color: var(--site-text);
  font-size: 15px;
  font-weight: 600;
}

.map-result span {
  color: var(--site-muted);
  font-size: 13px;
}

/* ---------------- 能力卡片 ---------------- */
.gain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
}

.gain-card {
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  border: 1px solid var(--site-line);
  border-radius: 14px;
  background: var(--site-card-bg);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.gain-card:hover {
  border-color: color-mix(in srgb, var(--fx-cyan) 34%, var(--site-line));
}

.gain-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.gain-tag {
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--fx-cyan) 12%, transparent);
  color: color-mix(in srgb, var(--fx-cyan) 80%, var(--site-text));
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}

.gain-area {
  color: var(--site-subtle);
  font-size: 10.5px;
}

.gain-card h3 {
  margin: 0 0 8px;
  color: var(--site-text);
  font-size: 15.5px;
  font-weight: 600;
}

.gain-card p {
  margin: 0;
  color: var(--site-muted);
  font-size: 12.5px;
  line-height: 1.75;
}

.gain-metric {
  margin-top: 12px !important;
  color: color-mix(in srgb, var(--fx-yellow) 70%, var(--site-text)) !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px !important;
  letter-spacing: 0.02em;
}

/* ---------------- 时间线 ---------------- */
.timeline {
  position: relative;
  margin: 0;
  padding: 0 0 0 22px;
  list-style: none;
  border-left: 1px solid var(--site-line);
}

.tl-item {
  position: relative;
  padding: 0 0 30px 22px;
}

.tl-item:last-child {
  padding-bottom: 0;
}

.tl-dot {
  position: absolute;
  left: -30px;
  top: 4px;
  width: 16px;
  height: 16px;
  border: 3px solid var(--site-bg);
  border-radius: 50%;
  background: var(--fx-cyan);
  box-shadow: 0 0 0 1px var(--site-line);
}

.tl-item--next .tl-dot {
  background: var(--site-bg);
  border-color: var(--fx-yellow);
  box-shadow: 0 0 0 1px var(--fx-yellow), 0 0 12px color-mix(in srgb, var(--fx-yellow) 50%, transparent);
}

.tl-body {
  padding: 18px 22px;
  border: 1px solid var(--site-line);
  border-radius: 14px;
  background: var(--site-card-bg);
}

.tl-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.tl-id {
  color: var(--site-text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.tl-date {
  color: var(--site-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
}

.tl-status {
  margin-left: auto;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 10px;
  letter-spacing: 0.06em;
}

.tl-status--done {
  background: var(--tag-success-bg);
  color: var(--tag-success-fg);
  border: 1px solid var(--tag-success-line);
}

.tl-status--next {
  background: var(--tag-warning-bg);
  color: var(--tag-warning-fg);
  border: 1px solid var(--tag-warning-line);
}

.tl-body h3 {
  margin: 0 0 8px;
  color: var(--site-text);
  font-size: 17px;
  font-weight: 600;
}

.tl-body p {
  margin: 0;
  color: var(--site-muted);
  font-size: 13px;
  line-height: 1.8;
}

.tl-log {
  margin: 12px 0 0;
  padding: 12px 14px;
  border: 1px solid var(--site-line-soft);
  border-radius: 10px;
  background: var(--site-surface-2);
  color: var(--site-text-2);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 11px;
  line-height: 1.75;
  overflow-x: auto;
  white-space: pre;
}

.tl-note {
  margin-top: 10px !important;
  color: var(--site-subtle) !important;
  font-size: 12px !important;
}

/* ---------------- 踩坑卡片 ---------------- */
.note-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.note-card {
  padding: 16px 18px;
  border: 1px solid var(--site-line);
  border-left: 3px solid var(--fx-yellow);
  border-radius: 12px;
  background: var(--site-card-bg);
}

.note-tag {
  display: inline-block;
  margin-bottom: 6px;
  color: var(--site-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
}

.note-card h3 {
  margin: 0 0 6px;
  color: var(--site-text);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.note-card p {
  margin: 0;
  color: var(--site-muted);
  font-size: 12.5px;
  line-height: 1.75;
}

/* ---------------- 截图 ---------------- */
.shot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 18px;
}

.shot-card {
  margin: 0;
  border: 1px solid var(--site-line);
  border-radius: 14px;
  background: var(--site-card-bg);
  overflow: hidden;
}

.shot-card img {
  display: block;
  width: 100%;
  height: auto;
  border-bottom: 1px solid var(--site-line-soft);
  background: #05070c;
}

.shot-card figcaption {
  padding: 14px 16px 16px;
  color: var(--site-muted);
  font-size: 12.5px;
  line-height: 1.75;
}

.shot-card figcaption strong {
  display: block;
  margin-bottom: 4px;
  color: var(--site-text);
  font-size: 13.5px;
  font-weight: 600;
}

/* ---------------- 许可证 ---------------- */
.license-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.license-card {
  padding: 20px;
  border: 1px solid var(--site-line);
  border-radius: 14px;
  background: var(--site-card-bg);
}

.license-card h3 {
  margin: 0 0 8px;
  color: var(--site-text);
  font-size: 15px;
  font-weight: 600;
}

.license-card p {
  margin: 0;
  color: var(--site-muted);
  font-size: 12.5px;
  line-height: 1.8;
}

.license-card code {
  padding: 1px 5px;
  border: 1px solid var(--site-line-soft);
  border-radius: 5px;
  background: var(--site-surface-2);
  color: var(--site-text-2);
  font-size: 11.5px;
}

.license-card a,
.license-card :deep(a) {
  color: var(--site-accent);
  text-decoration: none;
}

.source-links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 20px;
  font-size: 13px;
}

.source-links a {
  color: var(--site-accent);
  text-decoration: none;
}

.source-links a:hover {
  text-decoration: underline;
}

/* ---------------- 下一步 ---------------- */
.next-card {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) auto;
  align-items: center;
  gap: 28px;
  padding: 30px 32px;
  border: 1px solid color-mix(in srgb, var(--fx-cyan) 26%, var(--site-line));
  border-radius: 20px;
  background: var(--site-panel-bg);
  box-shadow: var(--site-panel-shadow);
}

.next-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ---------------- 响应式 ---------------- */
@media (max-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 36px;
    padding-top: 56px;
    padding-bottom: 48px;
  }

  .hero-art {
    order: -1;
  }

  .split {
    grid-template-columns: minmax(0, 1fr);
  }

  .split-fuse {
    flex-direction: row;
    justify-content: flex-start;
    min-width: 0;
    padding: 4px 0;
  }

  .map {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-arrow {
    flex-direction: row;
    justify-content: center;
  }

  .next-card {
    grid-template-columns: minmax(0, 1fr);
  }

  .next-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .wrap {
    padding-left: 20px;
    padding-right: 20px;
  }

  .table-card {
    overflow-x: auto;
  }

  .table-card table {
    min-width: 560px;
  }
}
</style>
