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
import {DATA_UUID_KEY} from "@/vars";
import {createRefManager} from "@/hooks/ref";
import {useRouter} from "vue-router";
import {fetchTwigComponent} from "@/hooks/remote.js";
import {getDeepConfigFromLinksAndDeps} from "@/views/about/components/DeepPropEditor/utils";
import {buildObjAttrs, buildXml, buildJsx, buildDeepTree} from "@/plugins/z-frame/components/ZLayoutEditor/xml";
import {
  parseFormAttrToObj,
  parseRulesArrToStr,
  parseEventsToStr,
  parseEventsToWeappStr
} from "@/plugins/form-render/utils/CusFormAttr";
import {useStore} from "vuex";
import {parseComponent} from "vue-sfc-parser";

globalThis.createParseComponentMan = function (s) {
  let o = parseComponent(s);
  let map = new Map();
  map.set('styles', o.styles)
  map.set('script', o.script);
  map.set('template', o.template);
  if (Array.isArray(o.customBlocks)) {
    o.customBlocks.forEach(item =>  {
      // console.log(item)
      map.set(item.type, item)
    })
  }
  return map;
}

globalThis.twigRender = function (template, data) {
  let t = Twig.twig({
    // id: tplID,
    data: template,
    allowInlineIncludes: true
  });
  let html = t.render(data)
  return html
}


