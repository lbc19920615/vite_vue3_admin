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
      <cus-date-time-picker :ui="cus_config.ui"></cus-date-time-picker>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusDateTimePicker from "@/components/CustomForm/CusDateTimePicker.vue";

export default {
  name: 'ZDragDateTimePicker',
  components: {CusDateTimePicker},
  ZDragXmlCom: true,
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1636965563344" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2495" width="16" height="16"><path d="M674.88 801.344c-10.4 0-20.256 9.824-20.256 25.088 0 10.432 9.856 20.8 20.256 20.8 10.496 0 20.384-10.368 20.384-20.8 0-15.264-9.888-25.088-20.384-25.088z m-313.088-163.072h67.232v66.944h-67.232v-66.944z m-119.424 0h72.672v66.944H242.368v-66.944z m618.048-21.12c-10.432 0-20.32 9.824-20.32 20.16 0 15.328 9.888 20.224 20.32 20.224 15.424 0 25.92-4.896 25.92-20.224-0.032-10.336-10.496-20.16-25.92-20.16z m-370.976 0c-10.464 0-20.32 9.824-20.32 20.16 0 15.328 9.856 20.224 20.32 20.224 10.496 0 20.352-4.896 20.352-20.224 0-10.336-9.856-20.16-20.352-20.16z m-127.648-87.008h67.232v67.008h-67.232v-67.008z m-119.424 0h72.672v67.008H242.368v-67.008z m535.488-10.304l-82.592 81.344c-4.896 0-9.888-4.864-20.384-4.864-10.4 0-20.256 4.864-25.888 10.4l-87.488-61.824c-4.896-9.792-20.288-4.896-25.888 0-4.896 5.536 0 20.8 5.6 25.728l92.384 71.584c0 20.832 21.024 36.128 41.28 36.128 25.92 0 41.312-15.296 41.312-41.024v-4.864l87.52-87.52c5.568-9.792 10.464-20.192 0-25.088-4.928-5.536-15.392-5.536-25.856 0z m-102.976-86.944c-10.4 0-20.256 9.824-20.256 20.224s9.856 20.192 20.256 20.192c10.496 0 20.384-9.792 20.384-20.192s-9.888-20.224-20.384-20.224z m-313.088-10.848h67.232v66.944h-67.232v-66.944zM190.528 340.48v409.408h288.448c-20.32-30.56-30.816-71.552-30.816-112.608 0-56.288 20.96-107.712 56.704-148.096h-30.816v-66.72h67.168v30.624c35.68-25.696 82.56-41.024 133.664-41.024h36.384v-71.616l-520.736 0.032z m149.76-107.712v56.288h221.216V232.768h-221.216zM180.064 186.88h541.056c25.888 0 46.848 20.768 46.848 45.92v200.096c82.016 35.488 138.688 112 138.688 204.416 0 127.936-102.944 230.144-231.776 230.144-51.104 0-102.88-20.224-144.16-50.816H180.064c-25.28 0-46.24-20.832-46.24-46.496V232.768A46.4 46.4 0 0 1 180.064 186.88" p-id="2496"></path></svg>
<div class="z-dragxml-label__name">日期选择器</div>
</div>`
  },
  DRAG_DEFAULT_VAL() {
    return {
      type: 'string',
      ui: {
        label: '默认值',
        widget: 'CusDateTimePicker',
        widgetConfig: {
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        }
      },
      rules: [
        {
          type: 'any'
        }
      ]
    }
  },
  mixins: [
    ZDragCommonMixin
  ],
  methods: {
    DRAG_CONFIG() {
      let obj = CusDateTimePicker.CUS_EDITOR() ?? { props: {} }
      Reflect.deleteProperty(obj.props, 'type')
      return obj
    },
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusDateTimePicker'
        }
      }
    },
  },
  data() {
    return {
      id: ZY.rid(6),
      INIT_CONFIG: {
        type: 'string',
        sub_type: 'datetime',
      },
      ui: {
        label: '时间日期选择',
        widgetConfig: {
          type: 'datetime',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          // sub_type: 'datetime'
        }
      }
    }
  }
}
</script>
