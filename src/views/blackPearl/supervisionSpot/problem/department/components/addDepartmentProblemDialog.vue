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
      添加单位问题
    </el-button>
    <Dialog
      :title="`${isEdit ? '编辑' : '添加'}单位问题`"
      :visible="dialogVisible"
      @onCancel="onDialogClose()"
      @onOk="onDialogOk()"
      width="600px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="auto"
      >
        <el-form-item label="上级单位问题类型" prop="parent_uuid">
          <el-cascader
            :style="{ width: '100%' }"
            v-model="form.parent_uuid"
            :options="parentMenuList"
            :props="{ checkStrictly: true, value: 'uuid', label: 'name' }"
            placeholder="请选择上级单位问题类型（不选默认新增一级单位问题类型）"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="单位问题名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入1-128位的任意字符"
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
            type="textarea"
            :autosize="{ minRows: 3 }"
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
import {
  addProblemDepartmentTypeApi,
  modifyProblemDepartmentTypeApi
} from '@/api/blackPearl/supervisionSpot'
import { getTreesData, iterationDeleteChildren } from '@/utils'

export default {
  components: {
    Dialog
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    currentProblemType: {
      type: Object
    }
  },
  computed: {
    parentMenuList() {
      let temList = JSON.parse(
        JSON.stringify(this.list.filter((item) => item.level < 3))
      )
      return iterationDeleteChildren(
        getTreesData(temList, 0, 'uuid', 'parent_uuid')
      )
    },
    isEdit() {
      return !!this.currentProblemType
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        parent_uuid: '',
        name: '',
        order: undefined,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入单位问题名称', trigger: 'change' },
          {
            pattern: /^.{1,128}$/,
            message: '请输入1-128位的任意字符',
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
    getParentIds(parentId, list) {
      let res = []
      const getIdLoop = (parentId, list) => {
        if (parentId === '0') return
        let { uuid, parent_uuid } = list.find((item) => item.uuid === parentId)
        res.unshift(uuid)
        getIdLoop(parent_uuid, list)
      }
      getIdLoop(parentId, list)
      return res
    },
    onDialogOpen() {
      // 编辑回填数据
      if (this.isEdit) {
        let { name, order, description, uuid, parent_uuid } =
          this.currentProblemType
        let temList = this.list
        let parentIds = this.getParentIds(parent_uuid, temList)
        this.form = {
          name,
          order,
          description,
          uuid,
          parent_uuid: parentIds
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
          let { parent_uuid = [] } = this.form
          parent_uuid = parent_uuid[parent_uuid.length - 1] || 0
          let api = this.isEdit
            ? modifyProblemDepartmentTypeApi
            : addProblemDepartmentTypeApi
          api({ ...this.form, parent_uuid }).then(() => {
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
