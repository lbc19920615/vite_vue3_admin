<template>
  <div class="page-home" v-if="page.inited">
    <el-row class="a-space-mb-20">
      <el-button type="primary" @click="save">保存</el-button>
<!--      <el-button><el-link type="primary" target="_blank"-->
<!--                          href="/about?page=show&storeName=111">测试</el-link></el-button>-->
    </el-row>
    <template v-if="store.model.textarea_step">
      <HttpComponent
          :defs="allDef"
          :is="store.model.textarea_step"
          :debug="false"
      >
        <template #route-link-custom="scope">
          {{scope.depData.tagName}}
          <el-button><el-link type="primary" target="_blank"
                              :href="getHref(scope)">编辑</el-link></el-button>
        </template>
      </HttpComponent>
    </template>
  </div>
</template>

<script>
import '@/plugins/form-render/ext.js';
import HttpComponent from "@/components/HttpComponent.vue";
import {defineComponent} from "vue";
import {extendControl2Page, PageControlMixin, useAppPageControl, useControl} from "@/mixins/framework";
export default defineComponent({
  components: {HttpComponent},
  mixins: [
    PageControlMixin,
  ],
  data() {
    return {
    }
  },
  setup() {
    const pageStoreName = 'home-index-store'
    function onInited({storeControl}) {
      page.commonLoadStep(
          import('./EventEditorConfig.js'),
          'textarea_step',
          {
            async onMounted(config) {
              // console.log('commonLoadStep onMounted')
              let eventModel = await page.dispatchRoot('GetStoreEvents', {
                storeName: pageStoreName
              })
              page.setPartModel(config.name, 'form2', eventModel ?? {})
              // console.log('eventModel', config, eventModel)
            }
          }
      )
    }
    let properties =  {
      textarea_step: {
        type: String
      },
    }
    let computedProps = {
    }
    let page = useControl({properties, computed: computedProps}, {
      onInited,
      extendContext: {
      },
      servicePrefix: 'PageHomeIndexService'
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    let cachedPageControlModel;

    page.setEventHandler({
      ['model:update:all'](e) {
        let { model, key, newVal, config } = e
        if (config.process === page.store.model.textarea_step) {
          // console.log('page about model:update:all', model)
          cachedPageControlModel = model
        }
      },
    })

    async function save() {
      await page.dispatchRoot('SetStoreLocal', {
        storeName: pageStoreName,
        data: cachedPageControlModel
      })
    }

    function getHref(scope) {
      return '/about?page=show&storeName=111'
    }

    return {
      store: page.store,
      getHref,
      page,
      allDef: page.defMap,
      save,
    }
  }
})
</script>
