import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    double(state, getters, rootState, rootGetters){
      console.log(getters, rootState, rootGetters);
      return state.count * 2;
    }
  },
  modules: {
    student: {
      namespaced: true,
      state: { count: 2 },
      getters: {
        studentDouble(state, getters, rootState, rootGetters){
        console.log(state, getters, rootState, rootGetters);
          return state.count * 2;
        }
      }
    },
    person: {
      state: { count: 2 },
      getters: {
        personDouble(state, getters, rootState, rootGetters){
          console.log(getters, rootState, rootGetters);
          return state.count * 2;
        }
      }
    }
  }
})
