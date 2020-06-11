<template>
  <div class="demo">
    <button @click="add">Add</button>
    <button @click="sub">Sub</button>
    <span>
      hello
      {{ $store.state.count }}
      {{ $store.getters.double }}
      {{ $store.getters["person/personTrible"] }}
    </span>
  </div>
</template>

<script>
export default {
  mounted(){
    console.log(this.$store);
  },
  methods: {
    add(){
      this.$store.dispatch("person/subAction").then(() => {
        console.log("ojbk");
      });
    },
    sub(){
      this.$store.commit("sub");
      this.$store.commit("person/sub");
    }
  }
}
</script>

<style scoped>
  button {
    display: block;
    width: 100px;
    height: 30px;
    margin: 5px auto;
  }
  span {
    display: block;
    font-size: 20px;
    padding: 20px 0;
  }
</style>