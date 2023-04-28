<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card>
          <div
            slot="header"
            class="clearfix"
          >
            <span style="font-weight: bold; color: #016dbe">督察报告</span>
            <div class="pull-right">
              <span style="font-size: 14px;">时间范围：</span>
              <el-date-picker
                size="small"
                v-model="dateRange"
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

            </div>
          </div>

          <el-row style="height:200px">
            <el-col
              :span="4"
              class="report-item"
              @click.native="openReport(1)"
            >
              <img
                class="img"
                :src="word"
              />
              <span class="txt">“五位一体”大监督体系工作报告</span>

            </el-col>
            <el-col
              :span="4"
              class="report-item"
              @click.native="openReport(2)"
            >
              <img
                class="img"
                :src="word"
              />
              <span class="txt">高发问题统计工作报告</span>

            </el-col>
            <el-col
              :span="4"
              class="report-item"
              @click.native="openReport(3)"
            >
              <img
                class="img"
                :src="word"
              />
              <span class="txt">各业务警种检查统计报告</span>

            </el-col>
            <el-col
              :span="4"
              class="report-item"
              @click.native="openReport(4)"
            >
              <img
                class="img"
                :src="word"
              />
              <span class="txt">各单位自查统计报告</span>

            </el-col>
            <el-col
              :span="4"
              class="report-item"
              @click.native="openReport(5)"
            >
              <img
                class="img"
                :src="word"
              />
              <span class="txt">各单位反馈统计报告</span>

            </el-col>
            <el-col
              :span="4"
              class="report-item"
              @click.native="openReport(6)"
            >
              <img
                class="img"
                :src="word"
              />
              <span class="txt">问题高发人员统计报告</span>

            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getReportFile } from "@/api/problem";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      word: require("../../assets/images/word.png"),
      dateRange: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],
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
    };
  },
  methods: {
    openReport(type) {
      if (!this.dateRange || this.dateRange.length < 1) {
        this.$modal.msgError("请先选择报表的时间范围!");
        return;
      }

      this.$modal.loading("正在生成报告...");

      this.curReportType = type;
      var tip = "";
      var url = "";
      switch (type) {
        case 1:
          url = "getWuWeiYiTi";
          tip = "“五位一体”大监督体系工作报告";
          break;
        case 2:
          url = "getGaoFaWenTi";
          tip = "高发问题统计工作报告";
          break;
        case 3:
          url = "getDanWeiJianCha";
          tip = "业务警种检查统计报告";
          break;
        case 4:
          url = "getDanWeiZiCha";
          tip = "各单位自查统计报告";
          break;
        case 5:
          url = "getDanWeiFanKui";
          tip = "各单位反馈统计报告";
          break;
        case 6:
          url = "getGaoFaRenYuan";
          tip = "问题高发人员统计报告";
          break;
      }
      var that = this;

      this.$modal
        .confirm("是否生成【" + tip + "】？")
        .then(function () {
          return that.getFile(url, tip);
        })
        .then(() => {
          this.$modal.closeLoading();
        })
        .catch(() => {
          this.$modal.closeLoading();
        });
    },
    getFile(url, tip) {
      var query = {};
      query.start_datetime =
        this.parseTime(this.dateRange[0], "{y}-{m}-{d}") + " 00:00:00";
      query.end_datetime =
        this.parseTime(this.dateRange[1], "{y}-{m}-{d}") + " 23:59:59";

      getReportFile(url, query).then((resp) => {
        console.log(resp.file_name);
        var filePath =
          process.env.VUE_APP_BASE_API +
          "/webapp/report_file/" +
          resp.file_name;
        saveAs(filePath, tip + ".docx");
      });
    },
  },
};
</script>

<style lang="scss" scope >
.report-item {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  .img {
    height: 60px;
    width: 60px;
    margin: 10px;
  }
  .txt {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
</style>