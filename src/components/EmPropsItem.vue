<style lang="scss">
$cls: 'em-props-item';

.#{$cls} {
  &--hidden {
    position: absolute;
    right: 0;
    top: 120px;
    z-index: -1;
    opacity: 0;
    //background-color: #ffffff;
  }
  &--active {
    opacity: 1;
    background-color: #ffffff;
    z-index: 111;
    box-shadow: 0 0 10px #c0c4cc;
    padding: 10px;
  }
}
</style>

<template>
  <div class="em-props-item" :class="getCls">
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
    },
  },
  inject: ['EmProps'],
  data() {
    let config = this.binds?.config ?? {}
    return {
      active: false,
      config,
      uuid: 'em-props-item__' + ZY.rid(10)
    }
  },
  computed: {
    getCls() {
      if (this.config?.EmHidden) {
        return {
          'em-props-item--active': this.active,
          'em-props-item--hidden': 1
        }
      }
    }
  },
  mounted() {

    // console.log(this.binds)
    this.EmProps.register(this.uuid, this)
  }
}
</script>
