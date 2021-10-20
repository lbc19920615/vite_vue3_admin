import { createWebHistory, createRouter, createRouterMatcher } from "vue-router";


import Layout from './views/layout/Layout.vue'
import {loadPage} from "@/remote";
import store from "@/store";
import {VARS_PAGE_MODEL_NAME, APP_STORE_NAME} from "@/vars";
import {app_buildDeepTree, app_initRoutesFromJSON5} from "@/hooks/app";


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
        hidden: true,
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
          storeName: VARS_PAGE_MODEL_NAME
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
  {
    z_parent: 'main',
    path: "name/:name",
    name: "name",
    // hidden: true,
    meta: {
      title: 'Name',
    },
    component: () => loadPage('Show'),
  },
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

export async function init_router_start() {

  let APP_MODEL =  await ZY_EXT.store.getItem(APP_STORE_NAME)
  try {
    let str = app_buildDeepTree(APP_MODEL.routers)
    let obj = app_initRoutesFromJSON5(str)
    console.log(obj)
  } catch (e) {
    console.log(e)
  }

  let routes = await store.dispatch('GenerateRoutes', {
    roles: ['admin']
  })
  routes.forEach(routeEntry => {
    // console.log(routeEntry)
    addRoute(routeEntry)
  })
}


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
