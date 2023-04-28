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
      添加个人问题
    </el-button>
    <Dialog
      :title="`${isEdit ? '编辑' : '添加'}个人问题`"
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
        <el-form-item label="个人问题名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入1-16位的任意字符"
            clearable
          />
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input
            v-model="form.score"
            placeholder="请输入1-255之间的正整数"
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
      </el-form>
    </Dialog>
  </fragment>
</template>

<script>
import Dialog from '@blackPearl/components/Dialog'
import {
  addProblemPersonTypeApi,
  modifyProblemPersonTypeApi
} from '@/api/blackPearl/supervisionSpot'

export default {
  components: {
    Dialog
  },
  props: {
    currentPersonProblem: {
      type: Object
    }
  },
  computed: {
    isEdit() {
      return !!this.currentPersonProblem
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        score: undefined,
        order: undefined
      },
      rules: {
        name: [
          { required: true, message: '请输入个人问题名称', trigger: 'change' },
          {
            pattern: /^.{1,16}$/,
            message: '请输入1-16位的任意字符',
            trigger: 'change'
          }
        ],
        score: [
          { required: true, message: '请输入分值', trigger: 'change' },
          {
            pattern: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/,
            message: '请输入1-255之间的正整数',
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
        ]
      }
    }
  },
  mounted() {},
  methods: {
    onDialogOpen() {
      // 编辑回填数据
      if (this.isEdit) {
        let { name, score, order, uuid } = this.currentPersonProblem
        this.form = {
          name,
          score,
          order,
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
          let api = this.isEdit
            ? modifyProblemPersonTypeApi
            : addProblemPersonTypeApi
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
