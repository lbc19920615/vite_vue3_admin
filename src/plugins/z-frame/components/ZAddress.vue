<template>
  <div class="z-address">
<!--    {{state.value}}-->
    <el-cascader
        v-model="state.value"
        :props="state.props"
    ></el-cascader>
  </div>
</template>

<script>
import {reactive} from "vue";

export default {
  name: 'ZAddress',
  props: {
    /**
     * 最大级别
     * 0  省
     * 1  省/市
     * 2  省/市/县
     */
    maxLevel: {
      type: Number,
      default: 2
    }
  },
  setup(props, ctx) {

    let id = 0;

    let state = reactive({
      value: '',
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          // console.log(level, node)
          setTimeout(() => {
            let nodes = []
            let data = node.data
            let area = chinaAreaManager.get(data.value ?? '86')
            // const nodes = Array.from({ length: level + 1 }).map((item) => ({
            //   value: ++id,
            //   label: `Option - ${id}`,
            //   leaf: level >= 2,
            // }))
            // console.log(level, area)
            if (area) {
              nodes = Object.entries(area).map(([key, value]) => {
                return {
                  label: value,
                  value: key,
                  leaf: level >= props.maxLevel,
                }
              })
            }
            // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.

            resolve(nodes)
          }, 300)
        },
      },
    })
    return {
      state
    }
  }
}
</script>
