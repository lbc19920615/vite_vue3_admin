<template>
  <div v-if="page.inited">
    <template v-if="store.model.form_step">
      <!--      {{store.computedModel}}-->
      <HttpComponent
          :defs="allDef"
          :is="store.model.form_step"
          :debug="false"
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
        </template>
        <template #array_item_after="scope">
          <el-space wrap>
            <el-button type="danger" size="small" @click="page.callEvent('remove:events', scope)">删除{{ scope.key }}</el-button>
            <template v-if="scope.key === 'forms'">
              <el-button size="small" @click="page.callEvent(`save:single:${scope.key}`, scope)">保存{{ scope.key }}</el-button>
            </template>
          </el-space>
        </template>
      </HttpComponent>

    </template>
  </div>
</template>

<script>
import HttpComponent from "@/components/HttpComponent.vue";
import {getCurrentInstance, onMounted} from "vue";
import {extendControl2Page, useAppPageControl, useControl} from "@/mixins/framework";
export default {
  name: 'FormManager',
  components: {HttpComponent},
  setup() {
    let self = getCurrentInstance().ctx

    function onInited({storeControl}) {
      // console.log('page inited')
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

    onMounted(() => {
      page.commonLoadStep(
          import('./FormManagerEditorConfig'),
          'form_step',
          {
            async onMounted(config) {
              let eventModel = await page.dispatchRoot('GetStoreEvents')
              page.setPartModel(config.name, 'form2', eventModel ?? {})
              console.log('eventModel', config, eventModel)
            }
          }
      )
    })

    return {
      store: page.store,
      page,
      allDef: page.defMap,
    }
  }
}
</script>
