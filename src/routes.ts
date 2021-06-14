import { RouteRecordRaw } from "vue-router";
import Home from "./pages/home";
import Examples from "./pages/examples";
import Editor from "./pages/editor";

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
    path: "/editor",
    component: Editor,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];
