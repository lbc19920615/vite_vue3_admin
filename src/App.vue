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
import {setupLoggerHandler} from "./utils/logger";
import {createRefManager} from "@/hooks/ref";
import {useRouter} from "vue-router";
import {fetchComponent, fetchTwigComponent} from "@/hooks/remote.js";

export default defineComponent({
  setup() {
    const router = useRouter()
    const globalStore = inject('globalStore')

    let serviceArr = [
      ['serviceA', '/public/services/work/serviceA.js'],
      ['serviceB', '/public/services/work/serviceB.js'],
      ['serviceC', '/public/services/work/serviceC.js'],
      ['serviceD', '/public/services/work/serviceD.js'],
    ]
    globalStore.installExposeServices(serviceArr)
    // global.fetchTwigComponent = fetchTwigComponent
    global.createServiceCom = async function () {
      let [err, res] = await ZY.awaitTo(
          fetchTwigComponent('Service' + ZY.nid(), {
            def: {},
            args: {
              src: 'bservice.twig'
            },
          })
      )
      if (err) {
        console.log('fetchTwigComponent err')
        return Promise.reject(err);
      }
      globalStore.installServiceComponent(res.name, res.script)
      return res
    }

    document.addEventListener('visibilitychange', function (newVal) {
      if (document.visibilityState === 'visible') {
        globalStore.installExposeServices(serviceArr)
      }
    })

    setupLoggerHandler()

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
