<style>
.z-easy-dialog__dialog {
  top: 50%;
  transform: translateY(-50%);
}
</style>

<template>
 <div class="code-js-editor">
<!--   {{state}}-->
   <el-space class="a-space-mb-10"  align="middle">
<!--     <el-popover-->
<!--         placement="bottom"-->
<!--         :width="700"-->
<!--         trigger="click"-->
<!--         v-model:visible="state.visible"-->
<!--     >-->
<!--       <template #reference>-->
<!--         <el-button size="small" @click="setRefMan(true)">快捷代码</el-button>-->
<!--       </template>-->
<!--       <div  style="min-height: 200px">-->
<!--         <SimpleList v-if="refMan.showed"-->
<!--                     :column="state.column"-->
<!--                     :suggest="getSuggest()"-->
<!--                    @select-item="onSelect"-->
<!--         ></SimpleList>-->
<!--       </div>-->
<!--     </el-popover>-->
     <z-easy-dialog title="快捷指令" :model-attr="modelAttr">
       <el-row style="height: 350px">
         <el-col :span="24">
           <el-row>
             <el-col class="g-list-group-item" v-for="element in elements"
                     :span="12"><div class="g-list-group-item__element"
             @click="selectQuickElement(element)"
             >{{element.label}}</div></el-col>
           </el-row>
         </el-col>
       </el-row>
     </z-easy-dialog>
<!--      <el-button @click="test">test</el-button>-->
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
import {useReloadMan} from "@/views/home/hooks.js";
import {getCurrentInstance, reactive, resolveComponent} from "vue";
import {provideDxValueTemplateMixin} from "@/plugins/form-render/utils/index.js";
import ZEasyDialog from "@/plugins/z-frame/components/ZEasyDialog.vue";

export default {
  name: 'CodeJsEditor',
  components: {ZEasyDialog},
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
      ],
      visible: false
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

    function test() {
      instance.ctx.$refs.editorRef.insertText(`
sdsds
`)
    }

    function onChange() {
      let newVal = instance.ctx.$refs.editorRef.getValue()
      // console.log('newVal', newVal, instance.ctx.content)
      // instance.ctx.editorChange(state.value)
      state.visible = false
    }

    function onSelect(str) {
      instance.ctx.$refs.editorRef.insertText(str)

      setTimeout(() => {
        onChange()
      }, 30)
    }

    let modelAttr = {
      // modal: false
      width: '50%'
    }

    let elements = [
      {
        label: '数组添加',
        value: `G.数组添加(e)`
      }
    ]

    function selectQuickElement(element = {}) {
      onSelect(element.value ?? '')
    }

    return {
      state,
      onSelect,
      modelAttr,
      elements,
      selectQuickElement,
      test,
      getSuggest,
      refMan,
      setRefMan
    }
  }
}
</script>
