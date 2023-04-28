<template>
  <div class="page-container">
    <div class="bottom-container">
      <Table
        :columns="columns"
        :data="dataSource"
        rowKey="uuid"
        :loading="loading"
      ></Table>
    </div>
    <Pagination
      :total="page.total"
      :page.sync="page.current"
      :limit.sync="page.pageSize"
      @pagination="getFileDeleteFailRecord()"
    />
  </div>
</template>

<script>
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import {
  getStorageFileDeleteFailRecordApi,
  removeFileDeleteFailLogApi
} from '@/api/blackPearl/supervisionSpot'

export default {
  components: {
    Table,
    Pagination
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'url', label: '路径', align: 'left' },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          render: (h, { row }) => {
            return (
              <el-link
                type="danger"
                underline={false}
                onClick={() => this.removeFileDeleteFailRecord(row.uuid)}
              >
                删除
              </el-link>
            )
          }
        }
      ],
      loading: false,
      page: {
        total: 0,
        current: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getFileDeleteFailRecord()
  },
  methods: {
    getFileDeleteFailRecord() {
      this.loading = true
      let { current, pageSize } = this.page
      let params = {
        offset: (current - 1) * pageSize,
        rows: pageSize
      }
      getStorageFileDeleteFailRecordApi(params).then(
        (resp) => {
          let { array: list = [], count = 0 } = resp || {}
          this.page['total'] = count
          this.dataSource = list
          this.loading = false
        },
        () => {
          this.loading = false
        }
      )
    },
    removeFileDeleteFailRecord(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeFileDeleteFailLogApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getFileDeleteFailRecord()
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
