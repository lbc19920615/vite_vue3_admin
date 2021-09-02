import {getCurrentInstance, inject, nextTick, provide, onMounted, reactive, ref} from "vue";
import {createRefManager, provideRefManager} from "@/hooks/ref";
import {useRouter} from "vue-router";
import {defineAutoStoreControl} from "@/hooks/autoVue";
import {useStore} from "vuex";

/**
 * PageControl
 * @type {{created(): void}}
 */
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
 * @param page
 */
export let useAppPageControl = function (page) {
  let ctx = getCurrentInstance().ctx
  let router = useRouter()
  let pageManager = inject('pageManager')
  // console.log(pageManager, this.$router.currentRoute); // path is /post

  pageManager.register(ctx, router.currentRoute.value.fullPath)

  page.pageManager = pageManager

  let webComponentRef = createRefManager({
    eventHandler({type, e}) {
      console.log('eventHandler', type, e)
    }
  })
  provide('webComponentRef', webComponentRef)
  page.webComponentRef = webComponentRef

  let modalManRef = createRefManager({
    eventHandler({type, e}) {
      console.log('eventHandler', type, e)
    }
  })
  provide('modalManRef', modalManRef)
  page.modalManRef = modalManRef

  async function openDialog(name) {
    let dialog = webComponentRef.find(name)
    if (dialog) {
      dialog.toggleOpen(true)
    }
  }

  page.openDialog = openDialog

  return page
}


export function useConstObj() {
  let ret = {}
  /**
   * FINAL_PROP_DEFS
   * @type {{options(): {type: Array | ArrayConstructor, properties: {label: {type: String | StringConstructor}, value: {type: null}}}}}
   */
  ret.FINAL_PROP_DEFS = {
    /**
     * 实现properties定义时options请求的ok
     * @returns {{type: ArrayConstructor, properties: {label: {type: StringConstructor}, value: {type: null}}}}
     */
    options() {
      return  {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: {
              type: String,
            },
            value: {
              type: null,
            }
          }
        }
      }
    }
  }
  return ret
}


/**
 *
 * @param properties
 * @param computed
 * @param filters
 * @param onInited
 * @param extendContext
 * @returns {{val: ((function(*=): (*))|*), dxValue: ((function(*=): (undefined))|*), inited, callEvent: callEvent, setData: setData, eventHandleMap: {}, rootStore, setByPath: setByPath, dispatchRoot: (function(...[*]): *), EVENT_TYPES: {ARR_APPEND: string, ARR_SPLICE: string, COMPUTED_CHANGE: string}, store, setEventHandler: setEventHandler}}
 */
