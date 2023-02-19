import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../../views/HomeView.vue";
import LoginView from "../../views/LoginView.vue";


const authGuard = function(to, from, next) {
  if (!localStorage.hasOwnProperty('token')) next({ name: 'login' });
  else next();
}

const managerAuthGuard = function(to, from, next) {
  const roles = JSON.parse(localStorage.getItem('userRoles'));
  if (!localStorage.hasOwnProperty('token')) next({ name: 'login' });
  else if (!roles.includes('manager') && (!roles.includes('administrator'))) next({ name: 'home' });
  else next();
}

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: authGuard,
  },
  {
    path: "/login",
    name: "login",
    //component: () => import("../../views/LoginView.vue"),
    component: LoginView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../../views/AboutView.vue"),
    beforeEnter: managerAuthGuard,
  },
  {
    path: "/teams",
    name: "teams",
    component: () => import("../../views/TeamsView.vue"),
    beforeEnter: managerAuthGuard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
