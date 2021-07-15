<style lang="scss">
$tag: "page-search";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="page-search">
    <search-demo1></search-demo1>

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

    <h3>datetimepicker</h3>
    <p>start: {{startDate}} end: {{endDate}}</p>
    <al-datetime-range v-model:start="startDate" v-model:end="endDate"></al-datetime-range>

    <my-highlight label="search-demo1 import">
      <textarea lang="js" style="display: none">
<script>
import("__remote/getscript?src=alDatetimeRange/index.twigvue").then((def) => {
  if (def.default) {
    const com = def.default('AlDatetimeRange')
    app.component(com.name, com)
  }
})
</script>
      </textarea>
    </my-highlight>

  </div>
</template>

<script>
import MyHighlight from "@/components/Myhighlight/MyHighlight.vue";
import {defineAsyncComponent, getCurrentInstance} from "vue";
import searchConfig from '__remote/getconfig?config_id=search.json5'
import { ref } from 'vue'

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
    let now = '2021-06-07 12:12:11'
    return {
      searchConfig,
      startDate: ref(now),
      endDate: ref(now),
    }
  }
}
</script>
