<style lang="scss">
$cls: 'em-props-item';

.#{$cls} {
  &__action {
    height: 0;
    overflow: hidden;
  }
  &--hidden {
    position: absolute;
    right: 0;
    top: 120px;
    z-index: -1;
    opacity: 0;
    //background-color: #ffffff;
  }
  &--active {
    //height: initial;
    opacity: 1;
    background-color: #ffffff;
    z-index: 111;
    box-shadow: 0 0 10px #c0c4cc;
    padding: 10px;
    .#{$cls}__action {
      height: initial;
    }
  }
}
</style>

<template>
  <div class="em-props-item" :class="getCls">
    <el-row class="em-props-item__action" align="middle" justify="space-between">
      <div>&nbsp;</div>
      <el-button size="small" @click="notityClose">
        <el-icon><close></close></el-icon>
      </el-button>
    </el-row>
    <slot></slot>
  </div>
</template>

<script>
import {Close} from "@element-plus/icons";

export default {
  name: 'EmPropsItem',
  components: {
    Close
  },
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
      render: null,
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
  methods: {
    notityClose() {
      this.EmProps.notityClose(this.uuid)
    }
  },
  mounted() {

    // console.log(this.binds)
    this.EmProps.register(this.uuid, this)
  }
}
</script>
