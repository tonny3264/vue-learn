export default function install(Vue){
  Vue.mixin({
    beforeCreate(){
      if(this.$options.store){
        this.$store = this.$options.store;
      }else{
        if(this.$parent){
          this.$store = this.$parent.$store;
        }
      }
    }
  })
}