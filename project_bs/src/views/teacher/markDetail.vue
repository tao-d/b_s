<template>
  <div class="view-mark-detail">
    <div class="mark-detail" style="">
      <p class="title">成绩统计</p>
      <div class="exam-select">
        <span>选择考试 </span>
        <el-select
          v-model="activeExam"
          filterable
          placeholder="请选择"
          clearable
          class="exam-select-content"
          @change="selectChange"
        >
          <el-option
            v-for="(item, index) in examList"
            :key="index"
            :label="item.examName"
            :value="item.examId"
          >
            <!-- <span style="float: left">{{
              item.account + " " + item.username + " " + item.examOrder + "号"
            }}</span> -->
            <!-- <el-tag
              style="float: right"
              size="mini"
              class="tag-item"
              :type="piyueTagType(item.gradeStatus)"
              >{{ piyueTagValue(item.gradeStatus) }}</el-tag
            > -->
          </el-option>
        </el-select>
      </div>
      <div class="mark-detail-echart">
        <!-- 成绩分布 -->
        <div id="main" style="width: 400px; height: 400px"></div>
        <!-- 合格人数 -->
        <div id="hgrs" style="width: 400px; height: 400px"></div>
        <!-- 各题正确率 -->
        <div id="singleCorrect" style="width: 400px; height: 400px"></div>
        <!-- 各题正确率 -->
        <div id="multipleCorrect" style="width: 400px; height: 400px"></div>
        <!-- 各题正确率 -->
        <div id="judgementCorrect" style="width: 400px; height: 400px"></div>
      </div>
      <div class="mark-detail-student" v-if="activeExam != ''">
        <p class="title">成绩详细</p>
          <b class="mark-informations" style="margin:40px 0px 0px 20px">
            平均分:{{avgGrade()}}
          </b>
        <div class="mark-detail-top">

          <div class="search">
            搜索
            <el-input
              v-model="dataSearch"
              placeholder="姓名/学号"
              size="small"
            ></el-input>
          </div>
          <el-button
            @click="exportExcel"
            type="primary"
            style="margin-left: 50px"
            >导出全部成绩</el-button
          >
          <el-button
            @click="revokeMarkBtn"
            type="danger"
            style="margin-left: 50px"
            >撤销批阅</el-button
          >
        </div>

        <section class="table" v-if="studentGradeList.length > 0">
          <el-table
            :data="
              studentGradeNewList.slice(
                (pagination.currPage - 1) * pagination.pageSize,
                pagination.currPage * pagination.pageSize
              )
            "
            style="width: 100%; min-height: 65vh"
            stripe
            border
            id="mark-table-detail"
          >
            <el-table-column
              sortable
              prop="examOrder"
              label="学生序号"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.examOrder + "号" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="username"
              label="学生姓名"
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="account"
              label="学号"
              width="180"
              align="center"
            >
            </el-table-column>

            <el-table-column
              sortable
              prop="studentGrade"
              label="考试成绩"
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="gradeOrder"
              label="考试名次"
              align="center"
              sortable
            >
            </el-table-column>
            <!--
          <el-table-column
            prop="examNotMarkingCount"
            label="未批阅人数"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="passMark"
            label="通过分数"
            align="center"
            class="addStudent"
          >
          </el-table-column>
          <el-table-column prop="examStatus" label="考试状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="checkExamTab(scope.row.examStatus)">{{
                checkExam(scope.row.examStatus)
              }}</el-tag>
            </template>
          </el-table-column>-->
            <el-table-column prop="handle" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="warning"
                  @click="handleDetail(scope.$index, scope.row)"
                  >查看详情</el-button
                >
                <!-- <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                disabled
                >关闭</el-button
              > -->
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.currPage"
              :page-sizes="[10, 20]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="studentGradeList.length"
            >
            </el-pagination>
          </div>
        </section>

        <section class="dialog">
          <el-dialog
            title="学生成绩详情"
            :visible.sync="dialogVisibleMarkDetail"
            id="dialogVisibleStudentDetail"
            v-if="dialogVisibleMarkDetail"
            class="abow_dialog"
            top="10vh"
            width="60%"
          >
            <el-card class="card-content">
              <div class="student-informations">
                <el-card>
                  <div class="exam-name">
                    考试名称:
                    {{
                      examList.find((item) => item.examId == activeExam)
                        .examName
                    }}
                  </div>
                  <div class="name">
                    学生姓名: {{ activeStudentInformations.username }}
                  </div>
                  <div class="mark">
                    学生得分: {{ activeStudentInformations.studentGrade }}
                  </div>
                </el-card>
              </div>
              <div class="singleChoice">
                <b class="list-title">单选题</b>
                <el-card
                  v-for="(item, index) in singleChoiceList"
                  :key="index"
                  class="card-item"
                >
                  <exam-option-mark
                    :optionContent="item.questionContent"
                    :optionTypeValue="item.questionType"
                    :optionAnswerValue="item.answer"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="item.imgUrl"
                    :optionMyAnswerValue="
                      activeStudentMaking.singleChoiceList.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="item.questionMark || 0"
                    :questionName="item.questionName"
                    :order="item.questionOrder"
                  >
                  </exam-option-mark>
                </el-card>
              </div>
              <div class="multipleChoice">
                <b class="list-title">多选题</b>
                <el-card
                  v-for="(item, index) in multipleChoiceList"
                  :key="index"
                  class="card-item"
                >
                  <exam-option-mark
                    :optionContent="item.questionContent"
                    :optionTypeValue="item.questionType"
                    :optionAnswerValue="item.answer"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="item.imgUrl"
                    :optionMyAnswerValue="
                      activeStudentMaking.multipleChoiceList.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="item.questionMark || 0"
                    :questionName="item.questionName"
                    :order="item.questionOrder"
                  >
                  </exam-option-mark>
                </el-card>
              </div>
              <div class="judgement">
                <b class="list-title"> 判断题</b>
                <el-card
                  v-for="(item, index) in judgementList"
                  :key="index"
                  class="card-item"
                >
                  <exam-option-mark
                    :optionContent="item.questionContent"
                    :optionTypeValue="item.questionType"
                    :optionAnswerValue="item.answer"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="item.imgUrl"
                    :optionMyAnswerValue="
                      activeStudentMaking.judgementList.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="item.questionMark || 0"
                    :questionName="item.questionName"
                    :order="item.questionOrder"
                  >
                  </exam-option-mark>
                </el-card>
              </div>
              <div class="completion">
                <b class="list-title">填空题</b>
                <el-card
                  v-for="(item, index) in completionList"
                  :key="index"
                  class="card-item"
                >
                  <exam-option-mark
                    :optionContent="item.questionContent"
                    :optionTypeValue="item.questionType"
                    :optionAnswerValue="item.answer"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="item.imgUrl"
                    :optionMyAnswerValue="
                      activeStudentMaking.completionList.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="item.questionMark || 0"
                    :questionName="item.questionName"
                    :order="item.questionOrder"
                    :type="'detail'"
                  >
                  </exam-option-mark>
                </el-card>
              </div>
              <div class="shortAnswer">
                <b class="list-title">简答题</b>
                <el-card
                  v-for="(item, index) in shortAnswerList"
                  :key="index"
                  class="card-item"
                >
                  <exam-option-mark
                    :optionContent="item.questionContent"
                    :optionTypeValue="item.questionType"
                    :optionAnswerValue="item.answer"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="item.imgUrl"
                    :optionMyAnswerValue="
                      activeStudentMaking.shortAnswerList.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (itemnei) => itemnei.questionId == item.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="item.questionMark || 0"
                    :questionName="item.questionName"
                    :order="item.questionOrder"
                    :type="'detail'"
                  >
                  </exam-option-mark>
                </el-card>
              </div>
            </el-card>
          </el-dialog>
        </section>
        <el-dialog :visible.sync="dialogVisibleImg">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import examOptionMark from "@/components/examOptionMark.vue";
