import {getCurrentInstance, inject, nextTick, provide, onMounted, reactive, ref, onBeforeUnmount, toRaw} from "vue";
import {createRefManager, provideRefManager} from "@/hooks/ref";
import {useRouter, useRoute} from "vue-router";
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
 * PageControlMixin
 * @type {{created(): void}}
 */
export let PageControlMixin = {
  created() {
    let pageManager = inject('pageManager')
    // console.log(pageManager, this.$router.currentRoute); // path is /post

    pageManager.register(this, this.$router.currentRoute.value.fullPath)
    // console.log('pageManager', pageManager.getCurrentPage())
  },
}

/**
 * initWebComponentRefMan
 * @param page
 * @returns {{Refs: *}}
 */
function initWebComponentRefMan(page) {
  let webComponentRef = createRefManager({
    eventHandler({type, e}) {
      console.log('eventHandler', type, e)
    }
  })

  webComponentRef.toggleDialog = function (name) {
    let dialog = webComponentRef.find(name)
    if (dialog) {
      dialog.toggle()
    }
  }

  return webComponentRef
}

/**
 * extendPartialPage
 * @param page
 */
export let extendPartialPage = function (page) {
  let webComponentRef = initWebComponentRefMan(page)
  provide('webComponentRef', webComponentRef)
  page.webComponentRef  = webComponentRef
}

let lastCachedPhoto = new Map()
globalThis.APP_lastCachedPhoto = lastCachedPhoto

/**
 *
 * @param page
 */
