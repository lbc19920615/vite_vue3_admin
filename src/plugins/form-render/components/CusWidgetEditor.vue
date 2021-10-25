<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
  <div v-if="state.inited && state.value && state.value.control">
<!--    <el-input v-model="state.value.control.widget"></el-input>-->
    <el-row align="middle" type="flex" class="a-space-mb-15">
      <div class="a-space-mr-10">描述</div>
      <el-input type="textarea" v-model="state.value.data.common_desc"
      @change="onCommonChange" style="width: 350px"
      ></el-input>
    </el-row>
    <el-row align="middle" type="flex" class="a-space-mb-15">
      <div class="a-space-mr-10">状态</div>
      <ZRadioButtons
          size="small"
          :options="commonOptions"
          v-model="state.value.data.common_state"
          @change="onCommonChange"
      ></ZRadioButtons>
    </el-row>
    <div class="a-space-mb-15">
      <ew-suggest v-model="state.value.control.widget"
                  placement="top"
                  :suggest="state.suggest"
                  :con-width="570"
                  :column="column"
                  :no-input="true"
                  :use-prepend="true"
                  :ref="getSuggestRef"
                  @value:change="onWidgetChange">
        <template #button-text>
          选择组件
        </template>
        <template #prepend="scope">
          <el-row v-if="scope.value" style="flex-wrap: nowrap">
            <div>{{scope.value}}</div>
            <z-window  class="a-space-ml-5"
                       :url="getUrl(scope.value)"
            >
              <i class="fa fa-book"></i>
            </z-window>
          </el-row>
          <template v-else></template>
        </template>
      </ew-suggest>
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
import {getCurrentInstance, ref, resolveComponent, toRaw} from "vue";
import ZHttpCom from "@/plugins/z-frame/components/ZHttpCom.vue";
import {createCusWidgetEditorConfig} from "@/plugins/form-render/components/CusWidgetEditor/createConfig";
import {useReloadMan} from "@/views/home/hooks";
import ZRadioButtons from "@/plugins/z-frame/components/ZRadioButtons.vue";
import ZWindow from "@/plugins/z-frame/components/ZWindow.vue";

export default {
  name: 'CusWidgetEditor',
  components: {ZWindow, ZRadioButtons, ZHttpCom, EwSuggest},
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

        // console.log(obj.data)
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
      if ( state.currentComponent) {
        let CUS_EDITOR = state.currentComponent.CUS_EDITOR()
        return toRaw(
            CUS_EDITOR.props
        )
      }
      return null
    }

    function getCUR_COMPONENT_COMPUTED() {
      if ( state.currentComponent) {
        let CUS_EDITOR = state.currentComponent.CUS_EDITOR()
        return toRaw(
            CUS_EDITOR.computed
        )
      }
      return {}
    }

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      // console.log(clonedValue)
      Reflect.deleteProperty(clonedValue, 'control')

      let base_ret = {}
      ZY.lodash.each(clonedValue.data, function (item, key) {
        if (key.startsWith('common_')) {
          base_ret[key] = item
          // let replaces = key.replace('common_', '')
          // if (item && key === 'common_state') {
          //   base_ret[item] = item
          // }

        }
      })

      let widgetConf = clonedValue?.data?.widgetConfig ?? {}
      clonedValue.data.widgetConfig = Object.assign(widgetConf, base_ret)

      // Reflect.deleteProperty(clonedValue.data.widgetConfig, 'disabled')
      // Reflect.deleteProperty(clonedValue.data.widgetConfig, 'readonly')
      // console.log('base_ret', Object.assign(widgetConf, base_ret))

      let comProps = getCUR_COMPONENT_PROPS()
      if (Array.isArray(comProps)) {
        let comPropsKeys = Object.keys(comProps)
        let ret = ZY.lodash.pick(clonedValue.data.widgetConfig, comPropsKeys)
        ret = ZY.lodash.pickBy(ret, function (value) {
          if (typeof value === 'string') {
            return value
          }
          return true
        });

        clonedValue.data.widgetConfig = Object.assign(clonedValue.data.widgetConfig, ret)
      }

      // console.log(comProps, clonedValue.data.widgetConfig)
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

    function onCommonChange() {
      onChange()
    }

    function save() {
      onChange()
    }

    function onBlur() {
      onChange()
    }


    const lifeTimes ={
      onReady() {
        // let app = globalThis.getAppContext()
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
          // console.log(v)
          let label = v[0]
          if (v[1] && v[1].CUS_TITLE) {
            label = v[1].CUS_TITLE
          }
          let value = v[0]
          return {
            label: label,
            value: value,
            labelTip: 'CUS_EDITOR'
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
      let computed = getCUR_COMPONENT_COMPUTED()
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
          if (value.rules) {
            properties[key].rules = Object.assign(
                properties[key].rules, value.rules)
          }
        }
      }

      // console.log(comProps, properties)

      let formDef = {
        type: 'object',
        ui: {
          attrs: [
            ['label-width', '120px']
          ],
        },
        properties,
      }
      return {
        default: createCusWidgetEditorConfig(formDef,
            computed
      )
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
        let model = ZY.JSON5.parse(ZY.JSON5.stringify(e.model))
        let filterModel = {}
        ZY.lodash.each(model, (item, key) => {
          if (key.endsWith('able')) {
            if (item !== null) {
              filterModel[key] = item
            }
          }
          // else if() {
          //
          // }
          else {
            // console.log('item', item)
            if (item !== '') {
              filterModel[key] = item
            }
          }
        })
        // console.log('onModelChange', model, filterModel)
        if (Array.isArray(model.props) && model.props.length < 1) {
          Reflect.deleteProperty(model, 'props')
        }

        state.value.data.widgetConfig = filterModel
        onChange()
      }
    }

    function  getDocAddressName(v = '') {
      let s =  ZY.lodash.kebabCase( v.replace('Cus', ''))
      if (s === 'date-time-picker') {
        s = 'date-picker'
      }
      return s
    }

    let column = [
      {
        prop: 'label',
        width: '250px',
        render(h, props) {
          const scope = props.scope
          const cusName = getDocAddressName(scope.row.value)
          let tooltip = resolveComponent('el-tooltip')
          let elLink = resolveComponent('z-window')
          let text = h('span', {}, scope.row.label)
          let icon = h('i', {class: 'el-icon-info a-space-ml-10'})
          let link = h(elLink, {
            url: `https://element-plus.gitee.io/zh-CN/component/${cusName}.html`,
            type: 'primary',
            class: 'a-space-ml-10',
            target: '_blank'
          }, '文档')
          let tip =  h(tooltip, {
            content: cusName,
            placement: 'right'
          }, [link, icon])
          return h('div', {}, [text, tip])
        }
      },
    ]

    let commonOptions = [
      {
        label: '普通',
        value: ''
      },
      {
        label: '只读',
        value: 'readonly'
      },
      {
        label: '禁用',
        value: 'disabled'
      },
      {
        label: '隐藏',
        value: 'hidden'
      },
    ]

    function getUrl(value) {
      let cusName = getDocAddressName(value)
      return `https://element-plus.gitee.io/zh-CN/component/${cusName}.html`
    }

    let suggestRef = ref(null)
    function openPopover(scope) {
      suggestRef.openPopver()
    }


    function getSuggestRef(v) {
      suggestRef = v
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      lifeTimes,
      methods,
      resolveConfig,
      onModelChange,
      onCommonChange,
      onWidgetChange,
      commonOptions,
      openPopover,
      getSuggestRef,
      getUrl,
      refMan,
      onBlur,
      column,
      save,
      listeners,
    }
  },
}
</script>

