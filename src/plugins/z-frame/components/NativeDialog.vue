<style>
.native-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 80vw;
  z-index: 1111;
  margin: 0 auto;
  transform: translateY(10vh);
}
.native-dialog::backdrop {
  background: repeating-linear-gradient(
      30deg,
      rgba(24, 194, 236, 0.2),
      rgba(24, 194, 236, 0.2) 1px,
      rgba(24, 194, 236, 0.3) 1px,
      rgba(24, 194, 236, 0.3) 20px
  );
  backdrop-filter: blur(1px)
}
</style>

<template>
  <dialog ref="dialogRef" class="native-dialog" >
    <el-row class="a-space-mb-10" justify="space-between">
      <header>{{title}}</header>
      <el-button size="small" icon="el-icon-close"
                 @click="closeDialog"></el-button>
    </el-row>
    <slot></slot>
  </dialog>
</template>

<script>
import {ref, watch} from "vue";

export default {
  name: 'NativeDialog',
  props: {
    title: String,
    open: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'opened',
    'closed'
  ],
  setup(props, ctx) {
    let dialogRef = ref(null)

    watch(() => props.open, (newVal) => {
      // console.log('sdsdsdsdsds', newVal)
      if (newVal) {
        openDialog()
      } else {
        closeDialog()
      }
    })

    function openDialog() {
      if (dialogRef && dialogRef.value) {
        dialogRef.value.showModal()
        ctx.emit('opened')
      }
    }

    function closeDialog() {
      // console.log(dialogRef)
      if (dialogRef && dialogRef.value) {
        dialogRef.value.close()
        ctx.emit('closed')
      }
    }

    return {
      dialogRef,
      closeDialog
    }
  }
}
</script>
