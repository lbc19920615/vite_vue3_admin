<template>
  <div>
    <el-row align="middle" type="flex" class="a-space-mb-15">
      <div class="a-space-mr-10">描述</div>
      <el-input type="textarea" v-model="state.common_desc"
                @change="onCommonChange" style="width: 350px"
      ></el-input>
    </el-row>
    <el-row align="middle" type="flex" class="a-space-mb-15">
      <div class="a-space-mr-10">状态</div>
      <ZRadioButtons
          size="small"
          :options="commonOptions"
          v-model="state.common_state"
          @val-change="onCommonChange"
      ></ZRadioButtons>
    </el-row>
  </div>
</template>

<script>
import ZRadioButtons from "@/plugins/z-frame/components/ZRadioButtons.vue";
import {reactive, toRaw} from "vue";
export default {
  name: "ZCommonAttrs",
  emits: [
    'common-change'
  ],
  components: {ZRadioButtons},
  props: {
    value: null
  },
  setup(props, ctx) {
    let commonOptions = [
      {
        label: '普通',
        value: ''
      },
      {
        label: '只读',
        value: 'readonly'
      },
      {
        label: '禁用',
        value: 'disabled'
      },
      {
        label: '隐藏',
        value: 'hidden'
      },
    ]


    let def = {
      common_state: '',
      common_desc: '',
      ...props.value
    }
    console.log('props', props.value)
    let state = reactive(def)

    function onCommonChange(v) {
      // ZY.lodash.each(clonedValue.data, function (item, key) {
      //   if (key.startsWith('common_')) {
      //     base_ret[key] = item
      //     // let replaces = key.replace('common_', '')
      //     // if (item && key === 'common_state') {
      //     //   base_ret[item] = item
      //     // }
      //   }
      // })
      // console.log('sdsds')
      // let base_ret = {}
      // if (v) {
      //   base_ret[v] = v
      // }
      ctx.emit('common-change', toRaw(state))
    }

    return {
      onCommonChange,
      state,
      commonOptions,
    }
  }
}
</script>
