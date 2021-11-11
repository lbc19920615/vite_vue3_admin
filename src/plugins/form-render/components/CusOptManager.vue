<style lang="scss">

</style>

<template>
  <template v-if="inited">
    <template v-if="state.control">
<!--      {{state.control}}-->
<!--      {{state.checked}}-->
      <div class="a-space-mb-10">
<!--        <z-cell-item-->
<!--            style="border-bottom: 1px solid #CFD1C4"-->
<!--            v-for="option in state.control"-->
<!--            :label="option.label">{{option.value}}</z-cell-item>-->
        <simple-list @select="onSelectList"
                     :actionProps="actionProps"
                     :show-acion="showAction"
                     :column="column" :suggest="state.control"></simple-list>
      </div>

      <section  class="a-space-mb-10">
        <z-options-manager @select-item="onSelect"></z-options-manager>
      </section>
    </template>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {inject, onMounted, toRaw, watch} from "vue";
import ZOptionsManager from "@/plugins/z-frame/components/ZOptionsManager.vue";
import ZCellItem from "@/plugins/z-frame/components/ZCellItem.vue";
import SimpleList from "@/plugins/z-frame/components/SimpleList.vue";

export default {
  name: 'CusOptManager',
  components: {SimpleList, ZCellItem, ZOptionsManager},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let curFormCon = inject('curFormCon')
    // console.log(curFormCon)
    let obj;
    let JSON5 = ZY.JSON5;
    let { data, methods, listeners, init, widgetConfig2 } = defineCustomRender(props, ctx, {
      handleValueInit(newVal, from) {
        // console.log(from)
        console.log('CusOptManager', newVal, typeof  newVal)
        if (newVal) {
          try {
            obj = JSON5.parse(newVal)
            state.control = obj
            state.value = obj
          } catch (e) {
            //
          }
        } else {
          state.control = []
          state.value = []
        }
        state.checked = new Map()
        return {}
      }
    })
    let state = data({
      value: [],

      checked: new Map(),
      control: [],
    })

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.control))
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }


    function onStylesChange(e) {
      // console.log('onStylesChange', e)
      // state.control.styles = e
      let options = ZY.JSON5.parse(e)
      // console.log(options)
      state.control = options.map(v => {
        return v.data
      })
      //
      setTimeout(() => {
        onChange()
      }, 30)
    }


    function save() {
      onChange()
    }

    function onSelect(option) {
      // console.log('ctx', option)
      onStylesChange(option.value)
    }

    function onSelectList(e) {
      // console.log('onSelectList', e)
      curFormCon.callPageEvent('cus:com:fire', {
        name: 'select-list',
      }, {
        origin: e,
      })
    }

    onMounted(() => {
      setTimeout(() => {
        console.log('props', props)
        if (widgetConfig2.mounted) {
          init(props)
        }
      }, 30)
    })


    let column = [
      { label: 'Label', prop: 'label' },
      { label: 'Value', prop: 'value' },
    ]


    let showAction = true
    if (widgetConfig2.multi) {
      column.unshift(
          {
            label: '选择',
            width: '60px',
            prop: 'LAY_CHECKED',
            render(h, props) {
              const scope = props.scope
              let com = CustomVueComponent.resolve('ElCheckbox')
              let checked = scope.row['LAY_CHECKED']
              let value = scope.row['value']
              state.checked.set(toRaw(scope.row), checked)
              // console.log('LAY_CHECKED', scope)
              return h(com, {
                checked: checked,
                onChange(e) {
                  state.checked.set(toRaw(scope.row), e)
                  scope.row.LAY_CHECKED = e
                  const checkedE =  [...state.checked]
                      .filter(([k, v]) => v ).map(r => r[0])
                  // console.log(checkedE)
                  // console.log('change', state.control)
                  curFormCon.callPageEvent('cus:com:fire', {
                    name: 'select-checked',
                  }, {
                    origin: {
                      options: checkedE
                    },
                  })
                  onChange()
                }
                // label: checked
              })
            }
          },
      )
      showAction = false
    }

    let actionProps = {
      width: '0px'
    }

    return {
      state,
      widgetConfig: widgetConfig2,
      onChange,
      methods,
      column,
      actionProps,
      onSelect,
      onSelectList,
      showAction,
      onStylesChange,
      save,
      listeners,
    }
  },
}
</script>

