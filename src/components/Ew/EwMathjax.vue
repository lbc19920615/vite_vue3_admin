<template>
  <span></span>
</template>

<script>
import { renderByMathjax } from './EwMathJax/utils'
export default {
  name: 'EwMathJax',
  props: {
    latex: {
      type: String,
      default: '',
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    latex() {
      this.renderMathJax()
    },
  },
  mounted() {
    this.renderMathJax()
  },
  methods: {
    renderMathJax() {
      this.$el.innerText = this.block
          ? `$$ ${this.latex} $$`
          : `$ ${this.latex} $`
      renderByMathjax(this.$el).then(() => {
        window.textHaha = this
      })
    },
    toImgBase64() {
      return window.MathJaxLatexToImg(this.latex)
    },
    async toImgEle() {
      let img = document.createElement('img')
      img.src = await textHaha.toImgBase64()
      return img
    }
  },
}
</script>
