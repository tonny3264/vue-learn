import Vue from "vue";
import { forEachVal } from "../util";

export default class Store {
  constructor(options) {
    this._options = options;
    this._vm = this._initVm(options, this);
    console.log(this._vm);
  }

  get state() {
    return this._vm.state;
  }

  _initVm(options, self) {
    const vm = new Vue({
      data: {
        state: self._registerState.call(self, options),
      },
      computed: self._registerGetters.call(self, options),
    });
    return vm;
  }

  _registerState(module) {
    const state = { ...module.state };
    const modules = module.modules;
    if (modules) {
      forEachVal(modules, (key, val) => {
        state[key] = this._registerState(val);
      });
    }
    return state;
  }

  _registerGetters(module, pathList = [], computed = {}) {
    const { getters, modules } = module;
    if (getters) {
      forEachVal(getters, (key, value) => {
        // 设置computed
        this._setComputed(computed, pathList, key, value);
        // 设置store的getters实际取值
        this._setGetterValue(pathList.concat(key).join("/"));
      });
    }
    if(modules){
      forEachVal(modules, (key, value) => {
        const tempPaths = [...pathList];
        if(value.namespaced){
          tempPaths.push(key);
        }
        this._registerGetters(value, tempPaths, computed);
      });
    }
    return computed;
  }

  // 设置computed
  _setComputed(computed, pathList, key, value) {
    let tempPaths = pathList.concat(key);
    let tempKey = tempPaths.join("/");
    computed[tempKey] = () => {
      const args = value.apply(this, this._delayArgs(tempPaths));
      console.log(args);
      return args
    }
  }

  // 设置get值
  _setGetterValue(key){
    if(!this.getters){
      this.getters = {}
    }
    Object.defineProperty(this.getters, key, {
      get: () => this._vm[key],
      enumerable: true
    })
  }

  // 根据命名空间获取state
  _getStateByNamespace(pathList, store){
    let state = store.state;
    pathList.slice(0, -1).forEach(path => {
      state = state[path];
    })
    return state;
  }

  _getGettersByNamespace(pathList, store){
    let getters = {};
    const { _vm: vm } = store;
    forEachVal(vm.$options.computed, (key, value) => {
      let keyList = key.split("/");
      if(pathList.slice(0, -1).join("/") ==  keyList.slice(0, -1).join("/")){
        Object.defineProperty(getters, keyList[keyList.length - 1], {
          get: () => vm[key]
        })
      }
    }) 
    return getters;
  }

  //设置延时参数
  _delayArgs(pathList){
    const args = {}
    const self = this;
    // console.log(self);
    Object.defineProperties(args, {
      "0": {
        get: () => self._getStateByNamespace(pathList, self)
      },
      "1": {
        get: () => self._getGettersByNamespace(pathList, self)
      },
      "2": {
        get: () => self.state
      },
      "3": {
        get: () => self.getters
      }
    })
    args.length = 4;
    return args;
  }
}
