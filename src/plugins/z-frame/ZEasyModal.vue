<template>
  <section>
    <el-button @click="openModal">{{title}}</el-button>
    <el-dialog width="90vw" v-model="opened">
      <div>
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
    }
  },
  data() {
    return {
      opened: false
    }
  },
  methods: {
    openModal() {
      this.opened = true
    }
  }
}
</script>
