<template>
  <div class="z-dragxml-com"
       :class="drag_highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter">
<!--    {{form_config}}-->
    <z-cell-item v-bind="form_config"
                 :label="GET_CONFIG('ui.label', '')"
                 :desc="GET_CONFIG('ui.desc', '')"
    >
    address
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusRichText from "@/components/CustomForm/CusRichText.vue";

export default {
  name: 'ZDragAddress',
  components: {},
  DRAG_GROUP: 'high',
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
<svg t="1637649668729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8321" width="16" height="16"><path d="M468.139 250.539a12.203 12.203 0 0 0-2.475-0.256H229.248a11.99 11.99 0 0 0-11.861 11.818v63.232a11.69 11.69 0 0 0 11.648 11.648h0.213a11.776 11.776 0 0 0 11.648-10.453v0.256a44.8 44.8 0 0 1 43.179-46.336h18.901a15.19 15.19 0 0 1 14.677 13.781v196.267a20.139 20.139 0 0 1-19.498 19.755h-10.752a11.69 11.69 0 0 0-11.691 11.648v0.213a11.69 11.69 0 0 0 11.69 11.69h120.235a11.69 11.69 0 0 0 11.691-11.69v-0.213a11.69 11.69 0 0 0-11.69-11.648h-13.995a15.53 15.53 0 0 1-16.214-13.483v-203.52a13.27 13.27 0 0 1 13.654-13.27h20.522a42.667 42.667 0 0 1 43.094 37.035v8.235a11.69 11.69 0 0 0 11.648 11.648h0.213a11.69 11.69 0 0 0 11.69-11.648v-63.232a11.733 11.733 0 0 0-10.111-11.477zM539.477 250.197h251.179v42.667H539.477zM539.477 370.73h251.179v42.667H539.477z" p-id="8322"></path><path d="M960 960H42.667V42.667H960z m-853.333-64H896V106.667H106.667z" p-id="8323"></path><path d="M802.09 536.661a64.939 64.939 0 0 0-91.22 10.582L501.332 811.349 342.101 704.256a63.104 63.104 0 0 0-73.301 2.048L42.667 877.44V960H960V745.216L813.952 548.949a65.75 65.75 0 0 0-11.861-12.288z" p-id="8324"></path></svg>
<div class="z-dragxml-label__name">地址</div>
</div>`
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        label: '',
        hiddenLabel: true,
        widgetConfig: {
        }
      }
    }
  },
  methods: {
    DRAG_CONFIG() {
      // let obj = CusRichText.CUS_EDITOR() ?? { props: {} }
      // Reflect.deleteProperty(obj.props, 'type')
      // return obj
      return {}
    },
    DRAG_EXPORT() {
      return {
        INIT_CONFIG: {
          type: 'string',
        },
        ui: {
          widget: 'CusAddress'
        }
      }
    },
  }
}
</script>
