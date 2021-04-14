<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { useStore } from 'vuex'
import SidebarItem from './SidebarItem.vue'
import {computed, ref} from "vue";

export default {
  components: { SidebarItem },
  setup() {
    const store = useStore()

    const permission_routers = computed(() => {
      return store.state.permission.routers
    })

    const isCollapse = computed(() => {
      return !store.state.app.sidebar.opened
    })
    return {
      permission_routers,
      isCollapse,
    }
  }
}
</script>
