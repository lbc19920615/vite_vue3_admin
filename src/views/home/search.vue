<template>
<!--  <div>{{page}}</div>-->
  <div v-if="page.inited">
<!--    <div>{{store.model}}</div>-->
    <div>{{store.computedModel}}</div>

    <el-row type="flex" align="middle">
      <el-input style="width: 600px" v-model="store.model.swaggerOrigin" placeholder="placeholder"></el-input>
      <submit-button @submit="onSubmit">开始分析</submit-button>
    </el-row>

<!--    {{page.dxValue('ZY_ARRAY_NOT_EMPTY(MODEL("options"))')}}-->

    <div v-if="page.val('options') && page.dxValue('ZY_ARRAY_NOT_EMPTY(MODEL(\'options\'))')">
      <h3>服务</h3>
      <EwSelect v-model="store.model.selectedValue" :options="store.model.options"></EwSelect>
    </div>

    <el-row type="flex" align="start" v-if="page.val('currentSwagger')">
      <el-col :span="12">
        <h3>JSON</h3>
        <json-viewer :value="store.model.currentSwagger" copyable boxed sort />
<!--        <textarea style="width: 100%; height: 30vh" v-model="store.model.currentSwagger"></textarea>-->
      </el-col>

      <el-col :span="12">
        <h3>JS文件</h3>
        <div v-for="file in store.model.files">
          <a class="el-link" :href="file" target="_blank" download>{{file}}</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import SubmitButton from "@/components/SubmitButton.vue"
import EwSelect from "@/components/Ew/EwSelect.vue"
import {getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";
import { ElMessage } from 'element-plus'
import {extendControl2Page, extendControlComputedWatch, useConstObj, useControl} from "@/mixins/framework";

let SEVER_ORIGIN = `http://192.168.1.67:7001/`

let constObj = useConstObj()

let properties = {
  haha: {
    type: String
  },
  swaggerOrigin: {
    type: String
  },
  options: constObj.FINAL_PROP_DEFS.options(),
  selectedValue: {
    type: String,
  },
  currentSwagger: {
    type: null,
  },
  files: {
    type: Array,
  }
}
let computed = {
  selectedOption: `find(MODEL('options', []), ['value', MODEL('selectedValue', '')])`
}
function onInited({storeControl}) {
  storeControl.set({
    haha: 111,
    swaggerOrigin: 'http://192.168.1.60:7888',
    selectedValue: '',
    files: [],
  })
  let s = ZY.formModel.createFormModel({
    type: 'object',
    properties
  })
  console.log(s)
  // console.log('sdsdsds', storeControl.store)
}
let page = useControl({properties, computed}, {
  onInited
})
extendControl2Page(page)
let store = page.store

let computedChange = {
  async ['selectedOption'](newVal) {
    if (newVal) {
      page.setByPath('files', [])
      await nextTick()
      let jsonOrigin = `${page.val('swaggerOrigin')}${newVal.value}`
      let [,{data: data1}] = await ZY.awaitTo(
          globalThis.Req.get(jsonOrigin)
      )
      page.setByPath('currentSwagger', data1)

      // console.log(JSON.stringify(data, null, 2))
      // http://192.168.1.67:7001/?url=http://192.168.1.60:7888/api-system/v2/api-docs&folder=folder3
      let folder = 'folder-' + newVal.label
      let [err,{data: data2}] = await ZY.awaitTo(
        globalThis.Req.get(`${SEVER_ORIGIN}?url=${jsonOrigin}&folder=${folder}`)
      )

      if (err) {
        ElMessage.error(err.message ?? '')
        return;
      }
      page.setByPath('files', data2.files)
    }
  }
}

extendControlComputedWatch(page, computedChange)

async function onSubmit() {
  let {data: responseData1} = await ZY.U.awaitAxios(
      globalThis.Req.get(`${page.val('swaggerOrigin')}/swagger-resources`)
  )
  let optionsM = ZY.U.objArr2OptionsManager(responseData1, 'name', 'location')
  // console.log(optionsM)
  page.setByPath('options', optionsM.options)
}
</script>
