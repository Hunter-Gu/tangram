import { App } from "@vue/runtime-core";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

let components: unknown;

export default {
  install(app: App) {
    app.use(ElementPlus);

    components = app._context.components;
  },
};

export function getAllElementPlusComponents() {
  return components;
}
