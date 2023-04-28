<template>
  <fragment>
    <el-link
      type="primary"
      :underline="false"
      class="mr5"
      @click="onDialogOpen()"
    >
      分配权限
    </el-link>
    <Dialog
      :title="`分配权限：${currentRole.name}`"
      :visible="dialogVisible"
      @onCancel="onDialogClose()"
      @onOk="onDialogOk()"
      width="800px"
    >
      <div class="table-container">
        <fragment v-for="(modules, idx) in list" :key="modules.module">
          <div class="table-header">
            <el-checkbox
              :indeterminate="checkedData[idx].isIndeterminate"
              v-model="checkedData[idx].checkAll"
              @change="(val) => onCheckAllChange(val, idx)"
              >{{ modules.module }}</el-checkbox
            >
          </div>
          <div class="table-content">
            <el-checkbox-group
              v-model="checkedData[idx].checkedKeys"
              @change="(val) => onCheckedChange(val, idx)"
            >
              <el-checkbox
                v-for="item in modules.methods"
                :label="item.method_full_name"
                :key="item.method_full_name"
                :title="item.method_name"
              >
                {{ item.method_name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </fragment>
      </div>
    </Dialog>
  </fragment>
</template>

<script>
import Dialog from '@blackPearl/components/Dialog'
import {
  getModuleMethodApi,
  modifyRolePermissionApi
} from '@/api/blackPearl/securityCenter'

export default {
  components: {
    Dialog
  },
  props: {
    currentRole: {
      type: Object
    }
  },
  computed: {},
  data() {
    return {
      dialogVisible: false,
      list: [],
      checkedData: []
    }
  },
  mounted() {},
  methods: {
    onCheckedChange(val, idx) {
      let { allKeys = [] } = this.checkedData[idx]
      let checkedCount = val.length
      this.$set(
        this.checkedData[idx],
        'checkAll',
        checkedCount === allKeys.length
      )
      this.$set(
        this.checkedData[idx],
        'isIndeterminate',
        checkedCount > 0 && checkedCount < allKeys.length
      )
    },
    onCheckAllChange(val, idx) {
      let { allKeys = [] } = this.checkedData[idx]
      let checkedKeys = val ? allKeys : []
      this.$set(this.checkedData[idx], 'checkedKeys', checkedKeys)
      this.$set(this.checkedData[idx], 'isIndeterminate', false)
    },
    getModuleMethods() {
      getModuleMethodApi().then((resp) => {
        let { array: list = [] } = resp || {}
        this.list = list
        // 回显已有权限
        let { permissions = '' } = this.currentRole || {}
        let defaultCheckedKeys = permissions.split(';').slice(0, -1)
        this.checkedData = list.map((item) => {
          let allKeys = item.methods.map((ite) => ite.method_full_name)
          let checkedKeys = defaultCheckedKeys.filter(
            (key) => key.indexOf(item.module) !== -1
          )
          let checkedCount = checkedKeys.length
          let isIndeterminate =
            checkedCount > 0 && checkedCount < allKeys.length
          let checkAll = checkedCount === allKeys.length
          return {
            checkedKeys,
            isIndeterminate,
            checkAll,
            allKeys
          }
        })
      })
    },
    onDialogOpen() {
      this.getModuleMethods()
      this.dialogVisible = true
    },
    onDialogClose() {
      this.dialogVisible = false
    },
    onDialogOk() {
      let permissions = this.checkedData.reduce((prev, item) => {
        return prev.concat(item.checkedKeys)
      }, [])
      if (permissions.length === 0) {
        this.$message.error('请先勾选权限')
        return
      }
      let permissionsStr = `${permissions.join(';')};`
      let { uuid } = this.currentRole || {}
      modifyRolePermissionApi({ permissions: permissionsStr, uuid }).then(
        () => {
          this.$message.success('操作成功')
          this.dialogVisible = false
          this.$emit('refreshList')
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  height: 50vh;
  overflow: auto;
  overflow: overlay;
  .table-header {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: #f3f7fa;
  }
  .table-content {
    ::v-deep .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      .el-checkbox {
        margin-right: 0;
        width: 33.33%;
        height: 35px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-bottom: 1px #f3f7fa solid;
        box-sizing: border-box;
        .el-checkbox__label {
          flex: 1;
          line-height: 34px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .el-checkbox__input {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
