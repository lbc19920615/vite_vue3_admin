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
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1637649571774" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3435" width="16" height="16"><path d="M983.04 0H40.96A40.96 40.96 0 0 0 0 40.96v942.08c0 22.613333 18.346667 40.96 40.96 40.96h942.08a40.96 40.96 0 0 0 40.96-40.96V40.96a40.96 40.96 0 0 0-40.96-40.96z m-51.2 931.84H92.16V92.16h839.68v839.68z" p-id="3436"></path><path d="M789.162667 305.749333H229.888c-3.157333 0-5.717333 3.669333-5.717333 8.106667v65.28c0 4.437333 2.56 8.106667 5.717333 8.106667h559.274667c3.157333 0 5.717333-3.669333 5.717333-8.106667v-65.28c0-4.437333-2.56-8.106667-5.717333-8.106667z m0 326.058667H229.888c-3.157333 0-5.717333 3.669333-5.717333 8.192v65.194667c0 4.522667 2.56 8.192 5.717333 8.192h559.274667c3.157333 0 5.717333-3.669333 5.717333-8.192V640c0-4.522667-2.56-8.192-5.717333-8.192z m0-162.986667H229.888c-3.157333 0-5.717333 3.669333-5.717333 8.106667v65.28c0 4.437333 2.56 8.106667 5.717333 8.106667h559.274667c3.157333 0 5.717333-3.669333 5.717333-8.106667v-65.28c0-4.437333-2.56-8.106667-5.717333-8.106667z" p-id="3437"></path></svg>
<div class="z-dragxml-label__name">多行输入框</div>
</div>`
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        label: '多行文本',
        widgetConfig: {
          type: 'textarea'
        }
      }
    }
  },
  methods: {
    DRAG_CONFIG() {
      let obj = CusInput.CUS_EDITOR() ?? { props: {} }
      Reflect.deleteProperty(obj.props, 'type')
      return obj
    },
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