import * as echarts from "echarts";
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  name: "markDetail",
  components: {
    examOptionMark,
  },
  data() {
    return {
      examList: [],
      studentList: [],
      activeExam: "",
      examInformations: "",
      avg: "",

      studentGradeList: [],
      studentGradeNewList: [],
      studentAllQusetion: [],

      dataSearch: "",

      dialogVisibleMarkDetail: false,

      activeStudentInformations: "",
      activeStudentGrade: "",
      activeStudentMaking: "",
      activeStudent: "",

      //各种题型数组
      singleChoiceList: [],
      multipleChoiceList: [],
      judgementList: [],
      completionList: [],
      shortAnswerList: [],

      //各种题型数组
      singleChoiceListCorrect: [],
      multipleChoiceListCorrect: [],
      judgementListCorrect: [],
      completionListCorrect: [],
      shortAnswerListCorrect: [],

      pagination: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },

      //图片
      dialogVisibleImg: false,
      dialogImageUrl: "",
    };
  },
  created() {
    //  this.drawCJFB('main')
    this.getFinishMarkExamList();
  },
  mounted() {
    this.$nextTick(function () {
      // console.log('mmmmm');
      // this.drawCJFB("main");
    });
  },
  watch: {
    dataSearch(val) {
      // console.log(val);
      let regexp = new RegExp(val);
      this.studentGradeNewList = this.studentGradeList.filter(
        (item) => regexp.test(item.username) || regexp.test(item.account)
      );
    },
  },
  methods: {
    revokeMark() {
      return this.$request({
        url: "/api/exam/revokeMark",
        method: "post",
        data: {
          examId: this.activeExam,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "撤销成功",
            message: "撤销成绩批阅成功",
            duration: 3000,
            type: "success",
          });
          this.activeExam = "";
          this.getFinishMarkExamList();
        }
      });
    },

    revokeMarkBtn() {
      this.$confirm(`是否撤销考试批阅?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.revokeMark();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消提交试卷",
          });
        });
      return;
    },
    //放大图片事件
    handlePaperViewPicture(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },

    selectChange() {
      // this.getExamGrade().then(()=>this.getExamInformations()).then(()=>this.drawCJFB('main'))
      // this.getExamGrade()
      //   .then(() => this.getExamInformations())
      //   .then(() => {
      //     this.getExamQuestion();
      //     this.handleCJFB();
      //     this.handleHGRS();
      //   });
      this.getExamQuestion()
        .then(() => this.getExamInformations())
        .then(() => {
          return this.getExamGrade();
        })
        .then(() => {
          this.handleCJFB();
          this.handleHGRS();
          this.handleSingleCorrect();
          this.handleMultipleCorrect();
          this.handleJudgementCorrect()
        });
    },
    //获取学生客观题的答题情况
    getStudentMarkingHasGrade({ studentId }) {
      return this.$request({
        url: "/api/exam/getStudentGrade",
        method: "post",
        data: {
          examId: this.activeExam,
          studentId: studentId,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code == 1) {
          // console.log(res.data.data[0]);
          this.activeStudentInformations = res.data.data[0];
          if (res.data.data[0].detail != undefined) {
            this.activeStudentGrade = JSON.parse(res.data.data[0].detail);
          } else {
            this.activeStudentGrade = [];
          }
          console.log("activeStudentGrade", this.activeStudentGrade);
          console.log(this.singleChoiceList);
        }
      });
    },

    //获取学生的作答详情
    getStudentMarkingDetail({ studentId }) {
      return this.$request({
        url: "/api/exam/getStudentMarkingDetail",
        method: "post",
        data: {
          examId: this.activeExam,
          studentId: studentId,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.activeStudentMaking = JSON.parse(res.data.data[0].studentmaking);
          console.log(this.activeStudentMaking);
        }
      });
    },

    getExamInformations() {
      return this.$request({
        url: "/api/exam/getTeacherExamInformations",
        method: "post",
        data: {
          examId: this.activeExam,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code === 1) {
          this.examInformations = res.data.data[0];
          console.log(this.examInformations);
        }
      });
    },
    getExamGrade() {
      return this.$request({
        url: "/api/exam/getExamGrade",
        method: "post",
        data: {
          examId: this.activeExam,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code === 1) {
          this.studentGradeList = this.studentList = res.data.data;
          this.studentGradeList.sort((a, b) => {
            return b.studentGrade - a.studentGrade;
          });
          this.studentGradeNewList = this.studentGradeList;
          console.log(this.studentGradeList);
          this.studentGradeList.forEach((item) => {
            let detail = JSON.parse(item.detail);
            // console.log(detail);
            detail.forEach((item) => {
              let indexSingle = this.singleChoiceList.findIndex(
                (item1) => item.questionId == item1.examQuestionId
              );
              let indexMultiple = this.multipleChoiceList.findIndex(
                (item1) => item.questionId == item1.examQuestionId
              );
              let indexJudgement = this.judgementList.findIndex(
                (item1) => item.questionId == item1.examQuestionId
              );
              
              if (indexSingle != -1) {
                if (this.singleChoiceListCorrect[indexSingle] === undefined) {
                  this.singleChoiceListCorrect[indexSingle] = 0;
                } 
                  if (item.isTrue) {
                    this.singleChoiceListCorrect[indexSingle]++;
                  }
                
              }
              if (indexMultiple != -1) {
                if (
                  this.multipleChoiceListCorrect[indexMultiple] === undefined
                ) {
                  this.multipleChoiceListCorrect[indexMultiple] = 0;
                } 
                  if (item.isTrue) {
                    this.multipleChoiceListCorrect[indexMultiple]++;
                  }
                
              }
              if (indexJudgement != -1) {
                console.log(item);
                if (this.judgementListCorrect[indexJudgement] === undefined) {
                  this.judgementListCorrect[indexJudgement] = 0;
                } 
                  
                  if (item.isTrue) {
                    this.judgementListCorrect[indexJudgement]++;
                  }
                
              }
            });
          });
          this.singleChoiceListCorrect = this.singleChoiceListCorrect.map(
            (item) => item / this.studentGradeList.length
          );
          this.multipleChoiceListCorrect = this.multipleChoiceListCorrect.map(
            (item) => item / this.studentGradeList.length
          );
          this.judgementListCorrect = this.judgementListCorrect.map(
            (item) => item / this.studentGradeList.length
          );
        }
      });
    },
    //获取考试试题
    getExamQuestion() {
      return this.$request({
        url: "/api/exam/getTeacherMarkingQuestion",
        method: "post",
        data: {
          examId: this.activeExam,
        },
      }).then((res) => {
        this.singleChoiceList = [];
        this.multipleChoiceList = [];
        this.judgementList = [];
        this.completionList = [];
        this.shortAnswerList = [];
        this.studentList = [];
        let data = res.data.data;
        this.studentAllQusetion = res.data.data;

        this.examInformations = {};
        data.forEach((item) => {
          // console.log(item);
          let typeArray = item.questionType.split(" ");
          item.order = item.typeOrder;
          item.questionContent = JSON.parse(item.questionContent);
          item.answer = JSON.parse(item.answer);
          item.imgUrl = JSON.parse(item.imgUrl);
          switch (typeArray[0]) {
            case "choice": {
              if (typeArray[1] == "singleChoice") {
                item.studentAnswer = "";
                this.singleChoiceList.push(item);
              } else {
                item.studentAnswer = [];
                this.multipleChoiceList.push(item);
              }
              break;
            }
            case "singleChoice": {
              item.studentAnswer = "";
              this.singleChoiceList.push(item);
              break;
            }
            case "multipleChoice": {
              item.studentAnswer = [];
              this.multipleChoiceList.push(item);
              break;
            }
            case "judgement": {
              item.studentAnswer = "";
              this.judgementList.push(item);
              break;
            }
            case "completion": {
              item.studentAnswer = "";
              this.completionList.push(item);
              break;
            }
            case "shortAnswer": {
              item.studentAnswer = "";
              this.shortAnswerList.push(item);
              break;
            }
          }
        });

        console.log(this.singleChoiceList);
        console.log(this.multipleChoiceList);
        console.log(this.judgementList);
        console.log(this.completionList);
        console.log(this.shortAnswerList);
      });
    },
    //处理图表数据
    async handleCJFB() {
      let optionCJFB = {
        title: {
          text: "成绩分布",
        },
        tooltip: {},
        legend: {
          data: ["人数"],
        },
        xAxis: {
          data: [],
        },
        yAxis: {},
        series: [
          {
            name: "人数",
            type: "bar",
            data: [],
          },
        ],
      };
      // let result =
      //成绩分布
      //总分
      // let mark = 0
      // let startMark = 0
      let dataCheck = [];
      let endMark = this.examInformations.examMark;
      // console.log(this.examInformations);
      //初始化统计数据
      //xAxis处理
      console.log(endMark);
      while (endMark > 0) {
        if (endMark % 10 != 0) {
          optionCJFB.xAxis.data.unshift(
            `${endMark - (endMark % 10)}-${endMark}`
          );
          dataCheck.unshift({
            startMark: endMark - (endMark % 10),
            endMark: endMark,
            count: 0,
          });
          endMark = endMark - (endMark % 10);
        } else {
          optionCJFB.xAxis.data.unshift(`${endMark - 10}-${endMark}`);
          dataCheck.unshift({
            startMark: endMark - 10,
            endMark: endMark,
            count: 0,
          });
          endMark = endMark - 10;
        }
      }
      console.log(dataCheck);
      //考试总人数
      //处理各阶段人数
      for (let i = 0; i < this.studentList.length; i++) {
        // mark+=this.studentList[i].studentGrade
        dataCheck.forEach((item) => {
          if (
            this.studentList[i].studentGrade <= item.endMark &&
            this.studentList[i].studentGrade > item.startMark
          ) {
            item.count++;
          } else {
            //处理成绩为0的边界
            if (this.studentList[i].studentGrade == 0 && item.startMark == 0) {
              item.count++;
            }
          }
        });
      }
      //处理人数
      optionCJFB.series[0].data = dataCheck.map((item) => item.count);
      console.log(optionCJFB);
      this.drawCJFB("main", optionCJFB);
    },
    //处理其他数据
    async examData() {
      //平均分
      let allMark = 0;
      for (let i = 0; i < this.studentList.length; i++) {
        // mark+=this.studentList[i].studentGrade
        allMark += this.studentList[i].studentGrade;
      }
      this.avg = (allMark / this.studentList.length).toFixed(1);
    },

    getFinishMarkExamList() {
      return this.$request({
        url: "/api/exam/getFinishMarkExamList",
        method: "post",
      }).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.examList = res.data.data;
        }
      });
    },

    drawCJFB(id, optionCJFB) {
      var myChart = echarts.init(document.getElementById(id));
      myChart.setOption(optionCJFB);
    },
    handleHGRS() {
      let optionHGRS = {
        title: {
          text: "合格人数",
        },
        tooltip: {},
        legend: {
          data: ["人数"],
        },
        xAxis: {
          data: ["不合格", "合格"],
        },
        yAxis: {},
        series: [
          {
            name: "人数",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#F56C6C",
              },
            },
            data: [],
          },
        ],
      };
      let dataCheck = [
        {
          title: "不合格",
          count: 0,
        },
        {
          title: "合格",
          count: 0,
        },
      ];
      for (let i = 0; i < this.studentList.length; i++) {
        if (
          this.studentList[i].studentGrade >= this.examInformations.passMark
        ) {
          dataCheck[1].count++;
        } else {
          dataCheck[0].count++;
        }
      }
      optionHGRS.series[0].data = dataCheck.map((item) => item.count);
      this.drawHGRS("hgrs", optionHGRS);
    },
    handleDetail(index, row) {
      console.log(row);
      console.log(index);
      this.getStudentMarkingHasGrade(row)
        .then(() => {
          return this.getStudentMarkingDetail(row);
        })
        .then(() => {
          this.dialogVisibleMarkDetail = true;
        });
    },
    drawHGRS(id, optionHGRS) {
      var myChart = echarts.init(document.getElementById(id));
      myChart.setOption(optionHGRS);
      console.log(this);
    },
    handleSingleCorrect() {
      let optionCorrect = {
        title: {
          text: "单选题正确率",
        },
        tooltip: {},
        legend: {
          data: ["正确率"],
        },
        xAxis: {
          data: [],
        },
        yAxis: {},
        series: [
          {
            name: "正确率",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#F56C6C",
              },
            },
            data: [],
          },
        ],
      };
      console.log(this.singleChoiceListCorrect.length);
      for (let i = 0; i < this.singleChoiceListCorrect.length; i++) {
        optionCorrect.xAxis.data.push("单选题" + (i+1));
        optionCorrect.series[0].data.push(this.singleChoiceListCorrect[i])
      }
      // optionCorrect.series[0].data = this.singleChoiceListCorrect;
      console.log(optionCorrect.series[0].data);
      // optionHGRS.series[0].data = dataCheck.map((item) => item.count);

      this.drawSingleCorrect("singleCorrect", optionCorrect);
    },
    drawSingleCorrect(id, optionCorrect) {
      var myChart = echarts.init(document.getElementById(id));
      myChart.setOption(optionCorrect);
      // console.log(this);
    },

    handleMultipleCorrect() {
      let optionCorrect = {
        title: {
          text: "多选题正确率",
        },
        tooltip: {},
        legend: {
          data: ["正确率"],
        },
        xAxis: {
          data: [],
        },
        yAxis: {},
        series: [
          {
            name: "正确率",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#F56C6C",
              },
            },
            data: [],
          },
        ],
      };
      for (let i = 0; i < this.multipleChoiceListCorrect.length; i++) {
        optionCorrect.xAxis.data.push('多选题'+(i+1));
      }
      optionCorrect.series[0].data = this.multipleChoiceListCorrect;

      this.drawMultipleCorrect("multipleCorrect", optionCorrect);
    },
    drawMultipleCorrect(id, optionCorrect) {
      var myChart = echarts.init(document.getElementById(id));
      myChart.setOption(optionCorrect);
      // console.log(this);
    },

    handleJudgementCorrect() {
      let optionCorrect = {
        title: {
          text: "判断题正确率",
        },
        tooltip: {},
        legend: {
          data: ["正确率"],
        },
        xAxis: {
          data: [],
        },
        yAxis: {},
        series: [
          {
            name: "正确率",
            type: "bar",
            itemStyle: {
              normal: {
                color: "#F56C6C",
              },
            },
            data: [],
          },
        ],
      };
      for (let i = 0; i < this.judgementListCorrect.length; i++) {
        optionCorrect.xAxis.data.push("判断题" + (i+1));
        optionCorrect.series[0].data.push(this.judgementListCorrect[i])
      }
      // optionCorrect.series[0].data = this.judgementListCorrect;
      console.log(optionCorrect.series[0].data);
      this.drawJudgementCorrect("judgementCorrect", optionCorrect);
    },
    drawJudgementCorrect(id, optionCorrect) {
      var myChart = echarts.init(document.getElementById(id));
      myChart.setOption(optionCorrect);
      // console.log(this);
    },
    avgGrade(){
      if(this.studentGradeNewList.length>0)
      {
        return this.studentGradeNewList.reduce((total,item)=>{
          console.log(typeof item.studentGrade);
          console.log(total);
          return total+Number(item.studentGrade)
        },0)/this.studentGradeNewList.length.toFixed(1)
        
      }
      else{
        return 0
      }
    },

    //定义导出Excel表格事件
    exportExcel() {
      console.log(this.activeExam);
      console.log(this);
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(
        document.querySelector("#mark-table-detail")
      );
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。

          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          `grade.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    //处理表的组件（分页事件）
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currPage = val;
    },
  },
};
</script>

