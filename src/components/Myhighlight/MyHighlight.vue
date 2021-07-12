<style lang="scss">
$tag: "my-highlight";
$sel: ".my-highlight";

#{$sel} {
}
</style>

<template>
<div>
  <slot></slot>
  <pre v-if="rendered" v-highlightjs class="my-highlight">
<code
    class="hljs"
    :class="computeCls"
    v-html="computeContent"
></code>
</pre>
</div>
</template>

<script>
import escape from "lodash/escape";
import pretty from 'pretty'
/**
 *
 * @param lang
 * @param content
 * @returns {{cls: string[], lang, content}}
 */
export function registerLanguage(lang, content) {
  return {
    cls: ['language-' + lang],
    lang: lang,
    content: escape(content)
  }
}

export default {
  name: 'MyHighlight',
  props: {
    // language: {
    //   type: String,
    //   default: ''
    // },
    // content: {
    //   type: String,
    //   default: ''
    // }
    tpl: String
  },
  data() {
    return {
      rendered: false
    }
  },
  computed: {
    computeCls() {
      return [
        'language-' + this.language
      ]
    },
    computeContent() {
      return this.content
    }
  },
  created() {
    let template = document.getElementById(this.tpl)
    if (template) {
      let lang = template.getAttribute('lang')
      let html = pretty(template.innerHTML.trim())
      this.register(lang, html)
    }
  },
  methods: {
    register(lang, content) {
      let obj = registerLanguage(lang, content)
      this.language = obj.lang
      this.content = obj.content
      this.rendered = true
    }
  }
}
</script>
