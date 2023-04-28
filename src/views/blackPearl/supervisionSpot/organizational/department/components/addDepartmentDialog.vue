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
      添加单位
    </el-button>
    <Dialog
      :title="`${isEdit ? '编辑' : '添加'}单位`"
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
        <el-form-item label="上级单位" prop="parent_uuid">
          <el-cascader
            :style="{ width: '100%' }"
            v-model="form.parent_uuid"
            :props="cascaderProps"
            placeholder="请选择上级单位"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="类型" prop="type_uuid">
          <el-select
            :style="{ width: '100%' }"
            v-model="form.type_uuid"
            placeholder="请选择单位类型"
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
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入1-64位的任意字符"
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
  addDepartmentApi,
  modifyDepartmentApi,
  getDepartmentApi
} from '@/api/blackPearl/supervisionSpot'

export default {
  components: {
    Dialog
  },
  props: {
    typeList: {
      type: Array,
      default: () => []
    },
    currentDepartment: {
      type: Object
    }
  },
  computed: {
    isEdit() {
      return !!this.currentDepartment
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        parent_uuid: [],
        type_uuid: '',
        name: '',
        order: undefined
      },
      rules: {
        type_uuid: [
          { required: true, message: '请选择单位类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入单位名称', trigger: 'change' },
          {
            pattern: /^.{1,64}$/,
            message: '请输入1-64位的任意字符',
            trigger: 'change'
          }
        ],
        order: [
          { required: true, message: '请输入排序编号', trigger: 'change' },
          {
            pattern: /^[1-9]\d*|0$/,
            message: '请输入正整数',
            trigger: 'change'
          }
        ]
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
              leaf: level >= 4 // 共5级，这里筛选父级单位，最多4级
            }))
            resolve(nodes)
          })
        }
      }
    }
  },
  mounted() {},
  methods: {
    onDialogOpen() {
      // 编辑回填数据
      if (this.isEdit) {
        let { type_uuid, name, order, uuid, parent_array } =
          this.currentDepartment
        let parent_uuid = parent_array.map((item) => item.uuid)
        this.form = {
          parent_uuid,
          type_uuid,
          name,
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
          let { parent_uuid = [] } = this.form
          parent_uuid = parent_uuid[parent_uuid.length - 1] || 0
          let api = this.isEdit ? modifyDepartmentApi : addDepartmentApi
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
