<style lang="scss">
$tag: "pgae-search";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="pgae-search">
    <my-highlight tpl="search-doc-1">
    </my-highlight>
  </div>
</template>

<script>
import MyHighlight from "@/components/Myhighlight/MyHighlight.vue";

export default {
  name: "Search",
  components: {MyHighlight},
  mounted() {

  }
}
</script>
