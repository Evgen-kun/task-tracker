import { createStore } from "vuex";
import { AuthModule } from "./modules/AuthModule";
import { TaskModule } from "./modules/TaskModule";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    authM: AuthModule,
    taskM: TaskModule,
  },
});