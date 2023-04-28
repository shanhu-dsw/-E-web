<template>
  <div class="app-container">
    <el-row style="padding: 10px; font-weight: bold; color: #016dbe">
      统计信息
    </el-row>
    <el-row>
      <div class="report">
        <div
          class="report-left"
          style="margin-right: 20px"
        >
          <img
            :src="house"
            class="house"
          />
          <div
            style="padding: 10px; width: 100%; min-height: 500px"
            class="organization_configuration"
          >
            <el-tree
              :default-expand-all="true"
              :data="detpList2"
              :props="defaultProps"
              highlight-current
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </div>
        <div class="report-left">
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;

              width: 250px;
              background: #fff;
            "
            :class="{ 'home-header-fixed': show }"
          >
            <span style="padding-top: 40px; font-size: 20px; font-weight: bold">{{ selDept.name }}</span>
            <img
              :src="info"
              class="house2"
            />
            <div style="padding: 10px; width: 100%; min-height: 500px">
              <el-menu
                style="width: 100%"
                default-active="1"
              >
                <el-menu-item
                  @click="quickTo(1)"
                  index="1"
                >
                  <span slot="title">基本信息</span>
                </el-menu-item>
                <el-menu-item
                  @click="quickTo(2)"
                  index="2"
                >
                  <span slot="title">单位问题排行</span>
                </el-menu-item>

                <el-menu-item
                  @click="quickTo(11)"
                  index="11"
                >
                  <span slot="title">自查问题排行</span>
                </el-menu-item>

                <el-menu-item
                  @click="quickTo(12)"
                  index="12"
                >
                  <span slot="title">工作量排行</span>
                </el-menu-item>
                <el-menu-item
                  @click="quickTo(7)"
                  index="7"
                >
                  <span slot="title">问题整改率</span>
                </el-menu-item>
                <el-menu-item
                  @click="quickTo(3)"
                  index="3"
                >
                  <span slot="title">问题流量</span>
                </el-menu-item>
                <el-menu-item
                  @click="quickTo(4)"
                  index="4"
                >
                  <span slot="title">问题分类</span>
                </el-menu-item>
                <el-menu-item
                  @click="quickTo(5)"
                  index="5"
                >
                  <span slot="title">高发问题</span>
                </el-menu-item>
                <el-menu-item
                  @click="quickTo(6)"
                  index="6"
                >
                  <span slot="title">问题清单</span>
                </el-menu-item>
              </el-menu>
            </div>
          </div>
        </div>
        <div class="report-right">
          <div style="background: #fff; padding: 15px 20px 20px 20px">
            <el-select
              v-model="selUUid"
              placeholder="请选择问题单位"
              style="width: 300px"
              filterable
              clearable
              @change="selDeptChange"
              :disabled="deptDisabled"
            >
              <el-option
                v-for="item in deptList"
                :key="item.uuid"
                :label="item.name"
                :value="item.uuid"
              >
              </el-option>
            </el-select>
          </div>

          <div id="div1">
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>基本信息</span>
              </div>
              <el-descriptions :column="2">
                <el-descriptions-item
                  :span="4"
                  label="单位类型"
                >{{
                  selDept.type_name
                }}</el-descriptions-item>
                <!-- <el-descriptions-item :span="4" label="管理人员">{{
                  selDept.managerUser
                }}</el-descriptions-item> -->
                <el-descriptions-item label="上级单位">
                  {{ selDept.parent_name }}
                </el-descriptions-item>
                <el-descriptions-item label="单位人数">{{
                  selDept.count
                }}</el-descriptions-item>

                <el-descriptions-item
                  :span="4"
                  label="下级单位"
                >{{
                  selDept.childDept
                }}</el-descriptions-item>
              </el-descriptions>

              <div style="
                  display: flex;
                  justify-content: space-between;
                  padding: 0 20px 0 20px;
                ">
                <div class="box1 img1">
                  <span style="font-size: 30px; font-weight: bold">{{ count1 }}个</span>
                  <span>检查问题总数</span>
                </div>
                <div class="box1 img2">
                  <span style="font-size: 30px; font-weight: bold">{{ count2 }}个</span>
                  <span>自查问题总数</span>
                </div>
                <div class="box1 img3">
                  <span style="font-size: 30px; font-weight: bold">{{
                    rank
                  }}</span>
                  <span>单位排名</span>
                </div>
              </div>
            </el-card>
          </div>

          <div
            id="div2"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>单位问题排行</span>
                <div class="pull-right">
                  <el-select
                    size="small"
                    v-model="rtStatus1"
                    placeholder="问题状态"
                    clearable
                  >
                    <el-option
                      label="未反馈"
                      value="UN_FEEDBACK"
                    ></el-option>
                    <el-option
                      label="已反馈"
                      value="FEEDBACK"
                    ></el-option>
                    <el-option
                      label="已归档"
                      value="FILED"
                    ></el-option>
                  </el-select>

                  <el-date-picker
                    size="small"
                    v-model="dateRange1"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    style="margin: 0 10px 0 10px"
                  >
                  </el-date-picker>

                  <el-button
                    size="small"
                    type="primary"
                    @click="getReport1"
                  >统计</el-button>
                </div>
              </div>
              <div style="font-size: 13px">
                <div
                  v-for="(item, index) in rtList1"
                  v-bind:key="index"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 0 10px 0;
                  "
                >
                  <div :class="getClass(index)">
                    <span>{{ index + 1 }}</span>{{ item.name }}
                  </div>
                  <div style="flex: 1">
                    <el-progress
                      :color="getColor(index)"
                      :show-text="false"
                      :stroke-width="15"
                      :percentage="item.percentage"
                    ></el-progress>
                  </div>
                  <div style="padding-left: 20px">{{ item.problem_count }}</div>
                </div>
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>

          <div
            id="div11"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>自查问题排行</span>
                <div class="pull-right">
                  <el-date-picker
                    size="small"
                    v-model="dateRange11"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    style="margin: 0 10px 0 10px"
                  >
                  </el-date-picker>

                  <el-button
                    size="small"
                    type="primary"
                    @click="getReport11"
                  >统计</el-button>
                </div>
              </div>
              <div style="font-size: 13px">
                <div
                  v-for="(item, index) in rtList11"
                  v-bind:key="index"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 0 10px 0;
                  "
                >
                  <div :class="getClass(index)">
                    <span>{{ index + 1 }}</span>{{ item.name }}
                  </div>
                  <div style="flex: 1">
                    <el-progress
                      :color="getColor(index)"
                      :show-text="false"
                      :stroke-width="15"
                      :percentage="item.percentage"
                    ></el-progress>
                  </div>
                  <div style="padding-left: 20px">{{ item.problem_count }}</div>
                </div>
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>

          <div
            id="div12"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>工作量排行</span>
                <div class="pull-right">
                  <el-date-picker
                    size="small"
                    v-model="dateRange12"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    style="margin: 0 10px 0 10px"
                  >
                  </el-date-picker>

                  <el-button
                    size="small"
                    type="primary"
                    @click="getReport12"
                  >统计</el-button>
                </div>
              </div>
              <div style="font-size: 13px">
                <div
                  v-for="(item, index) in rtList12"
                  v-bind:key="index"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 10px 0 10px 0;
                  "
                >
                  <div :class="getClass(index)">
                    <span>{{ index + 1 }}</span>{{ item.name }}
                  </div>
                  <div style="flex: 1">
                    <el-progress
                      :color="getColor(index)"
                      :show-text="false"
                      :stroke-width="15"
                      :percentage="item.percentage"
                    ></el-progress>
                  </div>
                  <div style="padding-left: 20px">{{ item.count }}</div>
                </div>
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>

          <div
            id="div7"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>问题整改率</span>
                <div class="pull-right">
                  <el-date-picker
                    size="small"
                    v-model="dateRange2"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    style="margin: 0 10px 0 10px"
                  >
                  </el-date-picker>

                  <el-button
                    size="small"
                    type="primary"
                    @click="getReport2(false)"
                  >统计</el-button>
                </div>
              </div>
              <div class="chart-wrapper">
                <bar-chart2 :chart-data="rtList2" />
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>

          <div
            id="div3"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>问题流量</span>
                <div
                  class="pull-right"
                  style="display: flex"
                >
                  <ZMPicker
                    ref="liduPicker"
                    @changeDate="changeDate"
                  ></ZMPicker>

                  <el-button
                    size="small"
                    type="primary"
                    @click="getReport6()"
                  >统计</el-button>
                </div>
              </div>
              <div class="chart-wrapper">
                <line-chart :chart-data="rtList6" />
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>

          <div
            id="div4"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>问题分类</span>
                <div class="pull-right">
                  <el-date-picker
                    size="small"
                    v-model="dateRange3"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    style="margin: 0 10px 0 10px"
                  >
                  </el-date-picker>

                  <el-button
                    size="small"
                    type="primary"
                    @click="getReport3()"
                  >统计</el-button>
                </div>
              </div>
              <div class="chart-wrapper">
                <pie-chart :chart-data="rtList3" />
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>

          <div
            id="div5"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>高发问题</span>
                <div class="pull-right">
                  <el-date-picker
                    size="small"
                    v-model="dateRange4"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    style="margin: 0 10px 0 10px"
                  >
                  </el-date-picker>

                  <el-button
                    size="small"
                    type="primary"
                    @click="getReport4(false)"
                  >统计</el-button>
                </div>
              </div>
              <div class="chart-wrapper">
                <bar-chart :chart-data="rtList4" />
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>

          <div
            id="div6"
            style="margin-top: 10px"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <span>问题清单</span>
                <div class="pull-right">
                  <el-button
                    size="small"
                    type="primary"
                    @click="$router.push('/problem/list')"
                  >更多</el-button>
                </div>
              </div>
              <div class="chart-wrapper">
                <el-table :data="rtList5">
                  <el-table-column
                    label="问题编号"
                    align="center"
                    prop="number"
                    width="100"
                  >
                    <template slot-scope="scope">
                      #{{ scope.row.number }}
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="问题状态"
                    align="center"
                    prop="status"
                    width="120"
                  >
                    <template slot-scope="scope">
                      <el-tag
                        v-if="scope.row.status == 'UN_FEEDBACK'"
                        type="warning"
                        effect="dark"
                      >未反馈</el-tag>
                      <el-tag
                        v-if="scope.row.status == 'FEEDBACK'"
                        type="success"
                        effect="dark"
                      >已反馈</el-tag>

                      <el-tag
                        v-if="scope.row.status == 'FILED'"
                        type="info"
                        effect="dark"
                      >已归档</el-tag>
                    </template>
                  </el-table-column>

                  <el-table-column
                    label="问题类型"
                    align="center"
                    prop="problem_department_type_parent_name"
                    width="140"
                    :show-overflow-tooltip="true"
                  />

                  <el-table-column
                    label="问题类别"
                    align="center"
                    prop="problem_department_type_name"
                    :show-overflow-tooltip="true"
                  />

                  <el-table-column
                    label="发生时间"
                    align="center"
                    prop="create_datetime"
                    width="180"
                  >
                  </el-table-column>

                  <el-table-column
                    label="问题单位"
                    align="center"
                    prop="department_name"
                  />
                </el-table>
              </div>
              <!-- <div style="text-align: right">展开查看表格</div> -->
            </el-card>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import house from "@/assets/images/house.png";
