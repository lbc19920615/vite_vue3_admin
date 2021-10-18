<style lang="scss">
.z-easy-dialog {
  &__content {

  }
}
</style>

<template>
  <section class="z-easy-dialog">
    <el-button @click="openModal">{{title}}</el-button>
    {{modelAttr}}
    <el-dialog custom-class="z-easy-dialog__dialog" v-bind="modelAttr"
               width="90vw" v-model="opened">
      <div class="z-easy-dialog__content">
        <slot></slot>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'ZEasyDialog',
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
    }
  }
}
</script>
