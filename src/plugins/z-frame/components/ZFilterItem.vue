<template>
  <div class="z-filter-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ZFilterItem',
  props: {
    maxHeight: {
      type: String,
      default: '1000px'
    }
  }
}
</script>
