<template>
  <div class="view-marking">
    <div class="main">
      <el-row>
        <el-col :span="15" class="main-left">
          <el-card class="head">
            <div slot="header" class="clearfix">
              <span>试卷批阅</span>
            </div>
            <el-card
              ><span>选择批阅学生: </span>
              <el-select
                v-model="activeStudent"
                filterable
                placeholder="请选择"
                clearable
                class="student-select"
                @change="selectChange"
                 v-if="studentList.length>0"
              >
                <el-option
                  v-for="(item, index) in studentList"
                  :key="index"
                  :label="
                    item.account +
                    ' ' +
                    item.username +
                    ' ' +
                    item.examOrder +
                    '号'
                  "
                  :value="item.userId"
                >
                  <span style="float: left">{{
                    item.account +
                    " " +
                    item.username +
                    " " +
                    item.examOrder +
                    "号"
                  }}</span>
                  <el-tag
                    style="float: right"
                    size="mini"
                    class="tag-item"
                    :type="piyueTagType(item.gradeStatus)"
                    >{{ piyueTagValue(item.gradeStatus) }}</el-tag
                  >
                </el-option>
              </el-select>
              <el-button
                class="next-btn"
                type="primary"
                style="margin-left: 20px"
                @click="preBtn"
                >上一个</el-button
              >
              <el-button
                class="next-btn"
                type="primary"
                style="margin-left: 20px"
                @click="nextBtn"
                >下一个</el-button
              >
              <el-button
                class="next-btn"
                type="primary"
                style="margin-left: 20px"
                @click="markFinishedBtn"
                >结束考试批阅</el-button
              >
            </el-card>
          </el-card>

          <el-card
            class="main-left-content"
            :body-style="{ padding: '30px' }"
            v-if="activeQuestion && activeStudentMaking != null"
          >
            <!-- <span class="order">
              {{
                findAllOrder(
                  activeQuestion.questionType,
                  activeQuestion.order - 1
                )
              }}
            </span>
            <div class="question-title">
              【{{ checkQuestionType() }}】
              <b>{{ activeQuestion.questionName }} </b>
              <b style="color: red">{{ activeQuestion.questionMark }}分</b>
            </div> -->
            <div class="question-content">
              <div
                class="single-choice"
                v-if="
                  activeQuestion &&
                  activeQuestion.questionType == 'choice singleChoice'
                "
              >
                <div class="option">
                  <exam-option-mark
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="activeQuestion.imgUrl"
                    :optionAnswerValue="activeQuestion.answer"
                    :optionMyAnswerValue="
                      activeStudentMaking.singleChoiceList.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="activeQuestion.questionMark || 0"
                    :questionName="activeQuestion.questionName"
                    :order="
                      findAllOrder(
                        activeQuestion.questionType,
                        activeQuestion.order - 1
                      )
                    "
                  >
                  </exam-option-mark>
                </div>
              </div>
              <div
                class="multiple-choice"
                v-if="
                  activeQuestion &&
                  activeQuestion.questionType == 'choice multipleChoice'
                "
              >
                <div class="option">
                  <exam-option-mark
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="activeQuestion.imgUrl"
                    :optionAnswerValue="activeQuestion.answer"
                    :optionMyAnswerValue="
                      activeStudentMaking.multipleChoiceList.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="activeQuestion.questionMark || 0"
                    :questionName="activeQuestion.questionName"
                    :order="
                      findAllOrder(
                        activeQuestion.questionType,
                        activeQuestion.order - 1
                      )
                    "
                  >
                  </exam-option-mark>
                </div>
              </div>
              <div
                class="judgement"
                v-if="
                  activeQuestion && activeQuestion.questionType == 'judgement'
                "
              >
                <div class="option">
                  <exam-option-mark
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="activeQuestion.imgUrl"
                    :optionAnswerValue="activeQuestion.answer"
                    :optionMyAnswerValue="
                      activeStudentMaking.judgementList.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).questionMark || 0
                    "
                    :questionZongMark="activeQuestion.questionMark || 0"
                    :questionName="activeQuestion.questionName"
                    :order="
                      findAllOrder(
                        activeQuestion.questionType,
                        activeQuestion.order - 1
                      )
                    "
                  >
                  </exam-option-mark>
                </div>
              </div>
              <div
                class="completion"
                v-if="
                  activeQuestion && activeQuestion.questionType == 'completion'
                "
              >
                <div class="option">
                  <exam-option-mark
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @giveMark="optionClick"
                    @markQuestion="updateGrade"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="activeQuestion.imgUrl"
                    :optionAnswerValue="activeQuestion.answer"
                    :optionMyAnswerValue="
                      activeStudentMaking.completionList.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).questionMark
                    "
                    :questionZongMark="activeQuestion.questionMark || 0"
                    :questionName="activeQuestion.questionName"
                    :order="
                      findAllOrder(
                        activeQuestion.questionType,
                        activeQuestion.order - 1
                      )
                    "
                  >
                  </exam-option-mark>
                </div>
              </div>
              <div
                class="short-answer"
                v-if="
                  activeQuestion && activeQuestion.questionType == 'shortAnswer'
                "
              >
                <div class="option">
                  <exam-option-mark
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @giveMark="optionClick"
                    @markQuestion="updateGrade"
                    @clickImg="handlePaperViewPicture"
                    :imgUrl="activeQuestion.imgUrl"
                    :optionAnswerValue="activeQuestion.answer"
                    :optionMyAnswerValue="
                      activeStudentMaking.shortAnswerList.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).studentAnswer
                    "
                    :questionMark="
                      activeStudentGrade.find(
                        (item) =>
                          item.questionId == activeQuestion.examQuestionId
                      ).questionMark
                    "
                    :questionZongMark="activeQuestion.questionMark || 0"
                    :questionName="activeQuestion.questionName"
                    :order="
                      findAllOrder(
                        activeQuestion.questionType,
                        activeQuestion.order - 1
                      )
                    "
                  >
                  </exam-option-mark>
                </div>
              </div>
            </div>
            <div class="btn-group">
              <el-button-group>
                <el-button
                  type="primary"
                  icon="el-icon-arrow-left"
                  @click="preQuestionBtn"
                  :disabled="activeIndex == 0"
                  >上一题</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-arrow-left"
                  @click="nextQuestionBtn"
                  :disabled="activeIndex == listLength - 1"
                  >下一题</el-button
                >
              </el-button-group>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" class="main-right">
          <el-card>
            <el-row>
              <el-col :span="11" class="informations-left">
                <el-card>
                  <div slot="header" class="clearfix">
                    <span>批阅学生信息</span>
                  </div>
                  <div class="item">
                    学生姓名:{{ activeStudentInformations.username }}
                  </div>
                  <div class="item">
                    当前得分:{{ activeStudentInformations.studentGrade }}
                  </div>
                  <div class="item">
                    考试序号:{{ activeStudentInformations.examOrder }}
                  </div>
                </el-card>
              </el-col>
              <el-col :span="11" class="informations-right">
                <el-card v-if="examInformations">
                  <div slot="header" class="clearfix">
                    <span>考试信息</span>
                  </div>
                  <div class="item">
                    考试名称:{{ examInformations.examName }}
                  </div>
                  <div class="item">
                    考试总分:{{ examInformations.examMark }}
                  </div>
                  <div class="item">
                    通过分数:{{ examInformations.passMark }}
                  </div>
                  <!-- <div>考试名称:{{}}</div> -->
                </el-card>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="question-small-order">
            <div class="title">答题卡</div>
            <div class="lizi">
              <!-- <el-button >未作答</el-button>
              <el-button style="background: #409EFF;color:white;">已作答</el-button> -->
              <div class="correct-mark mark">正确</div>
              <div class="fail-mark mark">错误</div>
              <div class="need-mark mark">未批阅</div>
              <div class="has-mark mark">已批阅</div>
            </div>
            <div class="single-choice big-item">
              <div class="single-choice-title">单选题</div>
              <div
                class="single-choice-order"
                v-if="singleChoiceList.length > 0"
              >
                <el-button
                  class="btn"
                  v-for="(item, index) in singleChoiceList"
                  :key="index"
                  @click="smallOrderBtn(item.questionType, index)"
                  :class="{
                    'is-true':
                      activeStudentGrade.length > 0 &&
                      activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isTrue,
                    'is-false':
                      activeStudentGrade.length > 0 &&
                      !activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isTrue,
                  }"
                  >{{ findAllOrder(item.questionType, index) }}</el-button
                >
              </div>
            </div>

            <div class="multiple-choice big-item">
              <div class="multiple-choice-title">多选题</div>
              <div
                class="multiple-choice-order"
                v-if="multipleChoiceList.length > 0"
              >
                <el-button
                  class="btn"
                  v-for="(item, index) in multipleChoiceList"
                  :key="index"
                  @click="smallOrderBtn(item.questionType, index)"
                  :class="{
                    'is-true':
                      activeStudentGrade.length > 0 &&
                      activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isTrue,
                    'is-false':
                      activeStudentGrade.length > 0 &&
                      !activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isTrue,
                  }"
                  >{{ findAllOrder(item.questionType, index) }}</el-button
                >
              </div>
            </div>

            <div class="judgement big-item">
              <div class="judgement-title">判断题</div>
              <div class="judgement-order" v-if="judgementList.length > 0">
                <el-button
                  class="btn"
                  v-for="(item, index) in judgementList"
                  :key="index"
                  @click="smallOrderBtn(item.questionType, index)"
                  :class="{
                    'is-true':
                      activeStudentGrade.length > 0 &&
                      activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isTrue,
                    'is-false':
                      activeStudentGrade.length > 0 &&
                      !activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isTrue,
                  }"
                  >{{ findAllOrder(item.questionType, index) }}</el-button
                >
              </div>
            </div>

            <div class="completion big-item">
              <div class="completion-title">填空题</div>
              <div class="completion-order" v-if="completionList.length > 0">
                <el-button
                  class="btn"
                  v-for="(item, index) in completionList"
                  :key="index"
                  :class="{
                    'need-mark':
                      activeStudentGrade.length > 0 &&
                      !activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isMark,
                    'has-mark':
                      activeStudentGrade.length > 0 &&
                      activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isMark,
                  }"
                  @click="smallOrderBtn(item.questionType, index)"
                  >{{ findAllOrder(item.questionType, index) }}</el-button
                >
              </div>
            </div>

            <div class="short-answer big-item">
              <div class="short-answer-title">简答题</div>
              <div class="short-answer-order" v-if="shortAnswerList.length > 0">
                <el-button
                  class="btn"
                  v-for="(item, index) in shortAnswerList"
                  :key="index"
                  :class="{
                    'need-mark':
                      activeStudentGrade.length > 0 &&
                      !activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isMark,
                    'has-mark':
                      activeStudentGrade.length > 0 &&
                      activeStudentGrade.find(
                        (itemIn) => itemIn.questionId == item.examQuestionId
                      ).isMark,
                  }"
                  @click="smallOrderBtn(item.questionType, index)"
                  >{{ findAllOrder(item.questionType, index) }}</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog :visible.sync="dialogVisibleImg">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import examOption from "@/components/examOption.vue";
