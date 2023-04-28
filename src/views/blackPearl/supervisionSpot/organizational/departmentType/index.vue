<template>
  <div class="page-container">
    <div class="top-container">
      <AddDepartmentTypeDialog @refreshList="getDepartmentTypeList()" />
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
import AddDepartmentTypeDialog from './components/addDepartmentTypeDialog'
import {
  getDepartmentTypeListApi,
  removeDepartmentTypeApi
} from '@/api/blackPearl/supervisionSpot'

export default {
  components: {
    Table,
    AddDepartmentTypeDialog
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'name', label: '名称', align: 'left' },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          render: (h, { row }) => {
            return (
              <fragment>
                <AddDepartmentTypeDialog
                  onRefreshList={() => this.getDepartmentTypeList()}
                  currentDepartmentType={row}
                />
                <el-link
                  type="danger"
                  underline={false}
                  onClick={() => this.removeDepartmentType(row.uuid)}
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
    this.getDepartmentTypeList()
  },
  methods: {
    getDepartmentTypeList() {
      this.loading = true
      getDepartmentTypeListApi().then(
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
    removeDepartmentType(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeDepartmentTypeApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getDepartmentTypeList()
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
