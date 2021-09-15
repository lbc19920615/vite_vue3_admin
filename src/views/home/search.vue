<template>
<!--  <div>{{page}}</div>-->
  <div v-if="page.inited">
<!--    <div>{{store.model}}</div>-->
    <el-button @click="page.callEvent('call:save:file')">保存currentSwagger</el-button>
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
      <el-col>

        <el-tabs>
          <el-tab-pane v-for="(path, pathName) in store.model.currentSwagger.paths"
          :label="pathName"
          >
            <json-viewer :value="path" copyable boxed sort />
            <json-viewer :value="getDefintion('#/definitions/RecordsAddVO', store.model.currentSwagger)" copyable boxed sort />
            <el-button @click="">获取</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-col>
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
<script>
export default {
  name: 'Form'
}
</script>
<script setup>
import SubmitButton from "@/components/SubmitButton.vue"
import EwSelect from "@/components/Ew/EwSelect.vue"
import {getCurrentInstance, nextTick, onMounted, reactive, ref} from "vue";
import { ElMessage } from 'element-plus'
import {
  extendControl2Page,
  extendControlComputedWatch,
  useAppPageControl,
  useConstObj,
  useControl
} from "@/mixins/framework";
import * as NodeDefMap from "@/plugins/ComEditor/nodes.js";



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
async function onInited({storeControl}) {
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
  let cached = await ZY_EXT.store.getItem('currentSwagger')
  if (cached) {
    // console.log('currentSwagger', cached)
    storeControl.set({
      currentSwagger: cached
    })

    let deps = []
    let links = []
    let lodash = ZY.lodash;
    let defLevel0 = getDefintion('#/definitions/RecordsAddVO', cached)
    console.log(defLevel0)

    function deepResolve(property, parentId = '') {
      if (property.type === 'array') {
        let items = property.items
        console.log(items)
        // let id = 'i' + ZY.rid(6)
        // let dep = NodeDefMap.create('array', {
        //   id
        // })
        // deps.push(dep)
        // if (property.items.$ref){
        //   let childDef = getDefintion(property.items.$ref, cached)
        //   // console.log(property.items.$ref, childDef)
        //   deepResolve(childDef)
        // }
      }
      if (property.type === 'object') {
        let id = 'i' + ZY.rid(6)
        let items = []
        lodash.each(property.properties, function (prop, propKey) {
          if (prop.type === 'array') {
            deepResolve(prop)
          } else if (prop.type === 'object') {
          //
          } else {
            // console.log(propKey,  prop)
            let item = NodeDefMap.createItem(id, propKey)
            items.push(item)
          }
        })

        let dep = NodeDefMap.create('object', {
          id,
          items
        })
        // console.log(dep)
        deps.push(dep)
      }
    }

    lodash.each(defLevel0.properties, function (property, propertyKey) {
      // console.log(property, propertyKey)
      deepResolve(property)
    })


  }


  // console.log(s)
  // console.log('sdsdsds', storeControl.store)
}
let page = useControl({properties, computed}, {
  onInited,
  servicePrefix: 'PageFormIndexService'
})
extendControl2Page(page)
let store = page.store

let computedChange = {
  async ['selectedOption'](newVal) {
    if (newVal) {
      page.setByPath('files', [])
      await nextTick()
      let jsonOrigin = `${page.val('swaggerOrigin')}${newVal.value}`
      let [err,res] = await ZY.awaitTo(
          globalThis.Req.get(jsonOrigin)
      )
      if (err) {
        return
      }
      if (res.data) {
        page.setByPath('currentSwagger', res.data)

        ZY_EXT.store.setItem('currentSwagger', res.data)

        console.log(res.data)
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
}

extendControlComputedWatch(page, computedChange)
useAppPageControl(page)

page.setEventHandler({
  async ['call:save:file'](e) {


    ZY_EXT.saveDesignFile({fileName: 'currentSwagger', data: page.store.model.currentSwagger})
  },
})

async function onSubmit() {
  let {data: responseData1} = await ZY.U.awaitAxios(
      globalThis.Req.get(`${page.val('swaggerOrigin')}/swagger-resources`)
  )
  let optionsM = ZY.U.objArr2OptionsManager(responseData1, 'name', 'location')
  // console.log(optionsM)
  page.setByPath('options', optionsM.options)
}

function getDefintion(path = '', defObj = {}) {
  let pathArr = path.split('/').slice(1)
  let objPath = pathArr.join('.')
  // console.log(ZY.lodash.get(defObj, objPath))
  return ZY.lodash.get(defObj, objPath)
}
</script>
