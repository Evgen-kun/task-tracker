import { createStore } from "vuex";
import { AuthModule } from "./modules/AuthModule";
import { TaskModule } from "./modules/TaskModule";
import { TeamModule } from "./modules/TeamModule";
import { ProjectModule } from "./modules/ProjectModule";
import { UserModule } from "./modules/UserModule";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    authM: AuthModule,
    taskM: TaskModule,
    teamM: TeamModule,
    projectM: ProjectModule,
    userM: UserModule,
  },
});