<template>
  <div class="page-container">
    <div class="top-container">
      <AddAdminUserDialog :roleList="roleList" @refreshList="onReset()" />
    </div>
    <div class="bottom-container">
      <div class="filter-container">
        <div class="filter-input">
          <span class="title">单位：</span>
          <el-cascader
            class="cascader-ipt"
            v-model="searchParams.department_uuid"
            :props="cascaderProps"
            :show-all-levels="false"
            @change="getAdminUserList()"
            placeholder="请选择单位"
            clearable
          ></el-cascader>
          <span class="title ml20">用户名：</span>
          <el-input
            class="ipt"
            v-model="searchParams.name"
            placeholder="请输入用户名"
            clearable
          />
          <span class="title ml20">角色名称：</span>
          <el-select
            class="sel"
            v-model="searchParams.role_uuid"
            placeholder="请选择角色名称"
            @change="getAdminUserList()"
            clearable
          >
            <el-option
              v-for="item in roleList"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid"
            >
            </el-option>
          </el-select>
          <span class="title ml20">状态：</span>
          <el-select
            class="sel"
            v-model="searchParams.status"
            placeholder="请选择状态"
            @change="getAdminUserList()"
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item.val"
              :label="item.title"
              :value="item.val"
            >
            </el-option>
          </el-select>
        </div>
        <div class="filter-btn ml20">
          <el-button type="primary" @click="getAdminUserList()">查询</el-button>
          <el-button @click="onReset()">重置</el-button>
        </div>
      </div>
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
      @pagination="getAdminUserList()"
    />
  </div>
</template>

<script>
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import AddAdminUserDialog from './components/addAdminUserDialog'
import SetDepartmentForAdmin from './components/setDepartmentForAdmin'
import {
  getAdminUserListApi,
  getRoleListApi,
  removeAdminUserApi
} from '@/api/blackPearl/securityCenter'
import { getDepartmentApi } from '@/api/blackPearl/supervisionSpot'

export default {
  components: {
    Table,
    Pagination,
    AddAdminUserDialog
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'full_name', label: '单位', align: 'left' },
        { prop: 'name', label: '用户名', align: 'left', width: 200 },
        { prop: 'role_name', label: '角色', align: 'left', width: 200 },
        {
          prop: 'frozen_timestamp',
          label: '冻结时间',
          align: 'left',
          width: 180,
          render: (h, { row: { frozen_timestamp } }) => {
            let frozenTime = frozen_timestamp
              ? this.parseTime(frozen_timestamp, '{y}-{m}-{d}')
              : '无'
            return frozenTime
          }
        },
        {
          prop: 'status',
          label: '状态',
          align: 'left',
          width: 100,
          render: (h, { row: { status } }) => {
            return this.statusToStr(status)
          }
        },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          width: 200,
          render: (h, { row }) => {
            return (
              <fragment>
                <SetDepartmentForAdmin
                  onRefreshList={() => this.getAdminUserList()}
                  currentAdminUser={row}
                />
                <AddAdminUserDialog
                  roleList={this.roleList}
                  onRefreshList={() => this.getAdminUserList()}
                  currentAdminUser={row}
                />
                <el-link
                  type="danger"
                  underline={false}
                  onClick={() => this.removeAdmin(row.uuid)}
                >
                  删除
                </el-link>
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
        department_uuid: '',
        name: '',
        role_uuid: '',
        status: ''
      },
      cascaderProps: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          let { level, value: parent_uuid = 0 } = node
          level = level + 1 // level默认从0开始，接口要求从1开始
          getDepartmentApi({ parent_uuid, level }).then((resp) => {
            let { array: list = [] } = resp || {}
            let nodes = list.map((item) => ({
              value: item.uuid,
              label: item.name,
              leaf: level >= 4 // 共5级，这里筛选上级单位，最多4级
            }))
            resolve(nodes)
          })
        }
      },
      roleList: [],
      statusList: [
        { title: '正常', val: 'NORMAL' },
        { title: '锁定', val: 'LOCK' }
      ]
    }
  },
  mounted() {
    this.getRoleList()
    this.getAdminUserList()
  },
  methods: {
    onReset() {
      for (let key in this.searchParams) {
        this.searchParams[key] = ''
      }
      this.page['current'] = 1
      this.page['pageSize'] = 10

      this.getAdminUserList()
    },
    getRoleList() {
      getRoleListApi().then((resp) => {
        let { array: list = [] } = resp || {}
        this.roleList = list
      })
    },
    statusToStr(val) {
      switch (val) {
        case 'NORMAL':
          return '正常'
        case 'FROZEN':
          return '冻结'
        case 'LOCK':
          return '锁定'
        default:
          return '未知'
      }
    },
    getAdminUserList() {
      this.loading = true
      let { current, pageSize } = this.page
      let params = {
        offset: (current - 1) * pageSize,
        rows: pageSize
      }
      for (let key in this.searchParams) {
        if (this.searchParams[key]) {
          // 父级菜单字段为数组，需特殊处理
          if (key === 'department_uuid') {
            let tem = this.searchParams[key]
            params[key] = tem[tem.length - 1]
          } else {
            params[key] = this.searchParams[key]
          }
        }
      }
      getAdminUserListApi(params).then(
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
    removeAdmin(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeAdminUserApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getAdminUserList()
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
    .filter-container {
      display: flex;
      padding: 20px 10px 10px;
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
        .cascader-ipt {
          width: 100%;
          max-width: 260px;
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
  }
}
</style>
