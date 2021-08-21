import {inject} from "vue";
import {provideRefManager} from "@/hooks/ref";
import mitt from "mitt";
import {useRouter} from "vue-router";
import {defineAutoStoreControl} from "@/hooks/autoVue";

export let PageControl = {
  created() {
    let pageManager = inject('pageManager')
    // console.log(pageManager, this.$router.currentRoute); // path is /post

    pageManager.register(this, this.$router.currentRoute.value.fullPath)
    // console.log('pageManager', pageManager.getCurrentPage())
  },
}

/**
 *
 * @param data
 * @param filters
 * @returns {{setDef: setDef, refsManager: {Refs: Map<unknown, unknown>}, meta: {}, getPartModel: (function(*=, *=): void), setPartModel: (function(*, *=, *=): void), storeControl: {}, setEventHandler: setEventHandler, httpComContext: {}, allDef: Map<any, any>}}
 */
export let usePage  = function ({data = {} , filters = {}} = {}) {
  let router = useRouter()
  let self = this
  let meta = {}
  if (router.currentRoute && router.currentRoute.value) {
    meta = router.currentRoute.value.meta
  }
  let httpComContext = {}
  let allDef = new Map()
  let events = new Map()
  let storeControl;
  let eventHandleMap = {}

  let refsManager = provideRefManager({
    async eventHandler({type, e}) {
      // console.log('page eventHandler', type, e)
      if (type === 'http-component:com:mounted') {
        let name = e.httpComponentContext.is
        httpComContext[name] = e.httpComponentContext
        // console.log(name)
        if (events.has(name)) {
          events.get(name)({
            done() {
              events.delete(name)
            }
          })
        }
      } else {
        if (eventHandleMap[type]) {
          eventHandleMap[type](e)
        }
      }
    }
  })
  function setPartModel(stepName, partName, model) {
    // console.log('httpComContext', stepName, partName)
    return httpComContext[stepName].runPart(partName, 'setModel',
        model
    )
  }

  function getPartModel(stepName, partName) {
    console.log('httpComContext', stepName, partName, httpComContext[stepName])
    return httpComContext[stepName].runPart(partName, 'getModel',

    )
  }

  function setEventHandler(_eventHandler) {
    eventHandleMap = _eventHandler
  }

  function setDef(config, fun) {
    allDef.set(config.name, config)
    events.set(config.name, fun)
    // events[name] = new Function('options', `fun()`)
  }

  storeControl = defineAutoStoreControl({
    service: meta.pageServiceName,
    data: {
      type: 'object',
      properties: {
        data
      }
    },
    filters: filters
  })
  return {
    allDef,
    setEventHandler,
    // addListener,
    meta,
    storeControl,
    setDef,
    getPartModel,
    setPartModel,
    httpComContext,
    refsManager
  }
}