<style lang="scss">
.page-demo {
  --n-dialog-width: 96vw;
}
</style>

<template>
  <div class="page-demo" v-if="page.inited">
    <iframe ref="iframe"  src="http://192.168.1.67:8080/#/main" style="width: 100%; height: 600px;" frameborder="0"></iframe>

    <NativeDialog title="你好" :open="store.model.openDialog"
    @closed="closeDialog"
    >
      <FormManager v-if="store.model.openDialog"></FormManager>
    </NativeDialog>
  </div>
</template>

<script>

import {extendControl2Page, useAppPageControl, useControl} from "@/mixins/framework";
import CustomElement from "@/components/CustomElement.vue";
import {getCurrentInstance, onMounted} from "vue";
import FormManager from "@/views/about/components/FormManager.vue";
import NativeDialog from "@/plugins/z-frame/components/NativeDialog.vue";

export default {
  components: {
    NativeDialog,
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
          // console.log(e)
          let data = e.data
          let isCustom = Lib.detectIsCustomMessage(data)
          if (isCustom) {
            let {name, value} = data.msg
            console.log('sdsdsdsdsd', name, value)
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

          // openDialog()
        }

        ifr.addEventListener("load", onIframeLoaded, false);

      })

    })

    function closeDialog() {
      sendMessage(new Lib.CommandMessage('update:prop:form', ['form-112121212121']));
      page.setData({
        openDialog: false
      })
      // ctx.$refs.dialog1.close()
    }

    function openDialog() {
      page.setData({
        openDialog: true
      })
      // ctx.$refs.dialog1.showModal()
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
