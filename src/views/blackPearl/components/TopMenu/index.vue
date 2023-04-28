<template>
  <el-menu
    :default-active="activeMenu"
    mode="horizontal"
    @select="onMenuSelect"
  >
    <el-menu-item
      v-for="(item, index) in topMenus"
      :index="item.path"
      :key="index"
    >
      {{ item.meta.title }}
    </el-menu-item>
  </el-menu>
</template>

<script>
import { BPMenuRoutes } from '@/router'

export default {
  data() {
    return {}
  },
  computed: {
    // 顶部显示菜单
    topMenus() {
      let topMenus = []
      this.routers.map((menu) => {
        if (menu.hidden !== true) {
          topMenus.push(menu)
        }
      })
      return topMenus
    },
    // BP管理后台所有的路由信息
    routers() {
      return BPMenuRoutes
    },
    // 默认激活的菜单
    activeMenu() {
      // 去掉默认的前缀
      const path = this.$route.path.replace('/blackPearl', '')

      let activePath = path
      if (path !== undefined && path.lastIndexOf('/') > 0) {
        const tmpPath = path.substring(1, path.length)
        activePath = tmpPath.substring(0, tmpPath.indexOf('/'))
      } else if (!this.$route.children) {
        activePath = path
      }
      // 更新当前激活路由的子路由
      this.activeRoutes(activePath)

      return activePath
    },
    // 设置子路由
    childrenMenus() {
      let childrenMenus = []
      this.routers.map((router) => {
        for (let item in router.children) {
          if (!router.children[item].parentPath) {
            router.children[item].parentPath = router.path
          }
          childrenMenus.push(router.children[item])
        }
      })
      return childrenMenus
    },
  },
  mounted() {},
  methods: {
    // 菜单选择事件
    onMenuSelect(key, keyPath) {
      if (this.isHttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, '_blank')
        return
      }
      this.$router.push({ path: `/blackPearl/${key}` })
    },
    // 更新当前激活路由的子路由
    activeRoutes(key) {
      let routes = []
      if (this.childrenMenus && this.childrenMenus.length > 0) {
        this.childrenMenus.map((item) => {
          if (key === item.parentPath) {
            routes.push(item)
          }
        })
      }
      if (routes.length > 0) {
        this.$store.commit('SET_SIDEBAR_ROUTERS', routes)
      }
    },
    isHttp(url) {
      return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
    },
  },
}
</script>

<style lang="scss" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;
  & > .el-menu-item {
    color: #4e5767;
    border-bottom: none;
    &:not(.is-disabled):hover,
    &.is-active {
      color: #1890ff;
      position: relative;
    }
    &.is-active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 50%;
      height: 2px;
      background: #1890ff;
    }
  }
}
</style>
