<style>
.z-style-input {
  flex: 1;
  width: initial;
}

.z-style-select {
  /*width: 150px;*/
}
</style>

<template>
  <div class="z-styles" v-if="page.inited">
<!--    {{valueConfig}}-->
    <template v-if="store.model.styleObj">
<!--      {{store.model.styleObj}}-->
      <el-collapse :border="false">
        <el-collapse-item title="文字" class="a-space-mb-15">
<!--          <header><h3>文字</h3></header>-->
          <el-row align="middle" type="flex" class="a-space-mb-15">
            <div class="a-space-mr-10">字体
              <z-window  class="a-space-ml-5"
                         :url="'https://developer.mozilla.org/en-US/docs/Web/CSS/font-family'"
              >
                <i class="fa fa-book"></i>
              </z-window>
            </div>
            <!--          {{getStyleObjArrLikeValue('font-family')}}-->

            <ew-select multiple
                       style="width: 350px"
                       :model-value="getStyleObjArrLikeValue('font-family')"
                       @change="onArrLikeStaticChange('font-family', $event)"
                       :options="fontStyle.familyOptions"></ew-select>
          </el-row>
          <el-row align="middle" type="flex" class="a-space-mb-15">
            <div class="a-space-mr-10">粗细
              <z-window  class="a-space-ml-5"
                         :url="'https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight'"
              >
                <i class="fa fa-book"></i>
              </z-window>
            </div>
            <ew-select

                :model-value="getStyleObjValue('font-weight')"
                @change="onStaticChange('font-weight', $event)"
                :options="fontStyle.weightOptions"></ew-select>
          </el-row>
          <el-row align="middle" type="flex" class="a-space-mb-15">
            <div class="a-space-mr-10">样式
              <z-window  class="a-space-ml-5"
                         :url="'https://developer.mozilla.org/en-US/docs/Web/CSS/font-style'"
              >
                <i class="fa fa-book"></i>
              </z-window>
            </div>
            <ew-select

                :model-value="getStyleObjValue('font-style')"
                @change="onStaticChange('font-style', $event)"
                :options="fontStyle.styleOptions"></ew-select>
          </el-row>
          <el-row align="middle" type="flex" class="a-space-mb-15">
            <div  class="a-space-mr-10">ALIGN
              <z-window  class="a-space-ml-5"
                         :url="'https://developer.mozilla.org/en-US/docs/Web/CSS/text-align'"
              >
                <i class="fa fa-book"></i>
              </z-window>
            </div>
            <ZRadioButtons
                size="small"

                :model-value="getStyleObjValue('text-align')"
                :options="fontStyle.alignOptions"
                @change="onStaticChange('text-align', $event)"
            ></ZRadioButtons>
          </el-row>
          <el-row align="middle" type="flex" class="a-space-mb-15">
            <div  class="a-space-mr-10">颜色
              <z-window  class="a-space-ml-5"
                         :url="'https://developer.mozilla.org/en-US/docs/Web/CSS/color'"
              >
                <i class="fa fa-book"></i>
              </z-window>
            </div>
            <el-color-picker
                show-alpha
                :model-value="getStyleObjValue('color')"
                :options="fontStyle.alignOptions"
                @change="onStaticChange('color', $event)"
                :predefine="predefineColors"
            />
          </el-row>
        </el-collapse-item>

        <div title="其他" class="a-space-mb-15">
          <section>
