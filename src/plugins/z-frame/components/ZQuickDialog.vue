<style lang="scss">
.z-quick-dialog {
  &__content {
  }
}

.z-quick-dialog__popover {
  max-width: var(--z-quick-dialog__popover-max-width, 700px);
}
</style>

<template>
  <section class="z-quick-dialog">
<!--    {{modelAttr}}-->
    <el-button v-bind="buttonAttr"
               @click="openModal"><slot name="button-content"></slot></el-button>
    <el-dialog class="z-quick-dialog__dialog" v-bind="modelAttr"
               v-model="opened"
                placement="top"
                popper-class="z-quick-dialog__popover"
               @opened="fireEvent('opened')"
               :title="title"
    >
      <div v-if="opened" class="z-quick-dialog__content">
        <slot></slot>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'ZQuickDialog',
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
  mounted() {
    let rect =      this.$el.getBoundingClientRect()
    console.log(rect)
  },
  methods: {
    openModal() {
      this.opened = !this.opened
    },
    hide() {
      this.opened = false
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
      this.$emit(name, this)
    }
  }
}
</script>