export let useAppPageControl = function (page) {
  let ctx = getCurrentInstance().ctx
  let router = useRouter()
  let pageManager = inject('pageManager')

  let cachedRouteObj = null
  if (router && router.currentRoute && router.currentRoute.value) {
    cachedRouteObj = router.currentRoute.value
  }

  page.setAutoGC(false)

  onBeforeUnmount(() => {
    let cachedModel = page.getPartAllModel()
    // console.log('cachedRouteObj', cachedRouteObj, cachedModel)

let urlCachedPath = cachedRouteObj.fullPath

    lastCachedPhoto.set(urlCachedPath, {
      model: cachedModel,
      route: cachedRouteObj
    })
  })
  // console.log(pageManager, this.$router.currentRoute); // path is /post

  pageManager.register(ctx, router.currentRoute.value.fullPath)

  page.pageManager = pageManager

  let webComponentRef = initWebComponentRefMan(page)
  provide('webComponentRef', webComponentRef)
  page.webComponentRef  = webComponentRef

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
export function useControl({properties, computed, filters}, {onInited, extendContext = {}, defaultGC = true, servicePrefix = 'ControlService'}) {
  const rootStore = useStore()
  const globalStore = inject('globalStore')
  let autoGC = defaultGC
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


  let filter = {}

  function log(...args) {
    // console.log(...args)
  }
  let storeControl
  let serviceId = servicePrefix + ZY.nid(8).toLowerCase()
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
    if (storeControl) {
      storeControl.set(o)
    }
  }

  function setData(v) {
    // console.log(storeControl)
    if (storeControl) {
      storeControl.set(v)
    }
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

  let comRefs = new Map();

  function runRefMethod(name, methodName, ...args) {
    let layoutRef = comRefs.get(name)
    if (layoutRef && layoutRef[methodName] && layoutRef[methodName].constructor) {
      // const isAsync = layoutRef[methodName].constructor.name === "AsyncFunction";
      // if (isAsync) {}
      return layoutRef[methodName].apply(null, args)
    }
  }

  function setRef(name) {
    return function (target, options) {
      comRefs.set(name, target)
    }
  }

  function getRef(name) {
    return comRefs.get(name)
  }

  function destory() {
    // console.log(serviceId, globalStore.serviceNames)
    globalStore.destory([serviceId]);
  }

  onMounted(() => {
    if (!inited.value) {
      init.bind(this)()
    }
  })

  function setAutoGC(v) {
    autoGC = v
  }

  onBeforeUnmount(() => {
    if (autoGC) {
      destory()
    }
  })

  return {
    getRef,
    setRef,
    destory,
    setAutoGC,
    EVENT_TYPES,
    store,
    dxValue,
    runRefMethod,
    val,
    comRefs,
    callEvent,
    eventHandleMap,
    dispatchRoot,
    rootStore,
    filter,
    setEventHandler,
    setData,
    setByPath,
    inited,
  }
}

export function extendCommonArrEventHandler(page) {
  let EVENT_NAMES = {
    ARR_APPEND_COMMON: 'ARR_APPEND_COMMON',
    ARR_REMOVE_COMMON: 'ARR_REMOVE_COMMON'
  }
  let _bindFun = null
  function onChange(v) {
    _bindFun = v
  }
  page.setEventHandler({
    [EVENT_NAMES.ARR_APPEND_COMMON](e) {
      let { parts, partName, selfpath, process } = e
      // console.log('add:events', e, e.pathArr)

      let s_path = selfpath
      if (Array.isArray(e.pathArr)) {
        // console.log('add:events', e, model)
        s_path = ZY.getObjPathFromPathArr(e.pathArr)
      } else {
      }
      parts[partName].arrAppend(s_path);
      if (_bindFun) {
        _bindFun(EVENT_NAMES.ARR_APPEND_COMMON, e)
      }
    },
    [EVENT_NAMES.ARR_REMOVE_COMMON](e) {
      // console.log('sdsdsdsdsdsds', e)
      let { parts, partName, fromPath, indexKey } = e

      console.log(e.pathArr, e)
      let s_path = fromPath
      if (Array.isArray(e.pathArr)) {
        // console.log('add:events', e, model)
        s_path = ZY.getObjPathFromPathArr(e.pathArr)
      } else {
      }

      parts[partName].appSplice(s_path, indexKey)
      if (_bindFun) {
        _bindFun(EVENT_NAMES.ARR_REMOVE_COMMON, e)
      }
    },
  })

  return {
    onChange,
    EVENT_NAMES
  }
}

export function extendControl2Page(control = {eventHandleMap: {}}) {
  let ctx = getCurrentInstance().ctx
  control.ctx = ctx
  let httpComContext = {}
  let cachedHttpCom = {}
  let allDef = new Map()
  let events = new Map()
  control.defMap = allDef
  control.allDef = allDef

  control.httpComContext = httpComContext

  let refsManager = provideRefManager({
    async eventHandler({type, e}) {
      // console.log('page eventHandler', type, e)
      if (type === 'http-component:com:mounted') {
        let name = e.httpComponentContext.is
        httpComContext[name] = e.httpComponentContext
        cachedHttpCom[name] = e
        // console.log(name)
        if (events.has(name)) {
          events.get(name)({
            done() {
              events.delete(name)
            }
          })
        }
        if (control.eventHandleMap['HTTP:COM:MOUNTED']) {
          control.eventHandleMap['HTTP:COM:MOUNTED'](e)
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


  function getPartAllModel() {
    let ret = {}
    for (let stepName in cachedHttpCom) {
      let e = cachedHttpCom[stepName]
      let parts = e.httpComponentComContext.parts
      ret[stepName] = {
        model: {}
      }
      for (let [partName, part] of Object.entries(parts)) {
        ret[stepName].model[partName] = toRaw(part.getModel())
      }
      // ret[setpName] = getPartModel(setpName)
    }
    return ret
  }
  control.getPartAllModel = getPartAllModel


  function setDef(config, fun) {
    allDef.set(config.name, config)
    events.set(config.name, fun)
    // events[name] = new Function('options', `fun()`)
  }

  control.setDef = setDef



  async function commonLoadStep( loadPromise, varName = '', {
    onMounted
  }) {
    let [e,res] = await ZY.awaitTo(
      loadPromise
    )
    // console.log(e)
    const config = ZY.JSON5.parse(ZY.JSON5.stringify(res.default))
    // console.log('commonLoadStep', config)
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
