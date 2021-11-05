<template>
  <div class="z-dragxml-com">
    <z-cell-item :label="id">
      <cus-input :ui="ui"></cus-input>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusInput from "@/components/CustomForm/CusInput.vue";

export default {
  name: 'ZDragTextarea',
  components: {CusInput},
  ZDragXmlCom: true,
  mixins: [
      ZDragCommonMixin
  ],
  DRAG_DATASET() {
    return {
      columnMax: 12
    }
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        widgetConfig: {
          type: 'textarea'
        }
      }
    }
  }
}
</script>
