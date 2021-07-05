import { RouteRecordRaw, RouterView } from "vue-router";
import { homeRoutes } from "./pages/home/home.route";
import { editorRoutes } from "./pages/editor/editor.route";
import { examplesRoutes } from "./pages/examples/examples.route";

export const routes = [
  {
    path: "/",
    children: homeRoutes,
  },
  {
    path: "/examples",
    children: examplesRoutes,
  },
  {
    path: "/editor",
    children: editorRoutes,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
].map((route) => ({
  ...route,
  component: route.children?.length ? RouterView : null,
})) as RouteRecordRaw[];
