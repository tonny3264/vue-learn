<template>
  <div class="login">
    <button @click="onLogin">{{ loginStr }}</button>
  </div>
</template>

<script>
import Cookie from "../utils/cookie.js"

export default {
  props: {
    prev: {
      type: [String, Number],
      default: -1
    }
  },
  data(){
    return {
      isLogin: false,
    }
  },
  computed: {
    loginStr () {
      if(this.isLogin) return "取消登录";
      else return "登录"
    }
  },
  methods: {
    onLogin () {
      if(this.isLogin){
        Cookie.deleteCookie("login");
      }else{
        Cookie.setCookie("login", true);
        if(typeof this.prev == "number"){
          this.$router.go(this.prev);
        }else{
          this.$router.replace(this.prev);
        }
      }
      this.isLogin = !this.isLogin;
    }
  }
}
</script>