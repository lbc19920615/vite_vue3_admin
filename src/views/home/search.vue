<style lang="scss">
$tag: "page-search";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="page-search">
    <search-demo1></search-demo1>
    <al-datetime-range v-model:start="now" v-model:end="now"></al-datetime-range>

    <my-highlight label="search-demo1 import">
      <textarea lang="js" style="display: none">
['search-demo1']: defineAsyncComponent(() => {
  return import("__remote/getscript?src=searchdemodef/index.twigvue&config_id=search.json5")
})
      </textarea>
    </my-highlight>

    <my-highlight label="search field def">
      <template #header>
        <el-link type="primary" style="margin-left: 10px;"
            href="https://ncform.github.io/ncform/ncform-show/playground/index.html#tpl=basic-verification-rule" target="_blank"> 参考ncform配置</el-link>
      </template>
      <template #default>
          <textarea  lang="js" style="display: none">
<script>
{{searchConfig.source.formDef}}
</script>
      </textarea>
      </template>
    </my-highlight>

  </div>
</template>

<script>
import MyHighlight from "@/components/Myhighlight/MyHighlight.vue";
import {defineAsyncComponent, getCurrentInstance} from "vue";
import searchConfig from '__remote/getconfig?config_id=search.json5'

export default {
  name: "Search",
  components: {
    MyHighlight,
    ['search-demo1']: defineAsyncComponent(() => {
      return import("__remote/getscript?src=searchdemodef/index.twigvue&config_id=search.json5")
    })
  },
  setup() {
    let instance = getCurrentInstance()
    let now = '2021-6-7 12:12:11'
    return {
      searchConfig,
      now
    }
  }
}
</script>
