// import { moduleConfig } from '__remote/public/vue-bs-loader.js'

import {fetchVueComponent} from "@/hooks/remote";

const getGlobal = function() {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

const _global = getGlobal();
_global.global = _global;

// import { initTemplate } from '__remote/public/template-loader.js'
_global.initTemplate = async function initTemplate(id, global, { html = '' } = {}) {
  const document = global.document;
  if (!document.getElementById(id)) {
    try {
      const template = document.createElement('template');
      template.innerHTML = html;
      template.id = id;
      document.body.appendChild(template);
    } catch (e) {
      console.error(new Error('loadTwigComponent failed'));
    }
  } else {
    //
  }
}

class CustomVueComponent {
  static defMap = new Map()
  static components = {}
  static app = null
  static component(name, ctx) {
    this.app.component(name, ctx)
    this.defMap.set(name, ctx)
    this.components[name] = ctx
  }
  static register(ctx, name = ctx.name) {
    this.component(name, ctx)
  }
  static resolve(str) {
    let components = getAppContext().components
    let comName = ZY.lodash.upperFirst(ZY.lodash.camelCase(str))
    if (components[comName]) {
      return components[comName]
    }
    return str
  }
}
globalThis.CustomVueComponent = CustomVueComponent



import * as Vue from 'vue/dist/vue.cjs'
globalThis.Vue = Vue

import * as vuex from 'vuex'
globalThis.Vuex = vuex


import 'normalize.css/normalize.css'
import 'suitcss-utils-size/index.css'
import App from './App.vue'

// element
// import ElementPlus from 'element-plus/dist/index.full.js';
import ElementPlus from 'element-plus/es/index';

import 'element-plus/theme-chalk/src/index.scss';

import locale from 'element-plus/lib/locale/lang/zh-cn'

import 'xy-ui/components/xy-text';
import 'xy-ui/components/xy-tips';
import 'xy-ui/components/xy-tab';
import '@alenaksu/json-viewer';

import '@/components/WebElements/index'

import {ElMessage} from "element-plus";
globalThis.ElMessage = ElMessage

class ZShadow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }
  setContent(css, html) {
    // console.log(css, html)

    this.shadowRoot.innerHTML = `<style>:host {display: block; overflow: hidden;} ${css}</style>${html}`
  }
}
window.customElements.define('z-shadow', ZShadow);

// vant

import UrlPattern from 'url-pattern';
globalThis.ZUrlPattern = UrlPattern

import * as ZY from '@expose/main.js'
globalThis.ZY = ZY

import * as ZY_EXT from '@expose/ext.js'
globalThis.ZY_EXT = ZY_EXT

import request from '@/requests/index.js'
globalThis.Req = request

import * as ZformMana from '@/plugins/z-frame/formsMana'

import * as Framework from "@/mixins/framework";
globalThis.Framework = Framework

import * as ZPageHooks from "@/plugins/z-page/hooks";
globalThis.ZPageHooks = ZPageHooks

import * as ZPageBuild from "@/plugins/z-page/build";
globalThis.ZPageBuild = ZPageBuild

import * as ZFramePlugin from "@/plugins/z-frame/index";
// import * as ZDragPlugin from "@/plugins/z-dragxml/index";

import * as NodeDefMap from "@/plugins/ComEditor/nodes.js";
import * as tabNodePlugin from '@/plugins/ComEditor/tabNode.plugin'
NodeDefMap.register(tabNodePlugin)

import * as v1ArrayPlugin from '@/plugins/ComEditor/v1arrayNode.plugin'
NodeDefMap.register(v1ArrayPlugin)

import * as v1objectPlugin from '@/plugins/ComEditor/v1objectNode.plugin'
NodeDefMap.register(v1objectPlugin)

import * as modalNodePlugin from '@/plugins/ComEditor/modalNode.plugin'
NodeDefMap.register(modalNodePlugin)

import * as eleNodePlugin from '@/plugins/ComEditor/eleNode.plugin'
NodeDefMap.register(eleNodePlugin)

import router, {init_router_start} from './router'
import store from './store'

import icons from './icons/index'
import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'

import * as remote from '@/plugins/remote'
import StoreApp from "./StoreApp.vue";

// import CodeMirrorPlugin from '@/plugins/CodeMirrorEditor/index'

import CustomFormRenderPlugin from "@/plugins/form-render";
import {initStoreApp} from "@/storeApp";



// import {initMathJax} from "@/components/Ew/EwMathJax/utils";
// initMathJax()

import {initChinaAreaManangerFromUrl} from "@/plugins/chinaArea";

