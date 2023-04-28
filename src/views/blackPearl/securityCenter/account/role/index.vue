<template>
  <div class="page-container">
    <div class="top-container">
      <AddRoleDialog @refreshList="getRoleList()" />
    </div>
    <div class="bottom-container">
      <Table
        :columns="columns"
        :data="dataSource"
        rowKey="uuid"
        :loading="loading"
      ></Table>
    </div>
  </div>
</template>

<script>
import Table from '@/components/Table'
import AddRoleDialog from './components/addRoleDialog'
import ModifyRoleMenuDialog from './components/modifyRoleMenuDialog'
import ModifyRolePermissionDialog from './components/modifyRolePermissionDialog'
import { getRoleListApi, removeRoleApi } from '@/api/blackPearl/securityCenter'

export default {
  components: {
    Table,
    AddRoleDialog,
    ModifyRoleMenuDialog,
    ModifyRolePermissionDialog
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'name', label: '名称', align: 'left' },
        { prop: 'description', label: '描述', align: 'left' },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          render: (h, { row }) => {
            return (
              <fragment>
                <ModifyRoleMenuDialog
                  currentRole={row}
                  onRefreshList={() => this.getRoleList()}
                />
                <ModifyRolePermissionDialog
                  currentRole={row}
                  onRefreshList={() => this.getRoleList()}
                />
                <AddRoleDialog
                  onRefreshList={() => this.getRoleList()}
                  currentRole={row}
                />
                <el-link
                  type="danger"
                  underline={false}
                  onClick={() => this.removeRole(row.uuid)}
                >
                  删除
                </el-link>
              </fragment>
            )
          }
        }
      ],
      loading: false
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      this.loading = true
      getRoleListApi().then(
        (resp) => {
          let { array: list = [] } = resp || {}
          this.dataSource = list
          this.loading = false
        },
        () => {
          this.loading = false
        }
      )
    },
    removeRole(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRoleApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getRoleList()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top-container {
    flex-shrink: 0;
  }
  .bottom-container {
    margin-top: 20px;
    flex: 1;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
