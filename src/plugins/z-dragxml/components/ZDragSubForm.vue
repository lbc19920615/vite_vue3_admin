<template>
  <div class="z-dragxml-com"
       @mouseenter.stop="callParentMoveEnter"
  >
    <div>子表单</div>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";


export default {
  name: 'ZDragSubForm',
  components: {},
  ZDragXmlCom: true,
  mixins: [
      ZDragCommonMixin
  ],
  DRAG_CONFIG() {
    return {
    }
  },
  DRAG_SUB_FORM: true,
  DRAG_DATASET() {
    return {
      columnMax: 1000000
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1636179309099" class="icon" viewBox="0 0 1117 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2623" width="16" height="16"><path d="M1024.418909 1024h-930.909091a93.090909 93.090909 0 0 1-93.090909-93.090909V93.090909a93.090909 93.090909 0 0 1 93.090909-93.090909h930.909091a93.090909 93.090909 0 0 1 93.090909 93.090909v837.818182a93.090909 93.090909 0 0 1-93.090909 93.090909z m46.545455-930.909091a46.545455 46.545455 0 0 0-46.545455-46.545454h-930.909091a46.545455 46.545455 0 0 0-46.545454 46.545454v837.818182a46.545455 46.545455 0 0 0 46.545454 46.545454h930.909091a46.545455 46.545455 0 0 0 46.545455-46.545454V93.090909z m-186.181819 791.272727h-651.636363a93.090909 93.090909 0 0 1-93.090909-93.090909V232.727273a93.090909 93.090909 0 0 1 93.090909-93.090909h651.636363a93.090909 93.090909 0 0 1 93.09091 93.090909v558.545454a93.090909 93.090909 0 0 1-93.09091 93.090909z m-698.181818-93.090909a46.545455 46.545455 0 0 0 46.545455 46.545455h325.818182v-139.636364h-372.363637v93.090909z m0-139.636363h372.363637v-139.636364h-372.363637v139.636364z m0-186.181819h372.363637V325.818182h-372.363637v139.636363z m744.727273-232.727272a46.545455 46.545455 0 0 0-46.545455-46.545455h-651.636363a46.545455 46.545455 0 0 0-46.545455 46.545455v46.545454h744.727273V232.727273z m0 93.090909h-325.818182v139.636363h325.818182V325.818182z m0 186.181818h-325.818182v139.636364h325.818182v-139.636364z m0 186.181818h-325.818182v139.636364h279.272727a46.545455 46.545455 0 0 0 46.545455-46.545455v-93.090909z" p-id="2624"></path></svg>
<div class="z-dragxml-label__name">子表单</div>
</div>`
  },
  data() {
    return {
      id: ZY.rid(6),
      DATA_IS_SUB_FORM: true,
      ui: {
        widgetConfig: {
          type: 'textarea'
        }
      }
    }
  },
  methods: {
    callParentMoveEnter(e) {
      // console.log(this.draginit, e)
      if (this.draginit) {
        this.draginit.onMouseEnter()
      }
    }
  }
}
</script>
