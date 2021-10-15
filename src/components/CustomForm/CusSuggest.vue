<style lang="scss" scoped>
.cus-suggest__button {
  //margin: initial;
}
.cus-sugges__con {
  min-height: 200px
}
</style>

<template>
  <template v-if="inited">
<!--        {{state}}-->
<!--    {{ui.widgetConfig}}-->
    <el-input :style="widgetConfig.inputStyle"  :readonly="widgetConfig.mode === 'select'" v-model="state.value" @input="onChange">
      <template #append>
        <e-popover
            class="cus-suggest__popover"
            :placement="widgetConfig.placement"
            :width="widgetConfig.poperWidth ? widgetConfig.poperWidth : 450"
            trigger="click"
            :append-to-body="true"
            :teleportTo="getWidgetConfig('teleportTo')"
        >
          <template #reference>
            <el-button class="cus-suggest__button" @click="setRefMan(true)">选择</el-button>
          </template>
          <div class="cus-sugges__con">
            <SimpleList v-if="refMan.showed"
                        :suggest="getSuggest()"
                        :column="extendColumn"

                        :class="widgetConfig.listCls ? widgetConfig.listCls : ''"
                        :con-style="widgetConfig.listStyle ? widgetConfig.listStyle : ''"
                        @select-item="selectSuggest"></SimpleList>
          </div>
        </e-popover>
      </template>
    </el-input>
  </template>

</template>

<script>
import {getCurrentInstance, resolveComponent} from 'vue'
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import DeepPropEditor from "@/views/about/components/DeepPropEditor.vue";
import {useArrHandler, useReloadMan} from "@/views/home/hooks";
import {EPopover} from "@/components/EPopover/index.js";
// import SimpleList from "@/components/SimpleList.vue";

export default {
  name: 'CusSuggest',
  components: {EPopover, DeepPropEditor},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let {part_key} = props.defs
    let JSON5 = ZY.JSON5
    let instance = getCurrentInstance()

    let obj = {}
    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit
    })
    let state = data({
      suggest: props.ui.widgetConfig.suggest ?? [],
      search: ''
    })
    init(props)

    let extendColumn = [
      {
        prop: 'label',
        width: '150px',
        render(h, props) {
          const scope = props.scope
          let tooltip = resolveComponent('el-tooltip')
          let text = h('span', {}, scope.row.label)
          let icon = h('i', {class: 'el-icon-info a-space-ml-10'})
          let tip =  h(tooltip, {
            content: scope.row.labelTip,
            placement: 'right'
          }, [icon])
          return h('div', {}, [text, tip])
        }
      }
    ]

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
      setTimeout(() => {
        onChange()
      }, 30)
    }

    function onChange() {
      methods.on_change(state.value)
    }

    function getSuggest() {
      if (props.ui.widgetConfig.enums) {
        let obj =  instance.ctx.dxValueTemplate(props.ui.widgetConfig.enums)
        // console.log('getsdsdsd', obj)
        return obj
      }
      else if (state.suggest) {
        return state.suggest
      }
      else {
        return []
      }
    }


    return {
      state,
      initSearch,
      extendColumn,
      searchSuggest,
      getSuggest,
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

