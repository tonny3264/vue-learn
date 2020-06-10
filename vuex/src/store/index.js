import Vue from "vue"
import Vuex from "../vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1
  },
  getters: {
    double(state, getters, rootState, rootGetts){
      return state.count * 2
    }
  },
  modules: {
    student: {
      state: {
        countstu: 2
      },
      getters: {
        doubleStudent(state){
          return state.countstu * 2;
        }
      },
      modules: {
        grand: {
          state: {
            name: "tonny"
          }
        }
      }
    },
    person: {
      namespaced: true,
      state: {
        count: 3
      },
      getters: {
        personDouble(state){
          return state.count * 2;
        },
        personTrible(state, getters, rootState, rootGetts){
          console.log(state, getters, rootState, rootGetts)
          return state.count * 100;
        }
      }
    }
  }
});