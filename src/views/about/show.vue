<style lang="scss">
//@import './show.scss';
</style>


<template>
  <div class="z-page">
    <template v-if="renderC.state.refresh">
      <render-layout :map="renderC.state.currentLayoutMap"
                     :id="renderC.state.rootId"
                     :handleNext="renderC.handleNext"
                     :page="page">
        <template #form_after="scope">
          <CusSubmitButton
              :scope="scope"
              class="el-col z-submit-btn"></CusSubmitButton>
        </template>
      </render-layout>
    </template>
  </div>
</template>

<script>
import RenderLayout from "@/views/about/components/render-layout.vue";
import {extendControl2Page, useAppPageControl, useControl} from "@/mixins/framework";
import { useRenderControl } from "@/plugins/z-page/hooks";

export default {
  name: "show",
  components: {RenderLayout},
  setup() {

    let renderC = useRenderControl()
    let properties =  {
      editor_step: {
        type: String,
      },
      code_str: {
        type: String,
      },
      textarea_step: {
        type: String
      }
    }
    let computed = {}
    let page = useControl({properties, computed}, {
      onInited
    })
    page = extendControl2Page(page)
    page = useAppPageControl(page)

    async function onInited() {
      console.log('page inited')

      renderC.detect()
    }

    return {
      page,
      renderC
    }
  }
}
</script>
