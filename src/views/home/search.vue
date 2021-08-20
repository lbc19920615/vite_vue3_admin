<template>
  <div>
<!--    <DemoTodo></DemoTodo>-->
<!--    <DemoTeleport></DemoTeleport>-->
    <DemoProxy></DemoProxy>
  </div>
</template>
<script>
import DemoTodo from "@/views/home/components/DemoTodo.vue";
import DemoTeleport from "@/views/home/components/DemoTeleport.vue";
import DemoProxy from "@/views/home/components/DemoProxy.vue";
export default {
  components: {DemoTodo, DemoTeleport, DemoProxy}
}
</script>
