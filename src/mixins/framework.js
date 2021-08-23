import {inject, nextTick} from "vue";
import {provideRefManager} from "@/hooks/ref";
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
 * @param defaultVal
 * @param serviceName
 * @returns {{setDef: setDef, refsManager: {Refs: Map<unknown, unknown>}, meta: {}, getPartModel: (function(*=, *=): void), setPartModel: (function(*, *=, *=): void), storeControl: {}, setEventHandler: setEventHandler, httpComContext: {}, allDef: Map<any, any>}}
 */
export let usePage  = function ({data = {} , filters = {}, defaultVal = {}, serviceName = ''} = {}) {
  let router = useRouter()
  let meta = {}
  if (router && router.currentRoute && router.currentRoute.value) {
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
    // console.log('httpComContext', stepName, partName, httpComContext[stepName])
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


  let service = serviceName ? serviceName : meta.pageServiceName

  // console.log(serviceName, meta, service)

  storeControl = defineAutoStoreControl({
    service: service,
    data: {
      type: 'object',
      properties: {
        data
      }
    },
    filters: filters
  })

  storeControl.set(defaultVal)

  async function commonLoadStepByContent( loadPromise, varName = '', {
    onMounted
  }) {
    let [,res] = await ZY.awaitTo(
      loadPromise
    )
    const config = res.default
    config.name = ZY.nid()

    setDef(config, function ({done}) {
      // let cached = null
      // if (item.data) {
      //   cached = JSON5.parse(item.data)
      // }
      let JSON5 = ZY.JSON5
      for (let [partName, data] of Object.entries(config.defaultVal)) {
        let defaultObj = JSON5.parse(JSON5.stringify(data))

        setPartModel( config.name, partName,
          defaultObj
        )
      }
      if (onMounted) {
        onMounted(config)
      }
      done()
    })
    await nextTick()
    storeControl.set({
      [varName]: config.name
    })
    console.log(storeControl.store)
  }

  function callEvent(name, e) {
    if (eventHandleMap[name]) {
      eventHandleMap[name](e)
    }
  }

  let EVENT_TYPES = {
    ARR_APPEND: 'arr_append_' + ZY.nid(6),
    ARR_SPLICE: 'arr_splice_' + ZY.nid(6),
  }

  return {
    allDef,
    setEventHandler,
    // addListener,
    EVENT_TYPES,
    meta,
    storeControl,
    callEvent,
    commonLoadStepByContent,
    store: storeControl.store,
    filter: storeControl.filter,
    setDef,
    getPartModel,
    setPartModel,
    httpComContext,
    refsManager
  }
}
