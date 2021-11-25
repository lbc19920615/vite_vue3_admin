<style lang="scss">
.z-easy-hide {
  &__content {
    height: 0;
    overflow: hidden;
  }
}
</style>

<template>
  <section class="z-easy-hide">
    <el-button @click="openModal">{{title}}</el-button>
<!--    <el-dialog width="90vw" v-model="opened">-->
<!--      <div>-->
<!--        <slot></slot>-->
<!--      </div>-->
<!--    </el-dialog>-->
    <div class="z-easy-hide__content" :style="getStyle()">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ZEasyHide',
  emits: [
    'opened'
  ],
  props: {
    title: {
      type: String,
      default: '打开'
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
      if (this.opened) {
        this.$emit('opened')
      }
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