import EmProps from "@/components/EmProps.vue";
import EmPropsItem from "@/components/EmPropsItem.vue";
// import RenderLayout from '@/views/about/components/render-layout.vue'
// import RenderXml from "@/views/about/components/RenderXml.vue";
// import {renderForm} from "@/utils/tpllib";
// import {buildFormDep} from "@/plugins/z-page/build";
import {initCompile} from "@/hooks/compile";
function comPlugin() {
}
comPlugin.install = function (app) {
  CustomVueComponent.app = app
  CustomVueComponent.register(EmProps)
  CustomVueComponent.register(EmPropsItem)

  // CustomVueComponent.register(GridRow)
  // CustomVueComponent.register(GridColumn)

  // CustomVueComponent.register(RenderXml)
  // CustomVueComponent.register(RenderLayout)
};


;(async function () {



  await init_router_start()

  window.startApp = function () {

    globalThis.renderComForm = initCompile()

    const storeApp = Vue.createApp(StoreApp)
    const app = Vue.createApp(App)

    globalThis.getAppContext = function () {
      return app._context
    }

    app.config.compilerOptions.isCustomElement = tag => {
      return tag === 'app-loading'
    }
    app.config.devtools = true

    storeApp.use({
      install(_a) {
        _a.config.globalProperties.$mainApp = app
      }
    })

    // app.use(moduleConfig)
    app.use(remote)
    app.use(ElementPlus, {
      size: 'medium',
      locale
    })
    app.use(comPlugin)
    app.use(ZformMana)
    app.use(CustomFormRenderPlugin)
    // app.use(CodeMirrorPlugin)
    app.use(ZFramePlugin)
    // app.use(ZDragPlugin)
    app.use(eventBus)
    app.use(icons)
    app.use(router)
    app.use(store)
    // import JsonViewer from "vue3-json-viewer";

    // import * as highlightPlugin from '@/plugins/highlight'
    // import('@/plugins/highlight').then(highlightPlugin => {
    //   app.use(highlightPlugin)
    // })
    // import('vant/es/index').then(res => {
    //   // console.log(res.default)
    //   app.use(res.default)
    // })
    initStoreApp(storeApp)

    app.mount('#app')


    return app
  }

  initChinaAreaManangerFromUrl(
    ZY.REMOTE_ORIGIN + '/public/area.json'
  ).then((res) => {
    globalThis.chinaAreaManager = res
  })

  globalThis.app = window.startApp()

  ;(function () {
    setTimeout(async () => {

let def = {
  "constants": {},
  "parts": [
    {
      "type": "form",
      "name": "form_N1q3vS",
      "serviceTpl": {
        "def": {},
        "args": {
          "src": "bservice.twig"
        }
      },
      "def": {
        "type": "object",
        "ui": {
          "attrs": [
            [
              "label-width",
              "100px"
            ],
            [
              "label-position",
              "top"
            ]
          ],
          "class": [
            "sdsdsdsds"
          ],
          "styles": [
            [
              "text-align",
              "left"
            ],
            [
              "font-weight",
              "normal"
            ],
            [
              "font-family",
              "Arial,Helvetica,微软雅黑"
            ],
            [
              "color",
              null
            ],
            [
              "additive-symbols",
              ""
            ]
          ]
        },
        "properties": {
          "field__OUgaWCjyZq": {
            "type": "string",
            "ui": {
              "widget": "CusSelect",
              "label": "选择类型",
              "widgetConfig": {
                "options2": "[{label:'选项1',value:'option1'},{label:'选项2',value:'option2'}]",
                "clearable": null,
                "filterable": null,
                "multiple": null,
                "collapseTags": null
              }
            },
            "computedFun": "",
            "rules": [
              {
                "required": true,
                "message": "必填"
              }
            ],
            "server": {
              "field_name": "field__OUgaWCjyZq"
            },
            "rules_json": "[{required:true,message:'必填'}]"
          },
          "field__cov27IMEbX": {
            "type": "string",
            "ui": {
              "widget": "CusDateTimePicker",
              "widgetConfig": {
                "type": "datetime"
              },
              "label": "开始时间"
            },
            "computedFun": "",
            "defaultVal": "2021-11-17T16:00:00.000Z",
            "rules": [
              {
                "required": true,
                "message": "必填"
              }
            ],
            "server": {
              "field_name": "field__cov27IMEbX"
            },
            "rules_json": "[{required:true,message:'必填'}]"
          },
          "field__qgsoZ4pmYD": {
            "type": "string",
            "ui": {
              "widget": "CusDateTimePicker",
              "widgetConfig": {
                "type": "datetime"
              },
              "label": "结束时间"
            },
            "computedFun": "",
            "defaultVal": "2021-11-29T16:00:00.000Z",
            "rules": [
              {
                "required": true,
                "message": "必填"
              }
            ],
            "server": {
              "field_name": "field__qgsoZ4pmYD"
            },
            "rules_json": "[{required:true,message:'必填'}]"
          },
          "field__fVS_6s9Edk": {
            "type": "number",
            "ui": {
              "widget": "CusInput",
              "label": "间隔(小时)",
              "widgetConfig": {
                "type": "number"
              }
            },
            "computedFun": "时间间隔(MODEL('field__qgsoZ4pmYD'),MODEL('field__cov27IMEbX'))",
            "rules": [
              {
                "type": "number",
                "min": 1
              }
            ],
            "server": {
              "field_name": "field__fVS_6s9Edk"
            },
            "rules_json": "[{type:'number',min:1}]"
          },
          "field__V_5Y4bZ8hJ": {
            "type": "string",
            "ui": {
              "widget": "CusInput",
              "label": "请假描述",
              "widgetConfig": {
                "type": "textarea"
              }
            },
            "computedFun": "",
            "defaultVal": "请假",
            "rules": [],
            "server": {
              "field_name": "field__V_5Y4bZ8hJ"
            },
            "rules_json": "[]"
          },
          "field__NsExhpbStv": {
            "type": "string",
            "ui": {
              "widget": "CusInput",
              "label": "请假人",
              "widgetConfig": {
                "defaultVal": "实打实打算"
              }
            },
            "computedFun": "",
            "defaultVal": "十九点回家睡大觉",
            "rules": [],
            "server": {
              "field_name": "field__NsExhpbStv"
            },
            "rules_json": "[]"
          },
          "field__TKZIOSTpSm": {
            "type": "string",
            "ui": {
              "widget": "CusRadio",
              "label": "单选",
              "widgetConfig": {
                "options2": "[{label:'选项1',value:'radio1'},{label:'选项2',value:'radio2'}]"
              }
            },
            "computedFun": "",
            "defaultVal": "",
            "rules": [],
            "server": {
              "field_name": "field__TKZIOSTpSm"
            },
            "rules_json": "[]"
          },
          "field__gCKjNzeCUa": {
            "type": "number",
            "ui": {
              "label": "数值",
              "widget": "CusInputNumber",
              "widgetConfig": {
                "type": "number"
              }
            },
            "computedFun": "",
            "defaultVal": 11,
            "rules": [
              {
                "type": "any"
              }
            ],
            "server": {
              "field_name": "field__gCKjNzeCUa"
            },
            "rules_json": "[{type:'any'}]"
          },
          "field__wW7vGZKC7H": {
            "type": "string",
            "ui": {
              "widget": "CusRichText",
              "label": "",
              "hiddenLabel": true,
              "widgetConfig": {
                "html_content": "{content:[{type:'header2',children:[{text:'实打实打算'}]},{type:'paragraph',children:[{text:'撒旦撒旦实打实'}]},{type:'paragraph',children:[{text:'撒旦撒旦实打实'}]}],html:'<div class=\"w-e-content-container\">\\r\\n    <h2>实打实打算</h2>\\r\\n    <p>撒旦撒旦实打实</p>\\r\\n    <p>撒旦撒旦实打实</p>\\r\\n</div>'}",
                "css_style": ":host {\n background-color: #40CF7C;\n}\n:host(:hover)  {\n background-color: #4FED86;\n}\n.w-e-content-container {\n background-color: rgba(120, 225, 27, 1);\n}"
              }
            },
            "computedFun": "",
            "rules": [],
            "server": {
              "field_name": "field__wW7vGZKC7H"
            },
            "css": "{cached:{':host':{width:'',backgroundColor:'#40CF7C'},':host(:hover) ':{backgroundColor:'#4FED86'},':host(:active) ':{},'.w-e-content-container':{backgroundColor:'rgba(120, 225, 27, 1)',overflow:''}},css:':host {\\n background-color: #40CF7C;\\n}\\n:host(:hover)  {\\n background-color: #4FED86;\\n}\\n.w-e-content-container {\\n background-color: rgba(120, 225, 27, 1);\\n}'}",
            "hiddenLabel": true,
            "rules_json": "[]"
          }
        },
        "metas": {}
      },
      "computed": {
        "full2": "MODEL('firstName','')+MODEL('lastName','')",
        "root2": "ROOT_STATE('tools.propTypes',[])",
        "full3": "MODEL('o2.o2_p1','')  +'sds'"
      },
      "service": "ServiceHWXbVRxRBzS5kv1Ufezd1"
    }
  ],
  "process": "表单1",
  "servicePartLink": {
    "form_N1q3vS": "ServiceHWXbVRxRBzS5kv1Ufezd1"
  }
}

      let tpl = _global.renderComForm({
        CONFIG: def
      });
// console.log(tpl.trim());

    }, 1000)
  })();
})()
