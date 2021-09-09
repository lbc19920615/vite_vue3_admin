<style lang="scss">
.native-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--n-dialog-width, 80vw);
  z-index: 1111;
  margin: 0 auto;
  transform: translateY(10vh);
  height: var(--n-dialog-height, 80vh);
  --dialog-padding:  var(--n-dialog-padding, 20px);
  --nav-height:  var(--n-dialog-header-height, 40px);
  padding: var(--dialog-padding);
  &__header {
    height: var(--nav-height);
  }
  &__content {
    height: calc(100% - var(--nav-height) - (var(--dialog-padding) / 2));
  }
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
    <el-row class="a-space-mb-10 native-dialog__header"
            align="middle" justify="space-between">
      <header>{{title}}</header>
      <el-button size="small" icon="el-icon-close"
                 @click="closeDialog"></el-button>
    </el-row>
    <div class="native-dialog__content"><slot></slot></div>
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
