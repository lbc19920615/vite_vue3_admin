<template>
  <iframe ref="iframe" src="http://192.168.1.67:8080/#/main" style="width: 100%; height: 600px;" frameborder="0"></iframe>
</template>

<script>
class Message {
  static Message = 1
  type = 'Message'
  msg = ''
  constructor(msg) {
    this.msg = msg
  }
}

export default {
  mounted() {
    let channel = new MessageChannel();

    let ifr = this.$refs.iframe
    let otherWindow = ifr.contentWindow;

    ifr.addEventListener("load", iframeLoaded, false);

    function iframeLoaded() {
      otherWindow.postMessage(new Message('Hello sdsdsdsds'), '*', [channel.port2]);
    }

    channel.port1.onmessage = handleMessage;
    function handleMessage(e) {

    }
  }
}
</script>
