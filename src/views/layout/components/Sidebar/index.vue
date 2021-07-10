<template>
  <div>
    <div class="logo">
      <!-- <img src="//oss.kaoyanvip.cn/uploads/file1573098085835.jpg"> -->
      <div class="normal">LOGO</div>
      <div class="small">L</div>
    </div>
    <el-scrollbar wrapClass="scrollbar-wrapper">
      <el-menu mode="vertical" :show-timeout="200"
               :default-openeds="defaultOpened"
               :default-active="active_path" :collapse="isCollapse"
               text-color="#1f2d3d">
        <sidebar-item :routes="permission_routers"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SidebarItem from './SidebarItem.vue'
import {computed} from "vue";

export default {
  components: { SidebarItem },
  setup() {
    const store = useStore()
    const router = useRouter()

    const permission_routers = computed(() => {
      return store.state.permission.routers
    })

    const isCollapse = computed(() => {
      return !store.state.app.sidebar.opened
    })

    const active_path = computed(() => {
      let route = router.currentRoute.value

      console.log(route)
      let { meta = {} } = route;
      let { parentPath = "" } = meta;
      return parentPath || route.path;
    })

    const defaultOpened = computed(() => {
      let route = router.currentRoute.value
      let { matched = [] } = route
      if (matched[0]) {
        return [matched[0].path]
      }
      return null
    })


    return {
      active_path,
      defaultOpened,
      permission_routers,
      isCollapse,
    }
  }
}
</script>
