<template>
  <div class="z-dragxml-com">
    <z-cell-item :label="id">
      <cus-radio :ui="ui"></cus-radio>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusRadio from "@/components/CustomForm/CusRadio.vue";


export default {
  name: 'ZDragRadio',
  components: {CusRadio},
  ZDragXmlCom: true,
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1636179342649" class="icon" viewBox="0 0 1040 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3616" width="16" height="16"><path d="M509.92 176C325.504 176 176 325.504 176 509.92c0 184.416 149.504 333.92 333.92 333.92 184.416 0 333.92-149.504 333.92-333.92C843.84 325.504 694.32 176 509.92 176z m0 48c157.904 0 285.92 128 285.92 285.92 0 157.904-128.016 285.92-285.92 285.92C352 795.84 224 667.808 224 509.92 224 352 352 224 509.92 224z m0 96C405.024 320 320 405.024 320 509.92c0 104.88 85.024 189.92 189.92 189.92 104.88 0 189.92-85.04 189.92-189.92 0-104.896-85.04-189.92-189.92-189.92z" p-id="3617"></path></svg>
<div class="z-dragxml-label__name">单选</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        widgetConfig: {
          options2: ZY.JSON5.stringify(
              [
                {
                  label: '选项1',
                  value: 'radio1'
                },
                {
                  label: '选项2',
                  value: 'radio2'
                }
              ]
          )
        }
      }
    }
  }
}
</script>
