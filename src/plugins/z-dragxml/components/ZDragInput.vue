<template>
  <div class="z-dragxml-com">
    <z-cell-item label="sdsdsd">
      <cus-input></cus-input>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusInput from "@/components/CustomForm/CusInput.vue";

export default {
  name: 'ZDragInput',
  components: {CusInput},
  ZDragXmlCom: true,
  mixins: [
      ZDragCommonMixin
  ]
}
</script>
