<template>
  <el-radio-group v-model="radio" v-bind="$attrs">
    <el-radio-button
    v-for="option in getOptions(options)"
    :label="option.value"
    @change="onChange"
    >
      <el-tooltip
          effect="dark"
          :content="option.label"
          placement="top-start"
      >
      <i class="fa" v-if="option.icon" :class="getIconCls(option)"></i>
      <span v-else-if="option.label">{{option.label}}</span>
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
  emits: [
    'val-change'
  ],
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
    },
    onChange(e) {
      this.$emit('change', this.radio)
      this.$emit('val-change', this.radio)
    }
  }
})
</script>
