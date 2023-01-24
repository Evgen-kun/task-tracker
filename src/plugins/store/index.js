import { createStore } from "vuex";
import { AuthModule } from "./modules/AuthModule";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    authM: AuthModule,
  },
});