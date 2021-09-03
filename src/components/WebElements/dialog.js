import {defineCustomElement, nextTick, inject} from 'vue'
import css from 'font-awesome/css/font-awesome.css'
import dialogStyle from './dialog.scss'

const MyVueElement = defineCustomElement({
  // normal Vue component options here
  template: `
  <div class="dialog" :class="{'dialog--opened': opened, 'dialog--ani': ani}">
    <div class="dialog-inner" v-bind:style="getStyle">
      <div class="dialog-header">
        <div><slot name="title">&nbsp;</slot></div>
        <button class="dialog-close"
                @click="handleClick">
          <i class="fa fa-times-circle"></i>
        </button>
      </div>
      <div class="dialog-body">
        <slot></slot>
      </div>
      <div class="dialog-footer"><slot name="footer"></slot></div>
    </div>
  </div>
  `,
  // defineCustomElement only: CSS to be injected into shadow root
  styles: [
    `
    ${css}
    ${dialogStyle}  
    `
  ],
  // style: {
  //   ['--dialog-inner-top']: '10vh'
  // },
  // sstyle: "width: 700px"
  props: {
    // style: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // },
    obj: {
      type: Object,
      default() {
        return {}
      }
    },
    sstyle: {
      type: String,
      default: "width: 700px"
    },
  },
  emits: ['inited'],
  data() {
    return {
      opened: false,
      ani: false,
      getStyle: {
      }
    }
  },
  mounted() {
    nextTick(() => {
      // console.log(this.obj)
      this.getStyle = this.sstyle
      // if (this.init) {
      //   let fun = new Function('$root', this.init)
      //   fun({
      //     ctx: this
      //   })
      //   // this.init(this)
      // }
      this.$emit('inited', {
        ctx: this
      })
    })
  },
  methods: {
    handleClick(e) {
      this.toggleOpen(false)
      // console.log(this.dispatch)
      this.$emit('fires',{
        type: 'closed',
        args: {}
      })
    },
    toggle() {
      this.toggleOpen(!this.opened)
    },
    toggleOpen(v) {
      this.opened = v
      nextTick(() => {
        setTimeout(() => {
          this.ani = v
        }, 600)
      })
    }
  }
})

customElements.define('my-vue-dialog', MyVueElement)

export default MyVueElement
