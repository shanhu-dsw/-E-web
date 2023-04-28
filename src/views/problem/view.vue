<template>
  <div class="app-container">
    <div style="display: flex;background-color: #fff;">
      <div class="prClass">
        <el-row
          class="prHeader"
          type="flex"
        >
          <div class="number">
            问题编号
            <span>#{{ modelPr.number }}</span>
          </div>
          <div class="title">
            <el-row class="desc">
              {{
                modelPr.department_name +
                "在" +
                parseTime(modelPr.create_datetime, "{y}年{m}月{d}日") +
                '发生了"' +
                modelPr.problem_department_type_name +
                '"的问题。'
              }}
            </el-row>
            <el-row style="margin-bottom: 10px">
              来源：
              <el-tag
                type="info"
                effect="dark"
                size="small"
              >人工录入</el-tag>
            </el-row>
            <el-row>
              状态：
              <el-tag
                v-if="modelPr.status == 'UN_FEEDBACK'"
                type="warning"
                effect="dark"
                size="small"
              >未反馈</el-tag>
              <el-tag
                v-if="modelPr.status == 'FEEDBACK'"
                type="success"
                effect="dark"
                size="small"
              >已反馈</el-tag>

              <el-tag
                v-if="modelPr.status == 'FILED'"
                type="info"
                effect="dark"
                size="small"
              >已归档</el-tag>
            </el-row>
          </div>
        </el-row>

        <el-row
          class="prInfo"
          type="flex"
        >
          <span class="title">问题详情</span>
        </el-row>

        <el-row class="content">
          <div class="content-row">
            <div class="content-col">
              <div class="content-title">问题类别:</div>{{modelPr.problem_department_type_name}}
            </div>
            <div class="content-col">
              <div class="content-title">问题类型:</div>{{modelPr.problem_department_type_parent_name}}
            </div>
          </div>

          <div class="content-row">
            <div class="content-col">
              <div class="content-title">被检查单位:</div>{{modelPr.department_name}}
            </div>
            <div class="content-col">
              <div class="content-title">问题责任人:</div>{{modelPr.resArry?modelPr.resArry.join(','):''}}
            </div>
          </div>

          <div class="content-row">
            <div class="content-col">
              <div class="content-title">创建单位:</div>{{modelPr.from_department_name}}
            </div>
            <div class="content-col">
              <div class="content-title">创建人:</div>{{modelPr.from_real_name+'('+ modelPr.from_account_name+')'}}
            </div>
          </div>

          <div class="content-row small">
            <div class="content-col">
              <div class="content-title">问题描述:</div>
            </div>
            <div class="content-col">
              <div class="content-title">检查时间:</div>{{modelPr.create_datetime}}
            </div>
          </div>

          <div class="content-desc">
            {{htmlDecode(modelPr.content)}}
          </div>

          <div class="content-row small">
            <div class="content-col">
              <div class="content-title">问题附件:</div>
            </div>
          </div>

          <div
            class="content-row hand"
            v-for="(item, index) in modelPr.storage_file"
            v-bind:key="index"
          >
            <div class="content-col">
              <img
                v-if="item.isImg"
                :src="item.url2"
                class="img"
                @click="viewImg(item.url2)"
              >

              <div
                v-if="!item.isImg"
                class="file"
                @click="downLoad(item.url2)"
              >
                <img
                  :src="fileImg"
                  class="img"
                >
                <span>{{item.url}}</span>
                <div class="download">
                  <i class="el-icon-download"></i>
                </div>
              </div>
            </div>
          </div>

        </el-row>

        <el-row
          class="prInfo"
          type="flex"
        >
          <span class="title">问题反馈</span>
        </el-row>

        <el-row
          class="content"
          v-if="isFeedBack"
        >
          <div class="content-row">
            <div class="content-col">
              <div class="content-title1">该问题于【</div>{{modelFb.last_update_datetime}} <div class="content-title1">】被【</div>{{ modelFb.from_admin_array[0].real_name }}（{{modelFb.from_admin_array[0].name}}）<div class="content-title1">】反馈为</div>
              <el-tag
                v-if="modelPr.is_fact == 'UN_CONFIR'"
                type="info"
                effect="dark"
              >未确认</el-tag>
              <el-tag
                v-if="modelPr.is_fact == 'NOT_FACT'"
                type="warning"
                effect="dark"
              >失实</el-tag>
              <el-tag
                v-if="modelPr.is_fact == 'FACT'"
                type="success"
                effect="dark"
              >属实</el-tag>
            </div>
          </div>
          <div class="content-row small">
            <div class="content-col">
              <div class="content-title1">反馈情况如下:</div>
            </div>
          </div>

          <div class="content-desc1">
            {{htmlDecode(modelFb.content)}}
          </div>

          <div class="content-row small">
            <div class="content-col">
              <div class="content-title1">问题附件:</div>
            </div>
          </div>

          <div
            class="content-row hand"
            v-for="(item, index) in modelFb.storage_file"
            v-bind:key="index"
          >
            <div class="content-col">
              <img
                v-if="item.isImg"
                :src="item.url2"
                class="img"
                @click="viewImg(item.url2)"
              >
              <div
                v-if="!item.isImg"
                class="file"
                @click="downLoad(item.url2)"
              >
                <img
                  :src="fileImg"
                  class="img"
                />
                <span>{{ item.url }}</span>
                <div class="download">
                  <i class="el-icon-download"></i>
                </div>
              </div>
            </div>
          </div>

        </el-row>

        <el-row
          class="content"
          v-if="!isFeedBack && !fbDisabled"
        >
          <div class="content-row">
            <div class="content-col">
              <div class="content-title1">问题暂无反馈信息，点击”</div><el-link
                type="primary"
                @click="openFbEidt"
              >反馈问题</el-link>
              <div class="content-title1">”开始编辑反馈信息!</div>
            </div>
          </div>
        </el-row>

        <el-row
          class="content"
          v-if="isFeedBack && !fbDisabled"
        >
          <div class="content-row">
            <div class="content-col">
              <div class="content-title1">问题已存在反馈信息，点击”</div><el-link
                type="primary"
                @click="openFbEidt"
              >编辑问题</el-link>
              <div class="content-title1">”开始编辑反馈信息!</div>
            </div>
          </div>
        </el-row>

        <el-row
          class="content"
          v-if="!isFeedBack&&fbDisabled"
        >
          <div class="content-row">
            <div class="content-col">
              <div class="content-title1">问题暂无反馈信息。</div>
            </div>
          </div>
        </el-row>

      </div>

      <div class="prOper">
        <!-- <i class="el-icon-printer iconInfo"></i> -->
        <i
          class="el-icon-edit-outline iconInfo"
          style="font-size: 40px;"
          @click="openPrEdit"
          v-if="!prDisabled"
        ></i>
        <!-- <i
          class="el-icon-star-on iconInfo1"
          style="color:#ffbc47"
        ></i>
        <i
          class="el-icon-download iconInfo"
          style="color:#0084ff"
        ></i> -->
      </div>

    </div>

    <el-dialog
      title="问题修改"
      :visible.sync="openPr"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="formPr"
        label-position="top"
        :model="formPr"
        :rules="rulesPr"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="被检查问题单位"
              prop="to_uuid"
            >
              <el-select
                v-model="formPr.to_uuid"
                disabled
                placeholder="被选择检查问题单位"
                @change="deptSelChange"
                style="width: 100%"
                clearable
                filterable
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              label="问题类型"
              prop="problem_type"
            >
              <el-select
                v-model="formPr.problem_type"
                placeholder="请选择问题类型"
                disabled
                style="width: 100%"
                clearable
                filterable
                @change="typeSelChange"
              >
                <el-option
                  v-for="item in problemType1"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="问题子类"
              prop="type_uuid"
            >
              <el-select
                style="width: 100%"
                v-model="formPr.type_uuid"
                placeholder="请选择问题分类"
                clearable
                filterable
              >
                <el-option
                  v-for="item in problemList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="问题描述"
              prop="content"
            >
              <el-input
                type="textarea"
                rows="5"
                placeholder="请输入内容"
                v-model="formPr.content"
                maxlength="5000"
                show-word-limit
              >
              </el-input>
              <!-- <editor v-model="formPr.content" :min-height="200" /> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row
          :gutter="20"
          v-if="formPr.storage_file.length != 0"
        >
          <el-col :span="24">
            <el-form-item label="问题原附件">
              <ul class="el-upload-list el-upload-list--picture-card">
                <li
                  class="el-upload-list__item is-success"
                  style="width: 100px; height: 100px"
                  v-for="(item, index) in formPr.storage_file"
                  v-bind:key="index"
                >
                  <img
                    :src="
                      item.suffix == 'jpeg' ||
                      item.suffix == 'png' ||
                      item.suffix == 'jpg'
                        ? item.url2
                        : fileImg
                    "
                    class="el-upload-list__item-thumbnail"
                  /><span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i
                        class="el-icon-delete"
                        @click="delFile(item, 'pr')"
                      ></i> </span></span>
                </li>
              </ul>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="问题新附件">
              <ZMUpload :uploadList.sync="beforeUpdateImg2"></ZMUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitPr"
        >确 定</el-button>
        <el-button @click="colsePr">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="openFb"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >

      <el-form
        ref="formFb"
        :model="formFb"
        :rules="rulesFb"
        label-width="100px"
      >

        <el-form-item label="问题负责人">
          <el-select
            v-model="to_uuid_person"
            filterable
            remote
            multiple
            placeholder="请输入姓名或警号"
            :remote-method="remotePerson1"
            @change="$forceUpdate()"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in personList1"
              :key="item.uuid"
              :label="item.name + '-' + item.real_name"
              :value="item.uuid"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="属实情况">
          <el-radio
            v-model="formFb.is_fact"
            label="NOT_FACT"
          > <el-tag
              type="warning"
              effect="dark"
            >失实</el-tag></el-radio>
          <el-radio
            v-model="formFb.is_fact"
            label="FACT"
          > <el-tag
              type="success"
              effect="dark"
            >属实</el-tag></el-radio>

        </el-form-item>

        <el-form-item
          label="反馈描述"
          prop="content"
        >
          <el-input
            type="textarea"
            rows="5"
            placeholder="请输入内容"
            v-model="formFb.content"
            maxlength="5000"
            show-word-limit
          >
          </el-input>
        </el-form-item>

        <el-form-item
          label="反馈原附件"
          v-if="isFeedBack"
        >
          <ul class="el-upload-list el-upload-list--picture-card">
            <li
              class="el-upload-list__item is-success"
              style="width: 100px; height: 100px"
              v-for="(item, index) in formFb.storage_file"
              v-bind:key="index"
            >
              <img
                :src="
                  item.suffix == 'jpeg' ||
                  item.suffix == 'png' ||
                  item.suffix == 'jpg'
                    ? item.url2
                    : fileImg
                "
                class="el-upload-list__item-thumbnail"
              /><span class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i
                    class="el-icon-delete"
                    @click="delFile(item, 'fb')"
                  ></i> </span></span>
            </li>
          </ul>
        </el-form-item>

        <el-form-item :label="!isFeedBack ? '反馈附件' : '反馈新附件'">
          <ZMUpload :uploadList.sync="beforeUpdateImg"></ZMUpload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitFb"
        >确 定</el-button>
        <el-button @click="colsePr">取 消</el-button>
      </div>
    </el-dialog>

    <el-image-viewer
      v-if="imgViewerVisible"
      :on-close="closeImgViewer"
      :url-list="imgList"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ZMUpload from "@/components/ZMUpload";
