<style lang="scss">
.cus-ui__class-props {
  .z-props__name {
    display: none;
  }
}
.cus-ui__label {
  width: 80px;
  font-weight: bold;
  font-size: 16px;
}
.cus-ui__class {
  .z-form__prop:first-child {
    height: 0;
    width: 0;
    opacity: 0;
  }
}
.z-props__value {
  width: 30vw;
}
.z-props__del {
  margin-left: 10px;
}
.z-props__add {
  margin-bottom: 10px;
}
.cus-ui__style-editor {
  width: var(--cus-ui__style-editor-width, 700px);
}
.cus-ui__style-editor-con {
  overflow: auto;
  height: var(--cus-ui__style-editor-con-height, max-content);
  overflow-x: hidden;
}
</style>

<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value.data}}-->
<!--    <el-row>-->
<!--      <el-button @click="save">保存</el-button>-->
<!--    </el-row>-->
    <el-row class="a-space-mb-10 cus-ui__item-title">
      <div class="cus-ui__label">标题</div>
      <el-input  style="width: auto; flex: 1"
                v-model="state.value.data.label" @blur="onBlur"></el-input>
    </el-row>
    <el-row  class="a-space-mb-10 cus-ui__class">
      <div class="cus-ui__label">类</div>
      <ZProps
          style="flex: 1"
          class="cus-ui__class-props" v-model:value="state.value.control.classObj" @form:input:blur="onBlur" @props-change="onClassChange"></ZProps>
    </el-row>

    <template v-if="widgetConfig.propsV2">
      <el-row  class="a-space-mb-10">
        <div class="cus-ui__label">属性
          <z-window class="a-space-ml-5"
                    url="https://element-plus.gitee.io/zh-CN/component/form.html#form-%E6%96%B9%E6%B3%95">
            <i class="fa fa-book"></i>
          </z-window>
        </div>

        <template v-if="state.value.control.propsV2">
<!--          sdsdsdsds 属性 {{state.value.control.propsV2}}-->
            <div>
              <z-cell-item label-width="max-content" label="标题位置(left, top)">
                <el-select  v-model="state.value.control.propsV2['label-position']"
                            @change="setPropVal(state.value.control.propsV2, 'label-position', $event)"

                >
                  <el-option label="left" value="left"></el-option>
                  <el-option label="top" value="top"></el-option>
                </el-select>
              </z-cell-item>
              <z-cell-item label-width="max-content" label="标题长度">
                <unit-input v-model="state.value.control.propsV2['label-width']"
                            default-unit="px"
                            @change="setPropVal(state.value.control.propsV2, 'label-width', $event)"
                ></unit-input>
              </z-cell-item>
            </div>
        </template>

      </el-row>
    </template>
    <template v-else>
      <el-row  class="a-space-mb-10">
        <div class="cus-ui__label">属性
          <z-window class="a-space-ml-5"
                    url="https://element-plus.gitee.io/zh-CN/component/form.html#form-%E6%96%B9%E6%B3%95">
            <i class="fa fa-book"></i>
          </z-window>
        </div>
        <ZProps
            style="flex: 1"
            v-model:value="state.value.control.attrsObj"
            @form:input:blur="onBlur"
            @props-change="onAttrsChange"></ZProps>
      </el-row>
    </template>

    <template v-if="widgetConfig.propsV2">
      <el-row  class="a-space-mb-10">
        <div class="cus-ui__label">样式</div>
<!--        {{state.value.control.stylesObj}}-->
        <div class="cus-ui__style-editor-con">
          <z-easy-modal title="样式"
                        :modelAttr="{
                    width: '96vw',
                     appendToBody: true,
                     top: '10vh',
                     modalClass: 'el-dialog--no-modal'
                  }"
                        :button-attr="{

                    size: 'small'
                  }"

          >
            <template #button-content>编辑</template>
            <template #default>
              <z-style-editor class="cus-ui__style-editor"
                              :value="state.value.control.stylesObj"
                              @val:change="onStyleChange2"></z-style-editor>
            </template>
          </z-easy-modal>

        </div>
      </el-row>
    </template>
    <template v-else>
      <el-row  class="a-space-mb-10">
        <div class="cus-ui__label">样式</div>
        <ZStyles
            style="flex: 1"
            :value="state.value.control.stylesObj" @form:input:blur="onBlur"
            @props-change="onStylesChange"></ZStyles>
      </el-row>
    </template>

  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index.js";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import ZProps from "@/plugins/z-frame/components/ZProps.vue";
