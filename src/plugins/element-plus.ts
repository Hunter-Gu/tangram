import { Component } from "../core/parser/src/types/schema";
import { App } from "@vue/runtime-core";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";

export default {
  install(app: App) {
    app.use(ElementPlus);
  },
};
