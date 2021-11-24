import {defineCustomElement, nextTick} from 'vue'

const MyVueElement = defineCustomElement({
  template: `<div></div>`,
  components: {

  },
  props: {
    html:String,
    css: String
  },
  data() {
    return {
      inner_css: '',
      inner_html: ''
    }
  },
  // watch:{
  //   html(v) {
  //     this.inner_html = v
  //   },
  //   css(v) {
  //     console.log(v, this)
  //     this.inner_css = v
  //     this.$el.innerHTML = `<style>${this.inner_css}</style>${this.inner_html}`
  //   }
  // },
  methods: {
    setContent(css, html) {
      // console.log(css, html)
      this.$el.innerHTML = `<style>${css}</style>${html}`
    }
  },
  created() {
    this.$emit('inited', this)
  }
})

customElements.define('my-vue-content', MyVueElement)

export default MyVueElement
