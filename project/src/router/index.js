import Router from "vue-router"

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    component: () => import("../components/Home"),
  },
  {
    path: "/about",
    component: () => import("../components/About"),
    meta: {
      loginRequired: true
    }
  },
  {
    path: "/more",
    component: () => import("../components/More"),
    meta: {
      exitRequired: true
    }
  },
  {
    path: "/login/:prev",
    name: "login",
    props: true,
    component: () => import("../components/Login")
  }
];

const router = new Router({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  const loginRequired = to.matched.some(item => item.meta.loginRequired);
  if(loginRequired){
    if(!document.cookie.includes("login=true")){
      return next({name: "login", params: {prev: to.path}});
    }
  }
  const exitRequired = from.matched.some(item => item.meta.exitRequired);
  if(exitRequired){
    const res = window.confirm("需要离开吗?");
    if(!res){
      return next(false);
    }
  }
  next();
})

export default router;