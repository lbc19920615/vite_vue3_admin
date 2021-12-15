<style>
.cus-form {
  /*--my-dialog-z-index: 10;*/
}
</style>

<template>
  <div class="cus-form" v-if="page.inited">
    <div hidden>{{store.model}}</div>
<!--    <el-button v-if="useDrag"-->

<!--              size="small"-->
<!--               @click="openDialog">打开编辑</el-button>-->
<!--    <CustomElement :is="useDrag ? 'my-vue-dialog' : 'div'" :name="dialogName"-->
<!--                   :params="{sstyle: 'width: 80vw; min-width: 720px;', modal: false}"-->
<!--    @closed="onClosed"-->
<!--    >-->
<!--      <template #default>-->
<!--        <HttpComponent-->
<!--            :defs="page.defMap"-->
<!--            :is="store.model.editor_step"-->
<!--            v-if="!useDrag || store.model.dialog_open"-->
<!--        >-->
<!--          <template #array_con_afterbegin="scope">-->
<!--&lt;!&ndash;            <h3>{{getArrItemBeforeKey(scope)}}</h3>&ndash;&gt;-->
<!--          </template>-->
<!--          <template #array_afterbegin="scope">-->
<!--            &lt;!&ndash;        <el-button  @click="page.callEvent('add:part', scope)">添加{{ scope.key }}</el-button>&ndash;&gt;-->
<!--          </template>-->
<!--        </HttpComponent>-->
<!--      </template>-->
<!--    </CustomElement>-->

    <HttpComponent
        :defs="page.defMap"
        :is="store.model.editor_step"
    >
      <template #array_con_afterbegin="scope">
<!--                    <h3>{{getArrItemBeforeKey(scope)}}</h3>-->
      </template>
      <template #array_afterbegin="scope">
        <template v-if="showAddBtn(scope)">
          <el-button size="small"
              @click="page.callEvent('add:part', scope)">添加{{ scope.key }}</el-button>
        </template>
      </template>
    </HttpComponent>
  </div>

</template>
<script>

import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index.js";
import HttpComponent from "@/components/HttpComponent.vue";
import {extendControl2Page, useControl} from "@/mixins/framework";
import { nextTick, onMounted, provide} from 'vue';
// import CustomElement from "@/components/CustomElement.vue";
// import {urlResolve} from "@/plugins/z-frame/urlResolve";

export default {
  name: 'CusForm',
  components: {HttpComponent},
  mixins: [
    CustomRenderControlMixin
  ],
  props: {
    configUrl: {
      type: String,
      default: '/formEditorConfig.js'
    }
  },
  setup(props, ctx) {
    // let instanse = getCurrentInstance()

    import("vue3-json-viewer").then(res => {
      // app.use(res.default)
      // console.log(res)
      let JsonViewer = res.JsonViewer
      CustomVueComponent.app.component('v-json-viewer',JsonViewer );
      import('@/plugins/form-render/ext2').then(res  => {
        res.registerExt2();
      })
    })

    let locks = true
    let cached = null
    let cachedModel = null
    let { methods, init, data, widgetConfig2, curFormCon } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        // console.log('handleValueInit', newVal, typeof newVal)
        if (typeof newVal !== 'undefined') {
          try {
            cached = ZY.JSON5.parse(newVal)
            // console.log('cached', cached)
          } catch (e) {
            console.error(new Error('json parse err', {
              cause: e
            }))
          }
        }
        return newVal
        // page.setPartModel('form-editor', 'form2', obj)
      }
    })
    data({
    })
    let properties =  {
      editor_step: {
        type: String,
      },
      json: {
        type: String,
      },
      dialog_open: {
        type: Boolean
      },
      loaded: {
        type: Boolean
      },
      dialogVisible: {
        type: Boolean
      }
    }
    let dialogName = 'cus_form_dialog_' + ZY.rid(6)
    let computed = {}
    function onInited({storeControl}) {
    }
    let page = useControl({properties, computed}, {
      onInited,
      extendContext: {
      }
    })
    page = extendControl2Page(page)


    page.setEventHandler({
      // ['model:update'](e) {
      //   let {model, key, newVal, config} = e
      // },
      ['add:part'](e) {
        let { parts, partName, pathArr, process } = e
        // console.log('add:events', e, model)
        let s_path = ZY.getObjPathFromPathArr(pathArr)
        parts[partName].arrAppend(s_path)
      },
      async ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        cachedModel = model
        if (!locks) {
          let val = ZY.JSON5.stringify(model)
          // console.log('cus:form model:update:all', model, val)
          page.setData({
            json: val
          })
          await nextTick();
          methods.on_change(val)
        }
      },
    })

    page.onOtherEventHandler = function (type, e) {
      // console.log('sdsdsdsdsds',)
      curFormCon.callPageEvent('cursform:event', {
        type,
        e
      })
    }


    provide('CusFormExpose', {
      getModel() {
        return cachedModel
      },
      getPartModel(){
        return cachedModel?.parts[0]
      }
    })

    let setStepModel = null

    let self_config = {}

    onMounted(function () {
      // console.log(widgetConfig2.configUrl)
      let _configUrl = props.configUrl
      if (widgetConfig2.configUrl) {
        _configUrl = widgetConfig2.configUrl
      }
      // let s = urlResolve(import.meta.url, './ass.js')
      // console.log(s);

      page.commonLoadStep(
          /* @vite-ignore */
          globalThis.importScripts(_configUrl),
          'editor_step',
          {
            async onMounted(config, {setPartModel}) {
              self_config = config

              init(props)
              setStepModel = function () {
                if (cached) {
                  setPartModel(config.name, 'form2', cached)
                }
              }
              if (locks) {

                locks = false
                setStepModel()
              }

              // page.setByPath('loaded', true)
              // console.log('sdsdsdsdsdsds')
            }
          }
      )
    })

    function openDialog() {
      let currentPageWebComponentRef =  globalThis.getCurrentPage('page.webComponentRef')
      if (currentPageWebComponentRef && currentPageWebComponentRef.toggleDialog) {
        currentPageWebComponentRef.toggleDialog(dialogName);
      }
      console.log('formEditorConfig', cached)

      if (!locks) {
        setStepModel()
      }
      page.setByPath('dialog_open', true)
    }

    function onClosed() {
      console.log('onClosed')
    }

    let useDrag = true
    if ( props.ui.widgetConfig.hasOwnProperty('useDrag')) {
      useDrag = props.ui.widgetConfig.useDrag
    }

    // let CurCmField = inject('CurCmField')

    //context.get_SELF_CONFIG('properties.parts.ui.label')
    function getArrItemBeforeKey(scope) {
      // let fieldContext = globalThis.cmFieldContext.get(props.field_uuid)
      // console.log(scope, self_config)

      let c = {
        config: self_config.init.def
      }

      let partCONFIG =  ZY.lodash.get(c, scope.configPath)

      // console.log(partCONFIG)

      let label = ZY.getStrFromObj(partCONFIG, 'ui.label', scope.key)

      return label
    }

    function showAddBtn(scope) {
      // console.log(scope)
      let {parts, partName, configPath} = scope
      // console.log(scope)
      // let partPath = configPath.replace('config.parts[0].def.', '')
      let def = parts[partName].getPartConfig(configPath);
      // console.log(parts[partName].rowDef, def)
      return def?.ui?.showAddBtn
    }

    return {
      dialogName,
      widgetConfig: widgetConfig2,
      page,
      showAddBtn,
      openDialog,
      getArrItemBeforeKey,
      useDrag,
      onClosed,
      store: page.store
    }

  }
}
</script>
