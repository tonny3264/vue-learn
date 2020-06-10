<template>
  <div>
    <button @click="add">Add</button><br/>
    <span>
      {{ $store.state.count }}
      - {{ $store.state.student.count }}
      <!-- -{{ $store.getters.personDouble }} -->
      -{{ $store.getters["student/studentDouble"] }}
    </span>
  </div>
</template>

<script>
export default {
  methods: {
    add(){
      this.$store.state.count++;
      this.$store.state.student.count++;
    }
  },
  computed: {
    test(){
      return 19;
    }
  },
  mounted(){
    // console.log(this.$options)
  }
}
</script>