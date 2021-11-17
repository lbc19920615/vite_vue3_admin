<template>
  <div class="z-dragxml-com z-dragxml-input"
       :class="drag_highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter"
  >
<!--    {{uuid}}-->
    <z-cell-item v-bind="form_config"
                 :label="GET_CONFIG('ui.label', '')"
                 :desc="GET_CONFIG('ui.desc', '')"
    >
      <cus-slider :ui="cus_config.ui"></cus-slider>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusSlider from "@/components/CustomForm/CusSlider.vue";


export default {
  name: 'ZDragSlider',
  components: {CusSlider},
  ZDragXmlCom: true,
  DRAG_CONFIG() {
    let obj = CusSlider.CUS_EDITOR() ?? { props: {} }
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
<svg t="1636956012974" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2264" width="16" height="16"><path d="M951.453 476.844H523.672a131.836 131.836 0 0 0-254.18 0H72.547v70.312h196.945a131.836 131.836 0 0 0 254.18 0h427.781z" p-id="2265"></path></svg>
<div class="z-dragxml-label__name">滑块</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  methods: {
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusSlider'
        }
      }
    },
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        widgetConfig: {
        }
      }
    }
  }
}
</script>
