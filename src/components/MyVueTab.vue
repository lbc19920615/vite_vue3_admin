<style lang="scss">
.my-vue-tab {
  //.el-scrollbar {
  //  &::after {
  //
  //    content: "";
  //    position: absolute;
  //    left: 0;
  //    bottom: 0;
  //    width: 100%;
  //    height: 2px;
  //    background-color: var(--el-border-color-light);
  //    z-index: 0;
  //  }
  //}
  .my-vue-tab__tabs {
    --my-vue-tab--tabs-mb: var(--z-size-10);
    margin-bottom: var(--my-vue-tab--tabs-mb);
    position: relative;
    display: flex;
    align-items: center;
    > .my-vue-tab__tab {
      padding: var(--my-vue-tab-padding, 10px 20px);
      cursor: pointer;
      flex-shrink: 0;
    }
    > .my-vue-tab--actived {
      color:#409EFF;
    }
    > .my-vue-tab__active-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background-color: var(--el-color-primary);
      z-index: 1;
      transition: transform var(--el-transition-duration) cubic-bezier(.645,.045,.355,1);
      list-style: none;
    }
  }
  > .my-vue-tab__content {
    >.my-vue-tab-pane {
    }
  }
}
</style>

<template>
<div class="my-vue-tab">
  <el-scrollbar>
    <div class="my-vue-tab__tabs">
      <div class="my-vue-tab__active-bar" :style="activeBarStyle"></div>
      <!--    <div class="my-vue-tab__tab" -->
      <!--         :my-vue-tab-name="tab.name" -->
      <!--         :class="classObj(tab)"-->
      <!--         @click="selectTab(tab.name)"-->
      <!--         v-for="tab in tabs">{{tab.name}}</div>-->
      <div class="my-vue-tab__tab"
           :my-vue-tab-name="tab[1].name"
           :class="classObj(tab[1])"
           @click="selectTab(tab[1].name)"
           v-for="tab in tabs">{{tab[1].name}}</div>
    </div>
  </el-scrollbar>
  <div class="my-vue-tab__content">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "MyVueTab",
  mounted() {
    // console.log('tab mounted')
  },
  data() {
    return {
      tabs: new Map(),
      activeBarStyle: {width: 0, transform: ''},
      lastTab: null,
      locks: false
    }
  },
  methods: {
    classObj(tab) {
      return {
        ['my-vue-tab--actived']: this.lastTab === tab
      }
    },
    async selectTab(name) {
      if (name && this.tabs.has(name)) {
        if (this.lastTab) {
          this.lastTab.toggle(false)
        }
        await this.$nextTick()
        // console.log('selectTab', name, this.lastTab)
        this.tabs.get(name).toggle(true)
        this.lastTab = this.tabs.get(name)

        // 设置active bar
        let tabEl = document.querySelector(`[my-vue-tab-name=${name}]`)
        if (tabEl) {
          let computedStyle = getComputedStyle(tabEl)
          // console.log(tabEl, computedStyle.width)
          this.activeBarStyle.width = computedStyle.width
          this.activeBarStyle.transform = `translateX(${tabEl.offsetLeft}px)`
        }
      }
    },
    registerTab(ctx) {
      if (ctx && ctx.name) {
        // this.tabs[ctx.name] = ctx
        this.tabs.set(ctx.name, ctx)

        if (!this.locks) {
          this.locks = true
          this.selectTab(ctx.name)
        }
        // this.styleObj['--show-' + ctx.name] = true
      }
    },
    unRegisterTab(ctx) {
      if (ctx && ctx.name) {
        // console.log(this.tabs, ctx.name)
        let keys = Array.of(...this.tabs.keys())
        keys.forEach((key, index) => {
          if (key === ctx.name) {
            // console.log('key', key, index)

            let last = keys[index - 1]
            if (last) {

              this.selectTab(last)
            }
            this.tabs.delete(key)
          }
        })
        // let finded = this.tabs.has(ctx.name)
        // if (finded) {
        //   // Reflect.deleteProperty(this.tabs, ctx.name)
        //   this.tabs.delete(ctx.name)
        // }
      }
    }
  }
}
</script>

<style scoped>

</style>
