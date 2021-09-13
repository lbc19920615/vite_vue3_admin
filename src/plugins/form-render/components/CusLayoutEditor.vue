<style>
.plumb-layout__tools {
  display: none;
}
</style>

<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    <el-row type="flex">
      <el-button size="small" @click="openDialog">打开编辑</el-button>
<!--      <el-button @click="getXML">获取xml</el-button>-->
    </el-row>
    <el-dialog
        v-model="state.dialogVisible"
        title="DOM编辑" width="80vw"
        :close-on-click-modal="false"
        @closed="onClosed"
    >
      <ZLayoutEditor
          :ref="setLayoutRef"
          :controls="false"
          @ele-drag-change="onEleDragChange"
          :store-prefix="storePrefix"
          :auto-load="false"
          @plumb-inited="onPlumbInited"
          @save-layout="onSaveLayout"
      ></ZLayoutEditor>
    </el-dialog>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import ZLayoutEditor from "@/plugins/z-frame/components/ZLayoutEditor.vue";
import {onBeforeUnmount} from "vue";
import {clearPlumbLayoutStorage} from "@/plugins/PlumbLayout/mixin";

export default {
  name: 'CusLayoutEditor',
  components: {ZLayoutEditor},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let storePrefix = ZY.rid(6);

    (async function () {
      let cachedKeys = await ZY_EXT.store.getItem('layout-store-prefix')
      if (cachedKeys) {
        clearPlumbLayoutStorage(cachedKeys)
      }

      await ZY_EXT.store.setItem('layout-store-prefix', '')
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
        openDialog()
        return newVal
      }
    })
    let state = data({
      dialogVisible: false
    })
    init(props)

    async function openDialog() {
      state.dialogVisible =true

      await ZY_EXT.store.setItem('layout-store-prefix', storePrefix)
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
    }

    function getXML() {
      let v = layoutRef.getXML()
      // console.log('getXML', v)
    }

    function onEleDragChange() {
      // console.log('onEleDragChange')
    }


    async function onClosed() {
      let v = layoutRef.getToolsData()
      // console.log('getToolsData', v)
      await layoutRef.saveCache2Storage(v)
      methods.on_change(JSON5.stringify(v))
    }



    onBeforeUnmount(() => {
      if (layoutRef) {

        layoutRef.clearLayoutStorage()
      }
    })

    return {
      state,
      getXML,
      openDialog,
      onPlumbInited,
      onEleDragChange,
      onClosed,
      onSaveLayout,
      storePrefix,
      setLayoutRef,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

