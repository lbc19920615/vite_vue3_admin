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
      <cus-uploader :ui="cus_config.ui"></cus-uploader>
    </z-cell-item>
  </div>
</template>

<script>
import {ZDragCommonMixin} from "@/plugins/z-dragxml/mixins";
import CusUploader from "@/components/CustomForm/CusUploader.vue";


export default {
  name: 'ZDragUpload',
  components: {CusUploader},
  ZDragXmlCom: true,
  DRAG_DATASET() {
    return {
      columnMax: 1
    }
  },
  DRAG_LABEL_XML() {
    return `<div class="z-dragxml-row">
<svg t="1637134266814" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2469" width="16" height="16"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163c-3.2-4.1-9.4-4.1-12.6 0l-112 141.7c-4.1 5.3-0.4 13 6.3 13z" p-id="2470"></path><path d="M878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z" p-id="2471"></path></svg>
<div class="z-dragxml-label__name">上传</div>
</div>`
  },
  mixins: [
      ZDragCommonMixin
  ],
  methods: {
    DRAG_CONFIG() {
      let obj = CusUploader.CUS_EDITOR() ?? { props: {} }
      Reflect.deleteProperty(obj.props, 'type')
      return obj
    },
    DRAG_EXPORT() {
      return {
        ui: {
          widget: 'CusUploader'
        }
      }
    },
  },
  data() {
    return {
      id: ZY.rid(6),
      ui: {
        label: '附件',
        widgetConfig: {
        }
      }
    }
  }
}
</script>
