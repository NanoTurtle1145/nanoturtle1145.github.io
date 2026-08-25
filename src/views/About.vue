<script setup lang="ts">
import { useHead } from "@vueuse/head";

useHead({
  title: "关于我们 | 希望工作室",
  meta: [
    {
      name: "description",
      content: "希望工作室（Hope Studio）介绍：一个由学生组成的技术兴趣团队。",
    },
  ],
});

const timeline = [
  { date: "2019", text: "希望工作室于杭州市滨文小学（2018 级 5 班）诞生，最初只是一群小学生无聊时组建的团体。" },
  { date: "2022-09-08", text: "工作室正式成立。" },
  { date: "2023-12-15", text: "HPSS（后更名 HopeCraft）Minecraft 服务器首次开启测试。" },
  { date: "2025-07-27", text: "HPSS 更名为 HopeCraft（改名異變）。" },
  { date: "2025-08-24", text: "hopestudio.top 初次运行。" },
  { date: "2025-11-23", text: "因数据库损坏，站点重置重建。" },
  { date: "2026-08-20", text: "阿里云服务器任期届满，原站 hopestudio.top 关闭；站点归档为静态并迁移至 GitHub Pages。" },
];
</script>

<template>
  <v-container class="py-12 px-4" style="max-width: 896px">
    <div class="mb-8">
      <div class="md3e-eyebrow mb-1">关于我们 · About</div>
      <div class="md3e-display-sm text-h3 text-on-surface">关于我们</div>
    </div>

    <v-card elevation="0" class="mb-8">
      <v-card-text class="pa-6 pa-sm-10">
        <div class="text-h5 font-weight-bold text-on-surface mb-2">
          Where there is a hope, there is a way.
        </div>
        <div class="text-subtitle-1 text-on-surface mb-6">有希望者，事竟成。</div>
        <div class="text-body-1 text-medium-emphasis" style="line-height: 2">
          <p class="mb-4">
            希望工作室，成立于 2019 年的杭州市滨文小学，即 2018 级 5 班。正式成立时间为 2022 年 9 月 8
            日。是一群小学生在无聊时组建的一个团体。
          </p>
          <p class="mb-4">
            本站初次运行于 2025 年 8 月 24 日。由于一些因素（数据库不知何时坏了）与同年 11 月 23
            日重置。感谢阿里云，为我们提供了一套比较廉价的云服务器用于托管我们的网站。
          </p>
          <p class="mb-4">目前活跃人数约 5 人。</p>
          <p class="mb-4">
            旧版官网（hopestudio.top）已归档为静态站点，
            <RouterLink to="/archive" class="text-primary text-decoration-none">点此访问归档官网</RouterLink>
            ，保留了原有的 Argon 主题外观。
          </p>
          <v-img
            class="rounded-xl mt-6"
            src="/media/hope-group.jpg"
            alt="希望工作室成员合照"
            max-height="480"
            cover
          />
        </div>

        <v-divider class="my-6" />

        <div class="text-h6 font-weight-semibold text-on-surface mb-3">我们的图标</div>
        <div class="text-body-1 text-medium-emphasis" style="line-height: 2">
          「希望工作室」取前两个字拼音的首字母
          <span class="text-primary font-mono">X</span> 与
          <span class="text-primary font-mono">W</span>，又取第一个字拼音的第二个字母
          <span class="text-primary font-mono">i</span>。仔细观察，图标上的「星星」与「太阳」（小点）就是 X 和 i
          的合体，那个有角的「月亮」就是 W。真佩服当年的奇思妙想。
        </div>

        <v-divider class="my-6" />

        <div class="text-h6 font-weight-semibold text-on-surface mb-3">我们都做些什么</div>
        <div class="text-body-1 text-medium-emphasis" style="line-height: 2">
          最初我们以著书为主，后来转型科技为主。在我们成立的几年后，同班的类似组织陆续出现，但最终我们至今仍然在正常运行。现在主要以科技为主，就是没事写点代码的那种。
        </div>
      </v-card-text>
    </v-card>

    <div class="md3e-display-sm text-h5 text-on-surface mb-4">成长历史</div>
    <v-card elevation="0" class="mb-10">
      <v-card-text class="pa-6 pa-sm-10 text-body-1 text-medium-emphasis" style="line-height: 2">
        <p class="mb-4">
          <span class="text-primary font-mono">2019</span>
          ：因小学低年级空闲时间充裕，NT 与 BS 在课余时间进行绘画等活动，这是希望工作室最早的运作形式。不久后，NT 与 BS
          提议创建团队，希望工作室雏形诞生。
        </p>
        <p class="mb-4"><span class="text-primary font-mono">2020~2021</span>：资料不可考，无内容。</p>
        <p class="mb-4">
          <span class="text-primary font-mono">2022</span>
          ：因工作室表现突出，出现大量模仿团队，严重打击有生力量并压缩进步空间。为缓解困境，BS 于 2022 年 6 月 27
          日决定开启「潜运行」。同年 9 月 8 日，希望工作室重新开始正常运行，NT 发布新 Logo 并沿用至今。
        </p>
        <p class="mb-4"><span class="text-primary font-mono">2023~2024</span>：工作室虽正常运行，但因学业压力无突出表现。</p>
        <p class="mb-4">
          <span class="text-primary font-mono">2024-09</span>
          ：小学毕业后许多成员离开，因 NT 与 BS 仍就读同一初中，工作室得以存续。
        </p>
        <p class="mb-4"><span class="text-primary font-mono">2025</span>：NT 购置阿里云服务器用于官网。</p>
        <p class="pt-4 border-top">
          目前的领导者为 <span class="text-on-surface">NanoTurtle</span>、<span class="text-on-surface">BusySheng</span>。他们是从
          2019 年就开始效力于希望工作室的成员（即创始人）。
        </p>
      </v-card-text>
    </v-card>

    <div class="md3e-display-sm text-h5 text-on-surface mb-4">大事记</div>
    <div class="d-flex flex-column ga-3">
      <v-card
        v-for="item in timeline"
        :key="item.date"
        elevation="0"
        class="pa-3"
      >
        <v-card-text class="d-flex flex-column flex-sm-row align-sm-baseline ga-2 ga-sm-4">
          <time class="text-primary font-mono text-no-wrap">{{ item.date }}</time>
          <span class="text-body-1 text-medium-emphasis">{{ item.text }}</span>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>


