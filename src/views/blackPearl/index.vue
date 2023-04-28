<template>
  <el-container class="layout-container">
    <el-aside class="layout-aside" width="180px">
      <div class="logo">BlackPearl</div>
      <SideNav class="menu-container" />
    </el-aside>
    <el-container class="layout-main-container">
      <el-header class="layout-header">
        <TopNav class="nav" />
        <div class="header-right">
          <p class="icon" title="返回首页" @click="onPageReturn">
            <svg-icon icon-class="return-home" class-name="icon-return-home" />
          </p>
        </div>
      </el-header>
      <el-main class="layout-main">
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TopNav from './components/TopMenu/index'
import SideNav from './components/SideMenu/index'
export default {
  components: { TopNav, SideNav },
  data() {
    return {}
  },

  mounted() {},

  methods: {
    // 跳转到业务操作首页
    onPageReturn() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  background: #f7fbff;
  .layout-aside {
    margin: 0;
    padding: 0;
    background: #fff;
    overflow: visible;
    box-shadow: 0px 4px 12px 0px rgba(183, 184, 213, 0.15);
    position: relative;
    z-index: 2;
    .logo {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60px;
      font-size: 20px;
      border-bottom: 1px #f3f7fa solid;
      box-sizing: border-box;
      font-family: Tahoma, Helvetica, Arial;
      font-weight: 600;
    }
    .menu-container {
      height: calc(100vh - 60px);
      padding: 0 0 20px 10px;
      border-inline-end: none !important;
      box-sizing: border-box;
      overflow: hidden;
      overflow-y: auto;
      overflow-y: overlay;
    }
  }
  .layout-main-container {
    overflow: hidden;
    position: relative;
    z-index: 1;
    .layout-header {
      position: relative;
      z-index: 2;
      padding: 0;
      overflow: visible;
      display: flex;
      align-items: center;
      box-shadow: 0px 4px 12px 0px rgba(183, 184, 213, 0.15);
      background: #fff;
      .nav {
        flex: 1;
        padding: 0 20px;
      }
      .header-right {
        flex-shrink: 0;
        .icon {
          width: 42px;
          height: 42px;
          background: #f7fbff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-right: 20px;
          .icon-return-home {
            width: 18px;
            height: 18px;
            color: #4e5767;
          }
        }
      }
    }
    .layout-main {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
