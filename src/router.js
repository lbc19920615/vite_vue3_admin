import { createWebHistory, createRouter, createRouterMatcher } from "vue-router";


import Layout from './views/layout/Layout.vue'
import {loadPage} from "@/remote";
import store from "@/store";
import {VARS_PAGE_MODEL_NAME} from "@/vars";

export const constantRouterMap = [
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: "/about-no",
    name: "AboutNo",

    meta: {
      title: 'AboutNo',
      // icon: 'shangdian'
    },
    component: () => import('@/views/about/index.vue'),
  },
  {
    path: "/about-form-no",
    name: "AboutFormNo",

    meta: {
      title: 'AboutFormNo',
      // icon: 'shangdian'
    },
    component: () => import('@/views/about/form.vue'),
  },
  {
    path: '',
    name: 'main',
    component: Layout,
    redirect: 'dashboard',
    hidden: false,
    meta: {
      title: '页面',
      icon: 'shangdian'
    },
    children: [
      {
        path: "dashboard",
        name: "Home",
        meta: {
          title: '首页',
          // icon: 'shangdian'
        },
        // component: () => import('@/views/home/index.vue'),
        component: () => import('@/views/home/index2.vue'),
      },
      {
        path: "about",
        name: "About",

        meta: {
          title: '页面设计',
          // icon: 'shangdian'
        },
        component: () => import('@/views/about/index.vue'),
      },
      {
        path: "form",
        name: "Form",
        meta: {
          title: '接口获取',
          // icon: 'shangdian'
        },
        component: () => import('@/views/home/search.vue'),
      },
      {
        path: "demo",
        name: "Demo",
        meta: {
          title: '流程设计',
          // icon: 'shangdian'
        },
        component: () => import('@/views/home/demo.vue'),
      },
      {
        z_parent: 'main',
        path: "show/:name",
        name: "Show",
        hidden: true,
        meta: {
          title: 'Show',
        },
        component: () => loadPage('Show', VARS_PAGE_MODEL_NAME),
      },
    ]
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/404',
  //   meta: { hidden: true }
  // }
];

export const asyncRouterMap = [
  // {
  //   z_parent: 'main',
  //   path: "show/:name",
  //   name: "Show",
  //   // hidden: true,
  //   meta: {
  //     title: 'Show',
  //   },
  //   component: () => loadPage('Show'),
  //   uuid: 'sdsdsdsdsdsd'
  // },
  // {
  //   z_parent: 'main',
  //   path: "form",
  //   name: "Form",
  //   meta: {
  //     title: '接口获取',
  //     // icon: 'shangdian'
  //   },
  //   component: () => import('@/views/home/search.vue'),
  // },
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
  if (args.z_parent) {
    // console.log('sdsdsdsd')
    router.addRoute(args.z_parent, args)
  } else {
    router.addRoute(args)
  }
}

(async () => {

  let routes = await store.dispatch('GenerateRoutes', {
    roles: ['admin']
  })
  routes.forEach(routeEntry => {
    // console.log(routeEntry)
    addRoute(routeEntry)
  })
})()

// let metaCache = new Map()
let locks = false
router.beforeEach(async (to, from, next) => {


  // console.log(router.getRoutes())


  if (!to.meta) {
    to.meta = {}
  }



  // if (!metaCache.has(to.name)) {
  //   to.meta.pageServiceName = `Page${to.name}Service`
  //   global.createServiceCom({
  //     def: {},
  //     args: {}
  //   },  to.meta.pageServiceName)
  //   metaCache.set(to.name, to)
  // } else {
  //   to.meta = Object.assign({}, to.meta, metaCache.get(to.name).meta)
  // }

  // console.log(to, to.meta)

  next()
// if (to.fullPath === '/form' && !locks) {
//   locks = true
//   next({...to})
// } else {
//
//   next()
// }
})

globalThis.APP_router = router;

export default router;
