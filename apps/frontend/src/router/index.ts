import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';
import LoginCallbackPage from '@/pages/LoginCallbackPage.vue';
import LoginCompletePage from '@/pages/LoginCompletePage.vue';

export const ROUTER_NAME = {
  Home: 'home',
  LoginCallback: 'callback',
  LoginComplete: 'complete',
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTER_NAME.Home,
    component: HomePage,
  },
  {
    path: '/login/callback',
    name: ROUTER_NAME.LoginCallback,
    component: LoginCallbackPage,
  },
  {
    path: '/login/complete',
    name: ROUTER_NAME.LoginComplete,
    component: LoginCompletePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
