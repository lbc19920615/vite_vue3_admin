<style lang="scss">
.cus-insert-input {
  --input-size: 14px;
  //user-select: none;
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

  &.selected {
    [text-item][selected]::after {
      background-color: transparent;
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

[cursor-div] {
  position: absolute;
  //background-color: saddlebrown;
  width: 10px;
  display: inline-block;
  overflow: hidden;
  height: 100%;
  //font-size: 14px;
  white-space: pre;
  pointer-events: none;
  top: 0;
  color: transparent;
  &:focus {
    outline: none;
    &::before {
      //background-color: var(--el-color-primary-light-1);
    }
  }
  &::before {

    position: absolute;
    //float: right;
    left: 0;
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
    padding: 0;
    background-clip: content-box
  }
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
<!--    {{state.str}}-->

    <div
        :id="hid"
        class="cus-insert-input"
        :class="{'focus': state.drawer || state.focused, selected: state.selected}"
        tabindex="-1"
        @focus="onFocus"
        @blur="onInputBlur"
    >
      <div
           style="flex: 1"
           @mouseup="onMainMouseUp"
           @mousedown="onMouseDown"
           @mousemove="onMouseMove"
      >
        <div content style="display: inline-block"
                                                           class="cus-insert-html" v-html="runFuncs(state.control.funcs)"></div>
        <span :id="cursorID"  cursor-div contenteditable="true"
              style="display: inline-block;"
              @focus="onCusorfocus"
              @blur="onCusorblur"
              @compositionstart="onCursorcompositionstart"
              @compositionend="onCursorcompositionend"
              @keyup="onCursorChange"
              @keydown="onCursorkeydown"
        ></span>
      </div>
      <el-button  class="cus-insert-input__append"
                  @click="onInputFocus"><i class="fas fa-keyboard"></i></el-button>
    </div>

    <el-drawer
        v-model="state.drawer"
        title="自定义键盘"
        direction="btt"
        modal="false"
        modal-class="cus-insert-modal"
        @closed="onModalClosed"
        :close-on-click-modal="false"
        :append-to-body="true"
    >
      <div  class="cus-insert-keyboard" tabindex="-1"   @keydown="onPopupkeyup">
       <div> 变量：
         <template v-for="item in insertedVars">
           <el-popover trigger="hover" width="450" placement="top">
             <div v-html="getFunDOC(item)"></div>
             <template #reference>
               <template v-if="isArray(item)">
                 <el-button @click="insertTVars(item)"><span v-html="item[0]"></span></el-button>
               </template>
               <template v-else>
                 <el-button @click="insertText(`${item}`, 'xy-text', '')"><span v-html="item"></span></el-button>
               </template>
             </template>
           </el-popover>
         </template>
       </div>
        <div> 函数：
          <template v-for="item in insertedFun">
            <el-popover trigger="hover" width="450" placement="top">
              <div v-html="getFunDOC(item)"></div>
              <template #reference><el-button
                  @click="insertFun(item)"><span v-html="item"></span></el-button></template>
            </el-popover>
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
        </div>
      </div>
    </el-drawer>


  </template>

</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import EwSuggest from "@/components/Ew/EwSuggest.vue";
import {nextTick, onBeforeUnmount, onMounted, toRaw, watch, watchEffect} from "vue";
import {Edit} from "@element-plus/icons";

export default {
  name: 'CusInsert',
  components: {EwSuggest, Edit},
  mixins: [
    CustomRenderControlMixin
  ],
  props: {
    docEnums: {
      type: String,
      default: 'ROOT_STATE("tools.toolDocs")'
    }
  },
  setup(props, ctx) {

    let {part_key} = props.defs;
    let obj;
    let JSON5 = ZY.JSON5;
    let lastIndex = 0
    let hid = 'htm' + ZY.rid(6).toLowerCase()
    let cursorID = 'cursor' +  ZY.rid(6).toLowerCase()

    let mouse_down_focused = false

    let widgetConfig =  props.ui.widgetConfig

    let codes = [
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
    ]

    codes = codes.concat(
        codes.map(v => {
          return v.toUpperCase()
        })
    )

    let insertedText = [
        '+', '-', '*', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '[', ']', '.',
        '_',
      '(',
      ')',
      ',',
      '\'',
 ...codes
    ]

    // console.log(widgetConfig.insText)

    if (Array.isArray(widgetConfig.insText)) {
      insertedText = insertedText.concat(widgetConfig.insText)
    }

    let insertedFun = [
        // 'Math'
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

    let { data, methods, listeners, init, instanse } = defineCustomRender(props, ctx, {
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
              lastIndex = toRaw( obj.funcs).length
              // console.log(lastIndex)
              nextTick(() => {
                if (state.value.funcs) {
                  state.control.funcs =  toRaw( state.value.funcs)
                }
                setTimeout(() => {
                  setCursor(
                      lastIndex,
                      'init',
                      1,
                      {
                        focus: false
                      }
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
      drawer: false,
      focused: false,
      selected: false,
      pinyin: '',
      parsedList: [],
      parsedText: [],
      str: ''
    })
    init(props)

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.control))
      // console.log(clonedValue)
      // clonedValue = toRaw(state.control)
      // Reflect.deleteProperty(clonedValue, 'control')
      let dom = document.querySelector(`#${hid} [content]`)
      if (!dom) {
        return;
      }
      let child = dom.children
      let content = ''
      if (child.length > 0) {
        Array.of(...child).forEach(item => {
          // console.log(item)
          if (item.hasAttribute('val')) {
            content = content + item.getAttribute('val')
          } else {
            content = content + item.textContent
          }
        })
      }
      // console.log(child, content)
      // let content = document.querySelector(`#${hid} [content]`)?.textContent ?? ''
      clonedValue.textContent = content.trim()
      let str =JSON5.stringify(clonedValue)
      state.str = clonedValue.textContent
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

    function getIndex(added = 1) {
      let trueIndex = lastIndex - 1
      if (trueIndex === -1) {
        return 0
      }
      if (trueIndex < -1) {
        return state.control.funcs.length
      }
      return trueIndex + added
    }

    function insertChange(addLength) {
      // console.log('sdsds', length)
      setTimeout(() => {
        let length = state.control.funcs.length
        setCursor(length - 1, 'add', addLength);
        onChange()
      }, 30)
    }
    function insertChangev2(addLength) {
      // console.log('sdsds', length)
      // let length = state.control.funcs.length
      setTimeout(() => {
        setCursor(112121, 'add', addLength);
        setTimeout(() => {
          onChange()
        }, 100)
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


    function isArray(v) {
      return Array.isArray(v)
    }

    function insertTVars(item) {
      insertTexts([item[0]], item[1], item[2])
    }

    function insertTexts(texts = [], tag = 'xy-text', attr = '') {
      if (Array.isArray(texts) && texts.length > 0) {
        resetFuncs()
        let index  = getIndex()
        let textCommands = texts.map(v => {
          return ['return \`${VAL}<'+tag+' text-item level="${INDEX}" '+attr+' >'+v+'</'+tag+'>\`']
        })
        // console.log(state.control.funcs, textCommands)
        state.control.funcs.splice(index, 0, ...textCommands)

        insertChangev2(textCommands.length)
      }
    }


    function insertEmoji() {
      // <z-emoji zoom=".7" face="fuck">&nbsp;</z-emoji>
      insertText('', 'z-emoji', 'zoom=".7" face="fuck"')
    }

    function runFuncs(funcs) {
      let trueFuns = [ ['return `<xy-text text-item level="0">&nbsp;</xy-text>`']]
      if (Array.isArray(funcs)) {
        trueFuns = trueFuns.concat(
            funcs
        ).map((v, index) => {
          return new Function('VAL', `let INDEX = ${index}; ` + v[0])
        })

        // console.log(trueFuns)

        // if (trueFuns.length > 0) {

          let ret = ZY.R.pipe.apply(null, trueFuns)('')
          // console.log(trueFuns, ret)
          return ret
        // }
      // return ''
      }

      return ''
    }

    function backCursor(cb) {
      let Index = lastIndex - 1
      if (Index < -1) {
        Index = -1
      }
      // console.log('backCursor', Index)
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

      // console.log('nextCursor', Index)

      if (Index <  state.control.funcs.length + 1) {
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
      state.control.funcs.splice(lastIndex - 1, 1)
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

    function setCursor(index, type, addLength = 1, {focus = true} = {}) {

      let INDEX = parseInt(index)

      let last = document.querySelector(`#${hid} [level="${lastIndex}"]`)
      if (last) {
        last.removeAttribute('selected')
      }
      // console.log(lastIndex)
      if (type === 'add') {
        lastIndex = lastIndex + addLength
      } else {
        lastIndex = INDEX
      }
      // console.log(lastIndex)
      let current = document.querySelector(`#${hid} [level="${lastIndex}"]`)
      if (current) {
        current.setAttribute('selected', 1)
        // console.dir(current.offsetLeft + current.clientWidth)

        let newLeft = current.offsetLeft + current.clientWidth
        let cursor = document.getElementById(cursorID)
        cursor.style.left = newLeft + 'px'
        if (focus) {
          cursor.focus()
        }
      }


    }

    function setFirstCursor() {
      setCursor(
          0,
          'index'
      )
    }

    function setLastCursor() {
      setCursor(
          state.control.funcs.length,
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

    // globalThis.testCalc = function () {
    //   let evalStr =  document.querySelector(`#${hid} [content]`).textContent
    //   return ZY_EXT.eval5(evalStr)
    // }

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


    function handleKeyUP(e, options = {}) {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Backspace') {
        backStep()
      } else  if (insertedText.includes(e.key)) {
        if (options.onText) {
          options.onText(e.key, e)
        } else {
          insertText(e.key)
        }
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

    function handleCnInput(e) {
      // e.preventDefault()
      // e.stopPropagation()
      // if (e.key === 'Backspace') {
      //   // state.pingyin = state.pingyin.slice(0, state.pingyin.length - 1)
      //   if (state.pingyin) {
      //     state.pingyin = state.pingyin.slice(0, state.pingyin.length - 1)
      //   } else {
      //     if (Array.isArray(state.parsedText)) {
      //       state.parsedText.pop()
      //     }
      //   }
      // } else  if (insertedText.includes(e.key)) {
      //   state.pingyin = (state.pingyin ?? '') + e.key
      //   state.parsedList = ZY.PinYin._getHanzi(state.pingyin)
      // }
    }

    // function selectCnText(cn = '') {
    //   // console.log('selectCnText', cn, state.parsedList[2])
    //   state.parsedText.push(cn)
    //   if (state.parsedList[2]) {
    //     state.pingyin = state.parsedList[2]
    //     state.parsedList = ZY.PinYin._getHanzi(state.parsedList[2])
    //   } else {
    //     state.pingyin = ''
    //     state.parsedList = [[], '']
    //   }
    // }


    function onInsertkeyup(e) {
      handleKeyUP(e)
    }

    function onPopupkeyup(e) {
      handleCnInput(e)
    }

    function onInputFocus(e) {
      // console.log('onFocus', e)
      e.stopPropagation();
      if (!document.querySelector('.cus-insert-input.focus')) {
        state.drawer = true
        state.pingyin = ''
        state.parsedList = [[], '']
        state.parsedText = []
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
      // document.getElementById(cursorID)?.focus()
    }



    let moveStart = 0
    let moveInstanse = 0
    let MOVE_DETECT = 60

    function onMainMouseUp(e) {
      // console.log('onMainMouseUp', e)
      // if (e.key === 'Control') {
      // //
      // } else {
      //   document.getElementById(cursorID)?.focus()
      // }
      if (moveInstanse < MOVE_DETECT) {
        document.getElementById(cursorID)?.focus()
      }
      state.selected = false
      mouse_down_focused = false
    }
    function onMouseDown(e) {
      moveStart = e.clientX
      mouse_down_focused = true
    }
    function onMouseMove(e) {
      // console.log('moveInstanse', moveInstanse, e.clientX)
      if (mouse_down_focused) {
        moveInstanse =  Math.abs(e.clientX-moveStart)
        if (moveInstanse > MOVE_DETECT) {
          document.getElementById(cursorID)?.blur()
          state.selected = true
        }
      }
    }

    let toolDocs = []

    function getFunDOC(funName = '') {
      if (toolDocs.length < 1) {
        toolDocs = instanse.ctx.dxValueTemplate(props.docEnums, [])
      }
      let finded = toolDocs.find(v => v.label === funName)

      if (finded) {
        let str = finded.value
        if (ZY.lodash.isFunction(finded.value)) {
          str = finded.value()
        }
        return ZY_EXT.marked(str ?? '')
      }

      return '空'
    }

    let isPinyin = false
    let change_ime_temped_text = ''

    function onCursorChange(e) {
      e.stopPropagation()
      e.preventDefault()
      // console.log('isPinyin', isPinyin)
      if (moveInstanse > MOVE_DETECT - 1) {
        return;
      }

      if (isPinyin) {

      } else {
        // console.log('sdsdsdsds', e)

      }
      if (e.code === 'Space') {
        // console.log('输入法保存', e.target.innerText)
        let text = e.target.innerText?.replace(change_ime_temped_text, '') ?? ''
        let textArr = [...text]
        insertTexts(textArr)
        e.target.innerText = ''
      }
      else if (e.code === 'Enter') {
        // console.log('Enterbaocun')
        let textArr = [...e.target.innerText]
        insertTexts(textArr)
        e.target.innerText = ''
      }
      else if (e.code === 'Backspace') {
        backStep()
      }
      else if (e.code === 'ShiftLeft') {
        // console.log('ShiftLeft', e.target.innerText)
        change_ime_temped_text =  e.target.innerText
      }
      else if (e.key === 'ArrowLeft') {
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
      else {
        // console.log('onCursorChange', e)
      }

      // isPinyin = false
    }

    function onCursorkeydown(e) {
      if (!isPinyin) {
        if (insertedText.includes(e.key)) {

          insertTexts([e.key])
          e.target.innerText = ''
        }
      }
    }

    function onCusorfocus() {
      state.focused = true
    }

    function onCusorblur() {
      state.focused = false
    }

    function onCursorcompositionstart(e) {
      isPinyin = true
    }

    function onCursorcompositionend(e) {
      isPinyin = false
    }

    return {
      state,
      widgetConfig,
      getFunDOC,
      onChange,
      cursorID,
      insertFun,
      insertText,
      insertQute,
      isArray,
      // selectCnText,
      onCursorcompositionstart,
      onCursorcompositionend,
      onCursorChange,
      onCursorkeydown,
      onCusorfocus,
      onCusorblur,
      insertEmoji,
      backStep,
      hid,
      lifeTimes,
      insertedText,
      insertedFun,
      insertTVars,
      onFocus,
      onMainMouseUp,
      onMouseDown,
      onMouseMove,
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

