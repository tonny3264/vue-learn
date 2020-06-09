<template>
  <div class="index">
    <nav>
      <router-link tag="div" to="/home">首页</router-link>
      <router-link tag="div" to="/about">关于</router-link>
      <router-link tag="div" to="/more">更多</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted(){
    // console.log("$router: ", this.$router);
    // console.log("$route: ", this.$route);
  }
}
</script>

<style scoped>
  nav {
    display: flex;
    padding: 0 20px;
    color: white;
    background: #1abc9c;
    height: 40px;
  }

  nav > * {
    text-decoration: none;
    padding: 0 10px;
    color: white;
    line-height: 40px;
  }

  nav > *:hover{
    background-color: #16a085;
  }
</style>