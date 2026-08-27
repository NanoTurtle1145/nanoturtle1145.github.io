import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import routes from "./router";
import vuetify from "./vuetify";
import "./styles/main.sass";
import "./style.css";

export const createApp = ViteSSG(App, { routes }, (ctx) => {
  ctx.app.use(vuetify);

  ctx.router.beforeEach((to, _from, next) => {
    const { title, description } = to.meta;
    const defaultTitle = "希望工作室 | Hope Studio";
    const defaultDescription = "希望工作室官方网站";
    if (typeof window !== "undefined") {
      document.title = typeof title === "string" ? title : defaultTitle;

      const descriptionElement = document.querySelector(
        'head meta[name="description"]'
      );

      descriptionElement?.setAttribute(
        "content",
        typeof description === "string" ? description : defaultDescription
      );
    }
    next();
  });
});
