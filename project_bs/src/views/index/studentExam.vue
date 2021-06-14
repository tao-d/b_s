<template>
  <div class="student-exam">
    <!-- 我是来考试的{{$route.query.examId}} -->
    <section class="top">
      <el-row>
        <el-col :span="4" class="flex">
          <div class="zxks">在线考试</div>
        </el-col>
        <el-col :span="4">
          <div class="countdown">
            <span>距离考试结束还有:</span>

            <div class="time">{{ countDownValue }}</div>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="commit-btn">
            <el-button type="warning" @click="commitExamBtn"
              >提交试卷</el-button
            >
          </div>
        </el-col>
      </el-row>
    </section>

    <section class="main">
      <el-row>
        <el-col :span="16">
          <el-card
            class="main-left"
            :body-style="{ padding: '30px' }"
            v-if="activeQuestion"
          >
            <span class="order">
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
            </div>
            <div class="question-content">
              <div
                class="single-choice"
                v-if="
                  activeQuestion &&
                  activeQuestion.questionType == 'choice singleChoice'
                "
              >
                <div class="option">
                  <exam-option
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    :optionModelValue="activeQuestion.studentAnswer"
                    :imgUrl="activeQuestion.imgUrl"
                    @clickImg="handlePaperViewPicture"
                  >
                    <!-- <template slot=""></template> -->
                  </exam-option>
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
                  <exam-option
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    :optionModelValue="activeQuestion.studentAnswer"
                    :imgUrl="activeQuestion.imgUrl"
                    @clickImg="handlePaperViewPicture"
                  >
                    <!-- <template slot=""></template> -->
                  </exam-option>
                </div>
              </div>
              <div
                class="judgement"
                v-if="
                  activeQuestion && activeQuestion.questionType == 'judgement'
                "
              >
                <div class="option">
                  <exam-option
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    :optionModelValue="activeQuestion.studentAnswer"
                    :imgUrl="activeQuestion.imgUrl"
                    @clickImg="handlePaperViewPicture"
                  >
                    <!-- <template slot=""></template> -->
                  </exam-option>
                </div>
              </div>
              <div
                class="completion"
                v-if="
                  activeQuestion && activeQuestion.questionType == 'completion'
                "
              >
                <div class="option">
                  <exam-option
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    :optionModelValue="activeQuestion.studentAnswer"
                    :imgUrl="activeQuestion.imgUrl"
                    @clickImg="handlePaperViewPicture"
                  >
                    <!-- <template slot=""></template> -->
                  </exam-option>
                </div>
              </div>
              <div
                class="short-answer"
                v-if="
                  activeQuestion && activeQuestion.questionType == 'shortAnswer'
                "
              >
                <div class="option">
                  <exam-option
                    :optionContent="activeQuestion.questionContent"
                    :optionTypeValue="activeQuestion.questionType"
                    @optionClick="optionClick"
                    :optionModelValue="activeQuestion.studentAnswer"
                    :imgUrl="activeQuestion.imgUrl"
                    @clickImg="handlePaperViewPicture"
                  >
                    <!-- <template slot=""></template> -->
                  </exam-option>
                </div>
              </div>
            </div>
            <div class="btn-group">
              <el-button-group>
                <el-button
                  type="primary"
                  icon="el-icon-arrow-left"
                  @click="preBtn"
                  :disabled="activeIndex == 0"
                  >上一题</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-arrow-left"
                  @click="nextBtn"
                  :disabled="activeIndex == listLength - 1"
                  >下一题</el-button
                >
                <!-- <el-button type="primary"
                  >下一题<i
                    class="el-icon-arrow-right el-icon--right"
                    @click="nextBtn"
                  ></i
                ></el-button> -->
              </el-button-group>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="main-right" :body-style="{ padding: '30px' }">
            <div class="title">答题卡</div>
            <div class="lizi">
              <!-- <el-button >未作答</el-button>
              <el-button style="background: #409EFF;color:white;">已作答</el-button> -->
              <div class="no-answer">未作答</div>
              <div class="has-answer">已作答</div>
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
                  :class="{ 'has-answer': item.studentAnswer }"
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
                  :class="{ 'has-answer': item.studentAnswer.length }"
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
                  :class="{ 'has-answer': item.studentAnswer.length }"
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
                  @click="smallOrderBtn(item.questionType, index)"
                  :class="{ 'has-answer': item.studentAnswer.length }"
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
                  @click="smallOrderBtn(item.questionType, index)"
                  :class="{ 'has-answer': item.studentAnswer.length }"
                  >{{ findAllOrder(item.questionType, index) }}</el-button
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
// import examOptionItem from "@/components/examOptionItem.vue";
import examOption from "@/components/examOption.vue";
export default {
  name: "studentExam",
  components: {
    examOption,
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
      //考试是否进行
      isExamingBool: true,
      //考试倒计时
      countDownValue: "",
      countDownInterval: "",
      endTime: "",
      startTime: "",
      enterTime: "",
      frontTime: "",
      diffTime: "",
      activeIndex: 0,
      activeQuestion: "",
      activeStudentAnswer: null,

      //图片
      dialogVisibleImg: false,
      dialogImageUrl: false,

      questionTypeIndex: [
        "singleChoice",
        "multipleChoice",
        "judgement",
        "completion",
        "shortAnswer",
      ],
      // singleChoiceList: [
      //   {
      //     questionType: "choice singleChoice",
      //     questionName: "通信系统必须具备的三个基本要素是",
      //     questionContent: [
      //       "终端、电缆、计算机",
      //       "信号发生器、通信线路、信号接收设备",
      //       "信源、通信媒体、信宿 ",
      //       "终端、通信设施、接收设备",
      //     ],
      //     order: 1,
      //     studentAnswer: "",
      //   },
      //   {
      //     questionType: "choice singleChoice",
      //     questionName:
      //       "随着电信和信息技术的发展，国际上出现了所谓“三网融合”的趋势，下列属于三网之一的是",
      //     questionContent: [
      //       "传统电信网",
      //       "计算机网",
      //       "有线电视网",
      //       "卫星通信网",
      //     ],
      //     order: 2,
      //     studentAnswer: "",
      //   },
      // ],
      // multipleChoiceList: [
      //   {
      //     questionType: "choice multipleChoice",
      //     questionName: "通信系统必须具备的三个基本要素是",
      //     questionContent: [
      //       "终端、电缆、计算机",
      //       "信号发生器、通信线路、信号接收设备",
      //       "信源、通信媒体、信宿 ",
      //       "终端、通信设施、接收设备",
      //     ],
      //     order: 1,
      //     studentAnswer: [],
      //   },
      //   {
      //     questionType: "choice multipleChoice",
      //     questionName:
      //       "随着电信和信息技术的发展，国际上出现了所谓“三网融合”的趋势，下列属于三网之一的是",
      //     questionContent: [
      //       "传统电信网",
      //       "计算机网",
      //       "有线电视网",
      //       "卫星通信网",
      //     ],
      //     order: 2,
      //     studentAnswer: [],
      //   },
      // ],
      // judgementList: [
      //   {
      //     questionType: "judgement",
      //     questionName: "我做的对吗",
      //     questionContent: null,
      //     order: 1,
      //     studentAnswer: "",
      //   },
      //   {
      //     questionType: "judgement",
      //     questionName:
      //       "随着电信和信息技术的发展，国际上出现了所谓“三网融合”的趋势，下列属于三网之一的是",
      //     questionContent: null,
      //     order: 2,
      //     studentAnswer: "",
      //   },
      // ],
      // completionList: [
      //   {
      //     questionType: "completion",
      //     questionName:
      //       "随着电信和信息技术的发展，国际上出现了所谓“三网融合”的趋势，下列属于三网之一的是",
      //     questionContent: [],
      //     order: 1,
      //     studentAnswer: "",
      //   },
      //   {
      //     questionType: "completion",
      //     questionName:
      //       "随着电信和信息技术的发展，国际上出现了所谓“三网融合”的趋势，下列属于三网之一的是",
      //     questionContent: [],
      //     order: 2,
      //     studentAnswer: "",
      //   },
      // ],
      // shortAnswerList: [
      //   {
      //     questionType: "shortAnswer",
      //     questionName:
      //       "随着电信和信息技术的发展，国际上出现了所谓“三网融合”的趋势，下列属于三网之一的是",
      //     questionContent: [
      //       "传统电信网",
      //       "计算机网",
      //       "有线电视网",
      //       "卫星通信网",
      //     ],
      //     order: 1,
      //     studentAnswer: "",
      //   },
      //   {
      //     questionType: "shortAnswer",
      //     questionName:
      //       "随着电信和信息技术的发展，国际上出现了所谓“三网融合”的趋势，下列属于三网之一的是",
      //     questionContent: [
      //       "传统电信网",
      //       "计算机网",
      //       "有线电视网",
      //       "卫星通信网",
      //     ],
      //     order: 2,
      //     studentAnswer: "",
      //   },
      // ],

      singleChoiceList: [],
      multipleChoiceList: [],
      judgementList: [],
      completionList: [],
      shortAnswerList: [],
    };
  },
  watch: {
    activeIndex() {
      let { typeIndex, type } = this.orderAllFind(this.activeIndex);
      this.activeQuestion = this[`${type}List`][typeIndex];
      // console.log('listLength',this.listLength);
      console.log(this.activeQuestion);
      console.log("activeIndex", this.activeIndex);
    },
    countDownValue() {
      if (this.countDownValue == "0:00") {
        // this.$alert('haha')
        // window.alert("考试结束");
        this.$alert("考试结束，已自动提交成绩", {
          confirmButtonText: "确定",
          callback: () => {},
        });
      }
    },
    isExamingBool() {},
  },
  created() {
    this.getQuery();
    this.getServerTime();
    this.getExamQuestion().then(() => {
      this.activeQuestion = this.singleChoiceList[this.activeIndex];
      this.localAnswer()
      this.getExamInformations().then(() => {
        this.countdownTest();
      });
    });
  },
