import { createWebHistory, createRouter } from "vue-router";

import Layout from './views/layout/Layout.vue'

export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    hidden: false,
    meta: {
      title: 'views',
      icon: 'shangdian'
    },
    children: [
      {
        path: "dashboard",
        name: "Home",
        meta: {
          title: 'dashboard',
          // icon: 'shangdian'
        },
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: "about",
        name: "About",

        meta: {
          title: 'About',
          // icon: 'shangdian'
        },
        component: () => import('@/views/about/index.vue'),
      },
      {
        path: "form",
        name: "Form",

        meta: {
          title: 'Form',
          // icon: 'shangdian'
        },
        component: () => import('@/views/home/search.vue'),
      },
    ]
  },
];

export const asyncRouterMap = []


const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap,
});

export default router;
