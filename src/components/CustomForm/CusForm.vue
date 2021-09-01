<template>
  <template v-if="page.inited">
    {{store.model}}
    <HttpComponent
        :defs="page.defMap"
        :is="store.model.editor_step"
    >
      <template #array_item_before="scope">
        <h3>{{ scope.key }}</h3>
      </template>
      <template #array_before="scope">
        <!--                 {{scope}}-->
        <el-button  @click="page.callEvent('add:part', scope)">添加{{ scope.key }}</el-button>
      </template>
    </HttpComponent>
  </template>

</template>
<script>
import HttpComponent from "@/components/HttpComponent.vue";
import {extendControl2Page, useControl} from "@/mixins/framework";
import {onMounted} from 'vue';
export default {
  components: {HttpComponent},
  setup(props, ctx) {
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
      ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        // console.log('model:update:all', model)
        // if (config.process === page.store.model.editor_step) {
        //   console.log('model:update:all', model)
        // }
        page.setData({
          json: ZY.JSON5.stringify(model)
        })
      },
    })


    onMounted(function () {
      page.commonLoadStep(
          import('@/plugins/CusForm/formEditorConfig.js'),
          'editor_step',
          {
            async onMounted(config) {

              console.log('eventModel', config, page.defMap)
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
