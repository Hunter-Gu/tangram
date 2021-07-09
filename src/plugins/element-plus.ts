import { App } from "@vue/runtime-core";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

export function installElementPlus(app: App) {
  app.use(ElementPlus);
}
