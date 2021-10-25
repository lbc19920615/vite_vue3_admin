<style lang="scss" scoped>
.ew-suggest-list-con {
  max-height: 300px;
  overflow: auto;
}
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
.ew-suggest:not(.input-width-none) {
  .el-input-group {
    &.el-input-group--prepend :deep(.el-input__inner)  {
      border-top-left-radius: var(--el-input-border-radius, var(--el-border-radius-base));
      border-bottom-left-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    }
    :deep(.el-input-group__prepend) {
      padding: 0;
      //border-left: none !important;
      //border-right: none !important;
      display: none;
    }
  }
}
.ew-suggest.input-width-none {
  .el-input-group {
    :deep(.el-input-group__prepend) {
      background-color: transparent;
      //c
      //min-width: 170px;
      //position: relative;
      //&:empty {
      //  padding: 0;
      //  border: none;
      //  + .el-input__inner {
      //    border-radius: 4px;
      //  }
      //}
    }
    //.empty-trigger {
    //  position: absolute;
    //  left: 0;
    //  top: 0;
    //  width: 100%;
    //  height: 100%;
    //}
    width: 0;
    :deep(.el-input__inner) {
      padding: 0 !important;
      border-right: none;
    }
  }
}
</style>

<template>
  <div class="ew-suggest" :class="{'input-width-none': noInput}">
<!--{{state.value}}-->
    <el-input v-bind="$attrs" v-model="state.value" @blur="onBlur" @input="onInput">
      <template  #prepend>
        <slot name="prepend" v-bind="{value: state.value}"></slot>
      </template>
      <template #append>
        <e-popover
            class="cus-suggest__popover"
            :placement="placement"
            :width="conWidth"
            trigger="click"
            :append-to-body="true"
            :teleportTo="teleportTo"
            v-model:visible="state.popoverVisible"
        >
          <template #reference>
            <el-button class="cus-suggest__button" @click="setRefMan(true)"><slot name="button-text">选择</slot></el-button>
          </template>
          <div  style="min-height: 200px; max-height: 400px; overflow:auto">
            <SimpleList v-if="refMan.showed"
                        con-class="ew-suggest-list-con"
                        :column="column"
                        :suggest="getSuggest()" @select-item="selectSuggest"></SimpleList>
          </div>
        </e-popover>
      </template>
    </el-input>
  </div>
</template>

<script>

import SimpleList from "@/plugins/z-frame/components/SimpleList.vue";
import {reactive, watch} from "vue";
import {useReloadMan} from "@/views/home/hooks";
import EPopover from "@/components/EPopover/index";

export default  {
  name: 'EwSuggest',
  components: {EPopover, SimpleList},
  props: {
    modelValue: null,
    teleportTo: String,
    suggest: [],
    column: [],
    noInput: Boolean,
    usePrepend: Boolean,
    placement: {
      type: String,
      default: 'top'
    },
    conWidth: {
      type: [String, Number],
      default: 400
    }
  },
  setup(props, ctx) {
    let state = reactive({
      value: props.modelValue ?? '',
      popoverVisible: false
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
      // console.log('cus-ui__class-props', e)
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
    function onBlur() {
      ctx.emit('blur')
    }

    watch(() => props.modelValue, (newVal) => {
      state.value = newVal
    })

    function openPopver() {
      state.popoverVisible = true
      setRefMan(true)
    }

    return {
      state,
      setRefMan,
      onBlur,
      getSuggest,
      onInput,
      openPopver,
      selectSuggest,
      refMan,
    }
  }
}
</script>
