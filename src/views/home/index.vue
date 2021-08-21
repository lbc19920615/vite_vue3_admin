<template>
  <div>
    {{store}}
  </div>
  <div>
    <el-button type="primary"
               :disabled="store.model.loading" @click="reload">reload</el-button>
    <el-button type="primary"
               :disabled="store.model.loading" @click="updateData">回填数据</el-button>
<!--    <el-button type="primary"-->
<!--               :disabled="store.model.loading" @click="nextStep">nextStep</el-button>-->
    <el-button type="primary"
               :disabled="store.model.loading" @click="chengeVuex">change vuex</el-button>
    <el-button type="primary"
               :disabled="store.model.loading" @click="openDialog">打开dialog</el-button>
  </div>
  <div style="min-height: 300px;" v-loading="store.model.loading">
    <HttpComponent
        :defs="allDef"
        :is="store.model.componentStep"
        v-if="filter('showCom')"
    >
      <template #form>
        <CusSubmitButton class="el-col search-form__button">搜索</CusSubmitButton>
      </template>
      <template #actions>
        <!--          <el-button type="primary" @click="openDialog">buttonCont</el-button>-->
        <CusTableAction>action1</CusTableAction>
      </template>
    </HttpComponent>
  </div>
  <CustomElement is="my-vue-dialog" name="dialog" :params="consts">
    <template #default>
      <h3 slot="title" style="margin: 0">表单</h3>
<!--      {{store.model}}-->
      <div v-loading="store.model.dialogLoading">
        <el-button type="primary" @click="nextStep">下一步</el-button>
        <div v-if="filter('showDialogCom')">
          <HttpComponent
              :defs="allDef"
              :is="store.model.dialogStep"
          >
            <template #form_after="scope">
<!--              {{scope}}-->
              <CusSubmitButton>提交</CusSubmitButton>
            </template>
          </HttpComponent>
        </div>
      </div>
    </template>
  </CustomElement>
</template>

<script lang="jsx">
import HttpComponent from "@/components/HttpComponent.vue";
import {defineAutoStoreControl} from "@/hooks/autoVue";
import {provideRefManager} from "@/hooks/ref";
import {inject, nextTick, ref, onMounted, provide} from "vue";
import {PageControl} from "@/mixins/framework";
import {useStore} from "vuex";
import CustomElement from "@/components/CustomElement.vue";
import { createRefManager} from "@/hooks/ref";
import SlotButton from "@/components/SlotButton.vue";
import CusSubmitButton from "@/components/CustomForm/CusSubmitButton.vue";
import CusTableAction from "@/components/CustomForm/CusTableAction.vue";

export default {
  components: {
    CusTableAction,
    CusSubmitButton,
    SlotButton,
    CustomElement,
    HttpComponent,
  },
  mixins: [
    PageControl
  ],
  setup(props, ctx) {

    let rootStore = useStore()
    let storeControl;
    let httpComContext = {}

    let refsManager = provideRefManager({
      async eventHandler({type, e}) {
        // console.log('page eventHandler', type, e)
        if (type === 'http-component:fetch:ready') {
          // console.log('http-component:fetch:ready', e)
        }
        else if (type === 'http-component:com:mounted') {
          // console.log(e.httpComponentContext)
          httpComContext[e.httpComponentContext.is] = e.httpComponentContext
          if (e.httpComponentContext.is === 'process-step1') {
            setTable(e)
            await nextTick()
            storeControl.set({
              loading: false
            })
          }
          if (e.httpComponentContext.is === 'process-step2') {
            storeControl.set({
              dialogLoading: false
            })
          }
        }
        else if (type === 'process-step3@http-component:com:mounted') {
          console.log('process-step3')
          storeControl.set({
            dialogLoading: false
          })
        }
        else if (type === 'submit:form') {
          let { context, parts } = e
          if (context) {
            // const a = x => x + 1;
            // const b = x => Promise.resolve(x * 2);
            // const c = async x => {
            //   let [err, res]  = await parts.form.callEl('validate')
            //   if (!err) {
            //     return x * 100
            //   } else {
            //     console.error(err)
            //   }
            // }
            // const runMethod = buildAsyncpipe(a, b, c);
            //
            //
            // console.log(
            //     await runMethod(1)
            // )

            let [err, res] = await parts.form.callEl('validate')
            if (!err) {
              let state = parts.form.getModel()
              console.log(state)
              // await globalStore.run('serviceA')
            } else {
              console.log(err)
            }
          }
        }
        else if (type === 'table:action') {
          let { context, attrs, parts } = e
          // console.log(attrs.scope)
          openDialog()
        }
        else {
          // console.log('page eventHandler', type, e)
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
        showCom: "ZY_NOT(MODEL('reload'))",
        showDialogCom: "ZY_NOT(MODEL('dialogReload'))",
      }
    })

    storeControl.set({
      componentStep: '',
      reload: false,
      loading: false,
    })

    async function loadStep(path, varName = 'componentStep') {
      let [,res] = await ZY.awaitTo(globalThis.importScripts(path))
      const config = res.default
      allDef.set(config.name, config)

      storeControl.set({
        [varName]: config.name
      })

      // ZY.sleep(10)

      await nextTick()

      return '';
    }

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
      httpComContext['process-step1'].runPart('form', 'setModel',
          {
            name: 'namssds',
          }
      )
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


    async function loadDialog(p) {
      storeControl.set({
        dialogReload: true,
        dialogLoading: true,
      })
      let nextStepPath = p + '?v=' + Date.now()
      await loadStep(nextStepPath, 'dialogStep')
      // await ZY.sleep(300)
      storeControl.set({
        dialogReload: false,
        // dialogLoading: false,
      })
    }

    async function openDialog() {
      let dialog = webComponentRef.find('dialog')
      if (dialog) {
        await loadDialog('./configs/step2.js')
        dialog.toggleOpen(true)
      }
    }

    async function nextStep() {
      await loadDialog('./configs/step3.js')
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

    function setTable(e) {
      // console.log(e)
      httpComContext['process-step1'].runPart('table', 'setModel',
          {
            page: 1,
            limit: 10,
            total: 1000,
            records: [
              {
                level1Name1: ZY.nid(),
                level1Name2: ZY.nid(),
                level1Name3: ZY.nid(),
              },
              {
                level1Name1: ZY.nid(),
                level1Name2: ZY.nid(),
                level1Name3: ZY.nid(),
              },
            ]
          }
      )
    }

    onMounted(async () => {
      storeControl.set({
        loading: true,
      })
      await loadStep('./configs/step1.js')
      await ZY.sleep(300)
      storeControl.set({
        loading: false,
      })
    })

    return ret
  },
};
</script>