const rootStore = useStore()

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
    get_elememt_doc_url(value) {
      let cusName = this.getDocAddressName(value)
      return `https://element-plus.gitee.io/zh-CN/component/${cusName}.html`
    },
    getDocAddressName(v = '') {
      let s =  ZY.lodash.kebabCase( v.replace('Cus', ''))
      if (s === 'date-time-picker') {
        s = 'date-picker'
      }
      return s
    },
     findUUIDfromClassList(trueDom, startStr = DATA_UUID_KEY) {
      let uuid_cls =  Array.of(...trueDom.classList).find(v => {
        return v.startsWith(startStr)
      })
      let uuid = null
      if (uuid_cls) {
        uuid = uuid_cls.replace(startStr, '')
      }
      return uuid
    },
    get_custom_components(filter) {
      let filterFun = function ([comName, comDef]) {
        return comDef.CUS_EDITOR
      }
      if (filter) {
        filterFun = filter
      }
      let AppComponents = CustomVueComponent.components
      let arr = []
      arr = arr.concat(
          Object.entries(AppComponents).filter(filterFun)
      )
      let BASE_SUGGEST = arr.map(v => {
        // console.log(v)
        let label = v[0]
        if (v[1] && v[1].CUS_TITLE) {
          label = v[1].CUS_TITLE
        }
        let value = v[0]
        return {
          label: label,
          value: value,
          labelTip: 'CUS_EDITOR',
          origin: v[1]
        }
      })
      return BASE_SUGGEST
    },
    SET_DYM_OPTIONS(name, value) {
      if (globalThis._set_dynimcalOptions) {
        globalThis._set_dynimcalOptions(name, value)
      }
    },
    ENUMS_AREA_GET_OPTS(v) {
      /**
       * ### MODEL
       * 是一个用于获取当前表单 数据的方法
       */
      return this.AREA_GET_OPTS(v)
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
    get_computedFunIns(d) {
      try {
        let o = ZY.JSON5.parse(d)
        // console.log('get_computedFunIns', o)
        let r = o.textContent ?? ''
        return r
      } catch (e) {
        //
      }
      return ''
    },
    getDragDatas(v) {
      try {
        let o = ZY.JSON5.parse(v)
        // console.log('getDragProps', o)
        return ZY.JSON5.stringify(o)
      } catch (e) {
        //
      }
      return '{}'
    },
    getDragProps(v) {
      try {
        let o = ZY.JSON5.parse(v)
        // console.log('getDragProps', o)
        let r = o.props ?? {}
        return ZY.JSON5.stringify(r)
      } catch (e) {
        //
      }
      return '{}'
    },
    getDragMetas(v) {
      try {
        let o = ZY.JSON5.parse(v)
        // console.log('getDragMetas', o)
        let r = o.metas ?? {}
        return ZY.JSON5.stringify(r)
      } catch (e) {
        //
      }
      return '{}'
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
    getui_css(styles) {
      // console.log(styles)
      try {
        let o = ZY.JSON5.parse(styles)
        // console.log('styles', styles, o)
        return o.css
      } catch (e) {
        //
      }
      return ''
    },
    getCusJsxEditor(jsx) {
      try {
        // let o = ZY.JSON5.parse(jsx)
        // console.log('jsx', jsx, o)
        return this.buildJSX(jsx)

      } catch (e) {
        //
      }
      return ''
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
    buildAllXml(data) {
      let ret = {
        web: this.buildXML(data) ?? '',
        weapp: this.buildWeappXML(data) ?? ''
      }
      return ZY.JSON5.stringify(ret)
    },
    buildWeappXML(data) {
      if (data) {
        let obj = ZY.JSON5.parse(data)
        let str = buildXml(obj.data, {
          extCtx: {
            resolveData({data, ele, id}) {
              if (data.attrsMap) {
                let d = ZY.JSON5.parse(data.attrsMap)
                let {commonFormAttr, rules, events} = d
                let obj = parseFormAttrToObj(commonFormAttr)
                // console.log(obj, buildObjAttrs(obj))
                let formAttr = buildObjAttrs(obj).trim()

                let ruleStr = parseRulesArrToStr(rules)
                let rulesAttr = ''
                if (ruleStr) {
                  rulesAttr = `:rules='${ruleStr}'`
                }

                let eventStr = parseEventsToWeappStr(events);
                let ret = [
                  formAttr, rulesAttr, eventStr
                ].join(' ')
                // console.log(ret)
                data.beforeAttrs = ret
              }
              return data
            }
          }
        })
        // console.log('buildXML', obj, str)
        return str
      }
      return ''
    },
    buildJSX(data) {
      if (data) {
        let obj = ZY.JSON5.parse(data)
        let str = buildJsx(obj.data)
        // console.log('buildXML', obj, str)
        return str
      }
      return ''
    },
    buildDeepTree(data) {
      if (data) {
        let obj = ZY.JSON5.parse(data)
        let str = buildDeepTree(obj.data)
        // console.log('buildXML', obj, str)
        return str
      }
      return ''
    },
    initRoutesFromJSON5(str) {
//       let str = `{
// name: 'main',
// children: [{
// name: 'Test',
// path: '/test',
// component: [
// '',
// "loadPage('Test')",
// ],
// meta: {
// ssds: '111',
// },
// z_parent: 'main',
// }],
// meta: {}
// }`


      let obj = ZY.JSON5.parse(str, function (k, v) {
        if (k === 'component') {
          return new Function(v[0], v[1])
        }

        return v
      })
      return obj
    },
    calcBeforeAttrs(commonFormAttr, rules = [], events = []) {
      // console.log('calcBeforeAttrs', rules, isWeapp)
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
    calcAttrsMap(commonFormAttr, rules = [], events = []) {
      return ZY.JSON5.stringify({
        commonFormAttr,
        rules,
        events
      })
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
    parseUIObj2(uiJSON5 = '') {
      let JSON5 = ZY.JSON5
      try {
        if (uiJSON5) {
          let ret = {}
          let obj = ZY.JSON5.parse(uiJSON5)
          let classes = obj.data.class ?? []
          let attrs = obj.data.attrs ?? []
          let styleSheets = obj.data.styles ?? '{}'
          // console.log(styles)
          ret.attrs = attrs
          ret.class = classes
          ret.styleSheets = []
          try {
            let obj = JSON5.parse(styleSheets);
            // console.log(obj)
            ret.styleSheets = Object.entries(obj.cached).filter(v => {
              return v[1] && Object.keys(v[1]).length > 0
            })
          } catch (e) {
            console.log('parseUIObj2 parse err', e)
          }
          // ret.styles = styles
          return JSON5.stringify(ret, null, 2)
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

    function getBserviceCache() {
      let ret = document.getElementById('bserviceTpl').innerHTML
          .replace('[REMOTE]', location.origin)
      // console.log('getBserviceCache', ret)
      return ret
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
             cached_tpl: getBserviceCache()
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
      // console.log('sdsds', getBserviceCache())
      let [err, res] = await ZY.awaitTo(
          fetchTwigComponent( serviceID, {
            def: def,
            args: {
              src: 'bservice.twig',
              ...args
            },
            cached_tpl: getBserviceCache()
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