<style lang="less" scoped>
.mark-detail {
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
  .title {
    font-size: 28px;
    // margin-left:60px ;
    position: relative;
    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 5px;
      height: 28px;
      background-color: rgb(140, 197, 255);
      border-radius: 5px;
      top: 5px;
      left: -10px;
    }
  }
  .exam-select {
    margin-top: 20px;
    .exam-select-content {
      width: 300px;
    }
  }
  .mark-detail-echart {
    margin-top: 100px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
  }
  .mark-detail-student {
    .title {
      font-size: 28px;
      // margin-left:60px ;
      margin-bottom: 20px;
      position: relative;
      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 5px;
        height: 28px;
        background-color: rgb(140, 197, 255);
        border-radius: 5px;
        top: 5px;
        left: -10px;
      }
    }
    .mark-detail-top {
      margin: 20px;
      // width: 350px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .search {
      /deep/ .el-input {
        width: 200px;
      }
      /deep/ .el-input__inner {
        width: 178px;
        margin-left: 20px;
      }
    }
  }
  .table {
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .card-content {
    height: 50vh;
    overflow: auto;
    .student-informations {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .list-title {
      font-size: 18px;
    }
    .card-item {
      margin: 20px 0;
    }
  }
  .el-dialog__body {
    position: absolute;
    height: 50vh;
    left: 0;
    top: 54px;
    bottom: 0;
    right: 0;
    padding: 0;
    z-index: 1;
    // overflow: auto;
    overflow-y: auto;
  }
  // .el-dialog {
  //   margin: 0 auto !important;
  //   // height: 90%;
  //   height: 500px;
  //   overflow: hidden;
  //   .el-dialog__body {
  //     position: absolute;
  //     height: 50vh;
  //     left: 0;
  //     top: 54px;
  //     bottom: 0;
  //     right: 0;
  //     padding: 0;
  //     z-index: 1;
  //     overflow: auto;
  //     // overflow-y: auto;
  //   }
  // }
}
</style>