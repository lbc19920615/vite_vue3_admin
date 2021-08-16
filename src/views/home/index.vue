<template>
  <div>
    {{store}}
  </div>
  <div>
    <el-button type="primary"
               :disabled="store.model.loading" @click="reload">reload</el-button>
    <el-button type="primary"
               :disabled="store.model.loading" @click="updateData">回填数据</el-button>
    <el-button type="primary"
               :disabled="store.model.loading" @click="nextStep">nextStep</el-button>
  </div>
  <div style="min-height: 300px;"
       v-loading="store.model.loading">
    <template v-if="filter('showCom')">
      <HttpComponent
          :defs="allDef"
          :is="store.model.componentStep"
      ></HttpComponent>
    </template>
  </div>
</template>

<script lang="jsx">
import HttpComponent from "../../components/HttpComponent.vue";
import {defineAutoStoreControl} from "@/hooks/autoVue";
import {provideRefManager} from "@/hooks/ref";
import {inject, nextTick} from "vue";
import {PageControl} from "@/mixins/framework";

export default {
  components: {
    HttpComponent,
  },
  mixins: [
    PageControl
  ],
  setup(props, ctx) {
    let storeControl;
    provideRefManager({
      eventHandler({type, e}) {
        console.log('eventHandler', type, e)
        if (type === 'self:fecthed') {
          storeControl.set({
            loading: false
          })
        }
      }
    })

    let allDef = new Map()

    storeControl = defineAutoStoreControl({
      service: 'serviceB',
      constants: {
        types: [
          {
            label: '事假',
            value: 'sds1212121sds'
          },
          {
            label: '病假',
            value: 'sds121212ds'
          }
        ]
      },
      data: {
        type: 'object',
        properties: {
          componentStep: {
            type: String,
          },
          reload: {
            type: Boolean
          },
          loading: {
            type: Boolean
          }
        }
      },
      computed: {
        // showCom: "ZY_NOT(MODEL('reload'))",
        option1: "nth(CONST('types'), 0)"
      },
      filters: {
        showCom: "ZY_NOT(MODEL('reload'))"
      }
    })

    storeControl.set({
      componentStep: '',
      reload: false,
      loading: false,
    })

    function loadStep(path) {
      return new Promise(resolve => {
        globalThis.importScripts(path).then(res => {
          const config = res.default
          allDef.set(config.name, config)
          // storeA.componentStep = config.name
          storeControl.set({
            componentStep: config.name
          })
          nextTick(() => {
            resolve()
          })
        })
      })
    }

    loadStep('./configs/step1.js')

    async function reload() {
      storeControl.set({
        reload: true,
        loading: true,
      })
      await ZY.sleep(300)
      storeControl.set({
        reload: false
      })
    }

    function updateData() {
      global.storeApp.run('serviceA', 'setModel', {
        name: 'namssds',
        level1: [
          {
            level1Name1: ZY.nid(),
            level1Name2: ZY.nid(),
          },
          {
            level1Name1: ZY.nid(),
            level1Name2: ZY.nid(),
          },
        ]
      })
    }

    async function nextStep() {
      // 请求下一步
      let nextStepPath = ''
      await ZY.sleep(100)
      nextStepPath = './configs/step2.js'
      await loadStep(nextStepPath)
      await reload()
    }

    return {
      store: storeControl.store,
      filter: storeControl.filter,
      allDef,
      updateData,
      nextStep,
      reload,
    };
  },
};
</script>