mounted () {
   
},

  methods: {
    //放大图片事件
    handlePaperViewPicture(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },
    //倒计时
    countdownTest() {
      console.log(this.frontTime);
      console.log(this.endTime);
      console.log(
        this.$moment(this.endTime).diff(this.$moment(this.frontTime))
      );
      this.countDownInterval = setInterval(() => {
        this.diffTime = this.$moment(this.endTime).diff(
          this.$moment(this.frontTime)
        );
        let m = parseInt(this.diffTime / 1000 / 60);
        // console.log(m);
        let s = parseInt((this.diffTime / 1000) % 60);
        // console.log(s);
        s = s > 9 ? s : "0" + s;
        this.countDownValue = `${m}:${s}`;
        if ((m == 0 && s == 0) || !this.isExamingBool) {
          clearInterval(this.countDownInterval);
          this.commitExam();
        }
        this.frontTime = this.frontTime.add(1, "seconds");
      }, 1000);
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
    getServerTime() {
      this.$request({
        url: "/api/exam/getServerTime",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.enterTime = this.$moment(res.data.time);
        this.frontTime = this.$moment(res.data.time);
      });
    },
    // checkExamAdmin() {},
    getExamQuestion() {
      return this.$request({
        url: "/api/exam/getStudentExamQuestion",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        let data = res.data.data;
        console.log(data);
        data.forEach((item) => {
          let typeArray = item.questionType.split(" ");
          item.order = item.typeOrder;
          item.questionContent = JSON.parse(item.questionContent);
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

      });
    },
    getExamInformations() {
      return this.$request({
        url: "/api/exam/getStudentExamInformations",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        let data = res.data.data[0];
        // console.log('informations',res.data);
        this.endTime = this.$moment(data.endTime);
        this.diffTime = this.$moment(this.endTime).diff(
          this.$moment(this.frontTime)
        );
        // console.log(this.diffTime.format('mm:ss'));
        // console.log(this.$moment(this.endTime).diff(this.$moment(this.enterTime)));
        // console.log(this.endTime-);
      });
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
    getQuery() {
      console.log(this.$route.query);
    },
    commitExamBtn() {
      this.$confirm(`是否提交试卷?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.commitExam();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消提交试卷",
          });
        });
    },
    commitExam() {
      let singleChoiceList = this.singleChoiceList.map((item) => {
        return {
          questionId: item.questionId,
          studentAnswer: item.studentAnswer,
        };
      });
      let multipleChoiceList = this.multipleChoiceList.map((item) => {
        return {
          questionId: item.questionId,
          studentAnswer: item.studentAnswer,
        };
      });
      let judgementList = this.judgementList.map((item) => {
        return {
          questionId: item.questionId,
          studentAnswer: item.studentAnswer,
        };
      });
      let completionList = this.completionList.map((item) => {
        return {
          questionId: item.questionId,
          studentAnswer: item.studentAnswer,
        };
      });
      let shortAnswerList = this.shortAnswerList.map((item) => {
        return {
          questionId: item.questionId,
          studentAnswer: item.studentAnswer,
        };
      });
      this.$request({
        url: "/api/exam/commitStudentExam",
        method: "post",
        data: {
          examContent: {
            singleChoiceList,
            multipleChoiceList,
            judgementList,
            completionList,
            shortAnswerList,
          },
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        console.log(res);
        this.isExamingBool = false;
        window.localStorage.removeItem(`${this.$route.query.examId}`)
        this.$router.go(0);
      });
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
      this.activeQuestion.studentAnswer = studentAnswer;
      //本地缓存
      if(window.localStorage.getItem(`${this.$route.query.examId}`)==null)
      {
        window.localStorage.setItem(`${this.$route.query.examId}`,JSON.stringify([{
          questionId:this.activeQuestion.questionId,
          studentAnswer:this.activeQuestion.studentAnswer
        }]))
      }
      else{
        console.log('不是null');
        let result = JSON.parse(window.localStorage.getItem(`${this.$route.query.examId}`))
        let resultQuestionId = result.find(item=>item.questionId==this.activeQuestion.questionId)
        //当questionId不存在
        console.log(resultQuestionId);
        if(!resultQuestionId)
        {
          result.push({
            questionId:this.activeQuestion.questionId,
            studentAnswer:this.activeQuestion.studentAnswer
          })
        }
        else{
          resultQuestionId.studentAnswer = this.activeQuestion.studentAnswer
        }
        window.localStorage.setItem(`${this.$route.query.examId}`,JSON.stringify(result))
      }
    },
    localAnswer(){
      let result = JSON.parse(window.localStorage.getItem(`${this.$route.query.examId}`))
      if(!result){
        return
      }
      result.forEach(item=>{
        let resultItem = null
        resultItem = this.singleChoiceList.find(item1=>item1.questionId==item.questionId)
        if(resultItem)
        {
          resultItem.studentAnswer = item.studentAnswer
          return true
        }
        resultItem = this.multipleChoiceList.find(item1=>item1.questionId==item.questionId)
        if(resultItem)
        {
          resultItem.studentAnswer = item.studentAnswer
          return true
        }
        resultItem = this.judgementList.find(item1=>item1.questionId==item.questionId)
        if(resultItem)
        {
          resultItem.studentAnswer = item.studentAnswer
          return true
        }
        resultItem = this.completionList.find(item1=>item1.questionId==item.questionId)
        if(resultItem)
        {
          resultItem.studentAnswer = item.studentAnswer
          return true
        }
        resultItem = this.shortAnswerList.find(item1=>item1.questionId==item.questionId)
        if(resultItem)
        {
          resultItem.studentAnswer = item.studentAnswer
          return true
        }
      })
      
    },
    nextBtn() {
      console.log(1);
      if (this.activeIndex < this.listLength) {
        this.activeIndex++;
      }
    },
    preBtn() {
      // console.log(2);
      if (this.activeIndex > 0) {
        this.activeIndex--;
      }
    },
    closeTip() {
      let _this = this;
      window.onbeforeunload = function (e) {
        if (_this.$route.name == "examing") {
          alert(1)
          e = e || window.event;
          // 兼容IE8和Firefox 4之前的版本
          if (e) {
            e.returnValue = "关闭提示1111";
          }
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          return "关闭提示222";
        } else {
          window.onbeforeunload = null;
        }
      };
    },
  },
  beforeRouteEnter(to, from, next) {
    // console.log(this);
    next((vm) => {
      vm.$request({
        url: "/api/exam/getStudentAdmin",
        method: "post",
        data: {
          examId: vm.$route.query.examId,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          next();
        } else {
          alert(res.data.msg);
        }
      });
    });
  },
};
</script>

<style lang="less" scoped>
.student-exam {
  max-width: 1170px;
  height: 100vh;
  // background: grey;
  // border: 1px black solid;
  box-sizing: border-box;
  margin: auto;
  overflow: hidden;
  .top {
    margin: 50px 0;
    line-height: 40px;
    .countdown {
      display: flex;
      color: #303133;
      font-size: 16px;
      .time {
        margin-left: 10px;
        color: red;
      }
    }
    .flex {
      display: flex;
      justify-content: center;
      height: 40px;
    }
    .zxks {
      font-size: 18px;
      color: #606266;
      position: relative;
      &::before {
        content: "";
        display: block;
        position: absolute;
        bottom: 5px;
        left: -2px;
        height: 2px;
        width: 76px;
        background-color: #409eff;
      }
    }
  }
  .commit-btn {
    float: right;
    margin-right: 50px;
  }
  .main {
    .main-left {
      overflow: auto;
      margin-right: 50px;
      height: 70vh;
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
    .main-right {
      overflow: auto;
      height: 70vh;
      .lizi {
        margin-top: 10px;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        .no-answer {
          border: 1px solid #dcdfe6;
          padding: 6px 6px;
          color: #606266;
          width: 56px;
          height: 28px;
          box-sizing: border-box;
          border-radius: 4px;
        }
        .has-answer {
          background: rgb(64, 158, 255);
          color: white;
          padding: 6px 6px;
          width: 56px;
          height: 28px;
          box-sizing: border-box;
          border-radius: 4px;
          margin-left: 10px;
        }
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
</style>