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
  inject: ['EmProps'],
  data() {
    return {
      uuid: 'em-props-item__' + ZY.rid(10)
    }
  },
  mounted() {

    console.log(this.binds)
    this.EmProps.register(this.uuid, this)
  }
}
</script>