<!--            <header><h3>其他</h3></header>-->
<!--            {{store.model.styleObj}}-->
            <el-row align="middle" type="flex"  class="a-space-mb-10"
                    v-for="(styleItem, styleItemIndex) in
                filterStatic(store.model.styleObj)"
                    :key="styleItemIndex"
            >
              <!--        <h3 class="a-space-pr-10">width</h3>-->
              <ew-select
                  size="small"
                  class="z-style-select" filterable  allow-create
                  :options="store.model.options"
                  @change="onPropKeyChange(styleItemIndex, styleItem)"
                  v-model="styleItem[0]"></ew-select>
              <!--        <el-input class="z-style-input"-->
              <!--                  v-model="store.model.styleObj.width"></el-input>-->

              <z-window  class="a-space-ml-10" v-if="styleItem[0]"
                         :url="'https://developer.mozilla.org/en-US/docs/Web/CSS/' + styleItem[0]"
              >
                <!--          <el-icon>-->
                <!--            <info-filled />-->
                <!--          </el-icon>-->
                <i class="fa fa-book"></i>
              </z-window>

              <div class="a-space-ml-10" style="display:flex; align-items: center" v-if="styleItem[0]">
                <unit-input v-if="isLengthProp(styleItem[0])"
                            v-model="styleItem[1]"
                            @change="onPropValueChange"
                ></unit-input>
                <el-color-picker v-model="styleItem[1]" show-alpha
                                 v-else-if="isPropType(styleItem[0], 'color')"
                                 :predefine="predefineColors"
                                 @change="onPropValueChange"
                />

                <!--          <el-input    size="small" v-else v-model="styleItem[1]"></el-input>-->
                <ew-suggest
                    v-else
                    size="small"
                    v-model="styleItem[1]"
                    @value:change="onPropValueChange"
                ></ew-suggest>
              </div>
              <div class="a-space-ml-10"  style="display:flex; align-items: center">
                <el-button size="mini" type="danger"
                           @click="removeStyleItem(store.model.styleObj, styleItem)">
                  <el-icon>
                    <Delete></Delete>
                  </el-icon>
                </el-button>
              </div>
            </el-row>
          </section>
          <el-button size="mini"
                     @click="page.callEvent('add:styleObj', store.model.styleObj)">
            <el-icon><Plus></Plus></el-icon>
          </el-button>
        </div>

      </el-collapse>





    </template>
  </div>
</template>

<script>
import {extendControl2Page, useControl, extendCommonArrEventHandler} from "@/mixins/framework";
import {onBeforeUnmount, onMounted, toRaw, watch} from "vue";
import UnitInput from "@/components/UnitInput.vue";
import EwSelect from "@/components/Ew/EwSelect.vue";
import * as elementIcons from "@element-plus/icons";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import ZWindow from "@/plugins/z-frame/components/ZWindow.vue";
import ZRadioButtons from "@/plugins/z-frame/components/ZRadioButtons.vue";

let LENGTH_PROPS = ['width', 'height']
let COLOR_PROPS = ['color', 'background-color']
let STATIC_PROPS = ['text-align', 'font-family', 'font-weight', 'color', 'font-style']

