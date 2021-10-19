<style lang="scss">
[mode='xml'] {
  .plumb-layout__tools {
    display: none;
  }
}
.cus-layout-editor {
  .plumb-layout__item-action {
    display: flex;
    align-items: center;
    //> *:first-child {
    //  width: 150px;
    //}
  }
  .plumb-layout .header {
    > * {
      display: flex;
      > *:first-child {

        //height: 0;
        > *:first-child {

          display: none;
        }
      }
    }
  }
}
</style>

<template>
  <div class="g-pointer-events-none-modal cus-layout-editor">
    <template v-if="inited">
      <!--    {{widgetConfig.enums}}-->
      <el-row type="flex" align="top" >
        <el-button size="small" @click="openDialog">打开编辑</el-button>
<!--        <z-easy-modal title="jsx" @opened="onDisplayOpened">-->
<!--          <CodeMirror-->
<!--              :ref="setEditorRef"-->
<!--              theme="vscode-dark"-->
<!--          />-->
<!--        </z-easy-modal>-->
        <!--      <el-button @click="getXML">获取xml</el-button>-->

        <el-popover
            v-model:visible="state.previewVisible"
            placement="bottom"
            title=""
            :width="600"
            trigger="click"
        >
          <template #reference>
            <el-button size="small" @click="toggleVisible">JSX预览</el-button>
          </template>

          <EwXmlShower :value="getXMLDisplay(state.value)"></EwXmlShower>
        </el-popover>
      </el-row>
      <el-dialog
          v-model="state.dialogVisible"
          title="JSX编辑" width="80vw"
          :close-on-click-modal="false"
          @closed="onClosed"

          :lock-scroll="false"
      >
        <div :mode="widgetConfig.mode">
          <el-row class="a-space-mb-10">
            <el-button type="primary" @click="save">保存</el-button>
          </el-row>
          <div>
            <!--          {{state.value}}-->
            <EwXmlShower :value="getXMLDisplay(state.value)"></EwXmlShower>
            <!--          <el-input type="textarea" readonly-->
            <!--                    :value="getXMLDisplay(state.value)"></el-input>-->
          </div>
          <ZLayoutEditor
              :ref="setLayoutRef"
              :controls="false"
              @ele-drag-change="onEleDragChange"
              :store-prefix="storePrefix"
              :auto-load="false"
              @plumb-inited="onPlumbInited"
              @mode:update:all="onPlumbUpdate"
              @save-layout="onSaveLayout"
              drawer-width="750px"
              :editor-content="editorContent"
              :debug="false"
          ></ZLayoutEditor>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import jsBeautify from 'js-beautify'
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";
import ZLayoutEditor from "@/plugins/z-frame/components/ZLayoutEditor.vue";
import {onBeforeUnmount} from "vue";
import {clearPlumbLayoutStorage} from "@/plugins/PlumbLayout/mixin";
import EwXmlShower from "@/components/Ew/EwXmlShower.vue";
import {createEditorConfig} from "@/plugins/ComEditor/editorConfig";
import ZEasyModal from "@/plugins/z-frame/ZEasyModal.vue";


async function cachedArrOperate(key = '', fun = () => {} ) {
  let cachedKeys = await ZY_EXT.store.getItem(key)
  if (!Array.isArray(cachedKeys)) {
    cachedKeys = []
  }
  // cachedKeys.push(v)
  cachedKeys = await fun(cachedKeys);
  await ZY_EXT.store.setItem(key, cachedKeys)
}

