<template>
<!--  {{state}}-->
  <simple-list :suggest="state.suggest"
  @select-item="onSelect"
  ></simple-list>
</template>

<script>
import {reactive, onMounted} from 'vue';
import SimpleList from "@/components/SimpleList.vue";
import {useFormsMana} from "@/plugins/z-frame/formsMana";
export default {
  name: "FormsManaSelect",
  components: {SimpleList},
  setup(props, ctx) {
    let formMana = useFormsMana()
    let state = reactive({
      suggest: []
    })
    onMounted(() => {
      state.suggest = formMana.getOptions()
    })
    function onSelect(e) {
      ctx.emit('select-item', e)
    }
    return {
      state,
      onSelect
    }
  }
}
</script>

<style scoped>

</style>
