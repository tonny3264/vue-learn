import Vue from "vue";
import { forEachVal } from "../util";

export default class Store {
  constructor(options) {
    this.strict = options.strict || false;
    this.commiting = false;
    this._options = options;
    this._vm = this._initVm(options, this);
    this._mutations = this._registerMutations(options);
    console.log(this._vm);
  }

  get state() {
    return this._vm.state;
  }

  commit(type, payload){
    let arg = {}
    if(Object.prototype.toString.call(type).includes("Object]")){
      arg = type;
    }else if(typeof type == "string"){
      arg.type = type;
      arg.payload = payload;
    }
    const fns = this._mutations[arg.type];
    const state = this._getStateByNamespace(arg.type.split("/"), this);
    const tempCommmit = this.commiting;
    this.commiting = true;
    fns.forEach(fn => {
      fn(state);
    });
    this.commiting = tempCommmit;
  }

  _initVm(options, self) {
    const vm = new Vue({
      data: {
        state: self._registerState.call(self, options),
      },
      computed: self._registerGetters.call(self, options),
    });
    self._strictWatch(vm, self);
    return vm;
  }

  _strictWatch(vm, store){
    vm.$watch(function(){
      return this.state
    }, () => {
      // console.log("xxx", !store.commiting, store)
      if(!store.commiting && store.strict){
        throw new Error("只能通过commit更改vuex状态");
      }
    },{
      deep: true,
      sync: true // 同步监听,只要更改就侦听
    });
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

  _registerMutations(module, pathList = [], result = {}){
    const { mutations, modules } = module;
    if(mutations){
      forEachVal(mutations, (key, value) => {
        let tempKey = pathList.concat(key).join("/");
        if(!result[tempKey]){
          result[tempKey] = [];
        }
        result[tempKey].push(value);
      })
    }
    if(modules){
      forEachVal(modules, (key, value) => {
        let tempPaths = [...pathList];
        if(value.namespaced){
          tempPaths.push(key);
        }
        this._registerMutations(value, tempPaths, result);
      })
    }
    return result;
  }

  /**
   * @description 统一注册函数(用于将配置项拍平)
   * @param {Object} module vuex配置的一个模块
   * @param {Function} pushHandler 插入到结果中的回调函数
   * @param {Array} pathList 命名空间数组
   * @param {Object} result 最终结果
   */
  _register(module, pushHandler, pathList=[], result={}){
    const { mutations, modules } = module;
    if(mutations){
      forEachVal(mutations, (key, value) => {
        let tempKey = pathList.concat(key).join("/");
        pushHandler && pushHandler.call(this, result, key, value, tempKey, pathList);
      });
    }
    if(modules){
      forEachVal(modules, (key, value) => {
        let tempPaths = [...pathList];
        if(value.namespaced){
          tempPaths.push(key);
        }
        this._register(value, pushHandler, tempPaths, result);
      })
    }
    return result;
  }

  // 设置computed
  _setComputed(computed, pathList, key, value) {
    let tempPaths = pathList.concat(key);
    let tempKey = tempPaths.join("/");
    computed[tempKey] = () => {
      const args = value.apply(this, this._delayArgs(tempPaths));
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
