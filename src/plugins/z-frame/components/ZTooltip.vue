<template>
  <el-tooltip
      effect="dark"
      placement="top-start"
  >
    <template #content><div v-html="state.marked"></div></template>
    <el-icon><InfoFilled></InfoFilled></el-icon>
  </el-tooltip>
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
    tooltip: null
  },
  setup(props) {
    // console.log('tooltip', props.tooltip)
    let state = reactive({
      marked: ZY_EXT.marked(props.tooltip)
    })


    return {
      state
    }
  }
}
</script>
