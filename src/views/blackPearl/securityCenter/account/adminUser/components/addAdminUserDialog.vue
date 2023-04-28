<template>
  <fragment>
    <el-link
      v-if="isEdit"
      type="primary"
      :underline="false"
      class="mr5"
      @click="onDialogOpen()"
    >
      编辑
    </el-link>
    <el-button type="primary" v-else @click="onDialogOpen()">
      添加管理员
    </el-button>
    <Dialog
      :title="`${isEdit ? '编辑' : '添加'}管理员`"
      :visible="dialogVisible"
      @onCancel="onDialogClose()"
      @onOk="onDialogOk()"
      width="500px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="auto"
      >
        <el-form-item label="角色名称" prop="role_uuid" :required="!isEdit">
          <el-select
            :style="{ width: '100%' }"
            v-model="form.role_uuid"
            placeholder="请选择角色名称"
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
        </el-form-item>
        <el-form-item label="账户名称" prop="name" :required="!isEdit">
          <el-input
            v-model="form.name"
            placeholder="请输入4-16位的数字、大小写字母、下划线或横线"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="!isEdit">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入1-16位的非空白字符"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="isEdit">
          <el-select
            :style="{ width: '100%' }"
            v-model="form.status"
            placeholder="请选择状态"
          >
            <el-option label="正常" value="NORMAL"> </el-option>
            <el-option label="锁定" value="LOCK"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </Dialog>
  </fragment>
</template>

<script>
import Dialog from '@blackPearl/components/Dialog'
import {
  addAdminUserApi,
  modifyAdminUserApi
} from '@/api/blackPearl/securityCenter'

export default {
  components: {
    Dialog
  },
  props: {
    roleList: {
      type: Array,
      default() {
        return []
      }
    },
    currentAdminUser: {
      type: Object
    }
  },
  computed: {
    isEdit() {
      return !!this.currentAdminUser
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        role_uuid: '',
        name: '',
        password: '',
        status: 'NORMAL'
      },
      rules: {
        role_uuid: [
          {
            validator: (rule, val, callback) => {
              if (!this.isEdit && !val) {
                callback(new Error('请选择角色名称'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        name: [
          {
            validator: (rule, val, callback) => {
              if (!this.isEdit && !val) {
                callback(new Error('请输入账户名称'))
              } else if (
                (!this.isEdit || val) &&
                !new RegExp(/^[0-9a-zA-Z_-]{4,16}$/).test(val)
              ) {
                callback(
                  new Error('请输入4-16位的数字、大小写字母、下划线或横线')
                )
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        password: [
          {
            validator: (rule, val, callback) => {
              if (!this.isEdit && !val) {
                callback(new Error('请输入密码'))
              } else if (
                (!this.isEdit || !!val.trim()) &&
                !new RegExp(/^\S{1,16}$/).test(val)
              ) {
                callback(new Error('请输入1-16位的非空白字符'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    onDialogOpen() {
      // 编辑回填数据
      if (this.isEdit) {
        let { role_uuid, name, status, uuid } = this.currentAdminUser
        this.form = {
          role_uuid,
          name,
          status,
          password: '         ', // 密码回填空字符串
          uuid
        }
      }
      this.dialogVisible = true
    },
    onDialogClose() {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields()
    },
    onDialogOk() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { role_uuid, name, password, status, uuid } = this.form
          let param = {}
          role_uuid ? (param.role_uuid = role_uuid) : ''
          name ? (param.name = name) : ''
          let delTrimPassword = password.trim()
          delTrimPassword ? (param.password = delTrimPassword) : ''

          let api = this.isEdit
            ? modifyAdminUserApi({ ...param, uuid, status })
            : addAdminUserApi(param)
          api.then(() => {
            this.$message.success('操作成功')
            this.$emit('refreshList')
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
