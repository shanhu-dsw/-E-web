<template>

  <div class="update">
    <div class="top">
      <div
        class="left"
        v-loading="loading"
      >
        <div class="oldOdds">
          <span>原始记录</span>
        </div>
        <el-input
          v-model="oldOddsStatus.id"
          :disabled="true"
        ></el-input>
        <el-input
          v-model="oldlocation"
          :disabled="true"
        ></el-input>
        <el-input
          v-model="oldName"
          :disabled="true"
        ></el-input>
        <el-input
          v-model="oldTime"
          :disabled="true"
        ></el-input>
        <el-input
          v-model="oldProblem"
          :disabled="true"
        ></el-input>
      </div>
      <div class="right">
        <div class=" newOdds">
          <span>新系统记录</span>
        </div>
        <el-form
          :label-position="labelPosition"
          label-width="80px"
        >
          <el-form-item
            label="问题编号"
            label-width="100px"
          >
            <el-input v-model="uuid"></el-input>
          </el-form-item>
          <el-form-item
            label="责任单位"
            label-width="100px"
          >
            <el-select
              v-model="unitMultipleValue"
              placeholder="请选择"
            >
              <el-option
                v-for="item in unitMultiple"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="问题类型"
            label-width="100px"
          >
            <el-select
              v-model="problemType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in problemTypeList"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="检查时间"
            label-width="100px"
          >
            <el-date-picker
              v-model="newTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="问题描述"
            label-width="100px"
          >
            <el-input v-model="description"></el-input>
          </el-form-item>
          <el-form-item
            label="创建单位"
            label-width="100px"
          >
            <el-input v-model="admin.department_uuid2_name"></el-input>
          </el-form-item>
          <el-form-item
            label="创建人"
            label-width="100px"
          >
            <el-input v-model="admin.real_name"></el-input>
          </el-form-item>

          <el-form-item
            label="问题附件图片"
            label-width="100px"
          >
            <el-button
              type="primary"
              @click="getRandomObjects(fileImgUrl)"
            >随机筛选</el-button>
            <el-button
              type="primary"
              @click="order"
            >顺序筛选</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
    <div class="img">
      <el-checkbox-group
        v-model="checkList"
        @change="handleCheckedCitiesChange"
      >
        <el-checkbox
          v-for="item in fileImgUrl[imgIndex]"
          :label="item"
          :key="item"
        >
          <el-image
            style="width:15em; height: 10em;display: block; margin: 0 auto;"
            :src="item"
          ></el-image>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="btnPre">
      <el-button
        type="text"
        @click="previous(1)"
      >
        <i class="el-icon-back"></i>
        上一页</el-button>
      <el-button
        type="text"
        @click="previous()"
      >下一页
        <i class="el-icon-right"></i>
      </el-button>
    </div>
    <div class="bottom-btn">
      <el-button
        type="info"
        @click="empty"
      >清空还原</el-button>
      <el-button
        type="primary"
        @click="submit"
      >确认导入</el-button>
    </div>

  </div>

</template>

<script>
import Axios from "axios";

import {
  addProblemWithUuid,
  getDepartment,
  getProblemDepartmentType,
  getAdminShort,
  addMessage,
} from "@/api/problem";

