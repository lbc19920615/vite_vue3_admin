<style lang="scss">
.z-easy-dialog {
  &__content {

  }
}
</style>

<template>
  <section class="z-easy-dialog">
<!--    {{modelAttr}}-->
    <el-popover class="z-easy-dialog__dialog" v-bind="modelAttr"
               v-model="opened"
                placement="top"
    >
      <template #reference> <el-button @click="openModal">{{title}}</el-button></template>
      <div class="z-easy-dialog__content">
        <slot></slot>
      </div>
    </el-popover>
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
