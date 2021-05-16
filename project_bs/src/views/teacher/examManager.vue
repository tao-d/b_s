<template>
  <div class="view-exam-manager">
    <div class="exam-manager">
      <p class="title">考试管理</p>
      <div class="add">
        <el-button type="primary" @click="click">+添加考试</el-button>
      </div>
      <div class="search">
        <el-input
          v-model="examSearch"
          placeholder="考试名称"
          size="small"
        ></el-input>
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
            prop="passMark"
            label="通过分数"
            align="center"
            class="addStudent"
          >
          </el-table-column>
          <el-table-column
            prop="examStudentCount"
            label="开始时间"
            align="center"
          >
            <template slot-scope="scope">
              {{ $moment(scope.row.startTime).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column
            prop="examStudentCount"
            label="结束时间"
            align="center"
          >
            <template slot-scope="scope">
              {{ $moment(scope.row.endTime).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="examStatus" label="考试状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="checkExamTab(scope.row.examStatus)">{{
                checkExam(scope.row.examStatus)
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="handle"
            label="操作"
            align="center"
            min-width="200px"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleClose(scope.row)"
                :disabled="
                  scope.row.examStatus > 1 || scope.row.examStatus == -1
                "
                >关闭</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="handleOpen(scope.row)"
                :disabled="scope.row.examStatus != -1"
                >开启</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                :disabled="scope.row.examStatus != -1"
                >编辑考试</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                :disabled="(scope.row.examStatus == 0 || scope.row.examStatus==1)"
                >删除</el-button
              >
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
            :total="examNewList.length"
          >
          </el-pagination>
        </div>
      </section>
    </div>

    <el-dialog
      title="修改考试信息"
      :visible.sync="dialogVisibleChange"
      id="dialogVisibleChange"
      v-if="dialogVisibleChange"
      top="10vh"
    >
      <div class="dialogVisible-content">
        <el-form
          class="examForm"
          status-icon
          :model="examForm"
          label-width="120px"
          ref="examForm"
        >
          <el-form-item
            label="考试开始时间"
            label-position="right"
            prop="startTime"
            width="180"
          >
            <el-date-picker
              v-model="examForm.startTime"
              type="datetime"
              placeholder="选择考试开始"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="考试结束时间"
            label-position="right"
            prop="endTime"
            width="180"
          >
            <el-date-picker
              v-model="examForm.endTime"
              :picker-options="pickerOptions"
              type="datetime"
              placeholder="选择考试结束"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="考试名称"
            label-position="right"
            prop="examName"
            width="180"
          >
            <el-input v-model="examForm.examName"></el-input>
          </el-form-item>

          <el-form-item
            label="通过分数"
            label-position="right"
            prop="passMark"
            width="180"
          >
            <el-input v-model="examForm.passMark"></el-input>
          </el-form-item>

          <el-form-item class="btnItems" prop="btn">
            <el-button type="primary" @click="saveBtn()" class="changeClass"
              >修改</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "examManager",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    var mustNumberPass = (rule, value, callback) => {
      let RegExp = /[0-9]+/g;
      console.log(value);
      if (!RegExp.test(value)) {
        callback(new Error("不能为空且为数字"));
      } else {
        callback();
      }
    };
    return {

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },

      examChangeRules: {
        startTime: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        endTime: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        examName: [
          { validator: validatePass, trigger: "blur", required: true },
        ],
        passMark: [
          { validator: mustNumberPass, trigger: "blur", required: true },
        ],
      },

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

      examForm: {
        examId: "",
        startTime: "",
        endTime: "",
        examName: "",
        passMark: "",
      },
      //考试名称搜索
      examSearch:'',

      //控制弹窗
      dialogVisibleChange: false,

      //图片
      dialogImageUrl :'',
      dialogVisibleImg:false,

      paperView: [],
    };
  },
  created() {
    this.getMyPaperList();
    this.getClassList();
    this.getMyExam();
    this.getServerTime();
  },
  methods: {

    getServerTime() {
      this.$request({
        url: "/api/exam/getServerTime",
        method: "get",
      }).then((res) => {
        console.log(res);
      });
    },
    getMyExam() {
      this.$request({
        url: "/api/exam/getMyExamList",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.examNewList = this.examList = res.data.data;
      });
    },
    checkExam(examStatus) {
      // console.log(new Date(startTime).getTime()-now.getTime());
      // let now = new Date();
      if (examStatus == 1) {
        return "进行中";
      }
      if (examStatus == 0) {
        return "未开始";
      }
      if (examStatus == 3) {
        return "已结束";
      }
      if (examStatus == 2) {
        return "待批阅";
      }
      if (examStatus == -1) {
        return "关闭";
      }
    },
    checkExamTab(examStatus) {
      // console.log(new Date(startTime).getTime()-now.getTime());
      // let now = new Date();
      if (examStatus == -1) {
        return "danger";
      }
      if (examStatus == 0) {
        return "info";
      }
      if (examStatus == 1) {
        return "primary";
      }
      if (examStatus == 2) {
        return "warning";
      }
      if (examStatus == 3) {
        return "success";
      }
    },
    click() {
      this.$router.push("/teacher/addExam");
    },
    preBtn() {
      this.stepActive = this.stepActive - 1;
    },
     handlePaperViewPicture(url) {
      this.dialogImageUrl = url;
      this.dialogVisibleImg = true;
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
    handleOpen(row) {
      this.$request({
        url: "/api/exam/openExam",
        method: "post",
        data: {
          ...row,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "开启成功",
            message: "考试开启成功",
            duration: 3000,
            type: "success",
          });
          this.$nextTick(() => {
            this.getMyExam();
          });
        }
      });
    },
    handleClose(row) {
      // console.log(row);
      this.$request({
        url: "/api/exam/closeExam",
        method: "post",
        data: {
          ...row,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "关闭成功",
            message: "考试关闭成功",
            duration: 3000,
            type: "success",
          });
          this.$nextTick(() => {
            this.getMyExam();
          });
        }
      });
    },
    handleEdit(row) {
      this.examForm.examId = row.examId;
      this.examForm.startTime = row.startTime;
      this.examForm.endTime = row.endTime;
      this.examForm.examName = row.examName;
      this.examForm.passMark = row.passMark;
      this.dialogVisibleChange = true;
    },
    handleDelete(row) {
      this.$confirm("是否删除该考试?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/api/exam/deleteExam",
            method: "post",
            data: {
              ...row,
            },
          }).then((res) => {
            if (res.data.code == 1) {
              this.$notify({
                title: "关闭成功",
                message: "考试关闭成功",
                duration: 3000,
                type: "success",
              });
              this.$nextTick(() => {
                this.getMyExam();
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除考试",
          });
        });
    },
    saveBtn() {
      this.$refs["examForm"].validate((validate) => {
        if (validate) {
          this.updateExamInformations();
        } else {
          console.log("error");
          return false;
        }
      });
    },
    updateExamInformations() {
      this.$request({
        url: "/api/exam/updateExam",
        method: "post",
        data: {
          // ...this.examForm,
          examId: this.examForm.examId,
          startTime: this.examForm.startTime,
          endTime: this.examForm.endTime,
          examName: this.examForm.examName,
          passMark: this.examForm.passMark,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "开启成功",
            message: "考试开启成功",
            duration: 3000,
            type: "success",
          });
          this.$nextTick(() => {
            this.getMyExam();
          });
        }
      });
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
  }
}
.search {
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  /deep/ .el-input {
    width: 200px;
  }
  /deep/ .el-input__inner {
    width: 178px;
    margin-left: 20px;
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