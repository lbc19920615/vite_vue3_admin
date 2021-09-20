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
<!--    {{state.value}}-->
<!--    <el-row>-->
<!--      <el-button @click="save">保存</el-button>-->
    <div :id="hid" class="cus-insert-html" v-html="runFuncs(state.control.funcs)"></div>

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
import {nextTick, onBeforeUnmount, onMounted, toRaw, watch, watchEffect} from "vue";

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
    let hid = 'htm' + ZY.rid(6).toLowerCase()

    let insertedText = [
        '+', '-', '*', '/', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ]

    let inited = false

    let { data, methods, listeners, init, FROM_TYPES } = defineCustomRender(props, ctx, {
      handleValueInit(newVal, from) {
        if (!newVal) {
          newVal = {
          }
          return newVal
        }
        if (newVal) {
          // console.log('newVal', newVal, typeof  newVal)
          try {
            obj = JSON5.parse(newVal)

            // console.log(from)

            if (!inited) {
              inited = true
              lastIndex = toRaw( obj.funcs).length - 1
              // console.log(lastIndex)
              nextTick(() => {
                if (state.value.funcs) {
                  state.control.funcs =  toRaw( state.value.funcs)
                }
                setTimeout(() => {
                  setCursor(
                      lastIndex,
                      'init'
                  )
                }, 100)
              })
            }


            return obj
          } catch (e) {
            console.log(e)
          }
        }
        return {}
      }
    })
    let state = data({
      value: {},
      control: {}
    })
    init(props)

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.control))
      // console.log(clonedValue)
      // clonedValue = toRaw(state.control)
      // Reflect.deleteProperty(clonedValue, 'control')
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
      if (! state.control.funcs) {
        state.control.funcs = []
      }
    }

    function getIndex() {
      if (lastIndex < 0) {
        return state.control.funcs.length
      }
      return lastIndex + 1
    }

    function insertChange() {
      // console.log('sdsds', length)
      setTimeout(() => {
        let length = state.control.funcs.length
        setCursor(length - 1, 'add');
        onChange()
      }, 30)
    }

    function insertFun(name) {
      resetFuncs()
      let index  = getIndex()
      // console.log(index)
      // state.control.funcs.push([ 'return \`<xy-text level="${INDEX}" mark>'+name+'(</xy-text>${VAL}<xy-text level="${INDEX}" mark>)</xy-text>\`'])
      state.control.funcs.splice(index, 0, [ 'return \`<z-math text-item name="'+name+'(" level="${INDEX}">${VAL}</z-math>\`'])

      insertChange()
    }

    function insertText(v) {
      resetFuncs()
      let index  = getIndex()
      // console.log(index)
      state.control.funcs.splice(index, 0, [ 'return \`${VAL}<xy-text text-item level="${INDEX}">'+v+'</xy-text>\`'])

      insertChange()
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
      state.control.funcs.splice(lastIndex, 1)
      // console.log(state.control.funcs)
      let Index = lastIndex - 1
      if (Index < 0) {
        Index = 0
      }
      setTimeout(() => {
        setCursor(
            Index,
            'remove'
        )
        onChange()
      }, 30)
    }

    function setCursor(index, type) {

      let INDEX = parseInt(index)

      let last = document.querySelector(`#${hid} [level="${lastIndex}"]`)
      if (last) {
        last.removeAttribute('selected')
      }
      // console.log(lastIndex)
      if (type === 'add') {
        lastIndex = lastIndex + 1
      } else {
        lastIndex = INDEX
      }
      // console.log(lastIndex)
      let current = document.querySelector(`#${hid} [level="${lastIndex}"]`)
      if (current) {
        current.setAttribute('selected', 1)
      }

    }

    function onClick(e) {
      // console.log(e.target.hasAttribute('text-item'))
      if  (e.target.hasAttribute('text-item')) {
        setCursor(
            e.target.getAttribute('level'),
            'index'
        )
      }
    }

    onBeforeUnmount(() => {
      document.getElementById(hid).removeEventListener('click', onClick)
    })


    // watch(state.control, (newVal) => {
    //
    // })

    globalThis.testCalc = function () {
      let evalStr = document.getElementById(hid).textContent;
      return ZY_EXT.eval5(evalStr)
    }

    let lifeTimes = {
      onReady() {
        setTimeout(() => {
          document.getElementById(hid).addEventListener('click', onClick)
        }, 30)
      }
    }

    function onValueChanged() {
      // console.log('  onValueInited', state)

    }



    return {
      state,
      widgetConfig: props.ui.widgetConfig,
      onChange,
      insertFun,
      insertText,
      backStep,
      hid,
      lifeTimes,
      insertedText,
      onValueChanged,
      methods,
      onBlur,
      runFuncs,
      save,
      listeners,
    }
  },
}
</script>

