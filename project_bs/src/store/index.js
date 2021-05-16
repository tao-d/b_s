import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user:{},
    examManager:{
      row:{}
    },
  },
  mutations: {
    setUser(state,payload){
      state.user = payload
    },
    getUser(state){
      return state.user
    },
    setExamManager(state,payload){
      state.examManager.row = payload
    }
  },
  actions: {},
  modules: {},
});
