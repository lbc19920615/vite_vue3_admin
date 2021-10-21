<style lang="scss">
$tag: "unit-input";
$sel: "." + $tag;

#{$sel} {
  display: flex;
  align-items: center;
  &__clear {
    border-radius: 10000px;
    font-size: 12px;
    padding: 0 2px;
    min-height: auto;
  }
}
</style>

<template>
  <div class="unit-input">
    <el-input-number size="small"  controls-position="right"
                     style="width: 90px;" v-model.number="num"
                     @change="changeItem(num)" type="text" ></el-input-number>
    <el-select class="a-space-ml-10" filterable size="small" v-model="unit" clearable
                @change="changeItem(unit)" style="width: 90px;">
      <el-option v-for="unit in units"
                 :label="unit" :value="unit" ></el-option>
    </el-select>
    <el-button class="a-space-ml-10 unit-input__clear"
               @click="clearAll"
               size="mini"><el-icon><Close></Close></el-icon></el-button>
  </div>
</template>

<script>
import { Close } from "@element-plus/icons";

export default {
  name: "UnitInput",
  components: {
    Close
  },
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
      unit: '',
      units: [
          'fr',
          'px',
          'rem',
          'ex',
          'vw',
          'vh',
          'vmax',
          'vmin',
          'em',
          '%'
      ]
    }
  },
  mounted() {
    // this.resolveValue()
  },
  watch: {
    modelValue: {
      handler(newVal) {
        // console.log('resolveValue', newVal)
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
      // console.log('change item', v)
      // this.$emit('update:modelValue', v)
      this.$emit('change', v)
      this.$emit('fchange', v)
    },
    clearAll() {
      this.num = ''
      this.unit = ''
      // this.$emit('update:modelValue', '')
      this.$emit('change', '')
      this.$emit('fchange', v)
    }
  }
}
</script>