import ZStyles from "@/plugins/z-frame/components/ZStyles.vue";
import ZCellItem from "@/plugins/z-frame/components/ZCellItem.vue";
import {nextTick, reactive, toRaw} from "vue";
import UnitInput from "@/components/UnitInput.vue";
import ZStyleEditor from "@/plugins/z-frame/components/ZStyleEditor.vue";
import ZEasyModal from "@/plugins/z-frame/components/ZEasyModal.vue";

export default {
  name: 'CusUI',
  components: {ZEasyModal, ZStyleEditor, UnitInput, ZCellItem, ZStyles, ZProps, EwSuggest},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {

    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let { data, methods, listeners, init, widgetConfig2, buildGetRef } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {

        // console.log('CusUI', newVal, typeof  newVal)
        if (!newVal) {
          newVal = {
            // classObj: {},
            // attrsObj: {},
            control: {
              propsV2: {}
            },
            data: {}
          }
          return newVal
        }
        if (newVal) {
          try {
            obj = JSON5.parse(newVal)
            // console.log(obj)
            if (!obj.data) {
              obj.data = {}
            }
            if (!obj.control) {
              obj.control = {
                propsV2: {}
              }
            }
            // delete obj.data.classObj;
            if (obj.data.attrs) {
              let props = []
              for (let [key, value] of obj.data.attrs) {
                props.push({
                  name: key,
                  value: value,
                })
              }
              obj.control.attrsObj = {
                props
              }
              obj.control.propsV2 = Object.fromEntries(obj.data.attrs)
            } else {

              obj.control.attrsObj = {
                props: []
              }
            }

            if (obj.data.class) {
              let props = []
              for (let value of obj.data.class) {
                props.push({
                  name: value,
                  value: value,
                })
              }
              obj.control.classObj  = {
                props
              }
            }

            obj.control.stylesObj = "{cached: null, css: ''}"

            if (obj.data.styles) {
              obj.control.stylesObj = obj.data.styles
            }

            return obj
          } catch (e) {
            console.log(e)
          }
        }
        return {}
      }
    })
    let state = data({
      value: {}
    })
    init(props)

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      // console.log(clonedValue)
      Reflect.deleteProperty(clonedValue, 'control')
      let str =JSON5.stringify(clonedValue)
      // console.log('onChaneg')
      methods.on_change(str)
    }


    function onAttrsChange(e) {
      console.log('onAttrsChange', e.props)
      // state.value.attrsObj = e

      state.value.data.attrs = e.props.filter(v => {
        return v.name
      }).map(v => {
        return [
            v.name, ZY.defaultStr(v.value, '')
        ]
      })
    }

    function onClassChange(e) {
      state.value.data.class = e.props.filter(v => {
        return v.value
      }).map(v => {
        return ZY.defaultStr(v.value, '')
      })
    }

    function onStylesChange(e) {
      // console.log('onStylesChange', e)
      // state.value.control.stylesObj = e
      state.value.data.styles = e
      onChange()
    }

    function onStyleChange2(e) {
// console.log('onStyleChange2', e)
      state.value.data.styles = e
      onChange()
    }

    function save() {
      onChange()
    }

    function onBlur() {
      console.log('onBlur')
      onChange()
    }

    let propsState = reactive({
      props: {}
    })
    function setPropVal(props, key, e) {
      state.value.data.attrs = Object.entries(toRaw(props))

      console.log('setPropVal', props, key, e, state.value.data.attrs )
      nextTick(() => {
        onBlur()
      })
    }

    return {
      state,
      widgetConfig: widgetConfig2,
      onChange,
      methods,
      propsState,
      onAttrsChange,
      onClassChange,
      setPropVal,
      onStyleChange2,
      onStylesChange,
      onBlur,
      save,
      listeners,
    }
  },
}
</script>

