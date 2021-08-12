<template>
  <div id="app">
<!--    <router-view></router-view>-->

    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <transition mode="out-in">
          <keep-alive>
            <suspense>
              <component :is="Component"></component>
              <template #fallback>
                <app-loading></app-loading>
              </template>
            </suspense>
          </keep-alive>
        </transition>
      </template>
    </router-view>

  </div>
</template>

<script>
import {defineComponent, inject} from "vue";
import {setupLoggerHandler} from "./utils/logger";

export default defineComponent({
  setup() {
    const globalStore = inject('globalStore')

    globalStore.installExposeServices([
      ['serviceA', '/public/service.js']
    ])

    document.addEventListener('visibilitychange', function (newVal) {
      if (document.visibilityState === 'visible') {
        globalStore.installExposeServices([
          ['serviceA', '/public/service.js']
        ])
      }
    })

    setupLoggerHandler()
  }
})
</script>

<style>
</style>
