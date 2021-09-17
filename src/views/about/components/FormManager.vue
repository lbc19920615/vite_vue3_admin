<template>
  <div v-if="page.inited">
    <CustomElement is="my-vue-dialog" name="form-mana-dialog"
                   :params="{sstyle: 'width: 60vw; min-width: 720px;'}">
      <template #default="scope">
        <!--        {{scope}}-->
        <FormsManaSelect
            com-name="form-mana-select"
            @select-form="page.callEvent('forms:select-form', {
              scope,
              value: $event
            })"></FormsManaSelect>
      </template>
    </CustomElement>

    <template v-if="store.model.form_step">
      <!--      {{store.computedModel}}-->
<!--      {{store.model.form_step}}-->
      <slot name="form_before" v-bind="{}"></slot>
      <HttpComponent
          :defs="allDef"
          :is="store.model.form_step"
          :debug="true"
      >
        <template #array_prev="scope">
          <template v-if="scope.key === 'forms'">
            <el-space align="middle">
              <h3>{{ scope.selfpath }}</h3>
              <el-button size="small" @click="page.callEvent('add:forms', scope)">添加{{ scope.key }}</el-button>
              <el-button size="small" @click="page.callEvent(`open:forms`, scope)">打开{{ scope.key }}管理</el-button>
            </el-space>
          </template>
        </template>
        <template #array_before="scope">
          <slot name="array_before" v-bind="scope"></slot>
        </template>
        <template #array_item_after="scope">
          <slot name="array_item_after" v-bind="scope"></slot>
        </template>
        <template #object_prev="scope">
          <h3>{{scope.selfpath}}</h3>
        </template>
      </HttpComponent>

    </template>
  </div>
</template>

<script>
import HttpComponent from "@/components/HttpComponent.vue";
import {onMounted, toRaw} from "vue";
import {extendControl2Page, useAppPageControl, useControl} from "@/mixins/framework";
import CustomElement from "@/components/CustomElement.vue";
import FormsManaSelect from "@/plugins/z-frame/components/FormsManaSelect.vue";
export default {
  name: 'FormManager',
  components: {FormsManaSelect, CustomElement, HttpComponent},
  props: {
    getConfig: Function
  },
  setup(props, ctx) {

    function onInited({storeControl}) {
    }
    let properties =  {
      form_step: {
        type: String,
      },
    }
    let computedProps = {
      ['curss']: `A.getDeeps(MODEL('links'),MODEL('deps'))`,
    }
    let page = useControl({properties, computed: computedProps}, {
      onInited,
      extendContext: {
      }
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    let storeName = 'haha-events-model'
    let cachedPageControlModel = null
    let currentFromDialog = null
    page.setEventHandler({
      ['add:forms'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:events', e, model)
        parts[partName].arrAppend(selfpath)
      },
      ['open:forms'](e) {
        currentFromDialog = e
        page.refsManager.runCom('form-mana-select', 'load')
        page.webComponentRef.toggleDialog('form-mana-dialog');
      },
      ['HTTP:COM:MOUNTED'](e) {
        let stepName = page.store.model.form_step
        let context = page.httpComContext[stepName]
        console.log('stepName', stepName)
        ctx.emit('com-ready', e)
      },
      ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        if (config.process === page.store.model.form_step) {
          // console.log('form_step update', newVal)
          cachedPageControlModel = model
        }
      },
    })

    async function save() {
      if (cachedPageControlModel) {
        await page.dispatchRoot('SetStore', {
          storeName,
          model: cachedPageControlModel
        })
      }
    }

    async function getModel() {
      return toRaw(cachedPageControlModel)
    }

    async function _loadConfig() {
      let _oldConfig = await import('./FormManagerEditorConfig')
      if (props.getConfig) {
        _oldConfig = await props.getConfig(_oldConfig)
      }
      return _oldConfig
    }

    async function setModel(model = {}) {
      let stepName = page.store.model.form_step
      // let context = page.httpComContext[stepName]
      page.setPartModel(stepName, 'form2', model)
    }

    onMounted(() => {
      page.commonLoadStep(
          _loadConfig(),
          'form_step',
          {
            async onMounted(config) {
              let eventModel = await page.dispatchRoot('GetStoreEvents', {
                storeName
              })
              page.setPartModel(config.name, 'form2', eventModel ?? {})
              // console.log('eventModel', config, eventModel)
            }
          }
      )
    })

    return {
      save,
      getModel,
      setModel,
      store: page.store,
      page,
      allDef: page.defMap,
    }
  }
}
</script>
