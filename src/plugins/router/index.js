import { createRouter, createWebHistory } from "vue-router";
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
    component: () => import("@/views/HomeView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/inbox",
    name: "inbox",
    component: () => import("@/views/InboxView.vue"),
    beforeEnter: authGuard,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
    beforeEnter: managerAuthGuard,
  },
  {
    path: "/teams",
    name: "teams",
    beforeEnter: managerAuthGuard,
    children: [
      { 
        path: '', 
        component: () => import("@/views/TeamsView.vue"), 
        beforeEnter: managerAuthGuard,
      },
      {
        path: ":id",
        name: "dashboard",
        component: () => import("@/views/DashboardView.vue"),
        beforeEnter: managerAuthGuard,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
