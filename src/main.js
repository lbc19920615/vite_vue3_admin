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
  static app = null
  static component(name, ctx) {
    this.app.component(name, ctx)
    this.defMap.set(name, ctx)
  }
  static register(ctx, name = ctx.name) {
    this.component(name, ctx)
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
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/src/index.scss';
import locale from 'element-plus/lib/locale/lang/zh-cn'

import '@/components/WebElements/index'

// vant

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

import router from './router'
import store from './store'

import icons from './icons/index'
import '@/styles/index.scss' // global css
import '@/styles/app.scss'

import eventBus from 'vue3-eventbus'

import * as remote from '@/plugins/remote'
import StoreApp from "./StoreApp.vue";

import CodeMirrorPlugin from '@/plugins/CodeMirrorEditor/index'

import CustomFormRenderPlugin from "@/plugins/form-render";
import {initStoreApp} from "@/storeApp";


window.startApp = function () {

  const storeApp = Vue.createApp(StoreApp)
  const app = Vue.createApp(App)

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
  app.use(ZformMana)
  app.use(CustomFormRenderPlugin)
  app.use(CodeMirrorPlugin)
  app.use(ZFramePlugin)
  app.use(eventBus)
  app.use(icons)
  app.use(router)
  app.use(store)
  // import JsonViewer from "vue3-json-viewer";
  import("vue3-json-viewer").then(res => {
    app.use(res.default)
  })
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


  let option = {
    "def": {
      "constants": {},
      "parts": [
        {
          "type": "form2",
          "name": "form2",
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
                  "150px"
                ]
              ]
            },
            "properties": {
              "name": {
                "type": "string",
                "ui": {
                  "attrs": [
                    [
                      "scroll-control",
                      "page_name"
                    ]
                  ],
                  "class": [
                    "a-space-pt-20"
                  ],
                  "widget": "van-field",
                  "widgetConfig": {
                    "enums": "ROOT_STATE('tools.constVars_pageNames', [])"
                  }
                }
              },
              "name1": {
                "type": "string",
                "computedProp": "layoutSlotArrComputed"
              },
              "layoutSlotArr": {
                "type": "array",
                "ui": {
                  "label": "Slot",
                  "attrs": [
                    [
                      "scroll-control",
                      "page_slotArr"
                    ]
                  ],
                  "conAttrs": [
                    {
                      "prefixValue": "\"slot\"+",
                      "handler": [
                        "c",
                        "return [\":name\", c.indexKey]"
                      ]
                    }
                  ],
                  "conClass": [
                    "a-space-mb-20"
                  ]
                },
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string",
                      "ui": {
                        "widget": "van-field",
                        "widgetConfig": {
                          "suggest": [
                            {
                              "label": "Form After",
                              "value": "form_after"
                            }
                          ]
                        }
                      }
                    },
                    "prop1": {
                      "type": "string",
                      "reflect": 'name',
                      "reflectTpl": '$VAL'
                    },
                  }
                }
              },

            }
          },
          "computed": {
            // "pagePropertiesComp": "A.getBeforeScript(MODEL('props'))",
            // "doubled": "MODEL('name', '')",
            "layoutSlotArrComputed": "A.slotArrToStr(MODEL('name'))",
            // "processes": "map(MODEL('events', []), v => v.name)"
          },
          "service": "ServiceJ5CnFHgdga57QhYD1s3a2"
        }
      ],
      "process": "o582V2U4si5QEqzewnyVA",
      "servicePartLink": {
        "form2": "ServiceJ5CnFHgdga57QhYD1s3a2"
      }
    },
    "args": {
      "src": "comformscr2.twig"
    }
  }
  let data = new FormData()
  data.append('source', JSON.stringify(option.def))
  ZY.fetchContentV3(data, option.args)

  return app
}

globalThis.app = window.startApp()
