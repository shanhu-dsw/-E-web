<template>
  <fragment>
    <el-link
      type="primary"
      :underline="false"
      class="mr5"
      @click="onDialogOpen()"
    >
      分配菜单
    </el-link>
    <Dialog
      :title="`分配菜单：${currentRole.name}`"
      :visible="dialogVisible"
      @onCancel="onDialogClose()"
      @onOk="onDialogOk()"
      width="800px"
    >
      <div class="table-container">
        <div class="table-header">
          <span class="text">
            <el-checkbox
              class="all-check-box"
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="onCheckAllChange"
            ></el-checkbox>
            显示文本
          </span>
          <span>
            <span>名称</span>
            <span>描述</span>
          </span>
        </div>
        <el-tree
          ref="tree"
          :data="dataSource"
          show-checkbox
          node-key="uuid"
          default-expand-all
          :expand-on-click-node="false"
          :check-on-click-node="true"
          :render-content="renderContent"
          @check="onTreeCheck"
        >
        </el-tree>
      </div>
    </Dialog>
  </fragment>
</template>

<script>
import Dialog from '@blackPearl/components/Dialog'
import {
  getMenuListApi,
  modifyRoleMenuApi
} from '@/api/blackPearl/securityCenter'
import { getTreesData } from '@/utils'

export default {
  components: {
    Dialog
  },
  props: {
    currentRole: {
      type: Object
    }
  },
  computed: {
    allMenuIds() {
      return this.list.map((item) => item.uuid)
    },
    isIndeterminate() {
      let checkedKeyLen = this.checkedKeys.length
      return checkedKeyLen > 0 && checkedKeyLen < this.allMenuIds.length
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataSource: [],
      list: [],
      checkedKeys: [],
      checkAll: false
    }
  },
  mounted() {},
  methods: {
    onCheckAllChange(val) {
      let checkedKeys = val ? this.allMenuIds : []
      this.$refs.tree.setCheckedKeys(checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onTreeCheck() {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      this.checkedKeys = checkedKeys
      this.checkAll = checkedKeys.length === this.allMenuIds.length
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span class="text" title={data.text}>
            {data.text}
          </span>
          <span>
            <span title={data.name}>{data.name}</span>
            <span title={data.description}>{data.description}</span>
          </span>
        </span>
      )
    },
    getMenuList() {
      getMenuListApi().then((resp) => {
        let { array: list = [] } = resp || {}
        this.list = list
        this.dataSource = getTreesData(
          JSON.parse(JSON.stringify(list)),
          0,
          'uuid',
          'parent_uuid'
        )
        // 回显已有菜单
        let { menus = [] } = this.currentRole || {}
        let defaultCheckedKeys = menus.map((item) => item.uuid)
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(defaultCheckedKeys)
          this.checkedKeys = defaultCheckedKeys
          this.checkAll = defaultCheckedKeys.length === this.allMenuIds.length
        })
      })
    },
    onDialogOpen() {
      this.getMenuList()
      this.dialogVisible = true
    },
    onDialogClose() {
      this.dialogVisible = false
    },
    onDialogOk() {
      let menus = this.$refs.tree.getCheckedKeys()
      if (menus.length === 0) {
        this.$message.error('请先勾选菜单')
        return
      }
      let menusStr = `${menus.join(';')};`
      let { uuid } = this.currentRole || {}
      modifyRoleMenuApi({ menus: menusStr, uuid }).then(() => {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.$emit('refreshList')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  width: 100%;
  height: 50vh;
  display: flex;
  flex-direction: column;
  .table-header {
    flex-shrink: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    overflow: hidden;
    background: #f3f7fa;
    font-weight: bold;
    span {
      &.text {
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .all-check-box {
        margin-right: 8px;
      }
      span {
        flex-shrink: 0;
        display: inline-block;
        width: 255px;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  ::v-deep .el-tree {
    width: 100%;
    flex: 1;
    overflow: auto;
    overflow: overlay;
    .el-tree-node__content {
      height: 35px;
      border-bottom: 1px #f3f7fa solid;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      overflow: hidden;
      span {
        &.text {
          padding-right: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span {
          flex-shrink: 0;
          display: inline-block;
          width: 255px;
          padding: 0 10px;
          box-sizing: border-box;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
