<template>
  <div v-if="page.inited">
    <h1>uniapp表单生成</h1>
    <el-row>
      <el-button @click="page.callEvent('call:save')">保存</el-button>
      <el-button @click="page.callEvent('call:save:file')">保存成文件</el-button>
    </el-row>
    <FormManager :getConfig="getConfig" :ref="formRef">
      <template #array_item_after="scope">
        <el-button size="small"
                   @click="page.callEvent(`save:form:file`, scope)"
        >保存</el-button>
        <el-button size="small"
                   @click="page.callEvent(`load:single:file`, scope)">
          导入{{ scope.key }}</el-button>
      </template>
    </FormManager>
  </div>
</template>
<script>
import '@/plugins/form-render/ext.js';
import "@/register";
import FormManager from "@/views/about/components/FormManager.vue";
import {extendControl2Page, useAppPageControl, useControl} from "@/mixins/framework";
import {toRaw} from "vue";
import {FormsMana} from "@/plugins/z-frame/formsMana";
export default {
  components: {FormManager},
  setup() {
    function onInited({storeControl}) {
      // console.log('page inited')
    }
    let properties =  {
      openDialog: {
        type: Boolean
      }
    }
    let computedProps = {
    }
    let page = useControl({properties, computed: computedProps}, {
      onInited,
      extendContext: {
      },
      servicePrefix: 'PageFormUniappService'
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)


    let formRef = page.setRef('formRef')

    page.setEventHandler({
      async ['call:save'](e) {
        await page.runRefMethod('formRef', 'save')
      },
      async ['call:save:file'](e) {
        let obj = {}
        obj = await page.runRefMethod('formRef', 'getModel')
        console.log('getModel', obj)

        ZY_EXT.saveDesignFile({fileName: obj.name, data: obj})
      },
      ['save:form:file'](e) {
        let {parts, partName, selfpath} = e
        let model = parts[partName].getModel()
        let obj = toRaw(
            model
        )
        let currentFormData = ZY.lodash.get(obj, selfpath)
        console.log('save:form:file', obj, currentFormData)
      },
      async ['load:single:file'](e) {
        let {parts, partName, selfpath} = e
        try {
          let data = await FormsMana.readFile()
          let appendData = data[0].value
          let updatedPath = `${selfpath}.value`
          parts[partName].setModelByPath(updatedPath, appendData)
        } catch (e) {
          //
        }
      }
    })

    function getConfig() {
      return import('./FormManagerEditorConfig')
    }

    return {
      formRef,
      getConfig,
      store: page.store,
      page,
    }
  }
}
</script>