export default {
  name: "",
  data() {
    return {
      pingUrl: "",
      pingUrlSuffix: "",
      imgIndex: 0,
      checkList: [],
      fileImgUrl: [],
      newTime: "", //新系统记录时间
      description: "", //新系统问题描述
      unitMultipleValue: "",
      uuid: "",
      loading: false,
      dataForm: {},
      message_user: [], //通知管理员
      labelPosition: "right",
      problemTypeList: [], //问题类型
      problemType: "", //问题类型
      oldOddsStatus: [],
      oldlocation: "",
      oldName: "",
      oldTime: "",
      oldProblem: "",

      unitMultiple: [],
    };
  },
  props: {
    token: { type: String },
    id: { type: Number, default: 0 },
    admin: { type: Object },
  },

  watch: {
    id: {
      handler(val) {
        if (val) {
          console.log(this.unitMultipleValue);
          this.unitMultipleValue = "";
          this.problemType = "";

          this.init(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },

  filters: {},
  //生命周期 - 实例方法
  methods: {
    //清空
    empty() {},
    //随机筛选
    getRandomObjects(arr) {
      // 将二维数组转换成一维数组
      var flatArr = arr.flat();
      // 随机排序数组
      flatArr.sort(function () {
        return 0.5 - Math.random();
      });
      // 取前10个对象
      var randomObjects = flatArr.slice(0, 10);
      return (this.checkList = randomObjects);
    },
    //顺序筛选
    order() {
      this.checkList = this.fileImgUrl[0];
    },
    //提交表单
    submit() {
      this.pingUrl = this.checkList.join("|");
      let urlSuffix = [];
      this.checkList.forEach((item) => {
        urlSuffix.push(item.substring(item.lastIndexOf(".") + 1));
      });
      this.pingUrlSuffix = urlSuffix.join("|").toUpperCase();
      console.log(this.pingUrlSuffix);
      var data = {
        uuid: this.uuid,
        type: "DEPARTMENT",

        from_uuid: this.admin.uuid,
        to_uuid: this.unitMultipleValue,

        type_uuid: this.problemType,
        content: this.description,
        file_url: this.pingUrl,
        file_suffix: this.pingUrlSuffix,
        problem_type: "CHECK",

        from_lv2_department_uuid: this.admin.department_uuid2,
        to_lv2_department_uuid: this.unitMultipleValue,

        create_datetime: this.newTime,
      };

      if (!this.pingUrl) {
        delete data.pingUrl;
      }
      if (!this.pingUrlSuffix) {
        delete data.file_suffix;
      }

      addProblemWithUuid(data)
        .then((resp) => {
          this.$message({
            message: "导入成功",
            type: "success",
          });
          this.$emit("change", false);
          this.getmessage_user(resp.uuid);
        })
        .catch((err) => {
          debugger;
          if (err.toString().indexOf("svp_problem.PRIMARY") > -1) {
            this.$message.error("问题编号已存在！！");
          } else {
            this.$message.error(err);
          }
        });
    },
    //根据被检查单位获取通知人，并发送指定通知
    getmessage_user(problem_uuid) {
      let query = {
        rows: 1000,
        offset: 0,
        manage_department_uuid_like: this.unitMultipleValue,
      };
      getAdminShort(query).then((response) => {
        this.message_user = response.array;

        var from_name = this.admin.real_name + "(" + this.admin.name + ")";
        var problemType_name = this.problemTypeList.filter(
          (item) => item.uuid == this.problemType
        )[0].name;
        var unitMultipleValue_name = this.unitMultiple.filter(
          (item) => item.uuid == this.unitMultipleValue
        )[0].name;
        console.log(problemType_name);
        console.log(unitMultipleValue_name);
        var msg =
          unitMultipleValue_name +
          ",于“" +
          this.newTime +
          "”被“" +
          from_name +
          "”发现“" +
          problemType_name +
          "”的问题，请及时整改。";

        const message_data = {
          from_uuid: this.admin.uuid,
          to_uuid: "",
          title: "发现" + problemType_name + "的问题",
          content: msg,
          remark: problem_uuid,
        };

        this.message_user.map((data) => {
          message_data.to_uuid = data.uuid;
          addMessage(message_data)
            .then(() => {})
            .catch((err) => {
              console.log(err);
            });
        });
      });
    },
    // 分页
    previous(num) {
      if (num == 1) {
        //上一页
        if (this.imgIndex > 0) {
          this.imgIndex--;
        } else {
          return this.$message.error("已经是第一页了！");
        }
      } else {
        //下一页
        if (this.imgIndex < this.fileImgUrl.length - 1) {
          this.imgIndex++;
        } else {
          return this.$message.error("已经是最后一页了！");
        }
      }
    },
    //多选图片
    handleCheckedCitiesChange(val) {
      console.log(val);
      if (val.length > 10) {
        alert("不能大于十张");
        this.checkList.pop();
      }
    },
    //回显
    init(id) {
      this.loading = true;
      this.uuid = id;

      Axios({
        url: process.env.VUE_APP_OLD_API + "/api/problems/" + id,
        method: "GET",
        params: {},
        headers: {
          Authorization: "Bearer " + this.token, //此处放置请求到的用户token
        },
      })
        .then((res) => {
          if (res.status == 200) {
            this.loading = false;
            this.getUnit();
            this.oldOddsStatus = res.data.data;
            this.oldName = res.data.data.problem_category.name;

            if (res.data.data.location.path.length > 3) {
              this.oldlocation = res.data.data.location.path[3].name;
            }

            this.oldTime = this.parseTime(res.data.data.issued_at);
            this.newTime = this.oldTime;

            this.oldProblem = res.data.data.note
              ? res.data.data.note
              : res.data.data.problem_category.name;
            this.description = res.data.data.note
              ? res.data.data.note
              : res.data.data.problem_category.name;

            let img = res.data.data.problem_evidences;
            let imgArray = [];
            img.forEach((item) => {
              imgArray.push(item.img_data.src ? item.img_data.src : "");
            });
            var mountOfLine = 10;
            this.fileImgUrl = this.twoDimensional(imgArray, mountOfLine);
          } else {
            this.$message.error("请求失败");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取单位
    getUnit() {
      let that = this;

      getDepartment({
        level: 2,
      }).then((resp) => {
        let unitName = resp.array;
        this.unitMultiple = resp.array;
        unitName.forEach((item) => {
          if (item.name == "督察审计支队") {
            //获取问题类型
            var self_uuid = item.problem_types.filter(
              (data) => data.name == "检查问题"
            )[0].uuid;
            this.problemTypeList = item.problem_types.filter(
              (data) => data.parent_uuid == self_uuid
            );
            //根据视频督察问题类型自动选择现场督察问题类型
            this.problemTypeList.forEach((item) => {
              if (item.name.indexOf(this.oldName) != -1) {
                console.log(item, "item");
                this.problemType = item.uuid;
                // this.problemType_name = item.name;
              }
            });
          }
          //根据视频督察单位名称自动选择现场督察单位名称
          if (item.name == this.oldlocation) {
            this.unitMultipleValue = item.uuid;
          }
        });
      });
    },
    //获取问题类型
    getProblem() {
      let that = this;

      getProblemDepartmentType().then((resp) => {
        this.problemTypeList = resp.array;
        this.problemTypeList.forEach((item) => {
          if (item.name.indexOf(this.oldName) != -1) {
            this.problemType = item.uuid;
          }
        });
      });
    },
    //一维数组转成二维数组
    twoDimensional(fromArr, mountOfEachLine) {
      //装二维数组的容器（目标数组）
      let newArr = [];
      //源数组元素个数
      let len = fromArr.length;
      //计算出指定好的 mountOfLine 源数组能分成几个子数组
      let lineNum =
        len % mountOfEachLine == 0
          ? len / mountOfEachLine
          : Math.ceil(len / mountOfEachLine);
      //将源数组的元素拿出来，放到新数组 newArr 容器内
      for (let i = 0; i < lineNum; i++) {
        let tempElement = fromArr.slice(
          i * mountOfEachLine,
          (i + 1) * mountOfEachLine
        );
        newArr.push(tempElement);
      }
      return newArr;
    },
  },
  //计算属性
  computed: {},
};
</script>



<style scoped lang="scss">
.update {
  width: 100%;
  padding: 20px 150px 20px 150px;
  margin-right: 40px;
  box-sizing: border-box;
  background: #fff;
  text-align: center;
  .top {
    display: flex;
    justify-content: space-between;
  }

  .left {
    width: 50%;

    .el-input {
      margin-bottom: 22px;
    }

    .oldOdds {
      background: #258ddc;
      width: 150px;
      line-height: 35px;
      text-align: center;
      border-radius: 10px 10px 0 0;
      color: #fff;
      float: right;
      margin-bottom: 5px;
    }
  }

  .right {
    width: 50%;

    .newOdds {
      background: #258ddc;
      width: 150px;
      line-height: 35px;
      text-align: center;
      border-radius: 10px 10px 0 0;
      color: #fff;
      margin-left: 100px;
      margin-bottom: 5px;
    }
  }
}
</style>