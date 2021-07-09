import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import "normalize.css";
import App from "./App.vue";
import { routes } from "./routes";
import install from "./plugins";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);

install(app);

app.use(router).mount("#app");
