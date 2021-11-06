<template>
  <div class="z-dragxml-com">
    <z-cell-item :label="id">
      <cus-checkbox :ui="ui"></cus-checkbox>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusCheckbox from "@/components/CustomForm/CusCheckbox.vue";


export default {
  name: 'ZDragCheckbox',
  components: {CusCheckbox},
  ZDragXmlCom: true,
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row"><svg t="1636083425081" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2423" width="16" height="16"><path d="M118.784 727.04h778.24V296.96h-778.24v430.08zM77.824 256h860.16v512H77.824V256zM194.56 409.6v204.8c0 12.288 8.192 20.48 20.48 20.48s20.48-8.192 20.48-20.48V409.6c0-12.288-8.192-20.48-20.48-20.48s-20.48 8.192-20.48 20.48z" p-id="2424"></path></svg>
<div>多选</div>
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
