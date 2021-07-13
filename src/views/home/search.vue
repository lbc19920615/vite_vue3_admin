<style lang="scss">
$tag: "page-search";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="page-search">
    <search-demo1></search-demo1>

    <my-highlight label="search-demo1 code">
      <textarea lang="js" style="display: none">
['search-demo1']: defineAsyncComponent(() => {
  return import("__remote/getscript?src=searchdemodef/index.twigvue&config_id=search.json5")
})
      </textarea>
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
      return import("__remote/getscript?src=searchdemodef/index.twigvue&config_id=search.json5")
    })
  },
  created() {
  },
  setup() {
    let instance = getCurrentInstance()

  }
}
</script>
