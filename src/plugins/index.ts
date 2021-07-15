import { App } from "@vue/runtime-core";
import ElementPlus from "./element-plus";
import { router } from "./routes";

export default function install(app: App) {
  app.use(router).use(ElementPlus);
}