export function useControl({properties, computed, filters}, {onInited, extendContext = {}}) {
  const rootStore = useStore()
  const globalStore = inject('globalStore')

  let inited = ref(false)
  let store = reactive({
    model: {},
    computedModel: {}
  })
  let eventHandleMap = {}

  const EVENT_TYPES = {
    ARR_APPEND: 'arr_append_' + ZY.nid(6),
    ARR_SPLICE: 'arr_splice_' + ZY.nid(6),
    COMPUTED_CHANGE: 'COMPUTED_CHANGE_' + ZY.nid(6),
  }

  function log(...args) {
    // console.log(...args)
  }
  let storeControl
  let serviceId = 'AsyncComService' + ZY.nid(8).toLowerCase()
    .replace('_', '')
    .replace('-', '')

  // console.log(globalStore)
  function init() {
    globalThis.createServiceComFromCache(serviceId).then((serviceName) => {
      let router = useRouter()
      let meta = {}
      if (router && router.currentRoute && router.currentRoute.value) {
        meta = router.currentRoute.value.meta
      }
      let service = serviceName ? serviceName : meta.pageServiceName
      log(service)

      storeControl = defineAutoStoreControl({
        service: service,
        data: {
          type: 'object',
          properties: properties
        },
        computed: computed ?? {},
        filters: filters ?? {},
        globalStore,
        rootStore,
        extendFun: '',
        extendContext,
      })
      storeControl.store.beforeAutoVal = function (key, newVal) {
        // console.log('beforeAutoVal', key, newVal, eventHandleMap[EVENT_TYPES.COMPUTED_CHANGE])
        if (eventHandleMap[EVENT_TYPES.COMPUTED_CHANGE]) {
          eventHandleMap[EVENT_TYPES.COMPUTED_CHANGE]({
            key, newVal
          })
        }
      }
      log(storeControl.store)
      store.model = storeControl.store.model
      store.computedModel = storeControl.store.computedModel
      inited.value = true
      // console.log('sdsdsdsdsdsds')
      if (onInited) {
        onInited({storeControl})
      }
    })
  }

  function dxValue(t) {
    if (!storeControl) {
      return undefined
    }
    return storeControl.dxValue(t)
  }

  function val(path) {
    let hasModel = ZY.lodash.has(store.model, path)
    if (hasModel) {
      return ZY.lodash.get(store.model, path)
    }
    return ZY.lodash.has(store.computedModel, path)
  }

  function setByPath(path, v) {
    let o = {}
    ZY.lodash.set(o, path, v)
    storeControl.set(o)
  }

  function setData(v) {
    storeControl.set(v)
  }

  function setEventHandler(_eventHandler) {
    for (let key in _eventHandler) {
      eventHandleMap[key] = _eventHandler[key]
    }
    // console.log(eventHandleMap)
  }

  function callEvent(name, e) {
    if (eventHandleMap[name]) {
      eventHandleMap[name](e)
    }
  }

  function dispatchRoot(...args) {
    return rootStore.dispatch(...args)
  }

  onMounted(() => {
    if (!inited.value) {
      init.bind(this)()
    }
  })

  return {
    EVENT_TYPES,
    store,
    dxValue,
    val,
    callEvent,
    eventHandleMap,
    dispatchRoot,
    rootStore,
    setEventHandler,
    setData,
    setByPath,
    inited,
  }
}

export function extendControl2Page(control = {eventHandleMap: {}}) {
  let ctx = getCurrentInstance().ctx
  control.ctx = ctx
  let httpComContext = {}
  let allDef = new Map()
  let events = new Map()
  control.defMap = allDef
  control.allDef = allDef

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
        // console.log(control.eventHandleMap, type)
        if (control.eventHandleMap[type]) {
          control.eventHandleMap[type](e)
        }
      }
    }
  })
  control.refsManager = refsManager

  function setPartModel(stepName, partName, model) {
    // console.log('httpComContext', httpComContext, stepName, partName)
    return httpComContext[stepName].runPart(partName, 'setModel',
      model
    )
  }
  control.setPartModel  = setPartModel

  function getPartModel(stepName, partName) {
    // console.log('httpComContext', stepName, partName, httpComContext[stepName])
    return httpComContext[stepName].runPart(partName, 'getModel',
    )
  }
  control.getPartModel  = getPartModel

  function setDef(config, fun) {
    allDef.set(config.name, config)
    events.set(config.name, fun)
    // events[name] = new Function('options', `fun()`)
  }

  control.setDef = setDef


  async function commonLoadStep( loadPromise, varName = '', {
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
        onMounted(config, {setPartModel})
      }
      done()
    })
    await nextTick()
    control.setByPath(varName, config.name)
    // console.log(storeControl.store)
  }
  control.commonLoadStep = commonLoadStep

  return control
}

export function extendControlComputedWatch(control = {setEventHandler}, computedChange = {}) {
  control.setEventHandler({
    [control.EVENT_TYPES.COMPUTED_CHANGE](e) {
      // console.log('  let [,response] = await ZY.awaitTo(', e)
      computedChange[e.key] ? computedChange[e.key](e.newVal) : ''
    }
  })
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
  const rootStore = useStore()
  const globalStore = inject('globalStore')

  let router = useRouter()
  let meta = {}
  if (router && router.currentRoute && router.currentRoute.value) {
    meta = router.currentRoute.value.meta
  }
  // console.log('meta', meta)
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
    filters: filters,
    globalStore,
    rootStore
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
    // console.log(storeControl.store)
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
