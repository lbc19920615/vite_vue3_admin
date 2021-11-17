<template>
  <div class="z-dragxml-com z-dragxml-input"
       :class="drag_highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter">
<!--    {{form_config}}-->
    <z-cell-item v-bind="form_config"
                 :label="GET_CONFIG('ui.label', '')"
                 :desc="GET_CONFIG('ui.desc', '')"
    >
      <cus-input :ui="cus_config.ui"></cus-input>
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
  DRAG_CONFIG() {
    let obj = CusInput.CUS_EDITOR() ?? { props: {} }
    Reflect.deleteProperty(obj.props, 'type')
    return obj
  },
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1636083606082" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3332" width="16" height="16"><path d="M896 64c38.4 0 64 25.6 64 64v768c0 38.4-25.6 64-64 64H128c-38.4 0-64-25.6-64-64V128c0-38.4 25.6-64 64-64h768m0-64H128C57.6 0 0 57.6 0 128v768c0 70.4 57.6 128 128 128h768c70.4 0 128-57.6 128-128V128c0-70.4-57.6-128-128-128z" p-id="3333"></path><path d="M249.6 486.4h160L352 320c-6.4-12.8-12.8-32-19.2-51.2-6.4 19.2-12.8 38.4-19.2 51.2l-64 166.4z m-12.8 44.8L192 646.4c-6.4 12.8-12.8 12.8-19.2 12.8h-12.8c-12.8 0-19.2-12.8-19.2-25.6v-12.8l153.6-384c6.4-19.2 19.2-25.6 38.4-25.6s32 6.4 38.4 25.6l153.6 390.4v12.8c0 12.8-6.4 19.2-19.2 25.6h-12.8c-12.8 0-19.2-6.4-25.6-12.8l-38.4-121.6h-192z" p-id="3334"></path><path d="M172.8 729.6h704c19.2 0 32 12.8 32 32s-12.8 32-32 32h-704c-19.2 0-32-12.8-32-32s12.8-32 32-32zM620.8 576h256c19.2 0 32 12.8 32 32s-12.8 32-32 32h-256c-19.2 0-32-12.8-32-32s12.8-32 32-32zM620.8 416h256c19.2 0 32 12.8 32 32s-12.8 32-32 32h-256c-19.2 0-32-12.8-32-32s12.8-32 32-32zM620.8 249.6h256c19.2 0 32 12.8 32 32s-12.8 32-32 32h-256c-19.2 0-32-12.8-32-32s12.8-32 32-32z" p-id="3335"></path></svg>
<div class="z-dragxml-label__name">多行输入框</div>
</div>`
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
  },
  methods: {
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusInput'
        }
      }
    },
  }
}
</script>