import {
  getProblemExact,
  editProblem,
  addFeedback,
  getFeedback,
  modifyFeedback,
  getDepartment,
  getProblemDepartmentType,
  removeStorageFile,
  addStorageFileBatch,
  getAdminShort,
  addMessage,
} from "@/api/problem";
import { resolve } from "path";
export default {
  computed: {
    ...mapGetters(["admin"]),
  },
  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer"),
    ZMUpload,
  },
  data() {
    return {
      fileImg: require("../../assets/images/file.png"),
      deptList: [],
      problemType1: [],
      problemType2: [],
      problemList: [],

      openPr: false,
      openFb: false,

      title: "",

      rulesPr: {
        to_uuid: [
          {
            required: true,
            message: "被检查问题单位不能为空",
            trigger: "change",
          },
        ],
        problem_type: [
          { required: true, message: "问题类型不能为空", trigger: "change" },
        ],
        type_uuid: [
          { required: true, message: "问题子类不能为空", trigger: "change" },
        ],
        content: [
          { required: true, message: "问题描述不能为空", trigger: "change" },
        ],
      },

      rulesFb: {
        content: [
          { required: true, message: "问题描述不能为空", trigger: "change" },
        ],
        is_fact: [
          { required: true, message: "属实情况不能为空", trigger: "change" },
        ],
      },

      beforeUpdateImg: [],
      beforeUpdateImg2: [],
      modelPr: {},
      modelFb: {},

      formPr: {
        to_uuid: "",
        type_uuid: "",
        content: "",
        problem_type: "",
        storage_file: [],
      },

      formFb: {
        is_fact: "",
        storage_file: [],
        content: "",
      },

      problemNumber: "",

      operate: "",

      isFeedBack: false,

      prDisabled: false,
      fbDisabled: false,

      imgViewerVisible: false,
      imgList: [],

      uuid: "",

      to_uuid_person: [],
      userList1: [],
      personList1: [],
      manageUser: [],
    };
  },

  watch: {
    //监听路由地址的改变
    $route: {
      immediate: true,
      handler() {
        if (this.$route.query.number) {
          //需要监听的参数
          this.problemNumber = this.$route.query.number;
        }
        if (this.$route.query.id) {
          this.uuid = this.$route.query.id;
        }
        if (this.$route.query.operate) {
        }
        this.getData();
      },
    },
  },

  created() {},
  methods: {
    quickTo(n) {
      this.$el
        .querySelector("#div" + n)
        .scrollIntoView({ block: "start", behavior: "smooth" });
    },

    getData() {
      this.isFeedBack = false;
      this.prDisabled = false;
      this.fbDisabled = false;

      this.beforeUpdateImg = [];
      this.beforeUpdateImg2 = [];
      this.modelPr = {};
      this.modelFb = {};

      this.formPr = {
        to_uuid: "",
        type_uuid: "",
        content: "",
        problem_type: "",
        storage_file: [],
      };

      this.formFb = {
        is_fact: "",
        storage_file: [],
        content: "",
      };
      this.getProblemInfo();
      this.getDepartmentList();
      this.checkRole();
    },

    getDepartmentList() {
      getDepartment({
        level: 2,
      }).then((resp) => {
        this.deptList = resp.array;
      });
    },

    getDeptProblemTypeList() {
      getProblemDepartmentType().then((resp) => {
        if (resp.array.length > 0) {
          this.problemType1 = resp.array.filter((item) => item.level == 1);
          this.problemType2 = resp.array.filter((item) => item.level == 2);
        }
      });
    },

    getProblemInfo() {
      const query = {
        offset: 0,
        rows: 1,
      };
      if (this.problemNumber) {
        query.number = this.problemNumber;
      }

      if (this.uuid) {
        query.uuid = this.uuid;
      }

      getProblemExact(query).then((resp) => {
        if (resp.array.length > 0) {
          this.modelPr = resp.array[0];

          if (this.modelPr.status == "FILED") {
            this.fbDisabled = true;
            this.prDisabled = true;
          }

          if (this.admin.role_name == "zd_admin") {
            this.fbDisabled = true;
            if (this.admin.uuid != this.modelPr.from_uuid) {
              this.prDisabled = true;
            }
          }

          if (
            this.admin.role_name == "zd_leader" &&
            this.admin.department_uuid2 != this.modelPr.to_department_uuid
          ) {
            this.fbDisabled = true;
          }

          if (
            this.modelPr.responsible_uuid &&
            this.modelPr.responsible_uuid.length > 0
          ) {
            let resArry = [];
            for (
              let i = 0;
              i < this.modelPr.responsible_real_name.length;
              i++
            ) {
              resArry.push(
                this.modelPr.responsible_real_name[i] +
                  "(" +
                  this.modelPr.responsible_account_name[i] +
                  ")"
              );
            }
            this.modelPr.resArry = resArry;
          } else {
            this.modelPr.resArry = [];
          }

          if (
            this.modelPr.storage_file &&
            this.modelPr.storage_file.length > 0
          ) {
            this.modelPr.storage_file.forEach((item) => {
              item.url2 =
                process.env.VUE_APP_BASE_API +
                "/webapp/problem_file/" +
                item.url;
              if (
                item.suffix.includes("jpeg") ||
                item.suffix.includes("png") ||
                item.suffix.includes("jpg") ||
                item.suffix.includes("gif")
              ) {
                item.isImg = true;
              } else {
                item.isImg = false;
              }
            });
          } else {
            this.modelPr.storage_file = [];
          }

          console.log(this.modelPr.storage_file);

          this.getDeptProblemTypeList();
          this.getProblemFeedBack();
          this.getManager();
        }
      });
    },

    getProblemFeedBack() {
      const query = {
        problem_uuid: this.modelPr.uuid,
        offset: 0,
        rows: 1,
      };

      getFeedback(query).then((resp) => {
        if (resp.array.length > 0) {
          this.prDisabled = true;

          this.modelFb = resp.array[0];

          if (
            this.modelFb.storage_file &&
            this.modelFb.storage_file.length > 0
          ) {
            this.modelFb.storage_file.forEach((item) => {
              item.url2 =
                process.env.VUE_APP_BASE_API +
                "/webapp/problem_file/" +
                item.url;
              if (
                item.suffix.includes("jpeg") ||
                item.suffix.includes("png") ||
                item.suffix.includes("jpg") ||
                item.suffix.includes("gif")
              ) {
                item.isImg = true;
              } else {
                item.isImg = false;
              }
            });
          } else {
            this.modelFb.storage_file = [];
          }

          this.isFeedBack = true;
        }
      });
    },

    getManager() {
      const query = {
        offset: 0,
        rows: 1000,
        manage_department_uuid_like: this.modelPr.to_department_uuid,
      };
      getAdminShort(query).then((resp) => {
        this.manageUser = resp.array;
      });
    },

    checkRole() {
      if (
        this.admin.role_name == "fu_jing" ||
        this.admin.role_name == "min_jing"
      ) {
        this.prDisabled = true;
        this.fbDisabled = true;
      }
    },

    deptSelChange(e) {
      this.formPr.type_uuid = "";
      this.formPr.problem_type = "";
      this.problemList = [];
    },

    typeSelChange(e) {
      this.formPr.type_uuid = "";
      this.problemList = [];
      this.problemList = this.problemType2.filter(
        (item) => item.parent_uuid == e
      );
    },

    openPrEdit() {
      this.beforeUpdateImg2 = [];
      this.formPr.photos = [];
      Object.assign(this.formPr, this.modelPr);
      this.formPr.content = this.htmlDecode(this.formPr.content);
      this.problemType1.forEach((item) => {
        if (item.name == this.modelPr.problem_department_type_parent_name) {
          this.formPr.problem_type = item.uuid;
        }
      });
      this.problemList = this.problemType2.filter(
        (item) => item.parent_uuid == this.formPr.problem_type
      );
      this.openPr = true;
    },

    submitPr() {
      var that = this;

      this.$refs["formPr"].validate((valid) => {
        if (valid) {
          this.formPr.content = this.htmlEncode(this.formPr.content);
          if (that.beforeUpdateImg2.length > 0) {
            const query = {
              file_content: that.beforeUpdateImg2
                .map((item) => {
                  return item.content;
                })
                .join("|"),
              file_suffix: that.beforeUpdateImg2
                .map((item) => {
                  return item.suffix;
                })
                .join("|"),
              associate_type: "PROBLEM",
              associate_uuid: that.formPr.uuid,
            };

            addStorageFileBatch(query).then((resp) => {
              const data = {
                uuid: that.formPr.uuid,
                to_uuid: that.formPr.to_uuid,
                type_uuid: that.formPr.type_uuid,
                content: that.formPr.content,
              };
              editProblem(data).then((response) => {
                that.$modal.msgSuccess("处理成功");
                that.getProblemInfo();
                that.openPr = false;
              });
            });
          } else {
            const data = {
              uuid: that.formPr.uuid,
              to_uuid: that.formPr.to_uuid,
              type_uuid: that.formPr.type_uuid,
              content: that.formPr.content,
            };
            editProblem(data).then((response) => {
              that.$modal.msgSuccess("处理成功");
              that.getProblemInfo();
              that.openPr = false;
            });
          }
        }
      });
    },

    colsePr() {
      this.getProblemInfo();
      this.openPr = false;
      this.openFb = false;
    },

    remotePerson1(query) {
      let count = 0;
      this.personList1 = [];
      this.userList1.forEach((item) => {
        if (item.real_name.indexOf(query) != -1 && count <= 20) {
          this.personList1.push(item);
          count++;
        } else if (item.name.indexOf(query) != -1 && count <= 20) {
          this.personList1.push(item);
          count++;
        }
      });
    },

    openFbEidt() {
      this.to_uuid_person = [];

      this.beforeUpdateImg = [];
      this.formFb.photos = [];

      if (this.isFeedBack) {
        this.formFb.content = this.modelFb.content;
        this.formFb.content = this.htmlDecode(this.modelFb.content);
        this.formFb.storage_file = this.modelFb.storage_file;
        this.formFb.is_fact = this.modelPr.is_fact;
        this.title = "修改反馈";
      } else {
        this.title = "问题反馈";
        this.formFb.is_fact = "FACT";
      }

      if (
        this.modelPr.responsible_uuid &&
        this.modelPr.responsible_uuid.length > 0
      ) {
        this.to_uuid_person = [...this.modelPr.responsible_uuid];
      } else {
        this.to_uuid_person = [];
      }
      this.formFb.problem_uuid = this.modelPr.uuid;
      this.formFb.from_uuid = this.admin.uuid;

      const queryParams = {
        rows: 1000,
        offset: 0,
        all_from_department_uuid: this.modelPr.to_department_uuid,
      };

      getAdminShort(queryParams).then((response) => {
        this.userList1 = response.array;
        this.personList1 = [...this.userList1];
        this.openFb = true;
        console.log(this.formFb);
      });
    },

    submitFb() {
      if (this.beforeUpdateImg.length > 0) {
        this.formFb.file_content = this.beforeUpdateImg
          .map((item) => {
            return item.content;
          })
          .join("|");
        this.formFb.file_suffix = this.beforeUpdateImg
          .map((item) => {
            return item.suffix;
          })
          .join("|");
      }
      this.$refs["formFb"].validate((valid) => {
        if (valid) {
          this.formFb.content = this.htmlEncode(this.formFb.content);
          if (!this.isFeedBack) {
            addFeedback(this.formFb).then((response) => {
              this.sendMsg();
              this.updatePr();
            });
          } else {
            var that = this;
            if (that.beforeUpdateImg.length > 0) {
              const query = {
                file_content: that.beforeUpdateImg
                  .map((item) => {
                    return item.content;
                  })
                  .join("|"),
                file_suffix: that.beforeUpdateImg
                  .map((item) => {
                    return item.suffix;
                  })
                  .join("|"),
                associate_type: "FEEDBACK",
                associate_uuid: that.modelFb.uuid,
              };

              addStorageFileBatch(query).then((resp) => {
                const data = {
                  uuid: that.modelFb.uuid,
                  content: that.formFb.content,
                };
                modifyFeedback(data).then((resp) => {
                  that.sendMsg();
                  that.updatePr();
                });
              });
            } else {
              const data = {
                uuid: that.modelFb.uuid,
                content: that.formFb.content,
              };
              modifyFeedback(data).then((resp) => {
                that.sendMsg();
                that.updatePr();
              });
            }
          }
        }
      });
    },

    updatePr() {
      const data = {
        uuid: this.formFb.problem_uuid,
        fact: this.formFb.is_fact,
        read: "READ",
        status: "FEEDBACK",
        responsible_uuids:
          this.to_uuid_person.length == 0
            ? "clear"
            : this.to_uuid_person.join(";"),
      };
      editProblem(data).then((response) => {
        this.$modal.msgSuccess("处理成功");
        this.getProblemInfo();
        this.openFb = false;
      });
    },

    downLoad(url) {
      window.open(url);
    },

    delFile(element, type) {
      var that = this;
      this.$modal
        .confirm("是否确认删除该附件")
        .then(function () {
          removeStorageFile({ uuid: element.uuid }).then((resp) => {
            if (type == "pr") {
              that.formPr.storage_file = that.formPr.storage_file.filter(
                (item) => item != element
              );
            } else {
              that.formFb.storage_file = that.formFb.storage_file.filter(
                (item) => item != element
              );
            }
            that.$forceUpdate();
          });
        })
        .then(() => {
          this.handleQuery();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    viewImg(url) {
      this.imgViewerVisible = true;
      this.imgList = [url];
    },

    closeImgViewer() {
      this.imgViewerVisible = false;
    },

    async sendMsg() {
      let sendUsers = [];

      if (this.manageUser.length > 0) {
        sendUsers = sendUsers.concat(this.manageUser.map((item) => item.uuid));
      }

      for (let i = 0; i < sendUsers.length; i++) {
        var msg =
          "" +
          this.modelPr.department_name +
          "，在“" +
          this.modelPr.create_datetime +
          "”被发现“" +
          this.modelPr.problem_department_type_name +
          "”的问题已做反馈，请查看反馈详情。";
        let query = {
          from_uuid: this.admin.uuid,
          to_uuid: sendUsers[i],
          title: "反馈产生通知",
          content: msg,
          remark: this.modelPr.uuid,
        };
        await this.addMsg(query);
      }
      if (
        this.modelPr.responsible_uuid &&
        this.modelPr.responsible_uuid.length > 0
      ) {
        for (let i = 0; i < this.modelPr.responsible_uuid.length; i++) {
          //宁远路派出所张三（110120），在“2023-03-14”被发现“个人着装”的问题已做反馈，请查看反馈详情。
          var msg =
            "" +
            this.modelPr.department_name +
            "" +
            this.modelPr.responsible_real_name[i] +
            "（" +
            this.modelPr.responsible_account_name[i] +
            "），在“" +
            this.modelPr.create_datetime +
            "”被发现“" +
            this.modelPr.problem_department_type_name +
            "”的问题已做反馈，请查看反馈详情。";

          let query = {
            from_uuid: this.admin.uuid,
            to_uuid: this.modelPr.responsible_uuid[i],
            title: "反馈产生通知",
            content: msg,
            remark: this.modelPr.uuid,
          };
          await this.addMsg(query);
        }
      }
    },

    addMsg(query) {
      return new Promise((resolve) => {
        addMessage(query).then((response) => {
          return resolve("nextt");
        });
      });
    },
  },
};
</script>

<style lang="scss" scope >
.prClass {
  display: flex;
  flex-direction: column;
  flex: 1;
  color: #545454;
  padding: 10px;

  .prHeader {
    .number {
      width: 170px;
      height: 160px;
      color: #fff;
      background: linear-gradient(135deg, #ff1651, #ff7c35);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      border-radius: 0 0 10px 10px;
      text-align: center;
    }
    .title {
      margin-top: 40px;
      margin-left: 20px;
      font-size: 10px;

      .desc {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
  }

  .prInfo {
    margin-top: 20px;
    border-bottom: 1px solid #eff0f4;
    .title {
      background-color: #eff0f4;
      padding: 5px 25px 5px 25px;
      font-size: 18px;
      border-radius: 5px 5px 0 0;
      font-weight: bold;
    }
  }

  .content {
    padding-left: 120px;
    padding-top: 20px;
    font-weight: bold;
    font-size: 14px;

    .content-row {
      display: flex;
      margin-bottom: 18px;
    }

    .small {
      margin-bottom: 5px;
    }

    .hand {
      cursor: pointer;
    }

    .content-col {
      flex: 1;
      display: flex;
      align-items: center;
      .img {
        height: 200px;
      }

      .file {
        height: 40px;
        background-color: #fcfcfc;
        padding: 0px 10px;
        border: 1px solid #eeeeee;
        display: flex;
        align-items: center;
        border-radius: 5px;
        width: 600px;

        .img {
          height: 30px;
          margin-right: 10px;
        }
        .download {
          flex: 1;
          font-size: 20px;
          color: #0084ff;
          text-align: right;
        }
      }
    }

    .content-title {
      width: 100px;
      color: #9c9c9c;
      text-align: right;
      margin-right: 15px;
    }

    .content-title1 {
      color: #9c9c9c;
      text-align: right;
    }

    .content-desc {
      margin-left: 30px;
      background-color: #fcfcfc;
      padding: 15px 10px;
      margin-bottom: 18px;
      border: 1px solid #eeeeee;
    }

    .content-desc1 {
      background-color: #fcfcfc;
      padding: 15px 10px;
      margin-bottom: 18px;
      border: 1px solid #eeeeee;
    }
  }
}

.prOper {
  width: 220px;
  font-size: 20px;
  text-align: right;
  padding-right: 10px;
  padding-top: 40px;
  .iconInfo {
    cursor: pointer;
    padding: 10px;
    border: 2px solid #eff0f4;
  }

  .iconInfo1 {
    cursor: pointer;
    padding: 10px;
    border-top: 2px solid #eff0f4;
    border-bottom: 2px solid #eff0f4;
  }
}

.descLabel {
  font-weight: bold;
}

.el-divider--horizontal {
  margin: 10px 0;
}

.el-upload-dragger {
  width: 300px;
  height: 120px;
}

.el-upload-dragger .el-icon-upload {
  font-size: 50px;
  color: #c0c4cc;
  margin: 10px 0 10px 0;
}
</style>