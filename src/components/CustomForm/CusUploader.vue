<template>
  <template v-if="inited">
<!--    {{widgetConfig.enums}}-->
    <z-upload></z-upload>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {createAbleProp, createBaseCusCONFIG} from "@/plugins/z-frame/CusBaseEditor";
import {QuickNumber} from "@/hooks/props";

export default {
  name: 'CusUploader',
  components: {},
  mixins: [
      CustomRenderControlMixin
  ],
  CUS_TITLE: '上传',
  CUS_EDITOR: function () {
    return {
      props: {
        ...createBaseCusCONFIG(),
        accept: {
          type: 'string',
          ui: {
            label: '接受上传的文件类型'
          }
        },
        multiple: createAbleProp({
          label: '多选'
        }),
        ['showFileList']: createAbleProp({
          label: '文件列表'
        }),
        ['autoUpload']: createAbleProp({
          label: '自动上传'
        }),
        ['limit']: {
          ...QuickNumber(),
          ui: {
            label: '限制'
          }
        }
      }
    }
  },
  setup(props, ctx) {
    let { data, methods, listeners, init, widgetConfig2 } = defineCustomRender(props, ctx)
    let state = data()
    init(props)

    return {
      state,
      widgetConfig: widgetConfig2,
      methods,
      listeners,
    }
  },
}
</script>

