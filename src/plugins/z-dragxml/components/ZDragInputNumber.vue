<template>
  <div class="z-dragxml-com">
    <z-cell-item :vertical="true"
                 :label="GET_CONFIG('ui.label', '')"
                 :desc="GET_CONFIG('ui.widgetConfig.common_desc', '')"
    >
      <cus-input-number :ui="cus_config.ui"></cus-input-number>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusInputNumber from "@/components/CustomForm/CusInputNumber.vue";

export default {
  name: 'ZDragInputNumber',
  components: {CusInputNumber},
  ZDragXmlCom: true,
  DRAG_CONFIG() {
    return {
    }
  },
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1636443384554" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5113" width="16" height="16"><path d="M572.8 460.8c0-51.2-41.6-76.8-92.8-76.8-35.2 0-73.6 12.8-96 41.6l25.6 28.8c16-19.2 38.4-28.8 70.4-28.8 22.4 0 48 12.8 48 38.4 0 35.2-38.4 70.4-137.6 144v32H576v-38.4H464c64-51.2 108.8-92.8 108.8-140.8zM224 457.6l25.6 28.8 41.6-44.8V640H336V384h-38.4z m518.4 51.2c25.6-3.2 54.4-22.4 54.4-57.6 0-41.6-35.2-67.2-92.8-67.2-41.6 0-73.6 16-92.8 38.4l22.4 25.6c19.2-19.2 38.4-28.8 67.2-28.8 28.8 0 51.2 12.8 51.2 35.2 0 22.4-22.4 32-51.2 32H672v38.4h28.8c35.2 0 57.6 9.6 57.6 35.2 0 22.4-19.2 38.4-54.4 38.4-25.6 0-54.4-12.8-70.4-28.8L608 598.4c16 22.4 51.2 41.6 96 41.6 57.6 0 96-28.8 96-73.6 0-38.4-35.2-57.6-57.6-57.6z" p-id="5114"></path><path d="M896 192H128c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h768c35.2 0 64-28.8 64-64V256c0-35.2-28.8-64-64-64z m0 544c0 19.2-12.8 32-32 32H160c-19.2 0-32-12.8-32-32V288c0-19.2 12.8-32 32-32h704c19.2 0 32 12.8 32 32v448z" p-id="5115"></path></svg>
<div class="z-dragxml-label__name">数字输入框</div>
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
          type: 'number'
        }
      }
    }
  }
}
</script>
