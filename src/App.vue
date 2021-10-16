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
import {buildObjAttrs, buildXml} from "@/plugins/z-frame/components/ZLayoutEditor/xml";
import {parseFormAttrToObj, parseRulesArrToStr, parseEventsToStr} from "@/plugins/form-render/utils/CusFormAttr";

export default defineComponent({
  mounted() {
    let self = this
    globalThis.getApp = function () {
      return self
    }
  },
  methods: {
    AREA_GET_PROVICES(code = '86') {
      return this.AREA_GET_OPTS(code)
    },
    AREA_GET_OPTS(code = '') {
      let arr = []
      let obj = chinaAreaManager.get(code)
      if (obj) {
        arr = Object.entries(obj).map(v => {
          return {
            label: v[1],
            value: v[0]
          }
        })
      }
      return arr
    },
    getElementComponentTags() {
      let appContext = getAppContext()
      return Object.keys(appContext.components)
          .filter(v => v.startsWith('El')).map(v => ZY.lodash.kebabCase(v))
    },
    getDeeps(v1, v2) {
      // console.log('v1', v1, v2)
      return getDeepConfigFromLinksAndDeps(v1, v2)
    },
    getProps(v) {
      // console.log('getProps', v)
      try {
        let o = ZY.JSON5.parse(v)
        let r =  getDeepConfigFromLinksAndDeps(o.links, o.deps)
        return ZY.JSON5.stringify(r, null, 2)
      } catch (e) {
      //
      }
      return '{}'
    },
    get_ui2_styles(styles) {
      try {
        let o = ZY.JSON5.parse(styles)
        // console.log('styles', styles, o)
        if (Array.isArray(o.styles)) {
          return o.styles
          // return ZY.JSON5.stringify(o.styles, null, 2)
        }
      } catch (e) {
      //
      }
      return []
    },
    getCusInsertContent(str = '') {
      // console.log('getCusInsertContent', str)
      try {
        let o = ZY.JSON5.parse(str)
        // console.log(o)
        return o?.textContent ?? ''
      } catch (e) {
        //
      }
      return ''
    },
    getRulesFromRulesArr(arr) {

      if (Array.isArray(arr)) {
        try {
          let o = ZY.JSON5.parse(ZY.JSON5.stringify(arr))
          let newArr = o.map(v => ZY.JSON5.parse(v.value))
          return ZY.JSON5.stringify(newArr)
        } catch (e) {
          console.log('getRulesFromRulesArr err', e)
          return  '{}'
        }
      }

      return '{}'
    },
    OBJ2JSON5(v = {}) {
      return ZY.JSON5.stringify(v)
    },
    slotArrToStr(arr = []) {
      let str = ''
      if (Array.isArray(arr)) {
        arr.forEach((item) => {
          str = str + `
<template v-slot:${item.name}="scope">
${item.value}
</template>
`
        })
      }

      return str.trim()
    },
    parseOptions2Entries(arr = []) {
      // console.log('parseOptions2Entries', arr)
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map(v => {
          return [
              v.label,
              v.value
          ]
        })
      }
      return []
    },
    getPropsObj(v) {
      // console.log('getProps', v)
      try {
        let o = ZY.JSON5.parse(v)
        let r =  getDeepConfigFromLinksAndDeps(o.links, o.deps)
        return r
      } catch (e) {
        //
      }
      return {}
    },
    getPropsObjFROMLinksAndDeps(o = {links: [], deps: []}) {
      return  getDeepConfigFromLinksAndDeps(o.links, o.deps)
    },
    getBeforeScript(s) {
      let tpl = function (v) {
        let p = ZY.JSON5.stringify(v, null, 2)
        return `
        let properties = ${p};
        `.trim()
      }
      let o = this.getPropsObj(s) ?? {}
      return tpl(o.properties ?? {})
    },
    propsToJSON5(item, path) {
      // console.log('propsToEntries', item)
      if (item) {
        let obj = {}
        let props = ZY.lodash.get(item, path)
        if (props) {
          props.forEach(prop => {
            let key = prop.name
            let value = undefined
            // try {
            //   value = ZY.JSON5.parse(prop.value)
            // } catch (e) {
            //   value = prop.value
            // }
            value = prop.value
            obj[key] = value
          })
          return ZY.JSON5.stringify(obj)
        }
      }
      return '{}'
    },
    buildXML(data) {
      if (data) {
        let obj = ZY.JSON5.parse(data)
        let str = buildXml(obj.data)
        // console.log('buildXML', obj, str)
        return str
      }
      return ''
    },
    calcBeforeAttrs(commonFormAttr, rules = [], events = []) {
      // console.log('calcBeforeAttrs', rules)
      let obj = parseFormAttrToObj(commonFormAttr)
      // console.log(obj, buildObjAttrs(obj))
      let formAttr = buildObjAttrs(obj).trim()

      let ruleStr = parseRulesArrToStr(rules)
      let rulesAttr = ''
      if (ruleStr) {
        rulesAttr = `:rules='${ruleStr}'`
      }

      let eventStr = parseEventsToStr(events)

      return formAttr + ' ' + rulesAttr + ' ' + eventStr
    },

    parseUIObj(uiJSON5 = '') {

      try {
        if (uiJSON5) {
          let ret = {}
          let obj = ZY.JSON5.parse(uiJSON5)
          let classes = obj.data.class ?? []
          let attrs = obj.data.attrs ?? []
          let styles = obj.data.styles ?? []
          // console.log(classes, attrs)
          ret.attrs = attrs
          ret.class = classes
          ret.styles = styles
          return ZY.JSON5.stringify(ret, null, 2)
        }
      } catch (e) {
        console.error(e);
        console.log(uiJSON5)
      }

      return '{}'
    },
    JSON5_stringify(v, tab = 2) {
      return ZY.JSON5.stringify(v, null, tab)
    },
    getWidgetExt(v1,v2) {
      let ext = {}
      try {
        ext = ZY.JSON5.parse(v2)
      } catch (e) {
      //
      }
      let o = Object.assign({}, v1, ext)
      return ZY.JSON5.stringify(o, null, 2)
    },
    getWidgetEditor(uiJSON5, path) {
      try {
        // let ret = {}
        // let obj = uiJSON5
        // let classes = obj.data.class ?? []
        // let attrs = obj.data.attrs ?? []
        // // console.log(classes, attrs)
        // ret.attrs = attrs
        // ret.class = classes
        // return ZY.JSON5.stringify(ret, null, 2)
        if (uiJSON5) {
          let obj = ZY.JSON5.parse(uiJSON5)
          // console.log('obj', obj, path)
          if (obj.data) {
            let ret =  ZY.lodash.get(obj.data, path)
            // console.log('sdsdsds', ret)
            return ret
          }
        }
        return undefined
      } catch (e) {
        console.error(e)
      }

      return undefined
    },

    test(v) {
      console.log('call app test')
      return v
    }
  },
  setup() {
    const router = useRouter()
    const globalStore = inject('globalStore')

    let serviceArr = [
      // ['serviceA', '/public/services/work/serviceA.js'],
      // ['serviceB', '/public/services/work/serviceB.js'],
      // ['serviceC', '/public/services/work/serviceC.js'],
      // ['serviceD', '/public/services/work/serviceD.js'],
    ]
    globalStore.installExposeServices(serviceArr)
    let cachedServiceDef = null
    // global.fetchTwigComponent = fetchTwigComponent
    globalThis.ServiceID = function (prefix = 'Service') {
      return prefix + ZY.nid(6)
    }



    globalThis.createServiceComFromCache = function (id = globalThis.ServiceID()) {
      // console.log('cachedServiceDef', cachedServiceDef, id)

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

    globalThis.createServiceComFromCacheFix = function (config, serviceID) {
      return  globalThis.createServiceComFromCache(serviceID)
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
        // console.log(pageManager.Refs)
        if (pageManager.Refs.has(currentRoute.fullPath)) {
          return pageManager.Refs.get(currentRoute.fullPath).context
        }
      }
      return null
    }

    provide('pageManager', pageManager)

    globalThis.getCurrentPage = function (path = '') {
      let obj = pageManager.getCurrentPage();
      if (obj && path) {
        return ZY.lodash.get(obj, path)
      }
      return obj
    }

    function reloadCurrentRoute() {
      // let route = useRoute()
      // console.log(router, route)
      router.go(router.currentRoute.value)
    }

    return {
      reloadCurrentRoute
    }
  }
})
</script>

<style>
</style>
