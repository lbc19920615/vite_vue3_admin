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
      {{store.model.styleObj}}
      <section class="a-space-mb-10">
        <header>文字</header>
        <el-row align="middle" type="flex">
          <div>ALIGN</div>
          <ZRadioButtons
              class="a-space-ml-10"
              :model-value="getStyleObjValue('text-align')"
              :options="fontStyle.alignOptions"
              @change="onStaticChange('text-align', $event)"
          ></ZRadioButtons>
        </el-row>
      </section>

      <el-row align="middle" type="flex"  class="a-space-mb-10"
              v-for="(styleItem, styleItemIndex) in filterStatic( store.model.styleObj)"
              :key="styleItemIndex"
      >
<!--        <h3 class="a-space-pr-10">width</h3>-->
        <ew-select
            size="small"
            class="z-style-select" filterable
            :options="filterOptions(store.model.options)"
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
                      v-model="styleItem[1]"></unit-input>
          <el-color-picker v-model="styleItem[1]" show-alpha
                           v-else-if="isPropType(styleItem[0], 'color')"
          />

<!--          <el-input    size="small" v-else v-model="styleItem[1]"></el-input>-->
          <ew-suggest
              v-else-if="styleItem[0]"
              size="small"
                       v-model="styleItem[1]"></ew-suggest>
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
    </template>
    <el-button size="mini"
               @click="page.callEvent('add:styleObj', store.model.styleObj)">
      <el-icon><Plus></Plus></el-icon>
    </el-button>
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
let STATIC_PROPS = ['text-align']

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
    let locks = true
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
    let computed = {}
    function onInited({storeControl}) {
      // console.log('value', props.value)
      storeControl.set({
        styleObj: Array.isArray(props.value) ? props.value : [],
        options:
            ZY.DOM.getAllPropKeys()
            .map(v => {
              return {
                label: v,
                value: v
              }
            })
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
      ctx.emit('props-change', page.store.model.styleObj)
    }

    onChange( (type, e) => {
      // let { parts, partName, selfpath, process } = e
      // let model = parts[partName].getModel()
      // let newVal = toRaw(model)
      // // console.log(type, e, toRaw(model))
      // ctx.emit('update:value', newVal)
      // ctx.emit('change', newVal)
    })

    page.setEventHandler({
      // ['model:update:all'](e) {
      //   if (!locks) {
      //     ctx.emit('props-change', e.model)
      //   }
      // },
      ['form:input:blur'](e) {
        // console.log('sdsdsdsdsdsds', e)
        ctx.emit('form:input:blur', e)
      },
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
    }


    function onPropKeyChange(styleItemIndex, styleItem) {
      // console.log('styleItemIndex', styleItemIndex, styleItem)
      if (styleItem[1]) {
        styleItem[1] = ''
      }
    }

    function filterStatic(options = []) {
      return options.filter(v => {
        return !STATIC_PROPS.includes(v[0])
      })
    }

    function filterOptions(options) {
      return options.filter(v => {
        return !STATIC_PROPS.includes(v.label)
      })
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
      ]
    }

    watch(page.store, (newVal) => {
      // console.log('sdsdsdsdsds', newVal)
      dispatchChange()
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
      page,
      store: page.store,
      fontStyle
    }

  }
}
</script>
