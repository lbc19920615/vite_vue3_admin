<style lang="scss">
.z-easy-dialog {
  &__content {

  }
}

.z-easy-dialog__popover {
  max-width: var(--z-easy-dialog__popover-max-width, 700px);
}
</style>

<template>
  <section class="z-easy-dialog">
<!--    {{modelAttr}}-->
    <el-button @click="openModal"><slot name="button-content"></slot></el-button>
    <el-dialog class="z-easy-dialog__dialog" v-bind="modelAttr"
               v-model="opened"
                placement="top"
                popper-class="z-easy-dialog__popover"
               @opened="fireEvent('opened')"
               :title="title"
    >
      <div v-if="opened" class="z-easy-dialog__content">
        <slot></slot>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'ZEasyModal',
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
    },
    fireEvent(name) {
      this.$emit(name)
    }
  }
}
</script>
