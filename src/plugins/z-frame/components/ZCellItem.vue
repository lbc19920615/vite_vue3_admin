<style lang="scss">
.z-cell-item {
  &.has-label {
    .z-cell-item__label {
      width: var(--z-cell-item-label-width, 100px);

      padding-right: var(--z-cell-item-padding-right, 10px);
    }
  }
  &__label {
    text-align: var(--z-cell-item-text-align, right);
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
  <el-row align="middle" class="z-cell-item" :class="{'has-label': label}" type="flex">
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
