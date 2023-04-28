import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../../views/LoginView.vue";


const authGuard = function(to, from, next) {
  if (!Object.prototype.hasOwnProperty.call(localStorage, 'token')) next({ name: 'login' });
  else next();
}

const managerAuthGuard = function(to, from, next) {
  const roles = JSON.parse(localStorage.getItem('user')).roles;
  if (!Object.prototype.hasOwnProperty.call(localStorage, 'token')) next({ name: 'login' });
  else if (!roles.includes('manager') && (!roles.includes('administrator'))) next({ name: 'home' });
  else next();
}

const adminAuthGuard = function(to, from, next) {
  const roles = JSON.parse(localStorage.getItem('user')).roles;
  if (!Object.prototype.hasOwnProperty.call(localStorage, 'token')) next({ name: 'login' });
  else if (!roles.includes('administrator')) next({ name: 'home' });
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
    beforeEnter: authGuard,
  },
  {
    path: "/teams",
    name: "teams",
    // beforeEnter: managerAuthGuard,
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        component: () => import("@/views/TeamsView.vue"),
      },
      {
        path: ":teamID",
        name: "team",
        // beforeEnter: managerAuthGuard,
        beforeEnter: authGuard,
        children: [
          {
            path: 'projects',
            children: [
              {
                path: '',
                name: 'projects',
                component: () => import("@/views/ProjectsView.vue"),
                // beforeEnter: managerAuthGuard,
                beforeEnter: authGuard,
              },
              {
                path: ":projectID",
                name: "dashboard",
                component: () => import("@/views/DashboardView.vue"),
                // beforeEnter: managerAuthGuard,
                beforeEnter: authGuard,
              }
            ]
          },
          
        ]
      }
      
    ]
  },
  {
    
  },
  {
    path: "/panel",
    name: "panel",
    component: () => import("@/views/PanelView.vue"),
    beforeEnter: adminAuthGuard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
