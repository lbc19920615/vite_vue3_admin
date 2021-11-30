<template>
  <div class="z-dragxml-com"
       :class="drag_highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter">
    <z-cell-item v-bind="form_config"
                 :label="GET_CONFIG('ui.label', '')"
                 :desc="GET_CONFIG('ui.desc', '')"
    >
      <cus-cascader :ref="get_cus_ref" :ui="cus_config.ui"></cus-cascader>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusCascader from "@/components/CustomForm/CusCascader.vue";



export default {
  name: 'ZDragCascader',
  components: {CusCascader},
  ZDragXmlCom: true,
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1637561889615" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2486" width="16" height="16"><path d="M128 512V224c0-16 12.8-32 32-32h384c19.2 0 32 12.8 32 32v288c0 16-12.8 32-32 32h-32v64h64c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64H128c-35.2 0-64 28.8-64 64v352c0 35.2 28.8 64 64 64h192v-64H160c-16 0-32-12.8-32-32z" fill="#333333" p-id="2487"></path><path d="M896 416H704v64h160c19.2 0 32 12.8 32 32v288c0 16-12.8 32-32 32H480c-19.2 0-32-12.8-32-32V512c0-16 12.8-32 32-32h32v-64h-64c-35.2 0-64 28.8-64 64v352c0 35.2 28.8 64 64 64h448c35.2 0 64-28.8 64-64V480c0-35.2-28.8-64-64-64z" fill="#333333" p-id="2488"></path></svg>
<div class="z-dragxml-label__name">级联</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  methods: {
    setVal(v = []) {
      this.cus_ref.state.value = v
    },
    DRAG_CONFIG() {
      let obj = CusCascader.CUS_EDITOR() ?? { props: {} }
      return obj
    },
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusCascader'
        }
      }
    },
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        INIT_CONFIG: {
          type: 'string',
        },
        widgetConfig: {
          tree_options: ZY.JSON5.stringify(
              [
                {
                  "value": "part",
                  "label": {
                    "type": "i18n",
                    "en_US": "dep",
                    "zh_CN": "部门"
                  },
                  "children": [
                    {
                      "value": "part_a",
                      "label": "A部门"
                    },
                    {
                      "value": "part_b",
                      "label": "B部门"
                    }
                  ]
                },
                {
                  "value": "product",
                  "label": "产品",
                  "children": [
                    {
                      "value": "product_a",
                      "label": "a产品"
                    },
                    {
                      "value": "product_b",
                      "label": "b产品"
                    }
                  ]
                }
              ]
          )
        }
      }
    }
  }
}
</script>
