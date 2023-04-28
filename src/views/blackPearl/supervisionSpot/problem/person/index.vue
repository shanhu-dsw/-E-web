<template>
  <div class="page-container">
    <div class="top-container">
      <AddPersonProblemDialog @refreshList="getProblemPersonTypeList()" />
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
import AddPersonProblemDialog from './components/addPersonProblemDialog'
import {
  getProblemPersonTypeListApi,
  removeProblemPersonTypeApi
} from '@/api/blackPearl/supervisionSpot'

export default {
  components: {
    Table,
    AddPersonProblemDialog
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'name', label: '名称', align: 'left' },
        { prop: 'score', label: '分值', align: 'left' },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          render: (h, { row }) => {
            return (
              <fragment>
                <AddPersonProblemDialog
                  onRefreshList={() => this.getProblemPersonTypeList()}
                  currentPersonProblem={row}
                />
                <el-link
                  type="danger"
                  underline={false}
                  onClick={() => this.removeProblemPersonType(row.uuid)}
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
    this.getProblemPersonTypeList()
  },
  methods: {
    getProblemPersonTypeList() {
      this.loading = true
      getProblemPersonTypeListApi().then(
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
    removeProblemPersonType(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeProblemPersonTypeApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getProblemPersonTypeList()
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
