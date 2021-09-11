<style>

</style>

<template>
  <div class="z-props" v-if="page.inited">
    <HttpComponent
        :defs="page.defMap"
        :is="store.model.editor_step"
    >
      <template #array_item_before="scope">
        <el-divider></el-divider>
      </template>
      <template #array_before="scope">
       <el-col>
<!--         <h3>{{ scope.key }}</h3>-->
         <el-button  @click="page.callEvent(EVENT_NAMES.ARR_APPEND_COMMON, scope)">添加{{ scope.key }}</el-button>
       </el-col>
      </template>
    </HttpComponent>
  </div>
</template>

<script>
import HttpComponent from "@/components/HttpComponent.vue";
import {extendControl2Page, useControl, extendCommonArrEventHandler} from "@/mixins/framework";
import {onMounted} from "vue";
export default {
  name: 'ZProps',
  components: {HttpComponent},
  props: {
    value: null
  },
  data() {
    return {
      loading: false,
    }
  },
  watch: {

  },
  methods: {

  },
  setup(props) {
    let locks = true
    let properties =  {
      editor_step: {
        type: String,
      },
      json: {
        type: String,
      },
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
    let { EVENT_NAMES } = extendCommonArrEventHandler(page)

    onMounted(function () {
      page.commonLoadStep(
          import('./ZProps/edtorConfig.js'),
          'editor_step',
          {
            async onMounted(config, {setPartModel}) {
              // console.log('formEditorConfig', cached)
              if (props.value) {
                setPartModel(config.name, 'form2', props.value)
              }
              locks = false
              // console.log('eventModel', config, page.defMap)
            }
          }
      )
    })

    return {
      EVENT_NAMES,
      page,
      store: page.store
    }

  }
}
</script>
