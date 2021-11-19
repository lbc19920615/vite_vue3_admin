<template>
  <div class="em-props-item">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'EmPropsItem',
  props: {
    binds: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    // console.log(this)
  }
}
</script>
