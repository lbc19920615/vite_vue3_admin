<template>
 <div class="code-js-editor">
   <el-space>
     <el-popover
         placement="bottom"
         :width="700"
         trigger="click"
     >
       <template #reference>
         <el-button class="a-space-mb-10" @click="setRefMan(true)">快捷代码</el-button>
       </template>
       <div  style="min-height: 200px">
         <SimpleList v-if="refMan.showed"
                     :column="state.column"
                     :suggest="getSuggest()" ></SimpleList>
       </div>
     </el-popover>

   </el-space>
   <CodeMirror
       v-if="inited"
       ref="editorRef"
       v-model="content"
       @update:modelValue="editorChange"
       :height="styleObj.height"
       :mode="mode"
       theme="vscode-dark"
   />
 </div>
</template>

<script>
import {useReloadMan} from "@/views/home/hooks";
import {getCurrentInstance, reactive, resolveComponent} from "vue";
import {provideDxValueTemplateMixin} from "@/plugins/form-render/utils";

export default {
  name: 'CodeJsEditor',
  mixins: [
    provideDxValueTemplateMixin
  ],
  emits: ['update:value', 'init'],
  props: {
    modelValue: String,
    ui: null,
    editorRef: null,
    // mode: {
    //   type: String,
    //   default: 'text/javascript'
    // },
  },
  data() {
    let lock = new ZY.Lock(/* optional lock name, should be unique */)
    let widgetConfigStyle = ZY.lodash.get(this, 'ui.widgetConfig.style')
    let mode = ZY.lodash.get(this, 'ui.widgetConfig.mode', 'text/javascript')
    return {
      content: '',
      lock,
      inited: false,
      mode,
      styleObj: {
        ...widgetConfigStyle
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        // console.log('modelValue sdsdsdsdsds', this.$refs.editorRef, this.lock.isLocked, newVal)
        if (!this.lock.isLocked) {
          this.content = newVal
          this.$nextTick(() => {
            if (!this.inited) {
              this.inited = true
            } else {
              this.$refs.editorRef.setModel(newVal)
            }
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    editorChange: function (e) {
      // console.log('editorChange', e)
      this.lock.lock( () => {
        this.$emit('update:modelValue', e)
        this.$emit('fchange', e);
      }, 1000)
    }
  },
  setup(props, ctx) {
    let instance = getCurrentInstance()
    let [refMan, setRefMan] = useReloadMan({timeout: 500})

    let suggest = props.ui.widgetConfig.suggest ?? []

    let state = reactive({
      column: [
        {
          prop: 'label',
          width: '150px'
        },
        {
          prop: 'value',
          label: 'VALUE',
        }
      ]
    })


    function getSuggest() {
      if (props.ui.widgetConfig.enums) {
        let obj =  instance.ctx.dxValueTemplate(props.ui.widgetConfig.enums)
        // console.log('getsdsdsd', obj)
        return obj
      }
      else if (suggest) {
        return suggest
      }
      else {
        return []
      }
    }

    return {
      state,
      getSuggest,
      refMan,
      setRefMan
    }
  }
}
</script>
