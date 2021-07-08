<template>
  <div></div>
</template>

<script>
import {defineComponent, onMounted} from "vue";

export default defineComponent({
  name: 'serviceA',
  setup() {
    function getArr() {
      console.log('value.value = props.modelValue')
    }
    return {
      getArr
    }
  }
})
</script>
