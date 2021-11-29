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
      <cus-time-picker :ui="cus_config.ui"></cus-time-picker>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusTimePicker from "@/components/CustomForm/CusTimePicker.vue";

export default {
  name: 'ZDragTimePicker',
  components: {CusTimePicker},
  ZDragXmlCom: true,
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1637026689733" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2490" width="16" height="16"><path d="M511.488 32C246.592 32 32 247.04 32 512c0 264.96 214.592 480 479.488 480 265.472 0 480.512-215.04 480.512-480 0-264.96-215.04-480-480.512-480zM512 896c-212.16 0-384-171.84-384-384s171.84-384 384-384 384 171.84 384 384-171.84 384-384 384z m24-624H464v288l252.032 151.232 35.968-59.072-216-128.128V272z" p-id="2491"></path></svg>
<div class="z-dragxml-label__name">时间选择器</div>
</div>`
  },
  DRAG_DEFAULT_VAL() {
    return {
      type: 'string',
      ui: {
        label: '默认值',
        widget: 'CusTimePicker',
        widgetConfig: {
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
      let obj = CusTimePicker.CUS_EDITOR() ?? { props: {} }
      Reflect.deleteProperty(obj.props, 'type')
      return obj
    },
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusTimePicker'
        }
      }
    },
  },
  data() {
    return {
      id: ZY.rid(6),
      INIT_CONFIG: {
        type: 'string',
        sub_type: 'time',
      },
      ui: {
        label: '时间选择',
        widgetConfig: {
        }
      }
    }
  }
}
</script>
