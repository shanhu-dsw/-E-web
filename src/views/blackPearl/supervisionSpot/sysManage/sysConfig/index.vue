<template>
  <div class="page-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-position="right"
      label-width="auto"
      class="form-container"
    >
      <div class="title">问题触发</div>
      <el-form-item
        label="个人问题触发报告次数"
        prop="person_problem_trigger_report_count"
      >
        <el-input
          class="wd-400"
          v-model="form.person_problem_trigger_report_count"
          placeholder="请输入1-255之间的正整数"
          clearable
        />
      </el-form-item>
      <el-form-item label="个人初始分值" prop="person_init_score">
        <el-input
          class="wd-400"
          v-model="form.person_init_score"
          placeholder="请输入大于等于0的正整数"
          clearable
        />
      </el-form-item>
    </el-form>
    <div class="btn-container">
      <el-button type="primary" @click="onFormSubmit()">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  getSystemConfigApi,
  modifySystemConfigApi
} from '@/api/blackPearl/supervisionSpot'

export default {
  data() {
    return {
      form: {
        person_problem_trigger_report_count: '',
        person_init_score: ''
      },
      rules: {
        person_problem_trigger_report_count: [
          {
            required: true,
            message: '请输入个人问题触发报告次数',
            trigger: 'change'
          },
          {
            pattern: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|[1-9])$/,
            message: '请输入1-255之间的正整数',
            trigger: 'change'
          }
        ],
        person_init_score: [
          {
            required: true,
            message: '请输入个人初始分值',
            trigger: 'change'
          },
          {
            pattern: /^[1-9]\d*|0$/,
            message: '请输入大于等于0的整数',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    this.getSystemConfig()
  },
  methods: {
    getSystemConfig() {
      getSystemConfigApi().then((resp) => {
        let { array: list = [] } = resp || {}
        let { person_init_score, person_problem_trigger_report_count } =
          list[0] || {}
        this.form = {
          person_init_score,
          person_problem_trigger_report_count
        }
      })
    },
    onFormSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          modifySystemConfigApi({ ...this.form }).then(() => {
            this.$message.success('保存成功')
            this.getSystemConfig()
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

<style lang="scss" scoped>
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  padding: 20px 0 20px 20px;
  box-sizing: border-box;
  .wd-400 {
    width: 400px;
  }
  .form-container {
    flex: 1;
    overflow: overlay;
    overflow: auto;
    .title {
      border-left: 3px solid #4084ff;
      padding-left: 13px;
      color: #1e2b43;
      font-weight: 600;
      font-size: 16px;
      line-height: 1;
      margin-bottom: 30px;
    }
  }
  .btn-container {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
  }
}
</style>
