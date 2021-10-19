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

      <el-col>
        <template v-if="page.val('currentDeepProp')">
          <FormManager :getConfig="getConfig" :ref="setFormRef"
          @com-ready="onComReady"
          >
            <template v-slot:form_before="scope">
              <el-space align="middle">
                <el-button size="small"
                         @click="page.callEvent('save:form:file', scope)">保存表单</el-button>
              </el-space>
            </template>

          </FormManager>
        </template>
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
import '@/plugins/form-render/ext.js';
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
import FormManager from "@/views/about/components/FormManager.vue";
import {buildDeepConfigData, buildDepItemConfig} from "@/views/about/components/DeepPropEditor/utils";
import {FormsMana} from "@/plugins/z-frame/formsMana";


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
  currentDeepProp: {
    type: null
  },
  files: {
    type: Array,
  }
}
let computed = {
  selectedOption: `find(MODEL('options', []), ['value', MODEL('selectedValue', '')])`
}


function resolveCurrentSwaggerModel(cached = {}) {
  let deps = []
  let links = []
  let lodash = ZY.lodash;
  let defLevel0 = getDefintion('#/definitions/RecordsAddVO', cached)
  // console.log(defLevel0)

  function createDepId() {
    return 'i' + ZY.rid(6)
  }

  function insertArrayItemToChildDepLink(fromPID, toPID) {
    let link = {
      fromPID,
      from: fromPID + '-0',
      toPID,
      to: toPID + '-top'
    }
    links.push(link)
  }

  function insertObjectItemToChildDepLink(fromPID, from, toPID) {
    let link = {
      fromPID,
      from,
      toPID,
      to: toPID + '-top'
    }
    links.push(link)
  }

  function useDepID(v) {
    if (v) {
      return v
    }
    return createDepId()
  }

  function deepResolve(property, parentId = '') {
    if (property.type === 'array') {
      let items = property.items
      // console.log(items)
      let id =  useDepID(parentId)
      let dep = NodeDefMap.create('array', {
        id
      })
      deps.push(dep)
      if (items.$ref){
        let childDef = getDefintion(items.$ref, cached)
        // console.log(property.items.$ref, childDef)
        let toPID = createDepId()
        insertArrayItemToChildDepLink(id, toPID)
        deepResolve(childDef, toPID)
      }
    }
    else if (property.type === 'object') {
      // let id = createDepId()
      console.log('property (๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤ ', property)
      let id = useDepID(parentId)
      let items = []
      lodash.each(property.properties, function (prop, propKey) {

        let item = NodeDefMap.createItem(id, propKey)


        // console.log(item)
        if (prop.type === 'array') {

          let toPID = createDepId()
          insertObjectItemToChildDepLink(id, item.id, toPID)
          deepResolve(prop, toPID)
        }
        else if (prop.type === 'object') {
          //
          console.log('这是一个（づ￣3￣）づ╭❤～', prop)
        }
        else if (prop.$ref) {
          let toPID = createDepId()
          insertObjectItemToChildDepLink(id, item.id, toPID)
          deepResolve(prop, toPID)
        }
        else {
          // console.log(propKey,  prop)
          let objData = buildDeepConfigData({
            type: prop.type,
            ...buildDepItemConfig(prop, prop.type, propKey)
          })
          item.data = ZY.JSON5.stringify(objData)

        }
        items.push(item)
      })

      let dep = NodeDefMap.create('object', {
        id,
        items
      })
      // console.log(dep)
      deps.push(dep)
    }
    else if (property.$ref) {
      let id = useDepID(parentId)
      let childDef = getDefintion(property.$ref, cached)
      // console.log(property, childDef, id)
      deepResolve(childDef, id)
    }
  }


  let rootId = createDepId()
  // Reflect.deleteProperty(defLevel0.properties, 'records')
  // console.log(defLevel0)
  deepResolve(defLevel0, rootId)


  let levelCount = new Map()

  function deepSetLevel(fromPIDS = [], level) {
    if (!levelCount.has(level)) {
      levelCount.set(level, 0)
    }
    let filterDeps = deps.filter(v => fromPIDS.includes(v.id))
    if (filterDeps.length>0) {
      let fromCountLength = levelCount.get(level)
      filterDeps.forEach((filterDep, index) => {
        let nextFromPIDS = []
        filterDep.A_LEVEL = level
        filterDep.A_LEVEL_INDEX = level + '_' + index
        let items = filterDep.items
        items.forEach(item => {
          let id = item.id
          let link = links.find(link => link.from === id)
          if (link) {
            nextFromPIDS.push(link.toPID)
          }
          if (nextFromPIDS.length > 0) {
            deepSetLevel(nextFromPIDS, level + 1)
          }
        })
      })

      fromCountLength = fromCountLength + filterDeps.length
      levelCount.set(level, fromCountLength)
      // console.log(fromPIDS, level)
    }
  }

  deepSetLevel([rootId], 0)

  console.log(links, deps, rootId)
  page.setByPath('currentDeepProp', {
    links,
    deps,
    rootId
  })
}

async function onInited({storeControl}) {
  storeControl.set({
    haha: 111,
    swaggerOrigin: 'http://192.168.1.125:7888',
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


    resolveCurrentSwaggerModel(cached)
  }
}

function onComReady() {
  let JSON5 = ZY.JSON5
  let formManager = page.getRef('formRef')
  if (formManager) {
    let defaultVal = {};
    {
      let deps = page.store.model.currentDeepProp.deps;
      let links = page.store.model.currentDeepProp.links;
      let rootDep = deps.find(v => v.id === page.store.model.currentDeepProp.rootId);
      // let formIDS = links.map(v => v.from);
      if (Array.isArray(rootDep.items)) {
        // console.log('rootDep', rootDep.items)
        rootDep.items.forEach(item => {
          let link = links.find(v => v.from === item.id)
          if (link) {
            let dep = deps.find(v => v.id === link.toPID)
            if (dep) {
              // console.log(dep)
              if (dep.type === 'array') {
                defaultVal[item.name] = [{}]
              }
              if (dep.type === 'object') {
                defaultVal[item.name] = {}
              }
            }
          } else {

          }
        })
      }
    }
    // console.log(defaultVal, links)

    let defaultUI = {
      attrs: [
        [ 'label-width', '150px']
      ]
    }

    formManager.setModel(
        {
          args: {
            name: 'test-' + ZY.rid(6),
          },
          form: JSON5.stringify({
            name: 'form_' + ZY.rid(6),
            parts: [
              {
                type: 'form',
                name: 'form_' + ZY.rid(6),
                props: JSON5.stringify(page.store.model.currentDeepProp),
                ui: JSON5.stringify(defaultUI, null,2 ),
                defaultVal: JSON5.stringify(defaultVal, null, 2)
              }
            ],
          })
        }
    )
  }
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

        // ZY_EXT.store.setItem('currentSwagger', res.data)


        if (newVal.label === 'case-service') {
          await ZY.sleep(300)
          resolveCurrentSwaggerModel(res.data)
        }


        // console.log(res.data)
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
  async ['save:form:file'](e) {
    let formManager = page.getRef('formRef')
    if (formManager) {
      let model = await formManager.getModel()
      let {args, form} = model
      // console.log('model', form, typeof form)

      let cached = ZY.JSON5.parse(form)

      // ZY_EXT.saveDesignFile({fileName: args.name, data: form })
      await FormsMana.saveCache2File([{name: cached.name, value: form}], {fileName: args.name})
    }
  }
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

function getConfig() {
  return import('./FormManagerEditorConfig')
}
let setFormRef = page.setRef('formRef')

</script>
