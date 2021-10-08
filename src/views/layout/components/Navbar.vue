<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <!-- <breadcrumb></breadcrumb> -->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
<!--        <img class="user-avatar" :src="avatar">-->
        <span>欢迎你，{{name}}</span>
<!--        <i class="el-icon-caret-bottom"></i>-->
        <el-icon><CaretBottom></CaretBottom></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger/index.vue'
// import { redirectToOA } from '@/utils'
import {CaretBottom} from "@element-plus/icons";

export default {
  data() {
    return {
      avatar: 'https://yantutest.oss-cn-shanghai.aliyuncs.com/face.png',
      name: 'admin'
    }
  },
  components: {
    // Breadcrumb,
    Hamburger,
    CaretBottom,
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // redirectToOA()
      })
    }
  }
}
</script>

<style lang="scss">
.navbar {
  height: 63px;
  line-height: 63px;
  border-bottom: none!important;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05);
  border-radius: 0 !important;
  .hamburger-container {
    height: 63px;
    line-height: 70px;
    float: left;
    padding: 0 30px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 63px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
      height: 100%;
      .user-avatar {
        width: 52px;
        height: 52px;
        border-radius: 50%;
      }
      span {
        color: #252b33;
        margin: 0 10px;
      }
    }
  }
}
</style>

