<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    {{state.value}}
  <div v-if="state.inited && state.value && state.value.control">
<!--    <el-input v-model="state.value.control.widget"></el-input>-->
    <div class="a-space-mb-20">
      <ew-suggest v-model="state.value.control.widget"
                  placement="bottom"
                  :suggest="state.suggest"
                  @value:change="onWidgetChange"></ew-suggest>
    </div>

    <div v-if="state.currentComponent && refMan.showed">
<!--      {{state.currentComponent}}-->
      <z-http-com :resolve-config="resolveConfig" @http:model:change="onModelChange"></z-http-com>
    </div>


  </div>

  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import {getCurrentInstance, onMounted, toRaw} from "vue";
import ZHttpCom from "@/plugins/z-frame/components/ZHttpCom.vue";
import {createCusWidgetEditorConfig} from "@/plugins/form-render/components/CusWidgetEditor/createConfig";
import {useReloadMan} from "@/views/home/hooks";

export default {
  name: 'CusWidgetEditor',
  components: {ZHttpCom, EwSuggest},
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
    let properties = {}
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

            if (!obj.control) {
              obj.control = {}
            }

            if (obj.data.widget) {
              obj.control.widget = obj.data.widget
            }

            initCurrentComponent(obj.data.widget)

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

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      // console.log(clonedValue)
      Reflect.deleteProperty(clonedValue, 'control')
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }

    function initCurrentComponent(v) {
      state.currentComponent = AppComponents[v]
      setRefMan()
      console.log('initCurrentComponent', AppComponents[v])
    }

    function onWidgetChange() {
      state.value.data.widget =  state.value.control.widget
      // console.log('onWidgetChange')
      // console.log(AppComponents)
      setTimeout(() => {
        initCurrentComponent(state.value.control.widget)
        onChange()
      }, 30)
    }

    function save() {
      onChange()
    }

    function onBlur() {
      onChange()
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

    async function resolveConfig(props) {
      // console.log(state.currentComponent.props)
      properties = {}
      let comProps = toRaw(
          state.currentComponent.props
      )
      // console.log(comProps)
      for (let [key, value] of Object.entries(comProps)) {
        if (value.type === Number) {
          properties[key] = {
            type: 'number',
            rules: {
              type: 'number'
            }
          }
        }
        else if (value.type === String) {
          properties[key] = {
            type: 'string'
          }
        }
        else if (value.type === Boolean) {
          properties[key] = {
            type: 'boolean',
            rules: {
              type: 'boolean'
            }
          }
        }
        else {
        //
        }
      }
      // properties = {
      //   name1: {
      //     type: 'string'
      //   },
      //   name2: {
      //     type: 'string'
      //   },
      // }
      // return import('./CusWidgetEditor/editorConfig')
      let formDef = {
        type: 'object',
        ui: {
          attrs: [
            ['label-width', '100px']
          ],
        },
        properties
      }
      return {
        default: createCusWidgetEditorConfig(formDef)
      }
    }

    function onModelChange(e) {
      console.log('onModelChange', e.model, e)
    }

    let [refMan, setRefMan] = useReloadMan({timeout: 500})

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      lifeTimes,
      methods,
      resolveConfig,
      onModelChange,
      onWidgetChange,
      refMan,
      onBlur,
      save,
      listeners,
    }
  },
}
</script>

