<!--<template>-->
<!--  <my-vue-dialog @inited="onInit" :style="consts.style">-->
<!--    <slot></slot>-->
<!--  </my-vue-dialog>-->
<!--</template>-->

<script lang="jsx">
  import {h, inject} from 'vue'
  export default {
    name: "CustomElement",
    props: {
      is: String,
      name: {
        type: String,
        default() {
          return ZY.nid()
        }
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        EVENT_TYPES: {
          inited: Symbol('customElement:inited')
        },
        obj: null,
        webComponentRef: null,
      }
    },
    render() {
      let self = this
      let webComponentRef = inject('webComponentRef')
      let slots = []
      for (let key in this.$slots) {
        let slotCom = this.$slots[key]
        slots.push(slotCom())
      }
      this.webComponentRef = webComponentRef
      return h(this.is, {
        style: {
          ['--dialog-inner-top']: '10vh'
        },
        ...this.params,
        name: this.name,
        onInited: function (e) {
          let instance = e.detail[0]
          self.obj = webComponentRef.register(instance.ctx, self.name)
          // instance.ctx.toggleOpen(true)
          // console.log(webComponentRef, self.obj)
        },
        onFires: function (e) {
          if (e.detail[0]) {
            let {type, args} = e.detail[0]
            // console.log('type', type, args)
            self.obj.emit(type, args)
          }
        }
      }, slots)
    },
    beforeUnmount() {
      let self = this
      let webComponentRef = this.webComponentRef
      webComponentRef.destory(self.obj.uuid)
    }
  }
</script>
