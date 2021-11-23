<template>
  <div class="z-wang-editor">
<!--    {{value}}-->
    <div :id="toolbarID"></div>
    <div :id="editorID"></div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar } from '@wangeditor/editor'
import {onBeforeUnmount, onMounted, watch} from "vue";

export default {
  name: 'ZWangEditor',
  props: {
    value: String
  },
  setup(props, ctx) {


    let editorID = 'z_editor_e__' + ZY.rid()
    let toolbarID = 'z_editor_t__' + ZY.rid()
    let editor;
    let toolbar;
    let locks;

    const editorConfig  = {}
    editorConfig.placeholder = '请输入内容'
    editorConfig.onChange = (editor) => {
      // 当编辑器选区、内容变化时，即触发
      // console.log('content', editor.children)
      // console.log('html', editor.getHtml())
      ctx.emit('val-change', {
        content: ZY.JSON5.parse(ZY.JSON5.stringify(editor.children)),
        html: editor.getHtml()
      })
    }

function initEditor(content = []) {


  editor = createEditor({
    selector: "#" + editorID,
    config: editorConfig,
    content: content, // 默认内容，下文有解释
    mode: 'simple' // 或者 'simple' ，下文有解释
  });

  // console.log(editor.getAllMenuKeys())

  const toolbarConfig = {
    toolbarKeys: [
      // 菜单 key
      'headerSelect',

      // 分割线
      '|',

      // 菜单 key
      'bold', 'italic',

      // 继续配置其他菜单...
    ]
  }

  // 创建工具栏
  toolbar = createToolbar({
    editor,
    selector: '#' + toolbarID,
    // config: toolbarConfig,
    mode: 'simple' // 或者 'simple' ，下文有解释
  })
}

    onMounted(() => {

    })

    onBeforeUnmount(() => {
      editor.destroy()
    })

    function init(newVal) {
      if (!locks) {
        // console.log('sdsdsds', newVal)
        locks  = true
        let content = []
        try {
          let obj = ZY.JSON5.parse(newVal)
          if (obj.content) {
            content = obj.content
          }
        } catch (e) {
          //
        }
        initEditor(content)
      }
    }

    return {
      editorID,
      init,
      toolbarID
    }
  }
}
</script>
