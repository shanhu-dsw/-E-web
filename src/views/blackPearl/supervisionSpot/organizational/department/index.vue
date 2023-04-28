<template>
  <div class="page-container">
    <div class="top-container">
      <AddDepartmentDialog :typeList="typeList" @refreshList="onReset()" />
    </div>
    <div class="bottom-container">
      <div class="filter-container">
        <div class="filter-input">
          <span class="title">上级单位：</span>
          <el-cascader
            class="cascader-ipt"
            v-model="searchParams.parent_uuid"
            :props="cascaderProps"
            :show-all-levels="false"
            @change="getDepartmentList()"
            clearable
          ></el-cascader>
          <span class="title ml20">类型：</span>
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
      @pagination="getDepartmentList()"
    />
  </div>
</template>

<script>
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import AddDepartmentDialog from './components/addDepartmentDialog'
import ModifyDepartmentProblemDialog from './components/modifyDepartmentProblemDialog'
import {
  getDepartmentApi,
  getDepartmentTypeListApi,
  removeDepartmentApi
} from '@/api/blackPearl/supervisionSpot'

export default {
  components: {
    Table,
    Pagination,
    AddDepartmentDialog,
    ModifyDepartmentProblemDialog
  },
  data() {
    return {
      dataSource: [],
      columns: [
        { prop: 'full_name', label: '单位', align: 'left' },
        { prop: 'name', label: '名称', align: 'left' },
        { prop: 'type_name', label: '类型', align: 'left', width: 150 },
        {
          prop: 'uuid',
          label: '操作',
          align: 'left',
          width: 250,
          render: (h, { row }) => {
            return (
              <fragment>
                <ModifyDepartmentProblemDialog
                  onRefreshList={() => this.getDepartmentList()}
                  currentDepartment={row}
                />
                <AddDepartmentDialog
                  typeList={this.typeList}
                  onRefreshList={() => this.getDepartmentList()}
                  currentDepartment={row}
                />
                <el-link
                  type="danger"
                  underline={false}
                  onClick={() => this.removeDepartment(row.uuid)}
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
        name: '',
        type_uuid: '',
        parent_uuid: ''
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
      typeList: []
    }
  },
  mounted() {
    this.getDepartmentTypeList()
    this.getDepartmentList()
  },
  methods: {
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
          // 父级菜单字段为数组，需特殊处理
          if (key === 'parent_uuid') {
            let tem = this.searchParams[key]
            params[key] = tem[tem.length - 1]
          } else {
            params[key] = this.searchParams[key]
          }
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
    },
    removeDepartment(uuid) {
      this.$confirm('删除后不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeDepartmentApi({ uuid }).then(() => {
          this.$message.success('删除成功')
          this.getDepartmentList()
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
