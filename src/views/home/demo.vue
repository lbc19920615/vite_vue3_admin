<style lang="scss">
.demo1-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 80vw;
  z-index: 1111;
}
dialog::backdrop {
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
  <div v-if="page.inited">
    <iframe ref="iframe"  src="http://192.168.1.67:8080/#/main" style="width: 100%; height: 600px;" frameborder="0"></iframe>
    <dialog id="dialog1" ref="dialog1" class="demo1-dialog" >
      <el-row class="a-space-mb-10" justify="space-between">
        <header>hello</header>
        <el-button size="small" icon="el-icon-close" @click="closeDialog"></el-button>
      </el-row>
      <iframe ref="iframe2"
              src="/about-no" style="width: 100%; height: 600px;" frameborder="0"></iframe>
    </dialog>
  </div>
</template>

<script>

import {extendControl2Page, useAppPageControl, useControl} from "@/mixins/framework";
import CustomElement from "@/components/CustomElement.vue";
import {getCurrentInstance, onMounted} from "vue";

export default {
  components: {
    CustomElement,
  },
  setup() {
    let ctx = getCurrentInstance().ctx
    function onInited({storeControl}) {
      // console.log('page inited')
    }
    let properties =  {
      openDialog: {
        type: Boolean
      }
    }
    let computedProps = {
    }
    let page = useControl({properties, computed: computedProps}, {
      onInited,
      extendContext: {

      }
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    onMounted(() => {
      import('__remote/public/message.js').then(Lib => {
        let channel = new MessageChannel();

        let ifr = ctx.$refs.iframe
        let ifrWindow = ifr.contentWindow;

        ifr.addEventListener("load", iframeLoaded, false);

        function sendMessage(obj) {
          ifrWindow.postMessage(obj, '*', [channel.port2]);
        }

        function iframeLoaded() {
          sendMessage(new Lib.CommandMessage('open', [1,2,3]));
        }

        channel.port1.onmessage = handleMessage;
        function handleMessage(e) {
          let data = e.data
          let isCustom = Lib.detectIsCustomMessage(data)
          if (isCustom) {
            let {name, value} = data.msg
            // console.log('sdsdsdsdsd', name, value)
            if (name === 'open:form:dialog') {
              openDialog()
            }
          }
        }
      })

    })

    function closeDialog() {
      page.setData({
        openDialog: false
      })
      ctx.$refs.dialog1.close()
    }

    function openDialog() {
      page.setData({
        openDialog: true
      })
      ctx.$refs.dialog1.showModal()
    }

    return {
      closeDialog,
      store: page.store,
      page,
      openDialog
    }
  }
}
</script>
