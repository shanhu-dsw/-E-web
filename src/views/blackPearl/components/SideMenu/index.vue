<template>
  <el-menu
    class="side-menus"
    :default-active="activeMenu"
    mode="vertical"
    @select="onMenuSelect"
  >
    <side-menu-item
      v-for="(route, index) in sidebarRouters"
      :key="route.path + index"
      :item="route"
      :base-path="route.path"
    />
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SideMenuItem from './sideMenuItem'

export default {
  components: { SideMenuItem },
  computed: {
    ...mapGetters(['sidebarRouters']),
    activeMenu() {
      const { meta, path } = this.$route
      // 去掉默认前缀
      let activeMenu = path.replace('/blackPearl/', '')
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return activeMenu
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 菜单选择事件
    onMenuSelect(key) {
      this.$router.push({ path: `/blackPearl/${key}` })
    },
  },
}
</script>

<style lang="scss" scoped>
.side-menus.el-menu {
  ::v-deep .el-submenu.is-active {
    .el-submenu__title {
      color: #1890ff;
      i {
        color: #1890ff;
      }
    }
  }
  ::v-deep .el-menu-item,
  ::v-deep .el-submenu__title {
    &:hover,
    &:focus {
      background: none;
      color: #1890ff;
      i {
        color: #1890ff;
      }
    }
  }
  ::v-deep .el-menu-item.is-active {
    position: relative;
    background-color: #f2f6ff;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #1890ff;
    }
  }
}
</style>
