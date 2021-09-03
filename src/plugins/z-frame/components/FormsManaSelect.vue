<template>
<!--  {{state}}-->
  <simple-list :suggest="state.suggest"
  @select="onSelect"
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
    onMounted(async () => {
      await formMana.init();
      await ZY.sleep(30)
      state.suggest = formMana.getOptions()
    })
    function onSelect(e) {
      ctx.emit('select-form', e)
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