import info from "@/assets/images/info.png";
import RaddarChart from "./../dashboard/RaddarChart";
import PieChart from "./../dashboard/PieChart";
import BarChart from "./../dashboard/BarChart";
import LineChart from "./../dashboard/LineChart";
import BarChart2 from "./../dashboard/BarChart2";
import ZMPicker from "@/components/ZMPicker";
import { checkAdmin } from "@/utils/ruoyi";

import {
  getAdmin,
  getProblem,
  getDepartment,
  getDepartmentProblemCount,
  getProblemDepartmentTypeCount,
  getProblemCountStatistics,
  getProblemDepartmentType,
  getDepartmentWorkloadFromCache,
  getProblemExact,
} from "@/api/problem";

export default {
  computed: {
    ...mapGetters(["admin", "noRead"]),
  },
  components: {
    RaddarChart,
    PieChart,
    BarChart,
    LineChart,
    BarChart2,
    ZMPicker,
  },

  mounted() {
    // 监听页面滚动事件
    window.addEventListener("scroll", this.showSearch);
  },
  data() {
    return {
      house,
      info,

      show: false,

      defaultProps: {
        children: "children",
        label: "name",
      },

      deptDisabled: false,

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      deptList: [],
      detpList2: [],
      selDept: {
        name: "",
        type_name: "",
        parent_name: "",
        childDept: "",
        managerUser: "",
        count: "",
      },
      selUUid: "",

      rtStatus1: "",
      dateRange1: [
        new Date() - 3600 * 1000 * 24 * 7,
        new Date() - 3600 * 1000 * 24,
      ],
      rtList1: [],

      dateRange2: [
        new Date() - 3600 * 1000 * 24 * 7,
        new Date() - 3600 * 1000 * 24,
      ],
      rtList2: {
        xData: [],
        yData1: [],
        yData2: [],
      },

      dateRange3: [
        new Date() - 3600 * 1000 * 24 * 7,
        new Date() - 3600 * 1000 * 24,
      ],
      rtList3: [],

      dateRange4: [
        new Date() - 3600 * 1000 * 24 * 7,
        new Date() - 3600 * 1000 * 24,
      ],
      rtList4: {
        xData: [],
        yData: [],
      },

      rtList5: [],

      dataType: 1,
      dateRange6: [
        new Date() - 3600 * 1000 * 24 * 7,
        new Date() - 3600 * 1000 * 24,
      ],
      rtList6: {
        xData: [],
        yData: [],
      },

      problemTypeList: [],
      deptProblemList: [],
      count1: 0,
      count2: 0,
      rank: "",

      dateRange11: [
        new Date() - 3600 * 1000 * 24 * 7,
        new Date() - 3600 * 1000 * 24,
      ],
      rtList11: [],

      dateRange12: [
        new Date() - 3600 * 1000 * 24 * 7,
        new Date() - 3600 * 1000 * 24,
      ],
      rtList12: [],
    };
  },
  created() {
    this.getProblemType();
    this.getReport1().then((resp) => {
      this.getReport2(true);
      this.getReport11();
      this.getReport12();
    });
    this.getDepartmentList().then((resp1) => {
      this.getReport5();
      this.getReportNew();
    });
  },
  methods: {
    getColor(index) {
      if (index <= 2) {
        return "#DE6F6D";
      } else if (index <= 7) {
        return "#5A70C1";
      } else {
        return "#A1CC83";
      }
    },

    getClass(index) {
      if (index <= 2) {
        return { rank1: true };
      } else if (index <= 7) {
        return { rank2: true };
      } else {
        return { rank3: true };
      }
    },
    showSearch() {
      let top = document.documentElement.scrollTop;
      if (top > 300) {
        // 当页面滚动到高度250px处，动态绑定class 来设置头部固定定位
        this.show = true;
      } else {
        this.show = false;
      }
    },
    quickTo(n) {
      this.$el
        .querySelector("#div" + n)
        .scrollIntoView({ block: "start", behavior: "smooth" });
    },
    handleNodeClick(data) {
      if (!data.children) {
        this.selDeptChange(data.uuid);
      }
    },
    changeDate(type, data) {
      this.dataType = type;
      this.dateRange6 = data;
    },

    getProblemType() {
      getProblemDepartmentType().then((resp) => {
        this.problemTypeList = resp.array.filter((item) => item.level == 1);
      });
    },

    getDepartmentList() {
      return new Promise((resolve) => {
        const query = {
          level: 2,
        };

        if (
          this.admin.role_name == "fu_jing" ||
          this.admin.role_name == "min_jing" ||
          this.admin.role_name == "zd_leader" ||
          this.admin.role_name == "zd_admin" ||
          this.admin.role_name == "department_admin"
        ) {
          query.uuid = this.admin.department_uuid2;
        }

        getDepartment(query).then((resp) => {
          this.deptList = resp.array;

          var p0 = this.deptList[0].parent_array[0].name;
          let map = new Map();
          for (let item of this.deptList) {
            map.set(item.type_name, item.type_name);
          }
          let p1 = [...map.values()];

          let node = {
            name: p0,
            children: [],
          };
          p1.forEach((item) => {
            // console.log(item);
            // console.log(this.deptList.filter((dept) => dept.type_name == item));
            var json = {
              name: item,
              children: this.deptList.filter((dept) => dept.type_name == item),
            };
            node.children.push(json);
          });

          this.detpList2.push(node);

          if (this.deptList.length == 1) {
            this.selUUid = this.deptList[0].uuid;
            this.deptDisabled = true;
            this.getDeptDetail(this.selUUid);
          }
          resolve("next");
        });
      });
    },

    getReport00() {
      return new Promise((resolve) => {
        if (this.deptProblemList.length > 0) {
          return resolve("next");
        }
        const query = {
          level: 2,
        };
        getDepartmentProblemCount(query).then((resp) => {
          this.deptProblemList = resp.array;
          this.deptProblemList.sort(this.sortBy("problem_count"));
          return resolve("next");
        });
      });
    },

    getReport0() {
      this.count1 = 0;
      this.count2 = 0;
      if (this.selUUid) {
        for (var i = 0; i < this.deptProblemList.length; i++) {
          if (this.deptProblemList[i].uuid == this.selUUid) {
            this.rank = i + 1;
            break;
          }
        }

        const query = {
          offset: 0,
          rows: 1,
          from_department_uuid: this.selUUid,
          problem_type: "CHECK",
        };

        getProblemExact(query).then((resp) => {
          this.count1 = resp.count;
        });

        const query2 = {
          offset: 0,
          rows: 1,
          from_department_uuid: this.selUUid,
          problem_type: "SELF",
        };

        getProblemExact(query2).then((resp) => {
          this.count2 = resp.count;
        });
      }
    },

    getReport1() {
      return new Promise((resolve) => {
        const query = {
          level: 2,
        };
        if (this.dateRange1) {
          query.start_create_datetime =
            this.parseTime(this.dateRange1[0], "{y}-{m}-{d}") + " 00:00:00";
          query.end_create_datetime =
            this.parseTime(this.dateRange1[1], "{y}-{m}-{d}") + " 23:59:59";
        }
        if (this.rtStatus1) {
          query.status = this.rtStatus1;
        }

        getDepartmentProblemCount(query).then((resp) => {
          this.rtList1 = resp.array;
          this.rtList1.sort(this.sortBy("problem_count"));
          this.rtList1.forEach((item) => {
            item.percentage =
              (item.problem_count / this.rtList1[0].problem_count) * 100;
          });
          resolve("next");
        });
      });
    },

    getReport2(skip) {
      const query = {
        level: 2,
      };
      if (this.dateRange2) {
        query.start_create_datetime =
          this.parseTime(this.dateRange2[0], "{y}-{m}-{d}") + " 00:00:00";
        query.end_create_datetime =
          this.parseTime(this.dateRange2[1], "{y}-{m}-{d}") + " 23:59:59";
      }
      if (skip) {
        var allList = [...this.rtList1];
        query.status = "UN_FEEDBACK";
        getDepartmentProblemCount(query).then((resp1) => {
          var unList = resp1.array;
          this.handlerReport2(allList, unList);
        });
      } else {
        getDepartmentProblemCount(query).then((resp1) => {
          var allList = resp1.array;
          query.status = "UN_FEEDBACK";
          getDepartmentProblemCount(query).then((resp2) => {
            var unList = resp2.array;
            this.handlerReport2(allList, unList);
          });
        });
      }
    },

    getReport11() {
      const query = {
        level: 2,
        order_group: "002",
      };
      if (this.dateRange11) {
        query.start_create_datetime =
          this.parseTime(this.dateRange11[0], "{y}-{m}-{d}") + " 00:00:00";
        query.end_create_datetime =
          this.parseTime(this.dateRange11[1], "{y}-{m}-{d}") + " 23:59:59";
      }
      getDepartmentProblemCount(query).then((resp) => {
        this.rtList11 = resp.array;
        this.rtList11.sort(this.sortBy("problem_count"));
        this.rtList11.forEach((item) => {
          if (this.rtList11[0].problem_count == 0) {
            item.percentage = 0;
          } else {
            item.percentage =
              (item.problem_count / this.rtList11[0].problem_count) * 100;
          }
        });
      });
    },

    getReport12() {
      const query = {};
      if (this.dateRange11) {
        query.start_create_datetime =
          this.parseTime(this.dateRange12[0], "{y}-{m}-{d}") + " 00:00:00";
        query.end_create_datetime =
          this.parseTime(this.dateRange12[1], "{y}-{m}-{d}") + " 23:59:59";
      }
      getDepartmentWorkloadFromCache(query).then((resp) => {
        this.rtList12 = resp.array;
        this.rtList12.sort(this.sortBy("count"));
        this.rtList12.forEach((item) => {
          item.percentage = (item.count / this.rtList12[0].count) * 100;
        });
      });
    },

    handlerReport2(allList, unList) {
      allList.forEach((item1) => {
        unList.forEach((item2) => {
          if (item1.uuid == item2.uuid) {
            item1.feed_count = item1.problem_count - item2.problem_count; //整改问题
            item1.no_feed_count = item2.problem_count; //未整改问题
            item1.feed_rate =
              item1.problem_count == 0
                ? 0
                : item1.feed_count / item1.problem_count;
          }
        });
      });
      allList.sort(this.sortBy("feed_rate"));
      this.rtList2.xData = allList.map((item) => item.name);
      this.rtList2.yData1 = allList.map((item) => item.feed_count);
      this.rtList2.yData2 = allList.map((item) => item.no_feed_count);
    },

    async getReportNew() {
      await this.getReport3();
      await this.getReport00();
      this.getReport4(true);
      this.getReport6();
      this.getReport0();
    },

    getReport3() {
      return new Promise((resolve) => {
        const query = {};
        if (this.dateRange3) {
          query.start_create_datetime =
            this.parseTime(this.dateRange3[0], "{y}-{m}-{d}") + " 00:00:00";
          query.end_create_datetime =
            this.parseTime(this.dateRange3[1], "{y}-{m}-{d}") + " 23:59:59";
        }
        if (this.selUUid) {
          query.to_uuid = this.selUUid;
        }

        getProblemDepartmentTypeCount(query).then((resp) => {
          var arrays = resp.array.filter(
            (item) => item.level == 2 && item.problem_count > 0
          );
          this.rtList3 = [...arrays].map((item) => {
            let obj = {
              name: item.name,
              value: item.problem_count,
            };
            return obj;
          });
          resolve("next");
        });
      });
    },

    getReport4(skip) {
      const query = {};
      if (this.dateRange4) {
        query.start_create_datetime =
          this.parseTime(this.dateRange4[0], "{y}-{m}-{d}") + " 00:00:00";
        query.end_create_datetime =
          this.parseTime(this.dateRange4[1], "{y}-{m}-{d}") + " 23:59:59";
      }
      if (this.selUUid) {
        query.to_uuid = this.selUUid;
      }
      if (skip) {
        var arrays = [...this.rtList3].sort(this.sortBy("value")).slice(0, 10);
        this.rtList4.xData = arrays.map((item) => item.name);
        this.rtList4.yData = arrays.map((item) => item.value);
      } else {
        getProblemDepartmentTypeCount(query).then((resp) => {
          var arrays = resp.array.filter((item) => item.level == 2);
          arrays = arrays.sort(this.sortBy("problem_count")).slice(0, 10);
          this.rtList4.xData = arrays.map((item) => item.name);
          this.rtList4.yData = arrays.map((item) => item.problem_count);
        });
      }
    },

    getReport5() {
      let query = { offset: 0, rows: 10 };
      if (this.selUUid) {
        query.to_uuid = this.selUUid;
      }
      query = checkAdmin(this.admin, query, true);

      getProblemExact(query).then((resp) => {
        this.rtList5 = resp.array;
      });
    },

    getReport6() {
      const query = {};
      if (this.dateRange3) {
        query.start_create_datetime =
          this.parseTime(this.dateRange6[0], "{y}-{m}-{d}") + " 00:00:00";
        query.end_create_datetime =
          this.parseTime(this.dateRange6[1], "{y}-{m}-{d}") + " 23:59:59";
      }
      if (this.selUUid) {
        query.to_uuid = this.selUUid;
      }
      switch (this.dataType) {
        case 1:
          query.statistics_unit = "DAY";
          break;
        case 2:
          query.statistics_unit = "WEEK";
          break;
        case 3:
          query.statistics_unit = "MONTH";
          break;
      }
      getProblemCountStatistics(query).then((resp) => {
        this.rtList6.xData = resp.array.map((item) => item.datetime);
        this.rtList6.yData = resp.array.map((item) => item.count);
      });
    },

    sortBy(field) {
      return (x, y) => {
        return y[field] - x[field];
      };
    },

    getDeptDetail(e) {
      var dept = this.deptList.filter((item) => item.uuid == e)[0];

      this.selDept.name = dept.name;
      this.selDept.type_name = dept.type_name;
      if (dept.parent_array.length > 0) {
        this.selDept.parent_name = dept.parent_array[0].name;
      } else {
        this.selDept.parent_name = "";
      }

      const query = {
        parent_uuid: e,
      };
      getDepartment(query).then((resp) => {
        if (resp.array.length > 0) {
          this.selDept.childDept = resp.array
            .map((item) => item.name)
            .join(",");
        } else {
          this.selDept.childDept = "";
        }
      });

      const query2 = {
        department_uuid: e,
        offset: 0,
        rows: 10000,
      };

      getAdmin(query2).then((resp) => {
        this.selDept.count = resp.array.length;
      });

      query2.manage_department_uuid_like = e;

      getAdmin(query2).then((resp) => {
        if (resp.array.length > 0) {
          this.selDept.managerUser = resp.array
            .map((item) => item.real_name + "(" + item.name + ")")
            .join(",");
        } else {
          this.selDept.managerUser = "";
        }
      });
    },

    selDeptChange(e) {
      if (e) {
        this.selUUid = e;
        this.getDeptDetail(e);
        this.getReport0();
      } else {
        this.selDept = {
          name: "",
          type_name: "",
          parent_name: "",
          childDept: "",
          managerUser: "",
          count: "",
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.report {
  display: flex;
}
.house {
  width: 120px;
  height: 120px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.house2 {
  width: 60px;
  height: 60px;
  margin-top: 20px;
}

.report-left {
  background: #fff;
  height: 100%;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.home-header-fixed {
  position: fixed;
  top: 0px;
}

.report-right {
  margin-left: 10px;
  flex: 1;
}

.el-menu {
  border-right: solid 0px #e6e6e6;
}

.el-menu-item {
  text-align: center;
  font-size: 16px;
}

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

.organization_configuration {
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    color: #016dbe;
    font-weight: bold;
  }
}

.el-menu-item.is-active {
  color: #016dbe;
  font-weight: bold;
}

.box1 {
  display: flex;
  height: 120px;
  width: 200px;
  background-size: 100% 100%;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  color: #fff;
  font-size: 13px;
}

.img1 {
  background-image: url("../../assets/images/r1.png");
}

.img2 {
  background-image: url("../../assets/images/r2.png");
}

.img3 {
  background-image: url("../../assets/images/r3.png");
}

.rank1 {
  width: 200px;
  font-size: 18px;
  font-weight: bold;
  font-style: italic;
  color: #de6f6d;
}

.rank2 {
  width: 200px;
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  color: #5a70c1;
}

.rank3 {
  width: 200px;
  font-size: 14px;
  font-weight: bold;
  color: #a1cc83;
}
</style>