/**
 * 工作室项目一览（项目页与首页共用同一份数据，避免两处各写一遍）。
 * 状态标签的配色也在这里统一，保证两个页面表现一致。
 */
export interface Project {
  name: string;
  desc: string;
  /** 状态标签：开源 / 闭源 / 更新中 / 内部开发中 / 归档 */
  status: string[];
  link: string;
  /** true 表示站外链接（新窗口打开） */
  external: boolean;
}

export const projects: Project[] = [
  {
    name: "BusyMitten/HopeCraft",
    desc: "NT & BM 联合推出的 Minecraft 服务器插件，适用于 Bukkit 核心，实现了服务器菜单等一些功能。",
    status: ["开源", "归档"],
    link: "https://github.com/BusyMitten/HopeCraft",
    external: true,
  },
  {
    name: "WinUI 笔记",
    desc: "面向 WinUI 3 的学习笔记系列，持续迭代更新。",
    status: ["开源", "更新中"],
    link: "/posts/winui-notes",
    external: false,
  },
  {
    name: "HopeOS",
    desc: "一个从零编写的 UEFI 操作系统，用于学习操作系统运行原理。",
    status: ["闭源", "内部开发中"],
    link: "/hopeos",
    external: false,
  },
  {
    name: "RootMyS9280",
    desc: "三星 Galaxy S24 Ultra 免解锁 Root 工具：基于 CVE-2026-43499 的临时提权 + KernelSU 加载，不熔断 KNOX。",
    status: ["开源", "更新中"],
    link: "https://github.com/NanoTurtle1145/root-my-s9280",
    external: true,
  },
];

export const statusColor = (s: string): string =>
  ({
    更新中: "success",
    归档: "grey",
    开源: "info",
    闭源: "error",
    内部开发中: "warning",
  })[s] ?? "grey";
