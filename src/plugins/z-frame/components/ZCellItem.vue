<style lang="scss">
.z-cell-item {
  &[vertical] {
    display: block;
    &.has-label {
      .z-cell-item__label {
        text-align: var(--z-cell-item__vertical-text-align, left);
        padding-bottom: var(--z-cell-item__vertical-padding-bottom, 10px);
      }
    }
  }
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
<!--  {{vertical + ''}}-->
  <el-row :vertical="vertical" align="middle" class="z-cell-item" :class="{'has-label': label}" type="flex">
    <div class="z-cell-item__label">{{label}}</div>
    <div class="z-cell-item__content">
      <div class="z-cell-item__con"><slot></slot></div>
      <div class="z-cell-item__desc">{{desc}}</div>
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'ZCellItem',
  props: {
    label: String,
    vertical: Boolean,
    desc: String
  }
}
</script>
