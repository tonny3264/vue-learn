import install from "./install"
import Vue from "vue"
import Modules from "./module/Modules"
import { forEachValue } from "./util.js"

class Store {
  constructor(options){
    let that = this;
    this.getters = {}
    this._vm = new Vue({
      data: {
        state: that.registerState.call(that, options)
      },
      computed: that.getterRegister.call(that, options)
    });
    console.log(this._vm);
    // 有啥用
    this._modules = new Modules(options);
  }

  get state(){
    return this._vm.state;
  }

  registerState(module){
    const state = {
      ...module.state
    }
    if(module.modules){
      forEachValue(module.modules, (key, value) => {
        state[key] = this.registerState(value);
      });
    }
    return state;
  }

  /* getters注册 */
  getterRegister(module, pathList = [], computed = {}){
    let that = this;
    forEachValue(module.getters, (key, value) => {
      let tempPathList = pathList.concat(key);
      let tempKey = tempPathList.join("/");
      // 绑定this.getters和vm的计算属性, 使组件可以直接访问$store.getters..
      Object.defineProperty(this.getters, tempKey, {
        get: () => that._vm[tempKey] // 直接访问vm的属性
      }); 
      let args = this._getArguments(tempPathList, this);
      // 设置computed逻辑
      computed[tempPathList.join("/")] = () => {
        return value.call(this, args.state, args.getters, args.rootState, args.rootGetters);
      }
    });
    if(module.modules){
      forEachValue(module.modules, (key, value) => {
        // 临时的path,用来记录是否含有命名空间
        let tempPath = [...pathList];
        if(value.namespaced){
          tempPath.push(key);
        }
        this.getterRegister(value, tempPath, computed);
      });
    }
    return computed;
  }

  /* 获得state */
  _getState(pathList, state){
    pathList.slice(0, -1).forEach(path => {
      state = state[path];
    });
    return state;
  }

  // 延时获得当前的getter属性
  _getGetters(pathList, store){
    let getters = store._vm.$options.computed
    const gs = {}
    // 判断作用域是否相等
    forEachValue(getters, (key, value) => {
      let keys = key.split("/");
      // 判断是否同一个命名空间下
      if(pathList.slice(0, -1).join("/") == keys.slice(0, -1).join("/")){
        // 延时设置
        Object.defineProperty(gs, keys[keys.length - 1], {
          get: () => store._vm[key]
        })
      }
    })
    return gs;
  }

  /* 获得参数 */
  _getArguments(pathList, store){
    let obj = {}
    Object.defineProperties(obj, {
      state: {
        get: () => store._getState(pathList, store.state)
      },
      getters: {
        get: () => store._getGetters(pathList, store)
      },
      rootState: {
        get: () => store.state
      },
      rootGetters: {
        get: () => store.getters
      }
    });
    return obj;
  }
}

export default {
  install,
  Store
}