<style>
.menu-wrapper {
  font-size: 14px;
}
</style>

<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <template v-if="item && !item.hidden&&item.children">

        <template v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" >
          <router-link
                :to="item.path+'/'+item.children[0].path"
                :key="item.children[0].name">
            <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
             <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon"
                       :icon-class="item.children[0].meta.icon"></svg-icon>
              <template #title>
                <span v-if="item.children[0].meta&&item.children[0].meta.title" >{{item.children[0].meta.title}}</span>
              </template>
            </el-menu-item>
          </router-link>
        </template>
        <el-sub-menu v-else :index="item.name||item.path" :key="item.name">
          <template #title>
            <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>
          </template>

          <template v-for="child in item.children" >
            <sidebar-item :is-nest="true" class="nest-menu"
                          v-if="child.children&&child.children.length>0"
                          :routes="[child]" :key="child.path"></sidebar-item>

            <template v-else>
<!--              {{item}}-->
              <template v-if="child && !child.hidden">
                <router-link  :to="item.path+'/'+child.path" :key="child.name">
                  <el-menu-item :index="item.path+'/'+child.path">
                    <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                    <template #title>
                      <span v-if="child.meta&&child.meta.title" v-html="child.meta.title"></span>
                    </template>
                  </el-menu-item>
                </router-link>
              </template>
            </template>
          </template>

        </el-sub-menu>
      </template>
    </template>
  </div>
</template>

<script>

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
