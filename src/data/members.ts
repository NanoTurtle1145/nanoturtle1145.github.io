/**
 * 工作室成员（成员页与首页共用，避免两处各写一遍）。
 * 头像留空时由页面显示首字母占位。
 */
export interface Member {
  name: string;
  role: string;
  desc: string;
  avatar?: string;
}

export const admins: Member[] = [
  {
    avatar: "/member/nt.png",
    name: "@NanoTurtle",
    role: "管理员 · 创始人",
    desc: "希望工作室创始人之一，元老级人物。是一位十分开朗的人，没了。个人博客 blog.nanoturtle.cn；近期沉迷 S24 Ultra 免解锁 root（开源项目 RootMyS9280）与 HopeOS。",
  },
  {
    avatar: "/member/bs.png",
    name: "@BusyMitten / BusySheng",
    role: "管理员 · 创始人",
    desc: "希望工作室创始人之一，依旧元老级人物。他实力超群，超群，超群。",
  },
];

export const members: Member[] = [
  { name: "YP", role: "成员", desc: "" },
  { name: "TP", role: "成员", desc: "" },
];
