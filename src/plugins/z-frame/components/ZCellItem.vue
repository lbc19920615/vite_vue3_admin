<style lang="scss">
.z-cell-item {
  &__label {
    width: var(--z-cell-item-label-width, 100px);
    text-align: var(--z-cell-item-text-align, right);
    padding-right: var(--z-cell-item-padding-right, 10px);
  }
  &__content {
    flex: 1;
  }
}
.z-cell-item + .z-cell-item {
  margin-top: var(--z-cell-item-margin-top, 15px);
}
</style>

<template>
  <el-row class="z-cell-item" type="flex">
    <div class="z-cell-item__label">{{label}}</div>
    <div class="z-cell-item__content"><slot></slot></div>
  </el-row>
</template>

<script>
export default {
  name: 'ZCellItem',
  props: {
    label: String
  }
}
</script>
