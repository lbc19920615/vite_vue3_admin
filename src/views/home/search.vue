<template>
  <div>
    <DemoTodo></DemoTodo>
    <DemoTeleport></DemoTeleport>
  </div>
</template>
<script>
import DemoTodo from "@/views/home/components/DemoTodo.vue";
import {ref} from "vue";
import DemoTeleport from "@/views/home/components/DemoTeleport.vue";
export default {
  components: {DemoTodo, DemoTeleport}
}
</script>
