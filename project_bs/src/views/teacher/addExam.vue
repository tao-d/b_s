<template>
  <div class="exam-manager">
    <div class="exam-steps"></div>
    <el-steps :active="stepActive" simple>
      <el-step title="选择试卷" icon="el-icon-edit"></el-step>
      <el-step title="选择班级" icon="el-icon-edit"></el-step>
      <el-step title="考试补充" icon="el-icon-edit"></el-step>
    </el-steps>
    <div class="back" v-if="stepActive == 0">
      <el-button @click="back" type="primary"> 返回 </el-button>
    </div>
    <div class="pre-btn" v-if="stepActive > 0">
      <el-button @click="preBtn" type="primary"> 上一步 </el-button>
    </div>
    <div class="zonglan">
      <el-card class="paper-card" v-if="stepActive >= 1">
        <div slot="header" class="clearfix">
          <span class="header-text">试卷选择</span>
        </div>
        <div class="card-item">
          试卷名称:{{ examForm.paperInformations.paperName }}
        </div>
        <div class="card-item">
          试卷总分:{{ examForm.paperInformations.paperMark }}分
        </div>
        <div class="card-item">
          通过分数:{{ examForm.paperInformations.passMark }}分
        </div>
      </el-card>
      <el-card class="class-card" v-if="stepActive >= 2">
        <div slot="header" class="clearfix">
          <span class="header-text">班级选择</span>
        </div>
        <div class="card-item">
          班级名称:{{ examForm.classInformations.className }}
        </div>
        <div class="card-item">
          班级人数:{{ examForm.classInformations.studentCount }}人
        </div>
        <!-- <div class="card-item">
          通过分数:{{ examForm.paperInformations.passMark }}分
        </div> -->
      </el-card>
    </div>

    <section class="table select-paper" v-if="stepActive == 0" key="paper">
      <el-table
        :data="
          myPaperNewList.slice(
            (paginationPaper.currPage - 1) * paginationPaper.pageSize,
            paginationPaper.currPage * paginationPaper.pageSize
          )
        "
        style="width: 100%"
        stripe
        v-if="stepActive == 0"
      >
        <el-table-column type="expand">
          <template slot-scope="propsPaper">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="选择题数量">
                <span>{{ propsPaper.row.choiceCount }}</span>
              </el-form-item>
              <el-form-item label="单选题数量">
                <span>{{ propsPaper.row.singleChoiceCount }}</span>
              </el-form-item>
              <el-form-item label="多选题数量">
                <span>{{ propsPaper.row.multipleChoiceCount }}</span>
              </el-form-item>
              <el-form-item label="判断题数量">
                <span>{{ propsPaper.row.judgementCount }}</span>
              </el-form-item>
              <el-form-item label="填空题数量">
                <span>{{ propsPaper.row.completionCount }}</span>
              </el-form-item>
              <el-form-item label="简答题数量">
                <span>{{ propsPaper.row.shortAnswerCount }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="paperName"
          label="试卷题目"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="getPaperDetail(scope.row)">{{
              scope.row.paperName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="paperType"
          label="试卷类型"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="questionCount"
          label="题目数量"
          align="center"
        ></el-table-column>
        <el-table-column prop="paperMark" label="试卷总分" align="center">
        </el-table-column>
        <el-table-column
          prop="passMark"
          label="通过分数"
          align="center"
          class="passMark"
        >
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center">
        </el-table-column>
        <el-table-column prop="paperStatus" label="试卷状态" align="center">
        </el-table-column>
        <el-table-column prop="paperStatus" label="试卷操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleSelectPaper(scope.$index, scope.row)"
              plain
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChangePaper"
          @current-change="handleCurrentChangePaper"
          :current-page="paginationPaper.currPage"
          :page-sizes="[10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="myPaperNewList.length"
        >
        </el-pagination>
      </div>
    </section>

    <section class="table select-class" v-if="stepActive == 1" key="class">
      <el-table
        :data="
          classNewList.slice(
            (paginationClass.currPage - 1) * paginationClass.pageSize,
            paginationClass.currPage * paginationClass.pageSize
          )
        "
        style="width: 100%"
        stripe
        border
      >
        <el-table-column
          prop="course"
          label="课程号"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="className"
          label="班级名"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="classCount" label="预设人数" align="center">
        </el-table-column>
        <el-table-column
          prop="studentCount"
          label="实际人数"
          align="center"
          class="addStudent"
        >
        </el-table-column>
        <el-table-column
          prop="classInformations"
          label="班级信息"
          align="center"
        >
          <template slot-scope="scope">
            <span class="class-informations-row">{{
              scope.row.classInformations
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paperStatus" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleSelectClass(scope.$index, scope.row)"
              plain
              >选择</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChangeClass"
          @current-change="handleCurrentChangeClass"
          :current-page="paginationClass.currPage"
          :page-sizes="[10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="classNewList.length"
        >
        </el-pagination>
      </div>
    </section>

    <section class="exam-append" v-if="stepActive == 2">
      <p class="title">补充信息</p>
      <div class="block">
        <div class="start-time">
          <span class="demonstration">考试开始时间：</span>
          <el-date-picker
            v-model="startTime"
            type="datetime"
            placeholder="选择考试开始"
          >
          </el-date-picker>
        </div>
        <div class="end-time">
          <span class="demonstration">考试结束时间：</span>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="选择考试结束"
            :picker-options="pickerOptions"
            
          >
          </el-date-picker>
        </div>
        <div class="pass-mark">
          通过分数：<el-input
            v-model="examForm.paperInformations.passMark"
          ></el-input>
        </div>
        <div class="exam-name">
          考试名称：<el-input v-model="examForm.examName"></el-input>
        </div>

        <el-button
          type="primary"
          plain
          @click="createExam"
          size="large"
          class="create-exam-btn"
          :loading="createExamLoading"
          >生成考试</el-button
        >
      </div>
    </section>

    <section class="dia">
      <el-dialog
        title="试卷预览"
        :visible.sync="dialogVisiblePaperView"
        id="dialogVisiblePaperView"
        v-if="dialogVisiblePaperView"
        top="10vh"
        class="abow_dialog dialogVisiblePaperView"
      >
        <paper-view
          :dataList="paperView"
          :paperInformations="paperViewInformations"
          @clickImg="handlePaperViewPicture"
        ></paper-view>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisibleImg">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </section>
  </div>
</template>

<script>
import paperView from "../teacher/paperView.vue";
export default {
  name: "examManager",
  components: {
    paperView,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },


      paperViewInformations: {
        paperTeacher: "荷和",
        paperName: "计算机科学与技术",
        paperMark: 0,
        // paperTime: 120,
      },

      //paperViewDia控制
      dialogVisiblePaperView: false,

      //图片
      dialogImageUrl: "",
      dialogVisibleImg: false,

      paperView: [],

      //时间控制
      value1: "",
      startTime: "",
      endTime: "",

      //步骤条控制
      stepActive: 0,

      paginationPaper: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },

      paginationClass: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },
      //试卷信息存储
      examForm: {
        examName: "exam",
        paperInformations: {
          paperId: "",
          paperName: "",
          paperMark: "",
          passMark: "",
        },
        classInformations: {
          classId: "",
          className: "",
          studentCount: "",
        },
        // otherInformations: {},
      },

      //试卷列表存储
      myPaperNewList: [],
      myPaperList: [],

      //班级列表
      classNewList: [],
      classList: [],

      //生成考试按钮的loading
      createExamLoading: false,
    };
  },
  created() {
    this.getMyPaperList();
    this.getClassList();
  },
  activated() {
    this.getMyPaperList();
    this.getClassList();
  },
  methods: {
    setPaperViewInformations(row) {
      // console.log(row);
      // console.log(this.$store.state.user);
      this.$set(
        this.paperViewInformations,
        "paperTeacher",
        this.$store.state.user.username
      );
      this.$set(this.paperViewInformations, "paperName", row.paperName);
      this.$set(this.paperViewInformations, "paperMark", row.paperMark);
      // this.$set(this.paperViewInformations, "paperTime", 120);
    },
    handlePaperViewPicture(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
    },
    getPaperQuestion(row) {
      // this.treeReset();
      console.log("treeReset");
      this.$request({
        url: "/api/paper/getPaperQuestion",
        method: "post",
        data: {
          paperId: row.paperId,
        },
      }).then((res) => {
        let data = res.data.data;
        this.paperView = data;
        console.log(this.paperView);
        data.forEach((item) => {
          // console.log(item);
          // item.id = index;
          // console.log(item.answer);
          item.answer = JSON.parse(item.answer);
          // console.log(item.questionContent);
          item.questionContent = JSON.parse(item.questionContent);

          item.imgUrl = JSON.parse(item.imgUrl);
        });
      });
    },
    //生成考试事件
    createExam() {
      if (this.startTime == "" && this.endTime == "") {
        this.$alert("考试时间不能为空！", "信息错误", {
          confirmButtonText: "确定",
        });
        return;
      }
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.$alert("考试时间错误！", "信息错误", {
          confirmButtonText: "确定",
        });
        return;
      }
      if (this.examForm.paperInformations.passMark == "") {
        this.$alert("请设定通过分数！", "信息错误", {
          confirmButtonText: "确定",
        });
        return;
      }
      this.createExamLoading = true;
      this.$request({
        url: "/api/exam/createExam",
        method: "post",
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          examMark: Number(this.examForm.paperInformations.paperMark),
          passMark: Number(this.examForm.paperInformations.passMark),
          classId: this.examForm.classInformations.classId,
          paperId: this.examForm.paperInformations.paperId,
          examName: this.examForm.examName,
          examStatus: 0,
        },
      }).then((res) => {
        console.log(res);
        //按钮的loading设置为false
        this.createExamLoading = false;
        if (res.data.code == 1) {
          this.$notify({
            title: "新建考试",
            message: "新建考试成功",
            duration: 3000,
            type: "success",
          });
        } else {
          this.$notify({
            title: "新建考试",
            message: "新建考试失败",
            duration: 3000,
            type: "error",
          });
        }
      });
    },

    getPaperDetail(row) {
      console.log(row);
      this.getPaperQuestion(row);
      this.setPaperViewInformations(row);
      this.dialogVisiblePaperView = true;
    },
    back() {
      this.$router.push("/teacher/examManager");
    },
    nextBtn() {
      this.stepActive = this.stepActive + 1;
      this.getMyPaperList();
    },
    preBtn() {
      this.stepActive = this.stepActive - 1;
    },
    handleSelectPaper(index, row) {
      console.log(index, row);
      // this.$store.commit('setExamManager',row)
      this.examForm.paperInformations.paperId = row.paperId;
      this.examForm.paperInformations.paperName = row.paperName;
      this.examForm.paperInformations.paperMark = row.paperMark;
      this.examForm.paperInformations.passMark = row.passMark;
      console.log(this.examForm.paperInformations);
      this.stepActive++;
    },
    handleSelectClass(index, row) {
      console.log(index, row);
      this.examForm.classInformations.className = row.className;
      this.examForm.classInformations.studentCount = row.studentCount;
      this.examForm.classInformations.classId = row.classId;
      // this.$store.commit('setExamManager',row)
      // this.examForm.paperInformations.this.stepActive++;
      this.stepActive++;
    },
    handleSizeChangePaper(val) {
      this.pagination.pageSize = val;
    },
    handleSizeChangeClass(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChangePaper(val) {
      this.pagination.currPage = val;
    },
    handleCurrentChangeClass(val) {
      this.pagination.currPage = val;
    },
    getMyPaperList() {
      console.log("getMyPaperList");
      this.$request({
        url: "/api/paper/getPaperList",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.myPaperNewList = this.myPaperNewList = res.data.data;
      });
    },

    getClassList() {
      this.$request({
        url: "/api/class/getMyClassList",
        method: "get",
      }).then((res) => {
        console.log(res.data);
        this.classNewList = this.classList = res.data.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.table {
  margin: 20px;
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .addStudent {
    display: flex;
  }
  span {
    margin-right: 50px;
  }
}
.back {
  margin-top: 20px;
}
.pre-btn {
  margin-top: 20px;
  margin-left: 20px;
}
.zonglan {
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  .el-card {
    width: 45%;
  }
  .card-item {
    margin: 10px 0;
  }
  .header-text {
    font-size: 24px;
  }
}
.block {
  width: 100%;
  height: 20vh;
  // border:
}
.exam-append {
  margin-top: 30px;
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
  .start-time {
    margin: 10px 0;
  }
  .end-time {
    margin: 10px 0;
  }
  .create-exam-btn {
    margin-top: 20px;
  }
  .pass-mark {
    // width: 300px;
    display: flex;
    align-items: center;
    margin-left: 30px;
    margin-bottom: 10px;
    /deep/ .el-input__inner {
      width: 220px;
    }
    /deep/ .el-input {
      width: 220px;
    }
  }
  .exam-name {
    // width: 300px;
    display: flex;
    align-items: center;
    margin-left: 30px;
    margin-bottom: 10px;
    /deep/ .el-input__inner {
      width: 220px;
    }
    /deep/ .el-input {
      width: 220px;
    }
  }
}
//班级休息选项行省略号
.class-informations-row{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>