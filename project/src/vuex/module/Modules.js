import Module from "./Module"

export default class Modules {
  constructor(option){
    this.root = this.register(option);
  }

  register(option){
    const module = new Module(option);
    if(option.modules){
      for (const key in option.modules) {
        if (option.modules.hasOwnProperty(key)) {
          const child = option.modules[key];
          module._children[key] = this.register(child);
        }
      }
    }
    return module;
  }
}