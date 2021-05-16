<template>
  <section class="exam">
    <p class="title">在线考试</p>
    <div class="exam-content">
      <exam-item
        v-for="(item, index) in examNewList"
        :key="index"
        v-bind="item"
        :ref="'item' + index"
        :data-index="index"
        @itemClick="clickExamItem"
      ></exam-item>
    </div>

    <section class="dialogVisible-detail" v-if="clickExamInformations != ''">
      <el-dialog title="确认考试信息" :visible.sync="dialogVisible" width="30%">
        <el-alert title="请核对考试信息" type="error" :closable="false"> </el-alert>
        <div class="exam-informations">
          <div class="exam-name item">
            考试名称: {{ clickExamInformations.examName }}
          </div>
          <div class="exam-time item">
            考试日期: {{ clickExamInformations.startTime }}
          </div>
          <div class="exam-time item">
            结束时间: {{ clickExamInformations.endTime }}
          </div>
          <div class="exam-duration item">
            考试时间: {{ Number(clickExamInformations.examDuration).toFixed(1) }}分钟
          </div>
          <div class="exam-mark item">考试总分: {{clickExamInformations.examMark}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="enterExam" class="enter-exam">进入考试</el-button>
        </span>
      </el-dialog>
    </section>
  </section>
</template>

<script>
import examItem from "./examItem.vue";
export default {
  name: "zxks",
  data() {
    return {
      examList: [
        {
          examName: "数学",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "已完成",
          examId: "asdasd1",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
      ],

      examNewList: [],
      dialogVisible: false,
      clickExamInformations: "",
    };
  },
  created() {
    this.getExam();
  },
  methods: {
    dialogClickTrue() {},
    getExam() {
      this.$request({
        url: "/api/exam/getStudentExamList",
        method: "get",
      }).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.examNewList = res.data.data;
          this.examNewList.sort((item1, item2) => {
            return this.$moment(item1.startTime).diff(
              this.$moment(item2.startTime),
              "seconds"
            );
          });
        }
      });
    },
    enterExam() {
      this.dialogVisible = false
      //跳转打开新页面getUrl(){
      let routeData = this.$router.resolve({
        path: "/examing",
        query: {
          examId: this.clickExamInformations.examId,
        },
      });
      window.open(routeData.href, "_blank");
    },
    async clickExamItem(exam) {
      this.$request({
        url: "/api/exam/getStudentExamPower",
        method: "post",
        data: {
          examId: exam.examId,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.clickExamInformations = exam;
          console.log(exam);
          console.log(res);
          this.dialogVisible = true;
        }
      });
      // let examStatus =
    },
  },
  components: {
    examItem,
  },
};
</script>

<style lang="less" scoped>
.exam {
  // background: grey;
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
  .exam-content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }
}
.dialogVisible-detail {
  .exam-informations {
    margin-top: 20px;
    font-size: 18px;
    .item {
      margin: 10px;
    }
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    margin-left: 10px;
    .exam-status {
      span {
        margin-right: 10px;
      }
    }
  }
  .enter-exam{
    margin-left: 50px;
  }
}
/deep/ .el-dialog__footer {
  display: flex;
  justify-content: center;
}
</style>