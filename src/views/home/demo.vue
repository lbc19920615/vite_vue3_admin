<template>
  <iframe ref="iframe"  src="http://192.168.1.67:8080/#/main" style="width: 100%; height: 600px;" frameborder="0"></iframe>
</template>

<script>

export default {
  mounted() {
    import('__remote/public/message.js').then(Lib => {
      let channel = new MessageChannel();

      let ifr = this.$refs.iframe
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
          console.log('sdsdsdsdsd', name, value)
        }
      }
    })
  }
}
</script>
