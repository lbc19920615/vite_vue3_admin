<style lang="scss">
.cus-insert-input {
  --input-size: 14px;
  user-select: none;
  display: flex;
  align-items: center;
  [text-item] {

    position: relative;
    display: inline-block;
    //padding-left: 2px;
    //padding-right: 2px;
    cursor: text;
    vertical-align: middle;
  }
  &__append {
    border: none;
  }
}

.cus-insert-modal {
  background-color: transparent;
  pointer-events: none;
  > * {
    pointer-events: all;
    height: max-content !important;
  }
}

.cus-insert-input {

  border: var(--el-border-base); min-height: 36px; position: relative;
}

.cus-insert-input {
  &:focus, &.focus {
    border-color: var(--el-color-primary-light-1);

    [text-item][selected]::after {

      background-color: var(--el-color-primary-light-1);
    }


  }
  border-radius: 4px;
}

[text-item]::after {
  //position: absolute;
  //float: right;
  //content: " ";
  //background-color: transparent;
  //letter-spacing: 0.88px;
  //width: 2px;
  //height: 100%;
  //animation: cursor-blinks 1.5s infinite steps(1, start);

  position: absolute;
  //float: right;
  right: 0;
  content: " ";
  background-color: transparent;
  letter-spacing: 0.88px;
  width: 1px;
  height: calc(var(--input-size) * 2);
  animation: cursor-blinks 1.5s infinite steps(1, start);
  /* height: 1em; */
  transform: translateY(-50%);
  top: calc(50% + .1em);
  //line-height: calc(100%);
  /* padding-left: 4px; */
  /* left: 2px; */
  margin-left: 0;
  box-sizing: border-box;
  padding: 3px 0;
  background-clip: content-box
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

.cus-insert-keyboard {
  .el-button {
    margin-bottom: var(--cus-insert-keyboard-mb, 10px);
  }
}
</style>

<template>
  <template v-if="inited">
    <!--    {{widgetConfig.enums}}-->
<!--    {{state.value}}-->
<!--    <el-row>-->
<!--      <el-button @click="save">保存</el-button>-->
    <div
        :id="hid"
        class="cus-insert-input"
        :class="{'focus': state.drawer}"
        tabindex="-1"
        @keydown="onInsertkeyup"
        @blur="onInputBlur"
        @focus="onFocus"
    >
      <div
           style="flex: 1"
      >
        <xy-text text-item level="-1">&nbsp;</xy-text>
        <div content style="display: inline-block"
                                                           class="cus-insert-html" v-html="runFuncs(state.control.funcs)"></div>
      </div>
      <el-button  class="cus-insert-input__append"  @click="onInputFocus"><i class="fas fa-keyboard"></i></el-button>
    </div>

    <el-drawer
        v-model="state.drawer"
        title="自定义键盘"
        direction="btt"
        modal="false"
        modal-class="cus-insert-modal"
        @closed="onModalClosed"
        :close-on-click-modal="false"
    >
      <div  class="cus-insert-keyboard" tabindex="-1"   @keydown="onPopupkeyup">
       <div>
         <template v-for="item in insertedVars">
           <el-button @click="insertText(`${item}`)"><span v-html="item"></span></el-button>
         </template>
       </div>
        <div>
          <el-button @click="backStep">退格</el-button>
          <el-button @click="insertFun('')">插入括号</el-button>
          <el-button @click="insertQute('')">插入引号</el-button>
          <el-button @click="insertEmoji('fuck')">插入<z-emoji  face="fuck"></z-emoji></el-button>
          <template v-for="item in insertedText">
            <el-button @click="insertText(`${item}`)"><span v-html="item"></span></el-button>
          </template>
          <template v-for="item in insertedFun">
            <el-button @click="insertFun(item)"><span v-html="item"></span></el-button>
          </template>
        </div>
      </div>
    </el-drawer>


  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import 'xy-ui/components/xy-text';
import {nextTick, onBeforeUnmount, onMounted, toRaw, watch, watchEffect} from "vue";
import {Edit} from "@element-plus/icons";

export default {
  name: 'CusInsert',
  components: {EwSuggest, Edit},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {

    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let lastIndex = -1
    let hid = 'htm' + ZY.rid(6).toLowerCase()

    let widgetConfig =  props.ui.widgetConfig

    let insertedText = [
        '+', '-', '*', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '&#8986;'
    ]

    if (Array.isArray(widgetConfig.insText)) {
      insertedText = insertedText.concat(widgetConfig.insText)
    }

    let insertedFun = [
        'Math'
    ]

    if (Array.isArray(widgetConfig.insFun)) {
      insertedFun = insertedFun.concat(widgetConfig.insFun)
    }


    let insertedVars = [

    ]

    if (Array.isArray(widgetConfig.insVars)) {
      insertedVars = insertedVars.concat(widgetConfig.insVars)
    }


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
      control: {},
      drawer: false
    })
    init(props)

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.control))
      // console.log(clonedValue)
      // clonedValue = toRaw(state.control)
      // Reflect.deleteProperty(clonedValue, 'control')
      clonedValue.textContent = document.querySelector(`#${hid} [content]`).textContent
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
      if (lastIndex === -1) {
        return 0
      }
      if (lastIndex < -1) {
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
      state.control.funcs.splice(index, 0, [
          'return \`${VAL}<xy-text text-item level="${INDEX}">'+name+'(</xy-text>\`',
      ])

      state.control.funcs.splice(index + 1, 0, [
        'return \`${VAL}<xy-text text-item level="${INDEX}">)</xy-text>\`',
      ])
      insertChange()
    }

    function insertQute(name) {
      resetFuncs()
      let index  = getIndex()
      state.control.funcs.splice(index, 0, [
        'return \`${VAL}<xy-text text-item level="${INDEX}">\'</xy-text>\`',
      ])

      state.control.funcs.splice(index + 1, 0, [
        'return \`${VAL}<xy-text text-item level="${INDEX}">\'</xy-text>\`',
      ])
      insertChange()
    }

    function insertText(v, tag = 'xy-text', attr = '') {
      resetFuncs()
      let index  = getIndex()
      // console.log(index)
      state.control.funcs.splice(index, 0, [ 'return \`${VAL}<'+tag+' text-item level="${INDEX}" '+attr+' >'+v+'</'+tag+'>\`'])

      insertChange()
    }

    function insertEmoji() {
      // <z-emoji zoom=".7" face="fuck">&nbsp;</z-emoji>
      insertText('', 'z-emoji', 'zoom=".7" face="fuck"')
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

    function backCursor(cb) {
      let Index = lastIndex - 1
      if (Index < -1) {
        Index = -1
      }
      setTimeout(() => {
        setCursor(
            Index,
            'remove'
        )
        if (cb) {
          cb()
        }
      }, 30)
    }

    function nextCursor(cb) {
      let Index = lastIndex + 1
      // if (Index >    state.control.funcs.length - 1) {
      //   Index =    state.control.funcs.length - 1
      // }

      if (Index <  state.control.funcs.length) {
        setTimeout(() => {
          setCursor(
              Index,
              'next'
          )
          if (cb) {
            cb()
          }
        }, 30)
      }
    }

    function backStep() {
      state.control.funcs.splice(lastIndex, 1)
      // console.log(state.control.funcs)
      // let Index = lastIndex - 1
      // if (Index < -1) {
      //   Index = -1
      // }
      // setTimeout(() => {
      //   setCursor(
      //       Index,
      //       'remove'
      //   )
      //   onChange()
      // }, 30)
      backCursor(function () {
        onChange()
      })
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

    function setFirstCursor() {
      setCursor(
          -1,
          'index'
      )
    }

    function setLastCursor() {
      setCursor(
          state.control.funcs.length - 1,
          'index'
      )
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
      let evalStr =  document.querySelector(`#${hid} [content]`).textContent
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


    function handleKeyUP(e) {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Backspace') {
        backStep()
      } else  if (insertedText.includes(e.key)) {
        insertText(e.key)
      } else if (e.key === 'ArrowLeft') {
        // console.log('ArrowLeft')
        backCursor()
      } else if (e.key === 'ArrowRight') {
        // console.log('ArrowRight')
        nextCursor()
      } else if (e.key === 'ArrowUp') {
        // console.log('ArrowUp')
        setFirstCursor()
      } else if (e.key === 'ArrowDown') {
        setLastCursor()
      }
    }

    function onInsertkeyup(e) {
      handleKeyUP(e)
    }

    function onPopupkeyup(e) {
      handleKeyUP(e)
    }

    function onInputFocus(e) {
      // console.log('onFocus', e)
      if (!document.querySelector('.cus-insert-input.focus')) {
        state.drawer = true
      }
    }

    function onInputBlur(e) {
      // console.log('onBlur', e)
      // state.drawer = false
    }

    function onModalClosed() {
      document.getElementById(hid)?.focus()
      // console.log(document.getElementById(hid))
    }

    function onFocus(e) {
      if (document.querySelector('.cus-insert-input.focus')) {
        Array.of(...document.querySelectorAll('.cus-insert-input:not(.focus)')).forEach(item => {
          item.blur()
        })
      }
    }


    return {
      state,
      widgetConfig,
      onChange,
      insertFun,
      insertText,
      insertQute,
      insertEmoji,
      backStep,
      hid,
      lifeTimes,
      insertedText,
      insertedFun,
      onFocus,
      insertedVars,
      onValueChanged,
      methods,
      onModalClosed,
      onInputFocus,
      onInputBlur,
      onBlur,
      onInsertkeyup,
      onPopupkeyup,
      runFuncs,
      save,
      listeners,
    }
  },
}
</script>

