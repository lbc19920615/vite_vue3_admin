<style lang="scss">
.cus-insert-html {
  user-select: none;
  [text-item] {
    display: inline-block;
    position: relative;
    padding-left: 2px;
    padding-right: 2px;
  }
}



[text-item]::after {
  position: absolute;
  float: right;
  content: " ";
  background-color: transparent;
  letter-spacing: 0.88px;
  width: 2px;
  height: 100%;
  animation: cursor-blinks 1.5s infinite steps(1, start);
}

[text-item][selected]::after {

  background-color: var(--el-color-primary-light-1);
}

@keyframes cursor-blinks {
  0% {
    opacity: 1;
    display: block;
  }
  50% {
    opacity: 0;
    display: none;
  }
  100% {
    opacity: 1;
    display: block;
  }
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
import {onBeforeUnmount, onMounted, watch, watchEffect} from "vue";

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
    let lastIndex = -1

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

    function getIndex() {
      if (lastIndex < 0) {
        return state.value.control.funcs.length
      }
      return lastIndex + 1
    }

    function insertFun(name) {
      resetFuncs()
      let index  = getIndex()
      console.log(index)
      // state.value.control.funcs.push([ 'return \`<xy-text level="${INDEX}" mark>'+name+'(</xy-text>${VAL}<xy-text level="${INDEX}" mark>)</xy-text>\`'])
      state.value.control.funcs.splice(index, 0, [ 'return \`<z-math text-item name="'+name+'(" level="${INDEX}">${VAL}</z-math>\`'])
    }

    function insertText(v) {
      resetFuncs()
      let index  = getIndex()
      console.log(index)
      state.value.control.funcs.splice(index, 0, [ 'return \`${VAL}<xy-text text-item level="${INDEX}">'+v+'</xy-text>\`'])
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
      state.value.control.funcs.splice(lastIndex, 1)
      // console.log(state.value.control.funcs)
      let Index = lastIndex - 1
      if (Index < 0) {
        Index = state.value.control.funcs.length - 1
      }
      setTimeout(() => {
        setCursor(
            Index,
            'remove'
        )
      }, 30)
    }

    function setCursor(index, type) {

      let INDEX = parseInt(index)


      // console.log(lastIndex, INDEX)
      let last = document.querySelector(`#htm [level="${lastIndex}"]`)
      if (last) {
        last.removeAttribute('selected')
      }
      if (type === 'add') {
        lastIndex = lastIndex + 1
      } else {
        lastIndex = INDEX
      }
      let current = document.querySelector(`#htm [level="${lastIndex}"]`)
      if (current) {
        current.setAttribute('selected', 1)
      }

    }

    function onClick(e) {
      if  (e.target.localName === 'xy-text') {
        // console.log(e.target.getAttribute('level'))
        setCursor(
            e.target.getAttribute('level'),
            'index'
        )
      }
    }

    onMounted(() =>{
      setTimeout(() => {
        document.getElementById('htm').addEventListener('click', onClick)
      }, 30)
    })

    onBeforeUnmount(() => {
      document.getElementById('htm').removeEventListener('click', onClick)
    })

    watch(state.value.control, (newVal) => {
      let length = newVal.funcs.length

      setTimeout(() => {
        setCursor(length - 1, 'add')
      }, 0)
      // document.getElementById('htm').children[length - 1].setAttribute('selected', 1)
    })

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

