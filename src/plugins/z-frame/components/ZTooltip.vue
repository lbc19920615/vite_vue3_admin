<template>
  <el-popover
      effect="dark"
      placement="top-start"
      v-bind="$attrs"
      trigger="hover"
  >
    <div v-html="state.marked"></div>
    <template #reference><el-icon><InfoFilled></InfoFilled></el-icon></template>
  </el-popover>
</template>

<script>
import {InfoFilled} from "@element-plus/icons";
import {reactive} from "vue";

export default {
  name: 'ZTooltip',
  components: {
    InfoFilled
  },
  props: {
    tooltip: String
  },
  setup(props) {
    console.log('tooltip', props.tooltip)
    let state = reactive({
      marked: ZY_EXT.marked(props.tooltip ?? '')
    })


    return {
      state
    }
  }
}
</script>
