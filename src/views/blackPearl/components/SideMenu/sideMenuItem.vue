<template>
  <div v-if="!item.hidden">
    <el-menu-item v-if="!item.children" :index="item.path">
      <item
        :icon="item.meta.icon || (item.meta && item.meta.icon)"
        :title="item.meta.title"
      />
    </el-menu-item>
    <el-submenu v-else ref="subMenu" :index="item.path" popper-append-to-body>
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <side-menu-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="child.path"
      />
    </el-submenu>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'SideMenuItem',
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  data() {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
  },
}
</script>
