<style lang="scss">
$tag: "unit-input";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="unit-input">
    <el-input-number size="small"  controls-position="right" style="width: 90px;" v-model.number="num" @change="changeItem(num)" type="text" ></el-input-number>
    <el-select  size="small" v-model="unit"  clearable
                @change="changeItem(unit)" style="width: 60px;">
      <el-option label="fr" value="fr" ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "UnitInput",
  props: {
    modelValue: null,
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      num: 0,
      unit: ''
    }
  },
  mounted() {
    // this.resolveValue()
  },
  watch: {
    modelValue: {
      handler(newVal) {
        console.log('resolveValue', newVal)
        this.resolveValue(newVal)
      },
      immediate: true
    }
  },
  methods: {
    resolveValue(newVal) {
      let v = parseInt(newVal)
      if (!Number.isNaN(v)) {
        this.num = v
      }
      // console.log(this.num)
      if (newVal && newVal.replace) {
        this.unit = newVal.replace(this.num, '')
      }
    },
    changeItem() {
      let v = `${this.num}${this.unit}`
      console.log('change item', v)
      this.$emit('update:modelValue', v)
    }
  }
}
</script>
