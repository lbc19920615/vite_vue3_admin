<template>
  <template v-if="inited">
<!--        {{state}}-->
    <el-input v-model="state.value" @input="onChange">
      <template #append>
        <el-popover
            placement="bottom"
            :width="400"
            trigger="click"
        >
          <template #reference>
            <el-button @click="setRefMan(true)">选择</el-button>
          </template>
          <div  style="min-height: 200px">
            <SimpleList v-if="refMan.showed" :suggest="state.suggest" @select-item="selectSuggest"></SimpleList>
          </div>
        </el-popover>
      </template>
    </el-input>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import DeepPropEditor from "@/views/about/components/DeepPropEditor.vue";
import {useArrHandler, useReloadMan} from "@/views/home/hooks";
import SimpleList from "@/components/SimpleList.vue";

export default {
  name: 'CusSuggest',
  components: {SimpleList, DeepPropEditor},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let {part_key} = props.defs
    let JSON5 = ZY.JSON5

    let obj = {}
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit
    })
    let state = data({
      suggest: props.ui.widgetConfig.suggest ?? [],
      search: ''
    })
    init(props)

    let [refMan, setRefMan] = useReloadMan({timeout: 500})

    function handleValueInit(newVal) {
      if (!newVal) {
        newVal = ''
      }
      if (newVal) {
        // obj = JSON5.parse(newVal)
      }
      // console.log('handleValueInit', part_key, obj)
      return newVal
    }

    let handler = useArrHandler(state.suggest)

    function searchSuggest(options, v) {
      let arr = handler.search(
          function(o) {
            return o.value.includes(v);
          }
      ) ?? []
      return arr
    }

    function initSearch() {
      state.search = ''
    }

    function selectSuggest(e) {
      state.value = e
    }

    function onChange() {
      methods.on_change(state.value)
    }

    return {
      state,
      initSearch,
      searchSuggest,
      selectSuggest,
      refMan,
      setRefMan,
      onChange,
      widgetConfig: props.ui.widgetConfig,
      handler,
      methods,
      listeners,
    }
  },
}
</script>

