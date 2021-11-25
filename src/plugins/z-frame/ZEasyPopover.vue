<style lang="scss">
.z-easy-popover {
  &__content {

  }
}

.z-easy-popover__popover {
  max-width: var(--z-easy-popover__popover-max-width, 700px);
}
</style>

<template>
  <section class="z-easy-popover">
<!--    {{modelAttr}}-->
    <el-popover class="z-easy-popover__dialog"
                v-bind="modelAttr"
                v-model="opened"
                popper-class="z-easy-popover__popover"
    >
      <template #reference> <el-button
          v-bind="buttonAttr"
          @click="openModal">{{title}}</el-button></template>
      <div class="z-easy-popover__content">
        <slot></slot>
      </div>
    </el-popover>
  </section>
</template>

<script>
export default {
  name: 'ZEasyPopover',
  props: {
    title: {
      type: String,
      default: '打开'
    },
    modelAttr: {
      type: Object,
      default() {
        return {}
      }
    },
    buttonAttr: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    openModal() {
      this.opened = !this.opened
    },
    getStyle() {
      if (this.opened ) {
        return {
          height: 'auto'
        }
      }
      return {
      }
    }
  }
}
</script>
