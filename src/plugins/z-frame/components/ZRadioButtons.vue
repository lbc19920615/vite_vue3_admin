<template>
  <el-radio-group v-model="radio" v-bind="$attrs">
    <el-radio-button
    v-for="option in getOptions(options)"
    :label="option.value"
    >
      <el-tooltip
          effect="dark"
          :content="option.label"
          placement="top-start"
      >
      <i class="fa" :class="getIconCls(option)"></i>
      </el-tooltip>
    </el-radio-button>
<!--    <el-radio-button label="Washington"></el-radio-button>-->
<!--    <el-radio-button label="Los Angeles"></el-radio-button>-->
<!--    <el-radio-button label="Chicago"></el-radio-button>-->
  </el-radio-group>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'ZRadioButtons',
  props: {
    modelValue: null,
    options: Array
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.radio = newVal
      },
      immediate: true
    }
  },
  data() {
    return {
      radio: ''
    }
  },
  methods: {
    getOptions(v) {
      return v.map(item => {
        return item
      })
    },
    getIconCls(option) {
      return 'fa-' + option.icon
    }
  }
})
</script>
