<template>
  <section class="app-main">
<!--    <transition name="fade" mode="out-in">-->
<!--      &lt;!&ndash; <router-view :key="key"></router-view> &ndash;&gt;-->
<!--      <router-view></router-view>-->
<!--    </transition>-->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
