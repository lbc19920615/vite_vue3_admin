<style>
/*.plumb-layout__tools {*/
/*  display: none;*/
/*}*/
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
      <div>
        <el-row class="a-space-mb-10">
          <el-button type="primary" @click="save">保存</el-button>
        </el-row>
        <ZLayoutEditor
            :ref="setLayoutRef"
            :controls="false"
            @ele-drag-change="onEleDragChange"
            :store-prefix="storePrefix"
            :auto-load="false"
            @plumb-inited="onPlumbInited"
            @save-layout="onSaveLayout"
        ></ZLayoutEditor>
      </div>
    </el-dialog>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import ZLayoutEditor from "@/plugins/z-frame/components/ZLayoutEditor.vue";
import {onBeforeUnmount} from "vue";
import {clearPlumbLayoutStorage} from "@/plugins/PlumbLayout/mixin";

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
      // let cachedKeys = await ZY_EXT.store.getItem('layout-store-prefix')
      // if (!Array.isArray(cachedKeys)) {
      //   cachedKeys = []
      // }
      //
      //
      // cachedKeys.forEach(cachedKey => {
      //   clearPlumbLayoutStorage(cachedKey)
      // })
      //
      //
      // await ZY_EXT.store.setItem('layout-store-prefix', [])

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
      dialogVisible: false
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
      methods.on_change(JSON5.stringify(v))
    }

    async function onClosed() {
      await save();
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
      save,
      setLayoutRef,
      widgetConfig: props.ui.widgetConfig,
      methods,
      listeners,
    }
  },
}
</script>

