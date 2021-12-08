<template>
  <z-easy-modal title="导出选项"
                :ref="getRef"
                :button-attr="{style: 'display: none;'}">
    <auto-http-com
                    :def="state.def"
                    :page="page"
                    :is="state.is"
    >
      <template #form_afterend="scope">
        <el-button @click="submit(scope, $event)">确定</el-button>
      </template>
    </auto-http-com>
  </z-easy-modal>
</template>
<script>
import {onBeforeUnmount, reactive, toRaw} from "vue";
import AutoHttpCom from "@/components/AutoHttpCom.vue";
import {baseConfig2} from "@/plugins/z-frame/hooks/form";
import ZEasyModal from "@/plugins/z-frame/components/ZEasyModal.vue";

export default {
  name: 'WechatExportDialog',
  components: {ZEasyModal, AutoHttpCom},
  props: {
    page: null
  },
  setup(props, ctx) {
    let JSON5 = ZY.JSON5;
    let id = 'wechat-export__' + ZY.rid(6);
    let _dialog =null;
    let cachedModel = null;

    let formDef = {
      type: 'object',
      ui: {
        attrs: [
          ['label-width', '100px']
        ],
      },
      properties: {
        libPath: {
          type: 'string',
          ui: {
            label: 'zform位置',
            widgetConfig: {
            }
          },
        },
      }
    };

    props.page.setProcessEventHandler(id, {
      handler (type, e) {
        console.log(type, e)
        let { model, key, newVal, config } = e;
        if (type === 'model:update:all') {
          cachedModel = model
        }
      }
    })

    onBeforeUnmount(() => {
      props.page.removeProcessEventHandler(id)
    })

    let _config = baseConfig2(id,{
      def: formDef,
      computed: {},
      partName: 'form2',
      defaultVal: {
        form2: {}
      }
    })

    let getRef = function (el) {
      _dialog = el
    }
    let state = reactive({
      is: id,
      inited: false,
      def: JSON5.stringify(_config)
    })
    function show() {
      _dialog.openModal()
    }
    function submit(scope, e) {
      let {partName, parts} = scope

      let model = toRaw(parts[partName].getModel())
      console.log('submit', model, scope)
      ctx.emit('submit', {
        model
      })
    }
    return {
      state,
      getRef,
      submit,
      show
    }
  }
}
</script>
