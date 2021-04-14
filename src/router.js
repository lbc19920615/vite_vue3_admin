import { createWebHistory, createRouter } from "vue-router";

import Layout from './views/layout/Layout.vue'

export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    hidden: false,
    children: [
      {
        path: "dashboard",
        name: "Home",
        meta: {
          title: 'dashboard'
        },
        component: () => import('@/views/home/index.vue'),
      },
    ]
  },
  {
    path: "/about",
    name: "About",
    hidden: false,
    meta: {
      title: 'About'
    },
    component: () => import('@/views/about/index.vue'),
  },
];

export const asyncRouterMap = []


const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap,
});

export default router;
