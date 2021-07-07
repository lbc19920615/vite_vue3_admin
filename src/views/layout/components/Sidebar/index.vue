<template>
  <div>
    <div class="logo">
      <!-- <img src="//oss.kaoyanvip.cn/uploads/file1573098085835.jpg"> -->
      <div class="normal">LOGO</div>
      <div class="small">L</div>
    </div>
    <el-scrollbar wrapClass="scrollbar-wrapper">
      <el-menu mode="vertical" :show-timeout="200"
               :default-active="active_path" :collapse="isCollapse"
               text-color="#1f2d3d">
        <sidebar-item :routes="permission_routers"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import SidebarItem from './SidebarItem.vue'
import {computed} from "vue";

export default {
  components: { SidebarItem },
  computed: {
    active_path() {
      //parentPath 是在某些页面有tab 切换的时候，选中左侧的导航栏
      let { meta = {} } = this.$route;
      let { parentPath = "" } = meta;
      return parentPath || this.$route.path;
    },
  },
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
