import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import { routes } from "./routes";
import vuetify from "./plugins/vuetify";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);

app.use(vuetify).use(router).mount("#app");
