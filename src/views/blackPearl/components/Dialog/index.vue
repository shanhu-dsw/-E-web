<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    append-to-body
    @close="onCancel()"
    class="dialog-container"
  >
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel()">取 消</el-button>
      <el-button type="primary" @click="onOk()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: String,
      default: '50%'
    }
  },
  data() {
    return {}
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    onOk() {
      this.$emit('onOk')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  ::v-deep .el-dialog {
    border-radius: 10px;
    .el-dialog__header {
      .el-dialog__title {
        border-left: 3px solid #4084ff;
        padding-left: 13px;
        color: #1e2b43;
        font-weight: 600;
        font-size: 16px;
      }
    }
    .el-dialog__body {
      padding: 10px 20px 10px;
    }
  }
}
</style>
