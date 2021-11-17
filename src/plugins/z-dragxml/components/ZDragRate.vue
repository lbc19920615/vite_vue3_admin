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
      <cus-rate :ui="cus_config.ui"></cus-rate>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusRate from "@/components/CustomForm/CusRate.vue";


export default {
  name: 'ZDragRate',
  components: {CusRate},
  ZDragXmlCom: true,
  DRAG_CONFIG() {
    let obj = CusRate.CUS_EDITOR() ?? { props: {} }
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
<svg t="1636955855948" class="icon" viewBox="0 0 1069 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3535" width="16" height="16"><path d="M633.73 378.02l9.498 18.688 20.78 2.798 206.616 27.332a11.465 11.465 0 0 1 6.61 19.473L729.966 593.665l-14.893 14.893 3.8 20.683 37.847 204.89a11.465 11.465 0 0 1-16.481 12.296l-185.55-94.58-18.687-9.493-18.487 9.992-183.24 99.35a11.465 11.465 0 0 1-16.784-11.867l32.543-205.796 3.297-20.786-15.192-14.492-151.033-143.484a11.465 11.465 0 0 1 6.1-19.64L399 402.998l20.786-3.296 9.092-18.98 89.713-188.078a11.465 11.465 0 0 1 20.569-0.263l94.568 185.635zM496.647 85.52L374.89 340.501l-279.126 44.26a34.395 34.395 0 0 0-18.303 58.908l204.873 194.663-44.169 279.115a34.395 34.395 0 0 0 50.366 35.616l248.4-134.679L788.776 946.66a34.395 34.395 0 0 0 49.437-36.894l-51.306-277.854 199.731-199.909a34.395 34.395 0 0 0-19.828-58.408l-280.118-37.032L558.33 84.713a34.395 34.395 0 0 0-61.682 0.802z" p-id="3536"></path></svg>
<div class="z-dragxml-label__name">打分</div>
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
        }
      }
    }
  },
  methods: {
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusRate'
        }
      }
    },
  }
}
</script>
