import { App } from "@vue/runtime-core";
import { installElementPlus } from "./element-plus";

export default function install(app: App) {
  installElementPlus(app);
}
