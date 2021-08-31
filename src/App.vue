<template>
  <div id="app">
<!--    <router-view></router-view>-->

    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <transition mode="out-in">
          <keep-alive>
            <suspense>
              <component :is="Component"></component>
              <template #fallback>
                <app-loading></app-loading>
              </template>
            </suspense>
          </keep-alive>
        </transition>
      </template>
    </router-view>

  </div>
</template>

<script>
import {defineComponent, inject, provide} from "vue";
import {createRefManager} from "@/hooks/ref";
import {useRouter} from "vue-router";
import {fetchTwigComponent} from "@/hooks/remote.js";
import {getDeepConfigFromLinksAndDeps} from "@/views/about/components/DeepPropEditor/utils";

export default defineComponent({
  mounted() {
    let self = this
    globalThis.getApp = function () {
      return self
    }
  },
  methods: {
    getDeeps(v1, v2) {
      // console.log('v1', v1, v2)
      return getDeepConfigFromLinksAndDeps(v1, v2)
    },
    getProps(v) {
      // console.log('getProps', v)
      try {
        let o = ZY.JSON5.parse(v)
        let r =  getDeepConfigFromLinksAndDeps(o.links, o.deps)
        return ZY.JSON5.stringify(r)
      } catch (e) {
      //
      }
      return '{}'
    },
    OBJ2JSON5(v = {}) {
      return ZY.JSON5.stringify(v)
    }
  },
  setup() {
    const router = useRouter()
    const globalStore = inject('globalStore')

    let serviceArr = [
      // ['serviceA', '/public/services/work/serviceA.js'],
      ['serviceB', '/public/services/work/serviceB.js'],
      ['serviceC', '/public/services/work/serviceC.js'],
      ['serviceD', '/public/services/work/serviceD.js'],
    ]
    globalStore.installExposeServices(serviceArr)
    let cachedServiceDef = null
    // global.fetchTwigComponent = fetchTwigComponent
    globalThis.ServiceID = function (prefix = 'Service') {
      return prefix + ZY.nid(6)
    }



    globalThis.createServiceComFromCache = function (id = globalThis.ServiceID()) {
      // console.log('cachedServiceDef', cachedServiceDef)

       return new Promise(resolve => {
         function run(script) {
           globalStore.installServiceComponent(id, script, {
             onMounted() {
               resolve(id)
             }
           })
         }

         if (cachedServiceDef) {
           run(cachedServiceDef.script)
         } else {
           fetchTwigComponent( id, {
             def: {},
             args: {
               src: 'bservice.twig',
               args: {}
             },
           }).then(res => {
             cachedServiceDef = res
             run(cachedServiceDef.script)
           })
         }
       })
    }

    /**
     * createServiceCom
     * @param def
     * @param args
     * @param serviceID
     * @returns {Promise<*>}
     */
    globalThis.createServiceCom = async function ({def = {}, args = {}} = {}, serviceID = ZY.nid()) {
      def.$SELF_NAME = serviceID
      let [err, res] = await ZY.awaitTo(
          fetchTwigComponent( serviceID, {
            def: def,
            args: {
              src: 'bservice.twig',
              ...args
            },
          })
      )
      if (err) {
        console.log('fetchTwigComponent err')
        return Promise.reject(err);
      }
      res.$SERVICE_ID = serviceID
      cachedServiceDef = res
      // console.log('res.script', res.script)
      globalStore.installServiceComponent(res.name, res.script)
      return res
    }

    globalThis.createServiceCom({
      def: {},
      args: {}
    }, "ServicePage")

    document.addEventListener('visibilitychange', function (newVal) {
      if (document.visibilityState === 'visible') {
        globalStore.installExposeServices(serviceArr)
      }
    })


    let pageManager = createRefManager({
      eventHandler({type, e}) {
        // console.log('eventHandler', type, e)
      }
    })

    pageManager.getCurrentPage = function () {
      let currentRoute = router.currentRoute.value
      if (currentRoute) {
        console.log(pageManager.Refs)
        if (pageManager.Refs.has(currentRoute.fullPath)) {
          return pageManager.Refs.get(currentRoute.fullPath).context
        }
      }
      return null
    }

    provide('pageManager', pageManager)
  }
})
</script>

<style>
</style>
