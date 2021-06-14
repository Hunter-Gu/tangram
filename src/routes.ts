import { RouteRecordRaw } from "vue-router";
import Home from "./pages/home";
import Examples from "./pages/examples";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/examples",
    component: Examples,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];
