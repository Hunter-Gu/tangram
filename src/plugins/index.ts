import { App } from "@vue/runtime-core";
import ElementPlus from "./element-plus";
import { router } from "./routes";
import { store } from "./store";

export default function install(app: App) {
  app.use(store).use(ElementPlus).use(router);
}
