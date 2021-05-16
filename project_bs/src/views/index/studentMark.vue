<template>
  <div class="view-student-mark">
    <section class="student-mark">
      <p class="title">历史考试</p>
    </section>
        <section class="table">
      <el-table
        :data="
          examMarkNewList.slice(
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
          prop="studentGrade"
          label="我的成绩"
          align="center"
          class="addStudent"
        >
          <!-- <template slot-scope="scope" class="addStudent">
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
              </template> -->
        </el-table-column>
        <el-table-column prop="examStatus" label="考试状态" align="center" class="tags">
          <template slot-scope="scope">
            <el-tag
              :type="checkExamTab(scope.row.examStatus)"
              >{{ checkExam(scope.row.examStatus) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="handle" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleStudentMark(scope.$index, scope.row)" :disabled='!(scope.row.examStatus==3)' type="primary"
              >查看成绩</el-button
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
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="examMarkNewList.length"
        >
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name:'studentMark',
  data(){
    return{
      pagination: {
        currentPage: 1,
        pageSize: 10, //每页数据条数
        currPage: 1, //当前页数
      },

      examMarkList:[],
      examMarkNewList:[],
    }
  },
  created(){
    this.getStudentExam()
  },
  methods:{
    //获取exam状态为完成（结束时间已过的）
    getStudentExam(){
      this.$request({
        url:'/api/exam/getStudentFinishExamList',
        method:'get',
      }).then(res=>{
        console.log(res);
        this.examMarkList = this.examMarkNewList = res.data.data
      })
    },
    handleStudentMark(index,row){
      console.log(index);
      console.log(row);
      this.$router.push({
        path: "/index/studentMarkDetail",
        query: {
          examId: row.examId,
        },
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pagination.currPage = val;
    },
    checkExam(examStatus) {
      if (examStatus==2) {
        return "等待批阅中";
      }
      if (examStatus==3) {
        return "批阅结束";
      }
    },
    checkExamTab(examStatus) {
      if (examStatus==2) {
        return "warning";
      }
      if (examStatus==3) {
        return "success";
      }
    },
  }
}
</script>

<style lang="less" scoped>
.student-mark{
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
}
    .table {
      margin: 20px;
      .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }
      .tags {
        display: flex;
        justify-content: center;
      }
      // span {
      //   margin-right: 50px;
      // }
    }
</style>