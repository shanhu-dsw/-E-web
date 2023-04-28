<template>
  <fragment>
    <el-link
      type="primary"
      :underline="false"
      class="mr5"
      @click="onDialogOpen()"
    >
      设置监督单位
    </el-link>
    <Dialog
      title="设置监督单位"
      :visible="dialogVisible"
      @onCancel="onDialogClose()"
      @onOk="onDialogOk()"
      width="800px"
      :isShowFooter="false"
    >
      <div class="table-container">
        <div class="filter-container">
          <div class="filter-input">
            <span class="title">类型：</span>
            <el-select
              class="sel"
              v-model="searchParams.type_uuid"
              placeholder="请选择单位类型"
              @change="getDepartmentList()"
              clearable
            >
              <el-option
                v-for="item in typeList"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid"
              >
              </el-option>
            </el-select>
            <span class="title ml20">名称：</span>
            <el-input
              class="ipt"
              v-model="searchParams.name"
              placeholder="请输入单位名称"
              clearable
            />
          </div>
          <div class="filter-btn ml20">
            <el-button type="primary" @click="getDepartmentList()">
              查询
            </el-button>
            <el-button @click="onReset()">重置</el-button>
          </div>
        </div>
        <Table
          class="table"
          :tHeight="500"
          :columns="columns"
          :data="dataSource"
          rowKey="uuid"
          :loading="loading"
        ></Table>
      </div>
      <Pagination
        class="pagination"
        :total="page.total"
        :page.sync="page.current"
        :limit.sync="page.pageSize"
        @pagination="getDepartmentList()"
      />
    </Dialog>
  </fragment>
</template>

<script>
import Dialog from '@blackPearl/components/Dialog'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import {
  getDepartmentApi,
  getDepartmentTypeListApi
} from '@/api/blackPearl/supervisionSpot'
import { modifyAdminUserApi } from '@/api/blackPearl/securityCenter'

export default {
  components: {
    Dialog,
    Table,
    Pagination
  },
  props: {
    currentAdminUser: {
      type: Object
    }
  },
  computed: {
    manageDepartments() {
      let { manage_departments = '' } = this.currentAdminUser
      return manage_departments.split(';')
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataSource: [],
      columns: [
        { prop: 'full_name', label: '单位', align: 'left' },
        { prop: 'name', label: '名称', align: 'left', width: 200 },
        { prop: 'type_name', label: '类型', align: 'left', width: 100 },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          width: 80,
          render: (h, { row }) => {
            let isDel =
              this.manageDepartments.findIndex((item) => item === row.uuid) !==
              -1
            return (
              <fragment>
                {!isDel ? (
                  <el-link
                    type="primary"
                    underline={false}
                    onClick={() => this.modifyAdminUser(row.uuid, 'ADD')}
                  >
                    添加
                  </el-link>
                ) : (
                  <el-link
                    type="danger"
                    underline={false}
                    onClick={() => this.modifyAdminUser(row.uuid, 'REMOVE')}
                  >
                    移除
                  </el-link>
                )}
              </fragment>
            )
          }
        }
      ],
      loading: false,
      page: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      searchParams: {
        name: '',
        type_uuid: ''
      },
      typeList: []
    }
  },
  mounted() {},
  methods: {
    modifyAdminUser(manage_department_uuid, manage_department_type) {
      let { uuid } = this.currentAdminUser
      modifyAdminUserApi({
        uuid,
        manage_department_uuid,
        manage_department_type
      }).then(() => {
        this.$message.success('操作成功')
        this.$emit('refreshList')
        this.getDepartmentList()
      })
    },
    onDialogOpen() {
      this.getDepartmentTypeList()
      this.getDepartmentList()
      this.dialogVisible = true
    },
    onDialogClose() {
      this.dialogVisible = false
    },
    onReset() {
      for (let key in this.searchParams) {
        this.searchParams[key] = ''
      }
      this.page['current'] = 1
      this.page['pageSize'] = 10

      this.getDepartmentList()
    },
    getDepartmentTypeList() {
      getDepartmentTypeListApi().then((resp) => {
        let { array: list = [] } = resp || {}
        this.typeList = list
      })
    },
    getDepartmentList() {
      this.loading = true
      let { current, pageSize } = this.page
      let params = {
        offset: (current - 1) * pageSize,
        rows: pageSize
      }
      for (let key in this.searchParams) {
        if (this.searchParams[key]) {
          params[key] = this.searchParams[key]
        }
      }
      getDepartmentApi(params).then(
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
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  display: flex;
  flex-direction: column;
  .filter-container {
    display: flex;
    .filter-input {
      display: flex;
      align-items: center;
      flex: 1;
      .title {
        white-space: nowrap;
        color: #606266;
        font-size: 14px;
      }
      .ipt {
        width: 100%;
        max-width: 200px;
      }
      .sel {
        width: 100%;
        max-width: 200px;
      }
    }
    .filter-btn {
      flex-shrink: 0;
      display: flex;
    }
  }
  .table {
    margin: 0 -10px;
  }
}
.pagination {
  margin-bottom: 20px !important;
}
</style>
