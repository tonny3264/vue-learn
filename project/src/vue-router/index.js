import link from "./components/link"
import view from "./components/view"
import History from "./history"

class VueRouter {
  constructor(options){
    this.pathList = options.routes || [];
    this.mode = options.mode || "hash";
    this.pathMap = this._createPathMode(this.pathList);
    this.history = new History();
    this._init();
  }

  _createPathMode(pathList){
    const pathMap = {}
    for (const path of pathList) {
      pathMap[path.path] = path.component;
    }
    return pathMap;
  }

  _setPath(){
    if(this.mode == "hash"){
      this.history.current.path = location.hash.slice(1);
    }else{
      this.history.current.path = location.pathname;
    }
  }

  _init(){
    // dom渲染完毕
    document.addEventListener("DOMContentLoaded", () => {
      this._setPath();
    });
    if(this.mode == "hash"){
      window.addEventListener("hashchange", () => {
        this._setPath();
      })
    }else{
      window.addEventListener("popstate", () => {
        this._setPath();
      })
    }
  }

  static install(Vue){
    Vue.mixin({
      beforeCreate () {
        if(this.$options.router){
          // 利用Vue工具绑定计算属性_route, 是的更改current.path之后重新渲染router-view组件
          Vue.util.defineReactive(this, "_route", this.$options.router.history.current);
        }
      }
    })

    Object.defineProperty(Vue.prototype, "$router", {
      get(){
        return this.$root.$options.router;
      }
    });
    Object.defineProperty(Vue.prototype, "$route", {
      get () {
        return this.$root._route;
      }
    });

    Vue.component("router-link", link);
    Vue.component("router-view", view);
  }
}

export default VueRouter;