<template>
  <div class="page-container">
    <div class="top-container">
      <AddDepartmentProblemDialog
        :list="list"
        @refreshList="getProblemDepartmentList()"
      />
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
import AddDepartmentProblemDialog from './components/addDepartmentProblemDialog'
import {
  getProblemDepartmentTypeListApi,
  removeProblemDepartmentTypeApi
} from '@/api/blackPearl/supervisionSpot'
import { getTreesData } from '@/utils'

export default {
  components: {
    Table,
    AddDepartmentProblemDialog
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'name', label: '名称', align: 'left' },
        {
          prop: 'description',
          label: '描述',
          align: 'left',
          width: '200',
          render: (h, { row }) => {
            return row.description ? row.description : '无'
          }
        },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          width: 150,
          render: (h, { row }) => {
            return (
              <fragment>
                <AddDepartmentProblemDialog
                  list={this.list}
                  onRefreshList={() => this.getProblemDepartmentList()}
                  currentProblemType={row}
                />
                <el-link
                  type="danger"
                  underline={false}
                  onClick={() => this.removeProblemDepartment(row.uuid)}
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
    this.getProblemDepartmentList()
  },
  methods: {
    getProblemDepartmentList() {
      this.loading = true
      getProblemDepartmentTypeListApi().then(
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
    removeProblemDepartment(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeProblemDepartmentTypeApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getProblemDepartmentList()
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
