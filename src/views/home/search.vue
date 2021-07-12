<style lang="scss">
$tag: "page-search";
$sel: "." + $tag;

#{$sel} {
}
</style>

<template>
  <div class="page-search"><my-highlight tpl="search-doc-1">
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
