<template>
  <div class="z-dragxml-com">
    <z-cell-item label="sdsdsd">
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
  data() {
    return {
      ui: {
        widgetConfig: {
          type: 'textarea'
        }
      }
    }
  }
}
</script>
