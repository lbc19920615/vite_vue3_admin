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
      <el-row align="middle" type="flex"  class="a-space-mb-10"
              v-for="(styleItem, styleItemIndex) in store.model.styleObj"
              :key="styleItemIndex"
      >
<!--        <h3 class="a-space-pr-10">width</h3>-->
        <ew-select
            size="small"
            class="a-space-mr-10 z-style-select" filterable
            :options="store.model.options" v-model="styleItem[0]"></ew-select>
<!--        <el-input class="z-style-input"-->
<!--                  v-model="store.model.styleObj.width"></el-input>-->
        <div class="a-space-mr-10" style="display:flex; align-items: center" v-if="styleItem[0]">
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
        <el-button size="mini" type="danger"
                   @click="removeStyleItem(store.model.styleObj, styleItemIndex)">
          <el-icon>
            <Delete></Delete>
          </el-icon>
        </el-button>
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
import {onBeforeUnmount, onMounted, toRaw} from "vue";
import UnitInput from "@/components/UnitInput.vue";
import EwSelect from "@/components/Ew/EwSelect.vue";
import {Plus, Delete} from "@element-plus/icons";
import EwSuggest from "@/components/Ew/EwSuggest.vue";

let LENGTH_PROPS = ['width', 'height']
let COLOR_PROPS = ['color', 'background-color']

export default {
  name: 'ZStyles',
  components: {EwSuggest, EwSelect, UnitInput, Plus, Delete},
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
      storeControl.set({
        styleObj: [],
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

    onChange( (type, e) => {
      let { parts, partName, selfpath, process } = e
      let model = parts[partName].getModel()
      let newVal = toRaw(model)
      // console.log(type, e, toRaw(model))
      ctx.emit('update:value', newVal)
      ctx.emit('change', newVal)
    })

    page.setEventHandler({
      ['model:update:all'](e) {
        if (!locks) {
          ctx.emit('props-change', e.model)
        }
      },
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

    function removeStyleItem(arr, index) {
      arr.splice(index, 1)
    }

    onMounted(function () {

    })

    return {
      isLengthProp,
      isPropType,
      removeStyleItem,
      EVENT_NAMES,
      page,
      store: page.store
    }

  }
}
</script>
