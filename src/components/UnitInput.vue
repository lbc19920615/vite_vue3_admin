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
    modelValue: null
  },
  data() {
    return {
      num: 0,
      unit: ''
    }
  },
  mounted() {
    this.num = parseInt(this.modelValue)
    // console.log(this.num)
    if (this.modelValue && this.modelValue.replace) {

      this.unit = this.modelValue.replace(this.num, '')
    }
  },
  methods: {
    changeItem() {
      let v = `${this.num}${this.unit}`
      console.log('change item', v)
      this.$emit('update:modelValue', v)
    }
  }
}
</script>