export default {
  name: 'ZStyles',
  components: {ZRadioButtons, ZWindow, EwSuggest, EwSelect, UnitInput, ...elementIcons},
  emits: [
    'props-change',
      'form:input:blur'
  ],
  props: {
    value: null,
    valueConfig: Object,
    nameConfig: Object
  },
  data() {
    return {
      loading: false,
    }
  },
  setup(props, ctx) {
    let properties =  {
      editor_step: {
        type: String,
      },
      styleObj: {
        type: null
      },
      options: {
        type: null
      }
    }
    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let locks = true
    let computed = {}


    let fontStyle = {
      alignOptions: [
        {
          label: 'left',
          icon: 'align-left',
          value: 'left'
        },
        {
          label: 'center',
          icon: 'align-center',
          value: 'center'
        },
        {
          label: 'right',
          icon: 'align-right',
          value: 'right'
        },
        {
          label: 'justify',
          icon: 'align-justify',
          value: 'justify'
        }
      ],
      familyOptions: [
        {
          label: 'Arial',
          value: 'Arial'
        },
        {
          label: 'Helvetica',
          value: 'Helvetica'
        },
        {
          label: '微软雅黑',
          value: '微软雅黑'
        },
        {
          label: 'sans-serif',
          value: 'sans-serif'
        }
      ],
      weightOptions: [
        {
          label: 'lighter 细',
          value: 'lighter',
        },
        {
          label: 'normal 正常',
          value: 'normal',
        },
        {
          label: 'bold 粗',
          value: 'bold',
        },
      ],
      styleOptions: [
        {
          label: 'normal 正常',
          value: 'normal',
        },
        {
          label: 'italic 斜',
          value: 'italic',
        },
      ]
    }

    let keys =   ZY.DOM.getAllPropKeys()
        .filter(v => {
          return !v.startsWith('webkit')
        })
        .filter(v => {
          return !STATIC_PROPS.includes(v)
        })

    function initData(arr = []) {
      if (page && page.setData) {
        let styleObj =  Array.isArray(arr) ? arr : []
        // console.log(styleObj)
        page.setData({
          styleObj: styleObj,
          options:
              keys
                  .map(v => {
                    return {
                      label: v,
                      value: v
                    }
                  })
        })
        setTimeout(() => {
          locks = false
        }, 150)
      }
    }

    function onInited({storeControl}) {
      // console.log('zstyles', props.value)
      if (locks) {
        initData(props.value)
      }
      ctx.emit('inited', {
        initData
      })
    }
    let page = useControl({properties, computed}, {
      onInited,
      extendContext: {
      }
    })
    page = extendControl2Page(page)
    let { EVENT_NAMES, onChange } = extendCommonArrEventHandler(page)

    function dispatchChange() {
      lock.lock(() => {
        ctx.emit('props-change', page.store.model.styleObj)
      })
    }

    page.setEventHandler({
      ['add:styleObj'](styleArr) {
        styleArr.push(['', ''])
      }
    })

    function isLengthProp(v) {
      if (!v) {
        return false
      }
      return LENGTH_PROPS.includes(v)
    }

    function isPropType(v, type = '') {
      if (type === 'color') {
        return COLOR_PROPS.includes(v) || v.includes('-color')
      }
      return false
    }

    function removeStyleItem(arr, item) {
      // arr.splice(index, 1)
      let index = arr.findIndex(v => {
        return v[0] === item[0]
      })
      if (index > -1) {
        arr.splice(index, 1)
      }

      setTimeout(() => {
        dispatchChange()
      }, 0)
    }


    function onPropKeyChange(styleItemIndex, styleItem) {
      // console.log('styleItemIndex', styleItemIndex, styleItem)
      if (styleItem[1]) {
        styleItem[1] = ''
      }
      // ctx.emit('form:input:blur', '')
    }

    function onPropValueChange() {
      // console.log('onPropValueChange')
      setTimeout(() => {
        dispatchChange()
      }, 0)
    }

    function filterStatic(options = []) {
      // return options
      return options.filter(v => {
        return !STATIC_PROPS.includes(v[0])
      })
    }

    function filterOptions(options) {
      return options
    }


    function onStaticChange(key, value) {
      let styleObj = page.store.model.styleObj
      let finded = styleObj.find(v => {
        return v[0] === key
      })
      if (finded) {
        finded[1] = value
      }
      else {
        styleObj.push([
            key,
            value
        ])
      }
      // ctx.emit('form:input:blur', '')
      setTimeout(() => {
        dispatchChange()
      }, 0)
    }

    function getStyleObjValue(key) {
      let styleObj = page.store.model.styleObj
      let finded = styleObj.find(v => {
        return v[0] === key
      })
      if (finded) {
        return finded[1]
      }
    }

    function onArrLikeStaticChange(key, value) {
      let trueVal = value.join()
      onStaticChange(key, trueVal)
    }

    function getStyleObjArrLikeValue(key) {
      let v = getStyleObjValue(key)
      if (v) {
        if ( v.includes(',')) {
          return v.split(',')
        }
        else {
          return [v]
        }
      }

      return ''
    }

    let predefineColors = [
        '#409EFF',
        '#67C23A',
        '#E6A23C',
        '#F56C6C',
        '#909399',
        '#303133'
    ]
    //
    // watch(() => page.store.model.styleObj, (newVal) => {
    //   console.log('styleObj', newVal)
    //   // if (!lock.isLocked) {
    //   //   dispatchChange()
    //   // }
    // })
    //
    watch(() => props.value, (newVal) => {
      // console.log('sdsdsdsdsdsdsds', locks, newVal)
      // initData(newVal)
      // if (typeof newVal === 'undefined') {
      //   // console.log(initData, newVal, page)
      // }
      // console.log(initData, newVal, page)
      if (locks) {
        initData(newVal)
      }
    }, {
      // immediate: true
    })



    return {
      isLengthProp,
      isPropType,
      onPropKeyChange,
      filterStatic,
      filterOptions,
      getStyleObjValue,
      removeStyleItem,
      EVENT_NAMES,
      onStaticChange,
      onArrLikeStaticChange,
      onPropValueChange,
      getStyleObjArrLikeValue,
      page,
      store: page.store,
      predefineColors,
      fontStyle
    }

  }
}
</script>
