<style>

</style>

<template>
  <div class="z-attrs" v-if="page.inited">
<!--    {{valueConfig}}-->
    <template v-if="store.model.styleObj">
<!--      {{store.model.styleObj}}-->
<!--      <el-collapse :border="false">-->


        <div title="其他" class="a-space-mb-15">
          <section>
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

<!--              <z-window  class="a-space-ml-10" v-if="styleItem[0]"-->
<!--                         :url="'https://developer.mozilla.org/en-US/docs/Web/CSS/' + styleItem[0]"-->
<!--              >-->
<!--                &lt;!&ndash;          <el-icon>&ndash;&gt;-->
<!--                &lt;!&ndash;            <info-filled />&ndash;&gt;-->
<!--                &lt;!&ndash;          </el-icon>&ndash;&gt;-->
<!--                <i class="fa fa-book"></i>-->
<!--              </z-window>-->

              <div class="a-space-ml-10" style="display:flex; align-items: center" v-if="styleItem[0]">
<!--                <unit-input v-if="isLengthProp(styleItem[0])"-->
<!--                            v-model="styleItem[1]"-->
<!--                            @change="onPropValueChange"-->
<!--                ></unit-input>-->
<!--                <el-color-picker v-model="styleItem[1]" show-alpha-->
<!--                                 v-else-if="isPropType(styleItem[0], 'color')"-->
<!--                                 @change="onPropValueChange"-->
<!--                />-->

                <!--          <el-input    size="small" v-else v-model="styleItem[1]"></el-input>-->
                <ew-suggest
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

<!--      </el-collapse>-->

    </template>
  </div>
</template>

<script>
import {extendControl2Page, useControl, extendCommonArrEventHandler} from "@/mixins/framework";
import {watch} from "vue";
import UnitInput from "@/components/UnitInput.vue";
import EwSelect from "@/components/Ew/EwSelect.vue";
import * as elementIcons from "@element-plus/icons";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import ZWindow from "@/plugins/z-frame/components/ZWindow.vue";

let LENGTH_PROPS = ['width', 'height']
let COLOR_PROPS = ['color', 'background-color']
let STATIC_PROPS = []

export default {
  name: 'ZAttrs',
  components: {ZWindow, EwSuggest, EwSelect, UnitInput, ...elementIcons},
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
          options: [
            {
              label: 'ai',
              value: 'ai'
            }
          ]
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
    let { EVENT_NAMES } = extendCommonArrEventHandler(page)

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


    watch(() => props.value, (newVal) => {
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
      onArrLikeStaticChange,
      onPropValueChange,
      getStyleObjArrLikeValue,
      page,
      store: page.store,
      fontStyle
    }

  }
}
</script>
