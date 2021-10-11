<template>
  <div class="ew-select">
<!--    {{value}}-->
    <el-select
        class="ew-select__select"
        v-model="value"
        v-bind="$attrs"
        @change="change($event)"
    >
      <el-option
          class="ew-select__option"
          v-for="(option, index) in options"
          :key="'ew-select__option' + index"
          :label="option.label"
          :value="option.value"
      />
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'EwSelect',
  emits: [
    'update:modelValue'
  ],
  props: {
    options: {
      type: Array,
      default: _ => []
    },
    modelValue: null
  },
  data() {
    return {
      value: null
    }
  },
  watch: {
    modelValue: {
      handler(v) {
        this.value = v
      },
      immediate: true
    }
  },
  methods: {
    change(val) {
      // console.log('sdsdsdsds', val)
      this.$emit('update:modelValue', val)
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
