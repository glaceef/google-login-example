import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import HomePage from '@/pages/HomePage.vue';

export const ROUTER_NAME = {
  HomePage: 'home',

};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: ROUTER_NAME.HomePage,
  },
  {
    path: `/${ROUTER_NAME.HomePage}`,
    name: ROUTER_NAME.HomePage,
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
