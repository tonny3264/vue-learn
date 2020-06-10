export default function(Vue){
  Object.defineProperty(Vue.prototype, "$store", {
    get(){
      return this.$root.$options.store
    }
  })
}