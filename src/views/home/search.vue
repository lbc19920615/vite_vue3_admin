<style lang="scss">
$tag: "pgae-search";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="pgae-search">
    <my-highlight
        :language="highlights[0].lang"
        :content="highlights[0].content"
    ></my-highlight>
  </div>
</template>

<script>
import escape from 'lodash/escape'
import MyHighlight from "@/components/Myhighlight/MyHighlight.vue";

export function registerLanguage(lang, content) {
  return {
    cls: ['language-' + lang],
    lang: lang,
    content: escape(content)
  }
}

export default {
  name: "Search",
  components: {MyHighlight},
  data() {
    return {
      highlights: [
        registerLanguage('html', `<RemoteOptions
:request-method="myRequestMethod"
label-key="name"
value-key="id"
></RemoteOptions>`)
      ]
    }
  }
}
</script>
