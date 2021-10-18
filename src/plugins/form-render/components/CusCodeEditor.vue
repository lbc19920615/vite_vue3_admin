<style lang="scss">

.cus-code-dialog {
  .plumb-layout__tools {
    display: none;
  }
}

.cus-code-editor {
  --plumb-con-width: 300px;
  --plumb-height: 900px;
  .plumb-layout__header-desc {
    margin-bottom: 0;
  }
  .plumb-layout__item-input-key {
    width: 0;
    overflow: hidden;
  }
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
        //display: none;
      }
    }
  }
  .plumb-layout .item {
    min-height: auto;
  }
  > * {
    //background-color: transparent;
    pointer-events: none;
    > * {
      pointer-events: none;
      > * {
        pointer-events: all;
      }
    }
  }
}
</style>

<template>
  <div class="cus-code-editor">
    <template v-if="inited">
      <!--    {{widgetConfig.enums}}-->
      <el-row type="flex" >
        <el-button size="small" @click="openDialog">打开编辑</el-button>
        <!--      <el-button @click="getXML">获取xml</el-button>-->
      </el-row>
      <el-dialog
          custom-class="cus-code-dialog"
          v-model="state.dialogVisible"
          title="代码可视化编辑" width="90vw"
          :close-on-click-modal="false"
          @closed="onClosed"
          :modal="false"
      >
        <div :mode="parsedWidgetConfig.mode">
          <el-row class="a-space-mb-10">
            <el-button type="primary" @click="save">保存</el-button>
          </el-row>
          <div>
            <el-input type="textarea" v-model="computedXmlDisplay" readonly></el-input>
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
              :editor-content="editorContent"
              :handleList1="handleList1"
              :debug="true"
          >
            <template #plumb-layout-item-action-beforeend="scope">

<!--              {{scope.item}}-->
<!--              <el-tooltip :content="scope.item.key">-->
<!--                <el-input readonly style="width: 150px"-->
<!--                          v-if="scope.item.name"-->
<!--                          :value="scope.item.name "></el-input>-->
<!--                <el-input readonly style="width: 150px"-->
<!--                          v-else-if="scope.item.key"-->
<!--                          :value="scope.item.key"></el-input>-->
<!--              </el-tooltip>-->
              <div style="width: 120px">
                {{scope.item.name ? scope.item.name : scope.item.key}}
              </div>
              <el-input v-model="scope.item.cond"
                        placeholder="请填写"></el-input>
            </template>
          </ZLayoutEditor>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils";
import ZLayoutEditor from "@/plugins/z-frame/components/ZLayoutEditor.vue";
import {computed, onBeforeUnmount} from "vue";
import {clearPlumbLayoutStorage} from "@/plugins/PlumbLayout/mixin";
import EwXmlShower from "@/components/Ew/EwXmlShower.vue";
import {buildCode} from "@/plugins/z-frame/components/ZLayoutEditor/code";
import {EditorConfig} from "@/plugins/ComEditor/eleNode.plugin";
import {createEditorConfig} from "@/plugins/ComEditor/editorConfig";

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
  name: 'CusCodeEditor',
  components: {EwXmlShower, ZLayoutEditor},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let storePrefix = ZY.rid(6);

    (async function () {
      await cachedArrOperate('code-store-prefix', (arr) => {

        arr.forEach(cachedKey => {
          clearPlumbLayoutStorage(cachedKey)
        })

        return []
      })
    })();

    let locks = true
    let { data, methods, listeners, init, parsedWidgetConfig } = defineCustomRender(props, ctx, {
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


    let layoutRef = null
    function setLayoutRef(target, options) {
      layoutRef = target
    }

    function onSaveLayout(e) {
      // console.log('onSaveLayout', e)
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
      return getApp().buildXML(v)
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

    function handleList1() {
      let elementTags = [
        {
          name: 'codes',
          data: {
            tagName: '代码'
          }
        },
        {
          name: 'control',
          data: {
            tagName: '控制'
          },
          items: [
            {
              name: '如果',
              key: 'if'
            },
            {
              name: '但是',
              key: 'else'
            },
            {
              name: '默认',
              key: 'default',
            }
          ]
        },
        {
          name: 'loop',
          data: {
            tagName: '循环'
          },
          items: [
            {
              name: '循环',
              key: 'for'
            },
            {
              name: '默认',
              key: 'default',
            }
          ]
        },
      ]
      let eleTags = elementTags.map(elementTag => {
        return {
          name: elementTag.name,
          value: '',
          id: ZY.rid(),
          data: {
            // tagName: elementTag,
            ...elementTag.data
          },
          items: elementTag.items,
          lib: 'control'
        }
      })
      return eleTags
    }

    function buildCodeTemplate(data) {
      if (data) {
        let obj = ZY.JSON5.parse(data)
        let str = buildCode(obj.data)
        // console.log('buildXML', obj, str)
        return str
      }
      return ''
    }

    let editorContent = createEditorConfig({
      properties: {
        name: {
          type: 'string'
        },
        code: {
          type: 'string',
          ui: {
            widget: 'CodeJsEditor',
            widgetConfig: {}
          }
        }
      },
    }, {
      form2: {
      }
    })

    let computedXmlDisplay= computed(function () {
      return buildCodeTemplate(state.value)
    })

    return {
      state,
      getXML,
      openDialog,
      onPlumbInited,
      onEleDragChange,
      buildCodeTemplate,
      computedXmlDisplay,
      onClosed,
      onSaveLayout,
      storePrefix,
      editorContent,
      save,
      setLayoutRef,
      handleList1,
      onPlumbUpdate,
      getXMLDisplay,
      parsedWidgetConfig,
      widgetConfig: props?.ui?.widgetConfig ?? {},
      methods,
      listeners,
    }
  },
}
</script>

