<style>
.z-style-input {
  flex: 1;
  width: initial;
}
</style>

<template>
  <div class="z-styles" v-if="page.inited">
<!--    {{valueConfig}}-->
    <template v-if="store.model.styleObj">
      {{store.model.styleObj}}
      <el-row align="middle" type="flex">
        <h3 class="a-space-pr-10">width</h3>
<!--        <el-input class="z-style-input"-->
<!--                  v-model="store.model.styleObj.width"></el-input>-->
        <unit-input  v-model="store.model.styleObj.width"></unit-input>
      </el-row>
    </template>
  </div>
</template>

<script>
import {extendControl2Page, useControl, extendCommonArrEventHandler} from "@/mixins/framework";
import {onBeforeUnmount, onMounted, toRaw} from "vue";
import UnitInput from "@/components/UnitInput.vue";
export default {
  name: 'ZStyles',
  components: {UnitInput},
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
      }
    }
    let computed = {}
    function onInited({storeControl}) {
      storeControl.set({
        styleObj: {}
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
      }
    })

    onMounted(function () {

    })

    return {
      EVENT_NAMES,
      page,
      store: page.store
    }

  }
}
</script>