export default {
  name: 'CusJsxEditor',
  components: {ZEasyModal, EwXmlShower, ZLayoutEditor},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let storePrefix = ZY.rid(6);

    (async function () {
      await cachedArrOperate('layout-store-prefix', (arr) => {

        arr.forEach(cachedKey => {
          clearPlumbLayoutStorage(cachedKey)
        })

        return []
      })
    })();

    let locks = true
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        if (!newVal) {
          newVal = '{data: {links: [], deps: []}, posMap: {}}'
        }
        if (newVal) {
          obj = JSON5.parse(newVal)
        }
        // openDialog()
        return newVal
      }
    })
    let state = data({
      dialogVisible: false,
      previewVisible: false
    })
    init(props)

    async function openDialog() {
      state.dialogVisible =true

      await cachedArrOperate('layout-store-prefix', (arr) => {
        return arr.concat([storePrefix])
      })
    }


    async function onPlumbInited({context}) {
      // console.log('handleValueInit', part_key, obj, context)
      await context.importToolsData(obj)
      await ZY.sleep(300)
      await context.saveCache2Storage(obj)

    }

    let editorRef = null
    function setEditorRef(target, options) {
      editorRef = target
    }

    let layoutRef = null
    function setLayoutRef(target, options) {
      layoutRef = target
    }

    function onSaveLayout(e) {
      console.log('onSaveLayout', e)
    }

    function getXML() {
      let v = layoutRef.getXML()
      // console.log('getXML', v)
    }

    function onEleDragChange() {
      // console.log('onEleDragChange')
    }

    async function save() {
      let v = layoutRef.getToolsData()
      // console.log('getToolsData', v)
      await layoutRef.saveCache2Storage(v)
      let ret = JSON5.stringify(v)

      methods.on_change(ret)
    }

    async function onClosed() {
      await save();
    }

    function getXMLDisplay(v) {
      return jsBeautify.js(getApp().buildJSX(v))
    }

    function onPlumbUpdate(e) {
      // let { model, key, newVal, config } = e
      let v = layoutRef.getToolsData()
      let ret = JSON5.stringify(v)
      // console.log(ret)
      state.value = ret
    }

    onBeforeUnmount(() => {
      if (layoutRef) {

        layoutRef.clearLayoutStorage()
      }
    })

    let editorContent = createEditorConfig({
      properties: {
        // name: {
        //   type: 'string'
        // },
        tagName: {
          type: 'string',
          ui: {
            label: '标签名'
          },
        },
        editText: {
          type: 'string',
          ui: {
            label: '文字',
            widgetConfig: {
              type: 'textarea'
            }
          },
          computedProp: 'text'
        },
        ui2: {
          type: 'string',
          ui: {
            label: '样式配置',
            widget: 'CusStyle'
          }
        },
        styles: {
          type: 'string',
          computedProp: 'ui2_styles',
          ui: {
            styles: [
              ['height', 0],
              ['overflow', 'hidden'],
            ],
            widgetConfig: {
              type: 'textarea',
              disabled: true
              // style: {height: '200px'}
            }
          },
          rules: {
            type: 'any'
          }
        },
        attrs: {
          type: 'array',
          ui: {
            label: '属性'
          },
          "items": {
            "type": "object",
            "properties": {
              name: {
                type: 'string',
                ui: {
                  widget: 'CusSuggest',
                  widgetConfig: {
                    placement: 'top'
                  }
                },
              },
              value: {
                type: 'string',
                ui: {
                },
              },
            }
          }
        },
        textContent: {
          type: 'string',
          // hidden: true,
          ui: {
            attrs: [
              // ['style', 'height: 0; overflow: hidden']
            ],
            label: 'text',
            widgetConfig: {
              type: 'textarea',
              rows: 1,
              disabled: true,
            }
          },
          computedProp: 'computedEditText'
        },
      },
      computed: {
        ui2_styles: `A.get_ui2_styles(MODEL('ui2'))`,
        computedEditText: "MODEL('editText', '')",
      }
    }, {
      form2: {
      }
    })

    function toggleVisible() {
      // state.previewVisible = !state.previewVisible
      if (state.previewVisible) {
        state.previewVisible = false
      } else {
        state.previewVisible = true
        setTimeout(() => {
          editorRef.setModel(getXMLDisplay(state.value))
        }, 150)
      }
    }

    function onDisplayOpened() {
      setTimeout(() => {
        editorRef.setModel(getXMLDisplay(state.value))
      }, 150)
    }

    return {
      state,
      getXML,
      openDialog,
      onPlumbInited,
      onEleDragChange,
      onClosed,
      onSaveLayout,
      storePrefix,
      save,
      setLayoutRef,
      onDisplayOpened,
      setEditorRef,
      editorContent,
      toggleVisible,
      onPlumbUpdate,
      getXMLDisplay,
      widgetConfig: props?.ui?.widgetConfig ?? {},
      methods,
      listeners,
    }
  },
}
</script>

