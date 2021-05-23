<template>
  <div class="view-exam-manager">
    <div class="exam-manager">
      <p class="title">阅卷管理</p>
      <!-- <div class="add">
        <el-button type="primary" @click="click">+添加考试</el-button>
      </div> -->
    </div>
    <section class="table">
      <el-table
        :data="
                    examNewList.slice(
            (pagination.currPage - 1) * pagination.pageSize,
            pagination.currPage * pagination.pageSize
          )
        "
        style="width: 100%"
        stripe
        border
      >
        <el-table-column
          prop="examName"
          label="考试名称"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="examMark"
          label="考试总分"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="examStudentCount"
          label="考试人数"
          align="center"
        >
        </el-table-column>
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
        </el-table-column>
        <el-table-column prop="handle" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleMarking(scope.$index, scope.row)"
              :disabled="!(scope.row.examStatus == 2)"
              >进入批阅</el-button
            >
            <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
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
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="examNewList.length"
        >
        </el-pagination>
      </div>
    </section>
    <el-dialog :visible.sync="dialogVisibleImg">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "examMarking",
  data() {
    return {
      //步骤条控制
      stepActive: 0,

      pagination: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },

      paginationClass: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },

      //试卷列表存储
      myPaperNewList: [],
      myPaperList: [],

      //班级列表
      classNewList: [],
      classList: [],

      //考试列表
      examNewList: [],
      examList: [],

      //图片
      dialogVisibleImg:false,
      dialogImageUrl:''
    };
  },
  created() {
    // this.getMyPaperList();
    // this.getClassList();
    this.getFinishExamList();
    // this.getServerTime();
  },
  methods: {
    //进入批阅按钮
    handleMarking(index,row) {
      console.log(index,row);
      this.$router.push({
        path:'/teacher/marking',
        query:{
          examId:row.examId
        }
      })
    },
    getServerTime() {
      this.$request({
        url: "/api/exam/getServerTime",
        method: "get",
      }).then((res) => {
        console.log(res);
      });
    },
    getFinishExamList() {
      this.$request({
        url: "/api/exam/getFinishExamList",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.examNewList = this.examList = res.data.data;
      });
    },
    checkExam(examStatus) {
      // console.log(new Date(startTime).getTime()-now.getTime());
      console.log(examStatus);
      if (examStatus == 2) {
        return "待批阅";
      }
      if (examStatus == 3) {
        return "已结束";
      }
    },
    checkExamTab(examStatus) {
      console.log(examStatus);
      // console.log(new Date(startTime).getTime()-now.getTime());
      if (examStatus == 2) {
        return "warning";
      }
      if (examStatus == 3) {
        return "info";
      }
    },
    click() {
      this.$router.push("/teacher/addExam");
    },
    preBtn() {
      this.stepActive = this.stepActive - 1;
    },
    handleSelectPaper(index, row) {
      console.log(index, row);
      this.$store.commit("setExamManager", row);
      this.stepActive++;
    },
    handleSelectClass(index, row) {
      console.log(index, row);
      this.$store.commit("setExamManager", row);
      this.stepActive++;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currPage = val;
    },
    getMyPaperList() {
      this.$request({
        url: "/api/paper/getPaperList",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.myPaperNewList = this.getMyPaperList = res.data.data;
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
.exam-manager {
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
  .add {
    margin-left: 20px;
    margin-top: 20px;
  }
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
}

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
}
.pre-btn {
  margin-top: 20px;
}
.zonglan {
  margin-top: 20px;
  .el-card {
    width: 45%;
  }
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