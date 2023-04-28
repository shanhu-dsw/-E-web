<template>
  <div class="page-container">
    <div class="top-container">
      <AddMenuDialog :list="list" @refreshList="getMenuList()" />
    </div>
    <div class="bottom-container">
      <Table
        :defaultExpandAll="true"
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
import AddMenuDialog from './components/addMenuDialog'
import { getMenuListApi, removeMenuApi } from '@/api/blackPearl/securityCenter'
import { getTreesData } from '@/utils'

export default {
  components: {
    Table,
    AddMenuDialog
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'name', label: '名称', align: 'left' },
        { prop: 'text', label: '显示文本', align: 'left', width: 200 },
        { prop: 'description', label: '描述', align: 'left' },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          width: 150,
          render: (h, { row }) => {
            return (
              <fragment>
                <AddMenuDialog
                  list={this.list}
                  onRefreshList={() => this.getMenuList()}
                  currentMenu={row}
                />
                <el-link
                  type="danger"
                  underline={false}
                  onClick={() => this.removeMenu(row.uuid)}
                >
                  删除
                </el-link>
              </fragment>
            )
          }
        }
      ],
      loading: false,
      list: []
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      this.loading = true
      getMenuListApi().then(
        (resp) => {
          let { array: list = [] } = resp || {}
          this.list = JSON.parse(JSON.stringify(list))
          this.dataSource = getTreesData(
            JSON.parse(JSON.stringify(list)),
            0,
            'uuid',
            'parent_uuid'
          )
          this.loading = false
        },
        () => {
          this.loading = false
        }
      )
    },
    removeMenu(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeMenuApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getMenuList()
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