import examOptionMark from "@/components/examOptionMark.vue";
export default {
  name: "marking",
  components: {
    // examOption,
    examOptionMark,
  },
  computed: {
    listLength() {
      let length = 0;
      for (let i = 0; i < 5; i++) {
        length += this[`${this.questionTypeIndex[i]}List`].length;
      }
      return length;
    },
  },
  data() {
    return {
      questionType: [
        {
          label: "单选题",
          value: "singleChoice",
        },
        {
          label: "多选题",
          value: "multipleChoice",
        },
        {
          label: "判断题",
          value: "judgement",
        },
        {
          label: "填空题",
          value: "completion",
        },
        {
          label: "简答题",
          value: "shortAnswer",
        },
      ],
      questionTypeIndex: [
        "singleChoice",
        "multipleChoice",
        "judgement",
        "completion",
        "shortAnswer",
      ],

      studentList: [],
      examQuestionList: [],
      smallActiveNames: [1],

      //题型分类
      singleChoiceList: [],
      multipleChoiceList: [],
      judgementList: [],
      completionList: [],
      shortAnswerList: [],

      //当前活动学生
      activeStudent: "",
      activeStudentIndex: "",
      activeStudentInformations: "",
      activeStudentLoading: false,
      notMarkStudentCount: 0,

      //当前活动试题
      activeQuestion: "",
      activeIndex: "",

      //获取学生的grade
      activeStudentGrade: [],
      activeStudentMaking: null,

      //学生总分
      activeStudentZongMark: 0,
      examInformations: "",

      //图片
      dialogVisibleImg: false,
      dialogImageUrl: "",
    };
  },
  // created() {
  //   //首先需要通过route来判断examId是否有效
  //   //1.是否为该teacher
  //   //2.exam状态是否为2（待批阅）
  //   //
  //   // this.dataInit()
  //   this.getStudentMarkingList();
  //   this.getExamQuestion();
  //   this.getExamInformations();
  // },
  watch: {
    activeIndex() {
      // this.getStudentMarkingHasGrade()
      // console.log("eeeeeeeeeeeeeeeeeeeeeeeeee");
      let { typeIndex, type } = this.orderAllFind(this.activeIndex);
      this.activeQuestion = this[`${type}List`][typeIndex];
      console.log(this.activeQuestion);
      // console.log('listLength',this.listLength);
      console.log(this.activeQuestion);
      console.log("activeIndex", this.activeIndex);
    },
    activeStudent() {
      this.getStudentMarkingHasGrade()
        .then(() => {
          return this.getStudentMarkingDetail();
        })
        .then(() => {
          // console.log("xiaxiaxiaxiaxia");
          this.activeIndex = 0;
        });

      // this.getActiveStudentInformations()
    },
  },
  // activated() {
  //   this.dataInit();
  //   this.getStudentMarkingList();
  //   this.getExamQuestion();
  //   this.getExamInformations();
  // },
  created() {
    this.dataInit();
    this.getStudentMarkingList();
    this.getExamQuestion();
    this.getExamInformations();
  },
  methods: {
    //判断是否批阅完成
    // checkMarkIsFull(){
    //   let flag = null
    //   flag = this.activeStudentGrade
    // },
    handlePaperViewPicture(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },

    piyueTagType(gradeStatus) {
      switch (gradeStatus) {
        case 0: {
          return "primary";
        }
        case 1: {
          return "warning";
        }
        case 2: {
          return "success";
        }
      }
    },

    piyueTagValue(gradeStatus) {
      switch (gradeStatus) {
        case 0: {
          return "未批阅";
        }
        case 1: {
          return "批阅中";
        }
        case 2: {
          return "已批阅";
        }
      }
    },
    nextQuestionBtn() {
      // console.log(1);
      if (this.activeIndex < this.listLength) {
        this.activeIndex++;
      }
    },
    preQuestionBtn() {
      // console.log(2);
      if (this.activeIndex > 0) {
        this.activeIndex--;
      }
    },
    //结束考试批阅事件
    markFinished() {
      return this.$request({
        url: "/api/exam/commitExamMarkFinish",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      });
    },
    markFinishedBtn() {
      this.$confirm(
        `是否结束此次考试阅卷? 还有${this.notMarkStudentCount}名考生未批阅完成`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.markFinished().then(() => {
            this.$notify({
              title: "结束批阅",
              message: "结束批阅成功",
              duration: 3000,
              type: "success",
            });
            this.$router.push("/teacher/examMarking");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消结束阅卷",
          });
        });
    },
    selectChange(value) {
      console.log(value);
      this.activeStudentIndex = this.studentList.findIndex(
        (item) => item.userId === value
      );
    },
    nextBtn() {
      if (this.activeStudentIndex < this.studentList.length - 1) {
        this.activeStudentIndex++;
        this.activeStudent = this.studentList[this.activeStudentIndex].userId;
      } else {
        return;
      }
    },
    preBtn() {
      if (this.activeStudentIndex > 0) {
        this.activeStudentIndex--;
        this.activeStudent = this.studentList[this.activeStudentIndex].userId;
      } else {
        return;
      }
    },
    dataInit() {
      this.activeStudentGrade = {}
      this.activeStudentMaking = {}
      this.examInformations = "";
      this.singleChoiceList = [];
      this.multipleChoiceList = [];
      this.judgementList = [];
      this.completionList = [];
      this.shortAnswerList = [];
      this.studentList = [];
      this.examQuestionList = [];
      this.smallActiveNames = [];
    },
    backBtn() {
      this.$router.go(-1);
    },

    //更新主观题得分
    updateGrade({ giveMark, oldMark }) {
      // console.log(value);
      return this.$request({
        url: "/api/exam/updateGrade",
        method: "post",
        data: {
          examId: this.$route.query.examId,
          studentId: this.activeStudent,
          questionId: this.activeQuestion.examQuestionId,
          questionMark: giveMark,
          questionType: this.activeQuestion.questionType,
          oldMark: oldMark,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "修改成功",
            message: "题目批阅成功",
            duration: 3000,
            type: "success",
          });
          //以上为更新数据库
          //更新完毕后更新前端的视图数据
          //更新总分studentGrade
          // if(giveMark>oldMark)
          // {
          //   this.activeStudentInformations.studentGrade+=(giveMark-oldMark)
          // }
          // else{
          //   this.activeStudentInformations.studentGrade-=(oldMark-giveMark)
          // }
          this.getStudentMarkingHasGrade();
          this.getStudentMarkingList();
        } else {
          this.$notify({
            title: "修改失败",
            message: "题目批阅失败",
            duration: 3000,
            type: "success",
          });
        }
      });
    },

    //获取活动学生信息
    getActiveStudentInformations() {
      return this.$request({
        url: "/api/exam/getStudentGrade",
        method: "post",
        data: {
          examId: this.$route.query.examId,
          studentId: this.activeStudent,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.activeStudentInformations = res.data.data[0];
          console.log(this.activeStudentInformations);
        }
      });
    },
    //获取参与考试的学生信息
    getStudentMarkingList() {
      return this.$request({
        url: "/api/exam/getStudentMarkingList",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        let data = res.data.data;
        console.log(data);
        this.studentList = res.data.data;
        this.notMarkStudentCount = 0;
        this.studentList.forEach((item) => {
          if (item.gradeStatus != 2) {
            this.notMarkStudentCount++;
          }
        });
        // console.log(this.studentList);
        //统计未批阅人数
      });
    },

    //获取学生的作答详情
    getStudentMarkingDetail() {
      return this.$request({
        url: "/api/exam/getStudentMarkingDetail",
        method: "post",
        data: {
          examId: this.$route.query.examId,
          studentId: this.activeStudent,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.activeStudentMaking = JSON.parse(res.data.data[0].studentmaking);
          console.log(this.activeStudentMaking);
          console.log("activeStudentMaking");
        }
      });
    },

    //获取学生客观题的答题情况
    getStudentMarkingHasGrade() {
      return this.$request({
        url: "/api/exam/getStudentGrade",
        method: "post",
        data: {
          examId: this.$route.query.examId,
          studentId: this.activeStudent,
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

    //获取考试试题
    getExamQuestion() {
      return this.$request({
        url: "/api/exam/getTeacherMarkingQuestion",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        let data = res.data.data;
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

    //获取考试基本信息
    getExamInformations() {
      return this.$request({
        url: "/api/exam/getTeacherExamInformations",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          let data = res.data.data[0];
          this.examInformations = data;
          console.log(this.examInformations);
        }
        // console.log(this.diffTime.format('mm:ss'));
        // console.log(this.$moment(this.endTime).diff(this.$moment(this.enterTime)));
        // console.log(this.endTime-);
      });
    },
    orderAllFind(index) {
      let typeIndex = null;
      let type = null;
      for (let i = 0; i < 5; i++) {
        let length = this[`${this.questionTypeIndex[i]}List`].length;
        if (index < length) {
          typeIndex = index;
          type = this.questionTypeIndex[i];
          break;
        } else {
          index -= length;
        }
      }
      return {
        typeIndex,
        type,
      };
    },
    findAllOrder(questionType, index) {
      // console.log(questionType);
      let typeArray = questionType.split(" ");
      let type = null;
      if (typeArray[0] == "choice") {
        type = typeArray[1];
      } else {
        type = typeArray[0];
      }
      let typeIndex = this.questionTypeIndex.findIndex((item) => {
        return item === type;
      });
      let total = 0;
      for (let i = 0; i < typeIndex; i++) {
        total += this[`${this.questionTypeIndex[i]}List`].length;
      }
      return index + 1 + total;
    },
    smallOrderBtn(questionType, index) {
      // let result = questionType.split(" ");
      let typeArray = questionType.split(" ");
      let type = null;
      if (typeArray[0] == "choice") {
        type = typeArray[1];
      } else {
        type = typeArray[0];
      }
      let typeIndex = this.questionTypeIndex.findIndex((item) => {
        return item === type;
      });
      let total = 0;
      for (let i = 0; i < typeIndex; i++) {
        total += this[`${this.questionTypeIndex[i]}List`].length;
      }
      this.activeIndex = index + total;
    },
    checkQuestionType() {
      let result = this.activeQuestion.questionType.split(" ");
      // console.log(result);
      switch (result[0]) {
        case "choice": {
          if (result[1] == "singleChoice") {
            return "单选题";
          } else {
            return "多选题";
          }
        }
        case "singleChoice": {
          return "单选题";
        }
        case "multipleChoice": {
          return "多选题";
        }
        case "judgement": {
          return "判断题";
        }
        case "completion": {
          return "填空题";
        }
        case "shortAnswer": {
          return "简答题";
        }
      }
    },
    optionClick({ studentAnswer }) {
      console.log(111111111);
      this.activeQuestion.studentAnswer = studentAnswer;
      console.log(this.activeQuestion.studentAnswer);
      // console.log(this.singleChoiceList);
    },
  },
};
</script>

<style lang="less" scoped>
.marking {
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
  .top {
    display: flex;
  }
  .title {
    font-size: 28px;
    // margin-left:60px ;
    display: inline-block;
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
}
.main {
  .main-left {
    margin-right: 20px;

    .tag-item {
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
    }

    .main-left-content {
      margin-top: 20px;
      overflow: auto;
      // margin-right: 50px;
      height: 60vh;
      .question-title {
        margin-bottom: 20px;
        overflow: hidden;
      }
      .order {
        // width: 20px;
        // height: 20px;
        padding: 2px 5px;
        background-color: #409eff;
        color: white;
        text-align: center;
        line-height: 20px;
        float: left;
        margin-right: 20px;
      }
      .btn-group {
        margin-top: 50px;
      }
    }
  }

  .main-right {
    font-size: 16px;
    .informations-left {
      margin-right: 20px;
    }
    .informations-right {
      // margin-right: 0px 20px;
      .item {
        margin: 5px 0;
      }
    }
    .question-small-order {
      margin-top: 10px;
      max-height: 50vh;
      overflow: auto;
      .lizi {
        margin-top: 10px;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        .no-mark {
          border: 1px solid #dcdfe6;
          padding: 6px 6px;
          color: #606266;
          width: 56px;
          height: 28px;
          box-sizing: border-box;
          border-radius: 4px;
        }

        .mark {
          background: #67c23a;
          color: white;
          padding: 6px 6px;
          // width: 56px;
          height: 28px;
          box-sizing: border-box;
          border-radius: 4px;
          margin-left: 10px;
        }
        .need-mark {
          background: #e6a23c;
          color: white;
        }
        .has-mark {
          background: #409eff;
          color: white;
        }
        .correct-mark {
          background: #67c23a;
          color: white;
        }
        .fail-mark {
          background: #f56c6c;
          color: white;
        }
        // .has-mark {
        //   background: #67c23a;
        //   color: white;
        //   padding: 6px 6px;
        //   width: 56px;
        //   height: 28px;
        //   box-sizing: border-box;
        //   border-radius: 4px;
        //   margin-left: 10px;
        // }
      }
      .big-item {
        margin: 20px 0;
      }
      .has-answer {
        background: #409eff;
        color: white;
      }
      .btn {
        min-width: 25px;
        // height: 25px;
        padding: 5px;
        margin: 5px;
      }
      .single-choice-title {
        margin-bottom: 10px;
      }
      .single-choice-order {
        display: flex;
        flex-wrap: wrap;
      }
      .multiple-choice-title {
        margin-bottom: 10px;
      }
      .judgement-title {
        margin-bottom: 10px;
      }
      .completion-title {
        margin-bottom: 10px;
      }
      .short-answer-title {
        margin-bottom: 10px;
      }
    }
  }
}

.tag-item {
  // position: absolute;
  // margin: auto 20px;
  top: 0;
  bottom: 0;
}
.el-select-dropdown__item {
  // line-height: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-select-dropdown {
  width: 300px !important;
}
.student-select {
  min-width: 270px;
  line-height: 1;
}
.is-true {
  background: #67c23a;
  color: white;
}
.is-false {
  background: #f56c6c;
  color: white;
}
.need-mark {
  background: #e6a23c;
  color: white;
}
.has-mark {
  background: #409eff;
  color: white;
}
</style>