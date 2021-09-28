<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
  <div v-if="state.inited && state.value && state.value.control">
<!--    <el-input v-model="state.value.control.widget"></el-input>-->
    <div class="a-space-mb-20">
      <ew-suggest v-model="state.value.control.widget"
                  placement="top"
                  :suggest="state.suggest"
                  :con-width="530"
                  :column="column"
                  @value:change="onWidgetChange"></ew-suggest>
    </div>

    <div v-if="state.currentComponent && refMan.showed">
<!--      {{state.currentComponent}}-->
      <z-http-com :resolve-config="resolveConfig"
                  @http:model:change="onModelChange"></z-http-com>
    </div>


  </div>

  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import {getCurrentInstance, toRaw} from "vue";
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
    let widgetFormLocks = true

    let [refMan, setRefMan] = useReloadMan({timeout: 500})


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

    function getCUR_COMPONENT_PROPS() {
      let CUS_EDITOR = state.currentComponent.CUS_EDITOR()
      return toRaw(
          CUS_EDITOR.props
      )
    }

    function onChange() {
      let comProps = getCUR_COMPONENT_PROPS()
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      // console.log(clonedValue)
      Reflect.deleteProperty(clonedValue, 'control')

      let comPropsKeys = Object.keys(comProps)
      let ret = ZY.lodash.pick(clonedValue.data.widgetConfig, comPropsKeys)
      // console.log(comProps, clonedValue.data.widgetConfig, ret)
      ret = ZY.lodash.pickBy(ret, function (value) {
        if (typeof value === 'string') {
          return value
        }
        return false
      });
      clonedValue.data.widgetConfig = ret
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }

    function initCurrentComponent(v) {
      // console.log('AppComponents', AppComponents, v)
      if (AppComponents[v]) {
        widgetFormLocks = true
        state.currentComponent = AppComponents[v]
        setRefMan()
      }
    }

    function onWidgetChange() {
      state.value.data.widget =  state.value.control.widget
      // console.log('onWidgetChange')
      // console.log(AppComponents)
      setTimeout(() => {
        initCurrentComponent(state.value.control.widget, 'change')
        for (let key in state.value.data.widgetConfig) {
          Reflect.deleteProperty( state.value.data.widgetConfig, key)
        }
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
        // AppComponents = app.components
        // let arr = Object.entries(AppComponents).filter(v => {
        //   return Prefix.some(p => v[0].startsWith(p))
        // })

        AppComponents = CustomVueComponent.components
        let arr = []
        arr = arr.concat(
            Object.entries(AppComponents).filter(([comName, comDef]) => {
              return comDef.CUS_EDITOR
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

        setTimeout(() => {
          initCurrentComponent(state.value.data.widget)
        }, 100)
      }

    }

    async function resolveConfig() {
      // console.log(state.currentComponent)
      let comProps = getCUR_COMPONENT_PROPS()
      properties = {

      }

      for (let [key, value] of Object.entries(comProps)) {
        if (value) {
          if (value.type === Number || value === Number) {
            properties[key] = {
              ...value,
              type: 'number',
              rules: {
                type: 'number'
              }
            }
          }
          else if (value.type === String || value === String) {
            properties[key] = {
              ...value,
              type: 'string'
            }
          }
          else if (value.type === Boolean || value === Boolean) {
            properties[key] = {
              ...value,
              type: 'boolean',
              rules: {
                type: 'boolean'
              }
            }
          }
          else {
            properties[key] = {
              ...value
            }
          }
        }
      }

      // console.log(comProps, properties)

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
      if (widgetFormLocks) {
        widgetFormLocks = false
        // e.model = {}
        // console.log(state.value.data)
        if (state.value.data.widgetConfig) {
          for (let key in  state.value.data.widgetConfig) {
            e.model[key] = state.value.data.widgetConfig[key]
          }
        }
      } else {
        // console.log('onModelChange', e.model, e)
        let model = ZY.JSON5.parse(ZY.JSON5.stringify(e.model))
        if (Array.isArray(model.props) && model.props.length < 1) {
          Reflect.deleteProperty(model, 'props')
        }

        state.value.data.widgetConfig = model
        onChange()
      }
    }

    let column = [

    ]

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

