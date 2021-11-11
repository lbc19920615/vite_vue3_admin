<template>
  <div class="z-dragxml-com"
       :class="drag_highlight_cls('itemUUID', uuid)"
       @mouseenter.stop="onMouseEnter">
    <z-cell-item :vertical="true"
                 :label="GET_CONFIG('ui.label', '')"
                 :desc="GET_CONFIG('ui.desc', '')"
    >
      <cus-checkbox :ref="get_cus_ref" :ui="cus_config.ui"></cus-checkbox>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusCheckbox from "@/components/CustomForm/CusCheckbox.vue";



export default {
  name: 'ZDragCheckbox',
  components: {CusCheckbox},
  ZDragXmlCom: true,
  DRAG_CONFIG() {
    let obj = CusCheckbox.CUS_EDITOR() ?? { props: {} }

    return obj
  },
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1636179382934" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4511" width="16" height="16"><path d="M778.666667 128A117.333333 117.333333 0 0 1 896 245.333333v533.333334A117.333333 117.333333 0 0 1 778.666667 896H245.333333A117.333333 117.333333 0 0 1 128 778.666667V245.333333A117.333333 117.333333 0 0 1 245.333333 128h533.333334z m0 64H245.333333c-29.44 0-53.333333 23.893333-53.333333 53.333333v533.333334c0 29.44 23.893333 53.333333 53.333333 53.333333h533.333334c29.44 0 53.333333-23.893333 53.333333-53.333333V245.333333c0-29.44-23.893333-53.333333-53.333333-53.333333zM426.666667 616.106667l276.053333-276.053334a32 32 0 0 1 48.341333 41.642667l-3.114666 3.584-298.666667 298.666667a32 32 0 0 1-41.642667 3.114666l-3.584-3.114666-128-128a32 32 0 0 1 41.642667-48.341334l3.584 3.114667L426.666667 616.106667l276.053333-276.053334L426.666667 616.106667z" p-id="4512"></path></svg>
<div class="z-dragxml-label__name">多选</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  methods: {
    setVal(v = []) {
      this.cus_ref.state.value = v
    }
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
                  value: 'check1',
                  // LAY_CHECKED: true,
                },
                {
                  label: '选项2',
                  value: 'check2',
                  // LAY_CHECKED: true,
                }
              ]
          )
        }
      }
    }
  }
}
</script>
