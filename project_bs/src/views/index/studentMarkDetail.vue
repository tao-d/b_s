<template>
  <div class="view-mark-detail">
    <p class="title">成绩详情</p>
    <el-card class="card-content">
      <div class="student-informations">
        <el-card>
          <div class="exam-name">
            考试名称:
            {{ examInformations.examName }}
          </div>
          <div class="name">
            学生姓名: {{ activeStudentInformations.username}}
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
      <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import examOptionMark from "@/components/examOptionMark.vue";
export default {
  name: "studentMarkDetail",
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

                  //图片
      dialogVisibleImg: false,
      dialogImageUrl: '',
    };
  },
  created() {
          this.getExamGrade()
        .then(() => this.getExamInformations())
        .then(() => {
          this.getExamQuestion();
          // this.handleCJFB();
          // this.handleHGRS();
        });
        this.getStudentMarkingHasGrade()
        .then(() => {
          return this.getStudentMarkingDetail();
        })
        
  },
  updated(){
    console.log(this.$store.state.user.username);
  },
  methods: {
    handlePaperViewPicture(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },
    //获取学生客观题的答题情况(学生)
    getStudentMarkingHasGrade() {
      return this.$request({
        url: "/api/exam/getStudentGrade_student",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        console.log(res);
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

    //获取学生的作答详情(学生)
    getStudentMarkingDetail() {
      return this.$request({
        url: "/api/exam/getStudentMarkingDetail_student",
        method: "post",
        data: {
          examId: this.$route.query.examId,
          studentId: this.$store.state.user.userId,
        },
      }).then((res) => {

        if (res.data.code == 1) {
          this.activeStudentMaking = JSON.parse(res.data.data[0].studentmaking);
          console.log(this.activeStudentMaking);
        }
      });
    },
    
    //获取考试信息
    getExamInformations() {
      return this.$request({
        url: "/api/exam/getStudentExamInformations",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code === 1) {
          // console.log(res);
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
          this.studentGradeList = this.studentGradeList.map((item, index) => {
            return {
              ...item,
              gradeOrder: index + 1,
            };
          });
          this.studentGradeNewList = this.studentGradeList;
        }
      });
    },



    //获取考试试题（学生）
    getExamQuestion() {
      return this.$request({
        url: "/api/exam/getStudentMarkingQuestion",
        method: "post",
        data: {
          examId: this.$route.query.examId,
        },
      }).then((res) => {
        this.multipleChoiceList = [];
        this.judgementList = [];
        this.completionList = [];
        this.shortAnswerList = [];
        this.studentList = [];
        let data = res.data.data;
        console.log(res);
        // this.examInformations = {};
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
  },
};
</script>

<style lang="less" scoped>
.title {
  font-size: 28px;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 50px;
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
.card-content{
  max-width: 50vw;
}
.card-item{
  margin: 30px;
}
.student-informations{
  margin-bottom: 50px;
}
</style>