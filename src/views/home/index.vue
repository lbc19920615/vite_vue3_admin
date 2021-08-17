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
    <el-button type="primary"
               :disabled="store.model.loading" @click="chengeVuex">change vuex</el-button>
    <el-button type="primary"
               :disabled="store.model.loading" @click="openDialog">打开dialog</el-button>
  </div>
  <div style="min-height: 300px;">
    <template v-if="filter('showCom')">
      <HttpComponent
          :defs="allDef"
          :is="store.model.componentStep"
      >
        <template v-slot:default>
          <el-button @click="updateData">回填数据</el-button>
        </template>
      </HttpComponent>
    </template>
  </div>
<!--  <my-vue-dialog @inited="onInit" :style="consts.style">-->
<!--    <div style="background: #fff">sdsdsdsds</div>-->
<!--  </my-vue-dialog>-->
  <CustomElement is="my-vue-dialog" name="dialog" :params="consts">
    <template v-slot:default>
      <h3 slot="title" style="margin: 0">表单</h3>
      <template v-if="filter('showCom')">
        <HttpComponent
            :defs="allDef"
            :is="store.model.dialogStep"
        >
        </HttpComponent>
      </template>
      <el-row type="flex" justify="space-between"
              style="padding: 1rem"
              slot="footer">
        <div>&nbsp;</div>
        <div>
          <el-button type="primary"
                     @click="dispatchEvent('submit:dialog')">提交</el-button>
          <el-button
              @click="dispatchEvent('close:dialog')">关闭</el-button>
        </div>
      </el-row>
    </template>
  </CustomElement>
</template>

<script lang="jsx">
import HttpComponent from "../../components/HttpComponent.vue";
import {defineAutoStoreControl} from "@/hooks/autoVue";
import {provideRefManager} from "@/hooks/ref";
import {inject, nextTick, ref, onMounted, provide} from "vue";
import {PageControl} from "@/mixins/framework";
import {useStore} from "vuex";
import CustomElement from "@/components/CustomElement.vue";
import { createRefManager} from "@/hooks/ref";

export default {
  components: {
    CustomElement,
    HttpComponent,
  },
  mixins: [
    PageControl
  ],
  setup(props, ctx) {


    let rootStore = useStore()
    let storeControl;
    let refsManager = provideRefManager({
      eventHandler({type, e}) {
        console.log('page eventHandler', type, e)
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
        ],
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
          },
          dialogStep: {
            type: String,
          },
          dialogReload: {
            type: Boolean
          },
          dialogLoading: {
            type: Boolean
          }
        }
      },
      computed: {
        // showCom: "ZY_NOT(MODEL('reload'))",
        option1: "nth(ROOT_STATE('sapp.constants.types'), 0)",
        vuexOptions: "ROOT_STATE('sapp.constants.types')",
        vuexAction: "ROOT_STATE('sapp.count')"
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

    function loadStep(path, varName = 'componentStep') {
      return new Promise(resolve => {
        globalThis.importScripts(path).then(res => {
          const config = res.default
          allDef.set(config.name, config)
          // storeA.componentStep = config.name
          storeControl.set({
            [varName]: config.name
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

    async function chengeVuex() {
      rootStore.dispatch('SetStoreAppCount', ZY.lodash.random(1, 10000))
    }

    let webComponentRef = createRefManager({
      eventHandler({type, e}) {
        console.log('eventHandler', type, e)
      }
    })

    provide('webComponentRef', webComponentRef)


    async function openDialog() {
      let dialog = webComponentRef.find('dialog')
      if (dialog) {
        let nextStepPath = './configs/step2.js'
        await loadStep(nextStepPath, 'dialogStep')
        dialog.toggleOpen(true)
        await reload()
      }
    }

    let eventHandler = {
      ['close:dialog']: function () {
        console.log('dispatchEvent')
        let dialog = webComponentRef.find('dialog')
        if (dialog) {
          dialog.toggleOpen(false)
        }
      },
      ['submit:dialog']: function () {
        console.log(
            refsManager
        )
      }
    }

    function dispatchEvent(name, ...args) {
      if (eventHandler[name]) {
        eventHandler[name](...args)
      }
    }

    let ret = {
      store: storeControl.store,
      filter: storeControl.filter,
      allDef,
      chengeVuex,
      updateData,
      nextStep,
      reload,
      openDialog,
      dispatchEvent,
      consts: {
        style: {
          ['--dialog-inner-top']: '10vh'
        },
        sstyle: "width: 700px"
      },
    };

    onMounted(() => {

    })

    return ret
  },
};
</script>
