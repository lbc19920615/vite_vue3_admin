import { createWebHistory, createRouter } from "vue-router";

import Layout from './views/layout/Layout.vue'
import {loadPage} from "@/remote";

export const constantRouterMap = [
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '',
    name: 'main',
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
      {
        path: "demo",
        name: "Demo",

        meta: {
          title: 'Demo',
          // icon: 'shangdian'
        },
        component: () => import('@/views/home/demo.vue'),
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true }
  }
];

export const asyncRouterMap = [
  {
    parent: 'main',
    path: "show",
    name: "Show",

    meta: {
      title: 'Show',
      // icon: 'shangdian'
    },
    // component: () => import('@/views/about/show.vue'),
    component: () => loadPage('show')
  }
]


/**
 * @type {Router}
 */
const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap,
});

export function addRoute(args) {
  // console.log(args)
  router.addRoute(args.parent, args)
}

let metaCache = new Map()
router.beforeEach(async (to, from, next) => {
  // ...
  // 返回 false 以取消导航


  if (!to.meta) {
    to.meta = {}
  }

  if (!metaCache.has(to.name)) {
    to.meta.pageServiceName = `Page${to.name}Service`
    global.createServiceCom({
      def: {},
      args: {}
    },  to.meta.pageServiceName)
    metaCache.set(to.name, to)
  } else {
    to.meta = Object.assign({}, to.meta, metaCache.get(to.name).meta)
  }

  // console.log(to.name, to.meta)

  next()
})

export default router;
