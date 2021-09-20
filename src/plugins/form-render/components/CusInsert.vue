<style lang="scss">
.cus-insert-html {
  user-select: none;
}
</style>

<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
    {{state.value}}
<!--    <el-row>-->
<!--      <el-button @click="save">保存</el-button>-->
    <div id="htm" class="cus-insert-html" v-html="runFuncs(state.value.control.funcs)"></div>

    <div>
      <el-button @click="backStep">退格</el-button>
      <template v-for="item in insertedText">

        <el-button @click="insertText(`${item}`)">{{item}}</el-button>
      </template>
      <el-button @click="insertFun('Math')">插入函数</el-button>
      <el-button @click="insertFun('')">插入括号</el-button>
    </div>
  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import 'xy-ui/components/xy-text';

export default {
  name: 'CusInsert',
  components: {EwSuggest},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {

    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;

    let insertedText = [
        '+', '-', '*', '/', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ]

    let { data, methods, listeners, init } = defineCustomRender(props, ctx, {
      handleValueInit(newVal) {
        if (!newVal) {
          newVal = {
            // classObj: {},
            // attrsObj: {},
            control: {
            },
            data: {}
          }
          return newVal
        }
        if (newVal) {
          // console.log('newVal', newVal, typeof  newVal)
          try {
            obj = JSON5.parse(newVal)
            if (!obj.data) {
              obj.data = {}
            }

            // if (!obj.control.funcs) {
            //   obj.control.funcs = []
            // }
            return obj
          } catch (e) {
            // console.log(e)
          }
        }
        return {}
      }
    })
    let state = data({
      value: {}
    })
    init(props)

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.value))
      // console.log(clonedValue)
      Reflect.deleteProperty(clonedValue, 'control')
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }

    function save() {
      onChange()
    }

    function onBlur() {
      onChange()
    }

    function resetFuncs() {
      if (! state.value.control.funcs) {
        state.value.control.funcs = []
      }
    }

    function insertFun(name) {
      resetFuncs()
      state.value.control.funcs.push([ 'return \`<xy-text level="${INDEX}" mark>'+name+'(</xy-text>${VAL}<xy-text level="${INDEX}" mark>)</xy-text>\`'])
      // state.value.control.html = `<xy-text mark>${name}(</xy-text><xy-text>sdsds</xy-text><xy-text mark>)</xy-text>`
      // console.log(name)
    }

    function insertText(v) {
      resetFuncs()
      state.value.control.funcs.push([ 'return \`${VAL}<xy-text level="${INDEX}">'+v+'</xy-text>\`'])
    }

    function runFuncs(funcs) {
      if (Array.isArray(funcs)) {
        let trueFuns = funcs.map((v, index) => {
          return new Function('VAL', `let INDEX = ${index}; ` + v[0])
        })

        if (trueFuns.length > 0) {

          let ret = ZY.R.pipe.apply(null, trueFuns)('')
          // console.log(trueFuns, ret)
          return ret
        }
      return ''
      }

      return ''
    }

    function backStep() {
      state.value.control.funcs.pop()
      console.log(state.value.control.funcs)
    }

    globalThis.testCalc = function () {
      let evalStr = document.getElementById('htm').textContent;
      return ZY_EXT.eval5(evalStr)
    }

    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      onChange,
      insertFun,
      insertText,
      backStep,
      insertedText,
      methods,
      onBlur,
      runFuncs,
      save,
      listeners,
    }
  },
}
</script>

