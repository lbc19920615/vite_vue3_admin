<style lang="scss">
.ew-suggest-list-con {
  max-height: 300px;
  overflow: auto;
}
</style>

<template>
  <div class="ew-suggest">
{{state.value}}
    <el-input v-model="state.value" @input="onInput">
      <template #append>
        <e-popover
            class="cus-suggest__popover"
            :placement="placement"
            :width="400"
            trigger="click"
            :append-to-body="true"
            :teleportTo="teleportTo"
        >
          <template #reference>
            <el-button class="cus-suggest__button" @click="setRefMan(true)">选择</el-button>
          </template>
          <div  style="min-height: 200px;">
            <SimpleList v-if="refMan.showed"
                        con-class="ew-suggest-list-con"
                        :suggest="getSuggest()" @select-item="selectSuggest"></SimpleList>
          </div>
        </e-popover>
      </template>
    </el-input>
  </div>
</template>

<script>

import SimpleList from "@/plugins/z-frame/components/SimpleList.vue";
import {reactive} from "vue";
import {useReloadMan} from "@/views/home/hooks";
import EPopover from "@/components/EPopover/index";

export default  {
  name: 'EwSuggest',
  components: {EPopover, SimpleList},
  props: {
    modelValue: null,
    teleportTo: String,
    suggest: [],
    placement: {
      type: String,
      default: 'top'
    }
  },
  setup(props, ctx) {
    let state = reactive({
      value: props.modelValue ?? ''
    })
    function onChange() {
      ctx.emit('update:modelValue', state.value)
    }
    let [refMan, setRefMan] = useReloadMan({timeout: 500})

    function getSuggest() {
      if (props.suggest) {
        return props.suggest
      }
      else {
        return []
      }
    }

    function selectSuggest(e) {
      console.log('cus-ui__class-props', e)
      state.value = e
      setTimeout(() => {
        onChange()
        ctx.emit('value:change', state.value)
      }, 30)
    }
    function onInput() {
      setTimeout(() => {
        onChange()
        ctx.emit('value:change', state.value)
      }, 30)
    }

    return {
      state,
      setRefMan,
      getSuggest,
      onInput,
      selectSuggest,
      refMan,
    }
  }
}
</script>
