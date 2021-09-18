<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    {{state.value}}
  <div v-if="state.inited">
<!--    <el-input v-model="state.value.control.widget"></el-input>-->
    <div>
      <ew-suggest v-model="state.value.control.widget"
                  placement="bottom"
                  :suggest="state.suggest"
                  @value:change="onWidgetChange"></ew-suggest>
    </div>

    <div v-if="state.currentComponent">
      {{state.currentComponent}}
    </div>
  </div>

  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import {getCurrentInstance, onMounted} from "vue";


export default {
  name: 'CusWidgetEditor',
  components: {EwSuggest},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let self = getCurrentInstance().ctx
    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let AppComponents = []
    let BASE_SUGGEST = []
    let { data, methods, listeners, init, onJSONChange } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        if (!newVal) {
          newVal = {
            control: {},
            data: {}
          }
          return  newVal
        }
        if (newVal) {
          // console.log('newVal', newVal, typeof  newVal)
          try {
            obj = JSON5.parse(newVal)
            return obj
          } catch (e) {
            console.error(e)
          }
        }
        return {}
      }
    })
    let state = data({
      value: {},
      currentComponent: null,
      suggest: [],
      inited: false
    })
    init(props)

    // function onChange() {
    //   let str =JSON5.stringify(state.value)
    //   methods.on_change(str)
    //   // console.log('sdsdsds')
    // }



    function onWidgetChange() {
      state.value.data.widget =  state.value.control.widget
      state.currentComponent = AppComponents[state.value.control.widget]
      console.log(AppComponents)
      setTimeout(() => {
        onJSONChange()
      }, 30)
    }

    function save() {
      onJSONChange()
    }

    function onBlur() {
      onJSONChange()
    }



    const lifeTimes ={
      onReady() {
        let app = globalThis.getAppContext()
        let Prefix = ['El']
        AppComponents = app.components
        let arr = Object.entries(AppComponents).filter(v => {
          return Prefix.some(p => v[0].startsWith(p))
        })

        arr = arr.concat(
            Object.entries(CustomVueComponent.components).filter(v => {
              return true
            })
        )
        BASE_SUGGEST = arr.map(v => {
          return {
            label: v[0],
            value: v[0]
          }
        })
        // console.log(BASE_SUGGEST)
        let enums = ZY.lodash.get(props, 'ui.widgetConfig.enums', '')
        if (enums) {
          state.suggest = BASE_SUGGEST.concat(
              self.dxValueTemplate( enums )
          )
        }
        // console.log('sdsdsdsds')
        state.inited = true
      }
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      lifeTimes,
      methods,
      onWidgetChange,
      onBlur,
      save,
      listeners,
    }
  },
}
</script>

