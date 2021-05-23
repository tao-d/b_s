<template>
  <div class="view-class-manager">
    <section class="class-manager">
      <p class="title">班级管理</p>
      <div class="class-manager-content">
        <div class="add">
          <el-button type="primary" @click="lookDialogVisible"
            >新建班级+</el-button
          >
        </div>
        <div class="search">
          <el-input
            v-model="courseSearch"
            placeholder="课程号/班级名"
            size="small"
          ></el-input>
          <!-- <el-input
            v-model="classNameSearch"
            placeholder="班级名"
            size="small"
          ></el-input> -->
        </div>

        <section class="table">
          <el-table
            :data="
              classNewList.slice(
                (pagination.currPage - 1) * pagination.pageSize,
                pagination.currPage * pagination.pageSize
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
              <template slot-scope="scope" class="addStudent">
                <el-row>
                  <el-col :span="16"
                    ><span>{{ scope.row.studentCount }}</span></el-col
                  >
                  <el-col :span="4">
                    <el-button
                      size="mini"
                      @click="handleAddStudent(scope.$index, scope.row)"
                      type="primary"
                      icon="el-icon-plus"
                      circle
                      class="addStudent"
                    ></el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      size="mini"
                      @click="handleStudentListDetail(scope.$index, scope.row)"
                      type="primary"
                      icon="el-icon-view"
                      circle
                      class="addStudent"
                    ></el-button>
                  </el-col>
                </el-row>
              </template>
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
                <!-- <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button
                > -->
              </template>
            </el-table-column>
            <el-table-column prop="handle" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
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
              :total="classNewList.length"
            >
            </el-pagination>
          </div>
        </section>
      </div>
    </section>
    <section class="dialogVisible">
      <el-dialog
        title="新建班级"
        :visible.sync="dialogVisible"
        id="dialogVisible"
        v-if="dialogVisible"
        top="10vh"
      >
        <div class="dialogVisible-content">
          <el-form
            class="classForm"
            status-icon
            :model="classForm"
            label-width="120px"
            ref="classForm"
            :rules="classRules"
          >
            <el-form-item
              label="课程编号"
              label-position="right"
              prop="course"
              width="180"
            >
              <el-input
                placeholder="课程编号"
                id="course"
                v-model="classForm.course"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="班级名称"
              label-position="right"
              prop="className"
              width="180"
            >
              <el-input
                placeholder="班级名称"
                id="className"
                v-model="classForm.className"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="预设人数"
              label-position="right"
              prop="classCount"
              width="180"
            >
              <el-input
                placeholder="班级预设人数"
                id="classCount"
                v-model="classForm.classCount"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              label="班级信息"
              label-position="right"
              prop="classInformations"
              width="180"
            >
              <el-input
                placeholder="班级基本信息"
                id="classInformations"
                v-model="classForm.classInformations"
                :rows="5"
                type="textarea"
                size="medium"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="btnItems" prop="btn">
              <el-button
                type="primary"
                @click="createClassBtn"
                class="createClassBtn"
                >新建班级</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <el-dialog
        title="修改班级"
        :visible.sync="dialogVisibleChange"
        id="dialogVisibleChange"
        v-if="dialogVisibleChange"
        top="10vh"
      >
        <div class="dialogVisible-content">
          <el-form
            class="classChangeForm"
            status-icon
            :model="classChangeForm"
            label-width="120px"
            ref="classChangeForm"
            :rules="classRules"
          >
            <el-form-item
              label="课程编号"
              label-position="right"
              prop="course"
              width="180"
            >
              <el-input
                placeholder="课程编号"
                id="course"
                v-model="classChangeForm.course"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="班级名称"
              label-position="right"
              prop="className"
              width="180"
            >
              <el-input
                placeholder="班级名称"
                id="className"
                v-model="classChangeForm.className"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="预设人数"
              label-position="right"
              prop="classCount"
              width="180"
            >
              <el-input
                placeholder="班级预设人数"
                id="classCount"
                v-model="classChangeForm.classCount"
                type="text"
                size="medium"
              >
              </el-input>
            </el-form-item>

            <el-form-item
              label="班级信息"
              label-position="right"
              prop="classInformations"
              width="180"
            >
              <el-input
                placeholder="班级基本信息"
                id="classInformations"
                v-model="classChangeForm.classInformations"
                :rows="5"
                type="textarea"
                size="medium"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="btnItems" prop="btn">
              <el-button
                type="primary"
                @click="saveBtn('classChangeForm')"
                class="changeClass"
                >修改</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <el-dialog
        title="修改学生"
        :visible.sync="dialogVisibleAddStudent"
        id="dialogVisibleAddStudent"
        v-if="dialogVisibleAddStudent"
        top="10vh"
      >
        <div class="dialogVisible-content">
          <el-transfer
            v-loading="!(transferList.length > 0)"
            v-model="transferListValue"
            :data="transferList"
            :filterable="true"
            :filter-method="filterMethod"
            :titles="['其他学生', '本班学生']"
            :button-texts="['去除', '添加']"
          ></el-transfer>
          <div class="changeClassStudent-content">
            <el-button
              type="primary"
              @click="saveMyClassStudent()"
              class="changeClassStudent"
              >修改</el-button
            >
          </div>
        </div>
      </el-dialog>

      <el-dialog
        title="班级学生详情"
        :visible.sync="dialogVisibleStudentDetail"
        id="dialogVisibleStudentDetail"
        v-if="dialogVisibleStudentDetail"
        class="abow_dialog"
        top="10vh"
      >
        <div class="search">
          <el-input
            size="mini"
            v-model="studentDetailSearch"
            placeholder="输入关键字搜索"
          ></el-input>
        </div>
        <el-table
          :data="studentDetailNewList"
          style="width: 100%"
          stripe
          border
          height="500"
        >
          <el-table-column
            prop="account"
            label="学号"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="classOrder"
            label="班级序号"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="sex" label="性别" align="center">
          </el-table-column>
          <el-table-column
            prop="role"
            label="身份"
            align="center"
            class="addStudent"
          >
          </el-table-column>
          <el-table-column prop="createTime" label="加入时间" align="center">
          </el-table-column>
        </el-table>
      </el-dialog>
    </section>
  </div>
</template>

<script>
export default {
  name: "classManager",
  data() {
    var validatePass1 = (rule, value, callback) => {
      let regExp = /\d+/g;
      if (!regExp.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      //穿梭框的过滤方法
      filterMethod(query, item) {
        // console.log(query);
        // console.log(item);
        let regExp = new RegExp(query);
        console.log(regExp.test(item.label));
        return regExp.test(item.label);
      },
      classRules: {
        course: [
          {
            trigger: "blur",
            required: true,
            message: "必填",
          },
        ],
        className: [{ trigger: "blur", required: true, message: "必填" }],
        classCount: [{ trigger: "blur", validator: validatePass1 }],
        classInformations: [{ trigger: "blur" }],
      },
      passwordForm: {
        oldPassword: ``,
        newPassword: ``,
        secondPassword: ``,
        message: ``,
      },
      courseSearch: null,
      classNameSearch: null,

      //控制弹窗出现
      dialogVisible: false,
      dialogVisibleChange: false,
      dialogVisibleAddStudent: false,
      dialogVisibleStudentDetail: false,

      //分页组件数据
      pagination: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },

      //新建班级表单
      classForm: {
        course: "",
        className: "",
        classInformations: "",
        classCount: null,
      },
      //修改班级信息表单
      classChangeForm: {
        course: "",
        className: "",
        classInformations: "",
        classCount: null,
      },

      //修改班级学生成员
      classNewList: [],
      classList: [],

      //班级成员详细
      studentDetailNewList: [],
      studentDetailList: [],
      studentDetailSearch: "",

      //穿梭框
      transferList: [],
      transferListValue: [],

      transferActiveClassId: null,

      transferValue: "",

      tableData: [
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          course: "2016-05-02",
          className: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },
  created() {
    this.getClassList();
  },
  updated() {},
  watch: {
    studentDetailSearch(val) {
      // console.log(val);
      let regexp = new RegExp(val);
      this.studentDetailNewList = this.studentDetailList.filter(
        (item) => regexp.test(item.username) || regexp.test(item.account)
      );
    },
    courseSearch(val) {
      let regexp1 = new RegExp(val);
      // let regexp2 = new RegExp(this.classNameSearch)
      this.classNewList = this.classList.filter(
        (item) => regexp1.test(item.course) || regexp1.test(item.className)
      );
      console.log(this.classNewList);
    },
    // classNameSearch(val){
    //   // console.log(val);
    //   let regexp2 = new RegExp(val)
    //   let regexp1 = new RegExp(this.courseSearch)
    //   this.classNewList = this.classList.filter( item => regexp1.test(item.course)||regexp2.test(item.className));
    //   console.log(this.classNewList);
    // }
  },
  methods: {
    //获取教师所属班级列表
    getClassList() {
      this.$request({
        url: "/api/class/getMyClassList",
        method: "get",
      }).then((res) => {
        console.log(res.data);
        this.classNewList = this.classList = res.data.data;
      });
    },

    //获取自己班级的学生详情(穿梭框)
    getMyClassStudents(obj) {
      this.$request({
        url: "/api/class/getClassStudent",
        post: "get",
        params: {
          classId: obj.classId,
        },
      }).then((res) => {
        console.log(res.data);
        //初始化穿梭框数据
        this.transferList = [];
        this.transferListValue = [];
        this.transferActiveClassId = obj.classId;
        res.data.forEach((item, index) => {
          this.transferList.push({
            data: {
              account: item.account,
              studentId: item.userId,
            },
            key: index,
            label: `${item.username} ${item.account}`,
          });
          if (item.thisClass) {
            this.transferListValue.push(index);
          }
        });
      });
    },

    //获取自己班级的学生详情（table）
    getMyClassStudentDetail(obj) {
      this.$request({
        url: "/api/class/getMyClassStudentDetail",
        method: "get",
        params: {
          classId: obj.classId,
        },
      }).then((res) => {
        console.log(res.data);
        this.studentDetailNewList = this.studentDetailList = res.data.map(
          (item) => {
            // let d = new Date(item.createTime)
            return {
              account: item.account,
              sex: item.sex === 0 ? "男" : "女",
              username: item.username,
              role: item.role === 0 ? "学生" : "教师",
              classOrder: item.classOrder,
              // createTime:`${d.getFullYear()}-${d.getMonth()}-${d.getDate()-1} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
              createTime: this.$moment(item.createTime).format(
                "YYYY-MM-DD mm:ss"
              ),
            };
          }
        );
      });
    },

    //修改班级成员
    saveMyClassStudent() {
      let studentData = this.transferListValue.map((item) => {
        return this.transferList[item];
      });
      this.$request({
        url: "/api/class/changeMyClassStudent",
        method: "post",
        data: {
          studentData: studentData,
          classId: this.transferActiveClassId,
        },
      })
        .then((res) => {
          if (res.data.code == 1) {
            this.$notify({
              title: "修改成功",
              message: "班级成员修改成功",
              duration: 3000,
              type: "success",
            });
          }
          this.dialogVisibleAddStudent = false;
          this.getClassList();
        })
        .catch(() => {
          this.$notify({
            title: "修改失败",
            message: "班级成员修改失败",
            duration: 3000,
            type: "danger",
          });
        });
    },

    //获取学生（没有使用）
    getStudents() {
      this.$request({
        url: "/api/class/getStudent",
        post: "get",
      });
    },

    //新建按钮切换dialog
    lookDialogVisible() {
      this.dialogVisible = true;
    },

    //修改班级事件
    changeClass() {
      this.$request({
        url: "/api/class/updateClass",
        method: "post",
        data: {
          classId: this.classChangeForm.classId,
          course: this.classChangeForm.course,
          className: this.classChangeForm.className,
          classCount: Number(this.classChangeForm.classCount),
          classInformations: this.classChangeForm.classInformations,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "修改成功",
            message: "班级信息修改成功",
            duration: 3000,
            type: "success",
          });
          this.getClassList();
          this.dialogVisibleChange = false;
        } else {
          this.$notify({
            title: "修改失败",
            message: "班级信息修改失败",
            duration: 3000,
            type: "error",
          });
        }
      });
    },

    //添加学生按钮
    // addStudentBtn() {},
    handleAddStudent(index, row) {
      // console.log(index);
      // console.log(row);
      this.dialogVisibleAddStudent = true;
      this.getMyClassStudents(row);
    },

    //查看班级成员细节
    handleStudentListDetail(index, row) {
      this.dialogVisibleStudentDetail = true;
      this.getMyClassStudentDetail(row);
    },

    saveBtn(FormName) {
      this.$refs[FormName].validate((validate) => {
        if (validate) {
          this.changeClass();
        } else {
          // console.log("submit error");
          //  this.$message({
          //   message: '请完善表格',
          //   type: 'warning'
          // });
          return false;
        }
      });
    },

    //修改表项
    handleEdit(index, row) {
      // console.log(index, row);
      this.classChangeForm = JSON.parse(JSON.stringify(row));

      //出现修改班级信息弹窗
      this.dialogVisibleChange = true;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将该班级信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$request({
            url: "/api/class/deleteClass",
            method: "post",
            data: {
              classId: row.classId,
            },
          }).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            }
            console.log(this);
            console.log(this.getClassList);
            this.getClassList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currPage = val;
    },

    //新建班级按钮事件
    createClassBtn() {
      this.$request({
        url: "/api/class/createClass",
        method: "post",
        data: {
          course: this.classForm.course,
          classStatus: 0,
          className: this.classForm.className,
          classCount: this.classForm.classCount,
          classInformations: this.classForm.classInformations,
        },
      }).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: "新建成功",
            message: "新建班级成功",
            duration: 3000,
            type: "success",
          });
          this.dialogVisible = false
          this.getClassList()
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.class-manager {
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
  .class-manager-content {
    // margin: 0 50px;
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
}
.dialogVisible {
  width: 100px;
  .dialogVisible-content {
    // width: 500px;
    margin: 0 20px 0;
    // display: flex;
    // flex-direction: column;
  }
  .btnItems {
    display: flex;
    justify-content: center;
  }
}
#dialogVisibleAddStudent {
  .el-transfer {
    display: flex;
    justify-content: center;
    align-items: center;
    /deep/.el-input {
      width: auto;
      // margin-left: 20px;
    }
  }
  .changeClassStudent-content {
    margin-top: 20px;
    text-align: center;
  }
  .changeClassStudent {
    // margin:  auto;
    // display: block;
    text-align: center;
  }
}
#dialogVisibleStudentDetail {
  .search {
    margin-bottom: 20px;
    /deep/ .el-input {
      width: 200px;
    }
    /deep/ .el-input__inner {
      width: 178px;
      margin-left: 20px;
    }
  }
}
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
  .el-dialog {
    margin: 0 auto !important;
    height: 90%;
    height: 500px;
    overflow: hidden;
    .el-dialog__body {
      position: absolute;
      left: 0;
      top: 54px;
      bottom: 0;
      right: 0;
      padding: 0;
      z-index: 1;
      overflow: hidden;
      overflow-y: auto;
    }
  }
}

//修改穿梭框样式
/deep/ .el-transfer-panel__list.is-filterable {
  width: 300px !important;
  height: 50vh !important;
}

/deep/ .el-transfer-panel {
  width: 300px !important;
  height: 50vh !important;
  overflow-y: auto;
}
//班级休息选项行省略号
.class-informations-row {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>