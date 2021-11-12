<style lang="scss" scoped>
.cus-suggest__button {
  //margin: initial;
  border-right-color: rgb(220, 223, 230) !important;
  border-radius: 0;
}
.cus-sugges__con {
  min-height: 200px
}
.cus-suggest-input {
  :deep(.el-input-group__append) {
    background-color: transparent;
  }
}
</style>

<template>
  <template v-if="inited">
<!--        {{state}}-->
<!--    {{ui.widgetConfig}}-->
    <el-input
        class="cus-suggest-input"
        :style="widgetConfig.inputStyle"
              :readonly="widgetConfig.mode === 'select'"
              v-model="state.value"
              @input="onChange">
      <template v-if="widgetConfig.mode === 'select' && state.value" #prepend>
        <el-space>
          <div>{{getOptionWithValue(state.value)?.label }}</div>
        </el-space>
      </template>
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
            <el-space>
              <el-button class="cus-suggest__button"
                         @click="setRefMan(true)">选择</el-button>

            </el-space>
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
        <el-button
            class="a-space-ml-10"
            @click="removeValue"><el-icon><Remove></Remove></el-icon></el-button>
      </template>
    </el-input>
  </template>

</template>

<script>
import {getCurrentInstance, resolveComponent} from 'vue'
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {useArrHandler, useReloadMan} from "@/views/home/hooks";
import {EPopover} from "@/components/EPopover/index.js";
import {Remove} from "@element-plus/icons";
// import SimpleList from "@/components/SimpleList.vue";

export default {
  name: 'CusSuggest',
  components: {EPopover, Remove,},
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
    let widgetConfig = props?.ui?.widgetConfig ?? {}
    let state = data({
      suggest: widgetConfig.suggest ?? [],
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
          if (scope.row.labelTip) {
            let tip =  h(tooltip, {
              content: scope.row.labelTip,
              placement: 'right'
            }, [icon])
            return h('div', {}, [text, tip])
          }
          return h('div', {}, [text])
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

    function removeValue() {
      state.value = null
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

    function getOptionWithValue(val) {
      let options = getSuggest()
      let option = options.find(v => v.value === val)
      if (option) {
        return option
      }
      return {}
    }

    return {
      state,
      initSearch,
      extendColumn,
      searchSuggest,
      getOptionWithValue,
      getSuggest,
      selectSuggest,
      refMan,
      setRefMan,
      onChange,
      removeValue,
      widgetConfig: props.ui.widgetConfig,
      handler,
      methods,
      listeners,
    }
  },
}
</script>

