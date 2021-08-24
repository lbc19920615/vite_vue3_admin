<template>
<!--  <div>{{page}}</div>-->
  <div v-if="page.inited">
<!--    <div>{{store.model}}</div>-->
    <div>{{store.computedModel}}</div>

    <el-input v-model="store.model.swaggerOrigin" placeholder="placeholder"></el-input>
    <submit-button @submit="onSubmit">开始分析</submit-button>

    <div v-if="page.val('options')">
      <EwSelect v-model="store.model.selectedValue" :options="store.model.options"></EwSelect>
    </div>

    <div v-if="page.val('currentSwagger')">
      <textarea style="width: 100%; height: 30vh" v-model="store.model.currentSwagger"></textarea>
    </div>

    <div v-for="file in store.model.files">
      <a :href="file" target="_blank" download>{{file}}</a>
    </div>
  </div>
</template>
<script setup>
import SubmitButton from "@/components/SubmitButton.vue"
import EwSelect from "@/components/Ew/EwSelect.vue"
import {onMounted, reactive, ref} from "vue";
import {useControl} from "@/mixins/framework";

let SEVER_ORIGIN = `http://192.168.1.67:7001/`

function onInited({storeControl}) {
  storeControl.set({
    haha: 111,
    swaggerOrigin: 'http://192.168.1.60:7888',
    selectedValue: '',
    files: [],
  })
  // console.log('sdsdsds', storeControl.store)
}

let properties = {
  haha: {
    type: String
  },
  swaggerOrigin: {
    type: String
  },
  options: {
    type: Array,
    properties: {
      label: {
        type: String,
      },
      value: {
        type: null,
      }
    }
  },
  selectedValue: {
    type: String
  },
  currentSwagger: {
    type: String
  },
  files: {
    type: Array,
  }
}
let computed = {
  selectedOption: `find(MODEL('options', []), ['value', MODEL('selectedValue', '')])`
}
let page = useControl({properties, computed}, {
  onInited
})
let store = page.store

let computedChange = {
  async ['selectedOption'](newVal) {
    console.log('newVal', newVal)
    if (newVal) {
      let jsonOrigin = `${page.val('swaggerOrigin')}${newVal.value}`
      let [,{data}] = await ZY.awaitTo(
          globalThis.Req.get(jsonOrigin)
      )
      page.setByPath('currentSwagger', JSON.stringify(data, null, 2))

      // console.log(JSON.stringify(data, null, 2))
      // http://192.168.1.67:7001/?url=http://192.168.1.60:7888/api-system/v2/api-docs&folder=folder3
      let folder = 'folder-' + newVal.label
      let [,res] = await ZY.awaitTo(
        globalThis.Req.get(`${SEVER_ORIGIN}?url=${jsonOrigin}&folder=${folder}`)
      )
      console.log('res', res)
      page.setByPath('files', res.data.files)
    }
  }
}

page.setEventHandler({
  [page.EVENT_TYPES.COMPUTED_CHANGE](e) {
    computedChange[e.key] ? computedChange[e.key](e.newVal) : ''
  }
})

async function onSubmit() {
  let [,response] = await ZY.awaitTo(
      globalThis.Req.get(`${page.val('swaggerOrigin')}/swagger-resources`)
  )
  let optionsM = ZY.U.objArr2OptionsManager(response.data, 'name', 'location')
  // console.log(optionsM)
  page.setByPath('options', optionsM.options)
}
</script>
