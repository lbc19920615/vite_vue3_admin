<style>
.cus-form {
  /*--my-dialog-z-index: 10;*/
}
</style>

<template>
  <div class="cus-form" v-if="page.inited">
    <div hidden>{{store.model}}</div>
    <el-button v-if="useDrag"


               @click="openDialog">打开编辑</el-button>
    <CustomElement :is="useDrag ? 'my-vue-dialog' : 'div'" :name="dialogName"
                   :params="{sstyle: 'width: 80vw; min-width: 720px;'}"
    @closed="onClosed"
    >
      <template #default>
        <HttpComponent
            :defs="page.defMap"
            :is="store.model.editor_step"
            v-if="!useDrag || store.model.dialog_open"
        >
          <template #array_item_before="scope">
            <h3>{{getArrItemBeforeKey(scope)}}</h3>
          </template>
          <template #array_before="scope">
            <!--        <el-button  @click="page.callEvent('add:part', scope)">添加{{ scope.key }}</el-button>-->
          </template>
        </HttpComponent>
      </template>
    </CustomElement>
  </div>

</template>
<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import HttpComponent from "@/components/HttpComponent.vue";
import {extendControl2Page, useControl} from "@/mixins/framework";
import {getCurrentInstance, inject, nextTick, onMounted, onBeforeMount} from 'vue';
import CustomElement from "@/components/CustomElement.vue";

export default {
  name: 'CusForm',
  components: {CustomElement, HttpComponent},
  mixins: [
    CustomRenderControlMixin
  ],
  props: {
  },
  setup(props, ctx) {
    let instanse = getCurrentInstance()
    let locks = true
    let cached = null
    let { methods, init, data } = defineCustomRender(props, ctx, {
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
      ['model:update'](e) {
        let {model, key, newVal, config} = e
      },
      ['add:part'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:event', e, model)
        parts[partName].arrAppend(selfpath)
      },
      async ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        console.log('model:update:all', model)
        if (!locks) {
          let val = ZY.JSON5.stringify(model)
          page.setData({
            json: val
          })
          await nextTick();
          methods.on_change(val)
        }
      },
    })

    let setStepModel = null

    let self_config = {}

    onMounted(function () {
      page.commonLoadStep(
          import('@/plugins/CusForm/formEditorConfig.js'),
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

    return {
      dialogName,
      widgetConfig: props.ui.widgetConfig,
      page,
      openDialog,
      getArrItemBeforeKey,
      useDrag,
      onClosed,
      store: page.store
    }

  }
}
</script>
