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
import {getCurrentInstance} from "vue";

import fieldContent from '@my-virtual-file:src=searchdemo.twig&config_id=s1212121222sss1212121'
import coma from "__remote/getscript?src=searchdemodef.js&config_id=s1212121222sss1212121"
console.log(coma)


export default {
  name: "Search",
  components: {MyHighlight},
  created() {
    this.$defineComponent('search-demo1', { template: fieldContent, def: coma })
  },
  setup() {
    let instance = getCurrentInstance()
  }
}
</script>
