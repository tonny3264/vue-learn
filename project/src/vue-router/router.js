import Router from "./index"

const routes = [
  {
    path: "/home",
    component: () => import("../components/Home"),
  },
  {
    path: "/about",
    component: () => import("../components/About"),
  },
  {
    path: "/more",
    component: () => import("../components/More"),
  }
];

const router = new Router({
  routes,
  mode: "history"
});

export default router;