<template>
  <template v-if="page.inited">
    <div>{{store.model}}</div>
    <HttpComponent
        :defs="page.defMap"
        :is="store.model.editor_step"
    >
      <template #array_item_before="scope">
        <h3>{{ scope.key }}</h3>
      </template>
      <template #array_before="scope">
<!--        <el-button  @click="page.callEvent('add:part', scope)">添加{{ scope.key }}</el-button>-->
      </template>
    </HttpComponent>
  </template>

</template>
<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import HttpComponent from "@/components/HttpComponent.vue";
import {extendControl2Page, useControl} from "@/mixins/framework";
import {nextTick, onMounted} from 'vue';

export default {
  name: 'CusForm',
  components: {HttpComponent},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let locks = true
    let cached = null
    // setTimeout(() => {
    //   locks = false
    // }, 10000)
    let { methods, init, data } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        // console.log('handleValueInit', newVal, typeof newVal)
        cached = ZY.JSON5.parse(newVal)
        return newVal
        // page.setPartModel('form-editor', 'form2', obj)
      }
    })
    data()
    let properties =  {
      editor_step: {
        type: String,
      },
      json: {
        type: String,
      }
    }
    let computed = {}
    function onInited({storeControl}) {
    }
    let page = useControl({properties, computed}, {
      onInited,
      extendContext: {
      }
    })
    page = extendControl2Page(page)


    page.setEventHandler({
      ['model:update'](e) {
        let {model, key, newVal, config} = e
      },
      ['add:part'](e) {
        let { parts, partName, selfpath, process } = e
        // console.log('add:event', e, model)
        parts[partName].arrAppend(selfpath)
      },
      async ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        // console.log('model:update:all', model)
        if (!locks) {
          let val = ZY.JSON5.stringify(model)
          page.setData({
            json: val
          })
          await nextTick();
          methods.on_change(val)
        }
      },
    })


    onMounted(function () {
      page.commonLoadStep(
          import('@/plugins/CusForm/formEditorConfig.js'),
          'editor_step',
          {
            async onMounted(config, {setPartModel}) {
              init(props)
              console.log('formEditorConfig', cached)
              setPartModel(config.name, 'form2', cached)
              locks = false
              // console.log('eventModel', config, page.defMap)
            }
          }
      )
    })

    return {
      page,
      store: page.store
    }

  }
}
</script>
