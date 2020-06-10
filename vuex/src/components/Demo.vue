<template>
  <div class="demo">
    <button @click="add">Add</button>
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
      this.$store.state.count++;
    }
  }
}
</script>

<style scoped>
  button {
    display: block;
    width: 100px;
    height: 30px;
    margin: 0 auto;
  }
  span {
    display: block;
    font-size: 20px;
    padding: 20px 0;
  }
</style>