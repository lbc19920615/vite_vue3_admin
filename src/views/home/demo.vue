<style lang="scss">
.demo1-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 80vw;
  z-index: 1111;
  margin: 0 auto;
  transform: translateY(10vh);
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
        <header>你好</header>
        <el-button size="small" icon="el-icon-close" @click="closeDialog"></el-button>
      </el-row>
      <FormManager></FormManager>
    </dialog>
  </div>
</template>

<script>

import {extendControl2Page, useAppPageControl, useControl} from "@/mixins/framework";
import CustomElement from "@/components/CustomElement.vue";
import {getCurrentInstance, onMounted} from "vue";
import FormManager from "@/views/about/components/FormManager.vue";

export default {
  components: {
    FormManager,
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

    let Lib = null
    let sendMessage = null

    onMounted(() => {
      import('__remote/public/message.js').then(res => {
        Lib = res
        let ifr = ctx.$refs.iframe
        let ifrWindow = ifr.contentWindow;


        function handleMessage(e) {
          console.log(e)
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

        function onIframeLoaded() {
          sendMessage = function (obj) {
            const {port1, port2} = new MessageChannel();
            port1.onmessage = handleMessage;
            ifrWindow.postMessage(obj, '*', [port2]);
          }
          sendMessage(new Lib.CommandMessage('ping', [1,2,3]));

          openDialog()
        }

        ifr.addEventListener("load", onIframeLoaded, false);

      })

    })

    function closeDialog() {
      sendMessage(new Lib.CommandMessage('update:prop:form', ['form-112121212121']));
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
