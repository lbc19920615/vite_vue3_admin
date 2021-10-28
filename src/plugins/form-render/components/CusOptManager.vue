<style lang="scss">

</style>

<template>
  <template v-if="inited">
    <template v-if="state.control">
<!--      {{state.control}}-->
      <div class="a-space-mb-10">
<!--        <z-cell-item-->
<!--            style="border-bottom: 1px solid #CFD1C4"-->
<!--            v-for="option in state.control"-->
<!--            :label="option.label">{{option.value}}</z-cell-item>-->
        <simple-list :suggest="state.control"></simple-list>
      </div>

      <section  class="a-space-mb-10">
        <z-options-manager @select-item="onSelect"></z-options-manager>
      </section>
    </template>
  </template>
</template>

<script>
import {CustomRenderControlMixin, defineCustomRender} from "@/plugins/form-render/utils/index";
import {onMounted, watch} from "vue";
import ZOptionsManager from "@/plugins/z-frame/components/ZOptionsManager.vue";
import ZCellItem from "@/plugins/z-frame/components/ZCellItem.vue";
import SimpleList from "@/plugins/z-frame/components/SimpleList.vue";

export default {
  name: 'CusOptManager',
  components: {SimpleList, ZCellItem, ZOptionsManager},
  mixins: [
    CustomRenderControlMixin
  ],
  setup(props, ctx) {
    let obj;
    let JSON5 = ZY.JSON5;
    let { data, methods, listeners, init, widgetConfig2 } = defineCustomRender(props, ctx, {
      handleValueInit(newVal, from) {
        // console.log(from)
        // console.log('CusOptManager', newVal, typeof  newVal)
        if (newVal) {
          try {
            obj = JSON5.parse(newVal)
            state.control = obj
            state.value = obj
          } catch (e) {
            //
          }
        } else {
          state.control = []
          state.value = []
        }
        return {}
      }
    })
    let state = data({
      value: [],
      control: [],
    })

    function onChange() {
      let clonedValue = JSON5.parse(JSON5.stringify(state.control))
      let str =JSON5.stringify(clonedValue)
      methods.on_change(str)
    }


    function onStylesChange(e) {
      console.log('onStylesChange', e)
      // state.control.styles = e
      let options = ZY.JSON5.parse(e)
      console.log(options)
      state.control = options.map(v => {
        return v.data
      })
      //
      setTimeout(() => {
        onChange()
      }, 30)
    }


    function save() {
      onChange()
    }

    function onSelect(option) {
      // console.log('ctx', option)
      onStylesChange(option.value)
    }

    onMounted(() => {
      if (widgetConfig2.mounted) {
        init(props)
      }
    })

    return {
      state,
      widgetConfig: widgetConfig2,
      onChange,
      methods,
      onSelect,
      onStylesChange,
      save,
      listeners,
    }
  },
}
</script>

