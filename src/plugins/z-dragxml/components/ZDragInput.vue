<template>
  <div class="z-dragxml-com z-dragxml-input"
       :class="zdrag__highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter"
  >
<!--    {{uuid}}-->
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
  name: 'ZDragInput',
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
<svg t="1636083425081" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2423" width="16" height="16"><path d="M118.784 727.04h778.24V296.96h-778.24v430.08zM77.824 256h860.16v512H77.824V256zM194.56 409.6v204.8c0 12.288 8.192 20.48 20.48 20.48s20.48-8.192 20.48-20.48V409.6c0-12.288-8.192-20.48-20.48-20.48s-20.48 8.192-20.48 20.48z" p-id="2424"></path></svg>
<div class="z-dragxml-label__name">单行输入框</div>
</div>`
  },
  DRAG_DEFAULT_VAL() {
    return {
      type: 'string',
      ui: {
        label: '默认值',
      }
    }
  },
  methods: {
    DRAG_CONFIG() {
      let obj = CusInput.CUS_EDITOR() ?? { props: {} }
      // Reflect.deleteProperty(obj.props, 'type')
      return obj
    },
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusInput'
        }
      }
    },
  },
  data() {
    return {
      id: ZY.rid(6),
      INIT_CONFIG: {
        type: 'string',
      },
      ui: {
        label: '单行文本',
        widgetConfig: {
        }
      }
    }
  }
}
</script>
