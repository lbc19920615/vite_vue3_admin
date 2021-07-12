<style lang="scss">
$tag: "page-search";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="page-search">
    <search-demo1></search-demo1>

    <my-highlight tpl="search-doc-1">
    </my-highlight>

  </div>
</template>

<script>
import MyHighlight from "@/components/Myhighlight/MyHighlight.vue";
import {defineAsyncComponent, getCurrentInstance} from "vue";



export default {
  name: "Search",
  components: {
    MyHighlight,
    ['search-demo1']: defineAsyncComponent(() => {
      return new Promise((resolve, reject) => {
        import('@my-virtual-file:src=searchdemo.twig&config_id=s1212121222sss1212121').then((res) => {
          let templateId = 'search-demo1-tpl'
          globalThis.initTemplate(templateId, globalThis, {
            html: res.default
          })
          import("__remote/getscript?src=searchdemodef.js&config_id=s1212121222sss1212121").then((def) => {
            console.log(def)
            resolve({
              template: '#' + templateId,
              ...def.default
            })
          })
        }).catch(e => {
          console.error(e)
        })
      })
    })
  },
  created() {
  },
  setup() {
    let instance = getCurrentInstance()

  }
}
</script>
