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
      添加角色
    </el-button>
    <Dialog
      :title="`${isEdit ? '编辑' : '添加'}角色`"
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
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入4-32位的数字、大小写字母、下划线或横线"
            clearable
          />
        </el-form-item>
        <el-form-item label="排序编号" prop="order">
          <el-input
            v-model="form.order"
            placeholder="请输入1-255之间的正整数"
            clearable
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            placeholder="请输入2-64位的任意字符"
            clearable
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </fragment>
</template>

<script>
import Dialog from '@blackPearl/components/Dialog'
import { addRoleApi, modifyRoleApi } from '@/api/blackPearl/securityCenter'

export default {
  components: {
    Dialog
  },
  props: {
    currentRole: {
      type: Object
    }
  },
  computed: {
    isEdit() {
      return !!this.currentRole
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        order: undefined,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
          {
            pattern: /^[0-9a-zA-Z_-]{4,32}$/,
            message: '请输入4-32位的数字、大小写字母、下划线或横线',
            trigger: 'change'
          }
        ],
        order: [
          { required: true, message: '请输入排序编号', trigger: 'change' },
          {
            pattern: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/,
            message: '请输入1-255之间的正整数',
            trigger: 'change'
          }
        ],
        description: [
          {
            pattern: /^.{2,64}$/,
            message: '请输入2-64位的任意字符',
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
        let { name, order, description, uuid } = this.currentRole
        this.form = {
          name,
          order,
          description,
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
          let api = this.isEdit ? modifyRoleApi : addRoleApi
          api({ ...this.form }).then(() => {
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
