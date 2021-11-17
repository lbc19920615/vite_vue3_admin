<template>
  <div class="z-dragxml-com z-dragxml-input"
       :class="drag_highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter">
    <z-cell-item :vertical="true"
                 :label="GET_CONFIG('ui.label', '')"
                 :desc="GET_CONFIG('ui.desc', '')"
    >
      <cus-select :ref="get_cus_ref"  :ui="cus_config.ui"></cus-select>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusSelect from "@/components/CustomForm/CusSelect.vue";

export default {
  name: 'ZDragSelect',
  components: {CusSelect},
  ZDragXmlCom: true,
  DRAG_CONFIG() {
    let obj = CusSelect.CUS_EDITOR() ?? { props: {} }
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
<svg t="1636443423038" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5983" width="16" height="16"><path d="M705.248 600.672l169.408-175.776h-56.48l-112.928 117.184-112.928-117.184h-56.448z" p-id="5984"></path><path d="M40 249.12v527.296h946.72V249.12H40z m58.592 58.592h829.536v410.112H98.592V307.712z" p-id="5985"></path></svg>
<div class="z-dragxml-label__name">选择</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  methods: {
    setVal(v) {
      this.cus_ref.state.value = v
    },
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusSelect'
        }
      }
    },
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        widgetConfig: {
          options2: ZY.JSON5.stringify(
              [
                {
                  label: '选项1',
                  value: 'option1'
                },
                {
                  label: '选项2',
                  value: 'option2'
                }
              ]
          )
        }
      }
    }
  }
}
</script>
