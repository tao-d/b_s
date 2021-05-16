<template>
  <div class="exam-item" @click="testEmit">
    <!-- <img src="../../assets/exam.png" alt="" />
    <div class="exam-informations">
      <div class="exam-name">考试科目: {{examName}}</div>
      <div class="exam-time">考试日期: {{examTime}}</div>
      <div class="exam-duration">考试时间: {{examDuration}}</div>
      <div class="exam-status">
        <span>考试状态:</span>
        <el-tag :type="examStatusType()" size="small" effect="plain"> {{examStatus}} </el-tag>
      </div>
    </div> -->
     <el-card :body-style="{ padding: '5px' }">
      <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
      <div style="padding: 14px;">
        <span>好吃的汉堡</span>
        <div class="bottom clearfix">
          <time class="time">{{ currentDate }}</time>
          <el-button type="text" class="button">操作按钮</el-button>
        </div>
      </div> -->

      <img src="../../assets/exam.png" class="image">
      <div class="exam-informations">
      <div class="exam-name item">考试名称: {{examName}}</div>
      
      <div class="exam-time item">考试日期: {{$moment(startTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
      <div class="exam-time item">结束时间: {{$moment(endTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
      <div class="exam-duration item">考试时间: {{Number(getExamTime()).toFixed(0)}}分钟</div>
      <div class="exam-mark item">考试总分: {{examMark}}</div>
      <div class="exam-status item">
        <span>考试状态:</span>
        <el-tag :type="examStatusType" size="small" effect="plain" > {{examStatusString}} </el-tag>
      </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "examItem",
  data(){
    return{
      examStatusString:'',
      examStatusType:''
    
    }
  },
  props: {
    examName: String,
    startTime:String,
    endTime:String,
    examTime: String,
    examDuration: String,
    examStatus:Number,
    examId:String,
    examMark:Number,
  },
  computed:{

  },
  created(){
    this.checkExamStatus()
    this.getExamStatusType()
  },
  methods:{
    getExamStatusType(){
      // console.log(this.examStatus);
      this.$request({
        url: "/api/exam/getServerTime",
        method: "get",
      }).then((res) => {
        console.log(res);
        let now = new Date(res.data.time);
        console.log(now);
        if (
          new Date(this.startTime).getTime() < now.getTime() &&
          now.getTime() < new Date(this.endTime).getTime()
        ) {
          return this.examStatusType = "";
        }
        if (new Date(this.startTime).getTime() > now.getTime()) {
          return this.examStatusType = "info";
        }
        if (now.getTime() > new Date(this.endTime).getTime()) {
          return  this.examStatusType ="success";
        }
      });
    },
    testEmit(){
      // console.log('emit');
      this.$emit('itemClick',{
        examName: this.examName,
        startTime:this.$moment(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime:this.$moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
        // examTime: this.examTime,
        examDuration: this.getExamTime(),
        examStatus:this.examStatus,
        examId:this.examId,
        examMark:this.examMark,

      })
    },

    getExamTime(){
      let zTime = new Date(this.endTime).getTime() - new Date(this.startTime).getTime() 
      let minute = (zTime/1000)/60
      return minute
    },
    checkExamStatus() {
      // console.log(new Date(startTime).getTime()-now.getTime());
      // let now = new Date();
      this.$request({
        url: "/api/exam/getServerTime",
        method: "get",
      }).then((res) => {
        console.log(res);
        let now = new Date(res.data.time);
        console.log(now);
        if (
          new Date(this.startTime).getTime() < now.getTime() &&
          now.getTime() < new Date(this.endTime).getTime()
        ) {
          return this.examStatusString = "进行中";
        }
        if (new Date(this.startTime).getTime() > now.getTime()) {
          return this.examStatusString = "未开始";
        }
        if (now.getTime() > new Date(this.endTime).getTime()) {
          return  this.examStatusString ="已结束";
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
.exam-item {
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  // width: 200px;
  // height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 50px;
  margin-bottom: 50px;
  position: relative;
  // width: 30%;
  .item{
    margin: 10px;
  }
  el-card{
    width: 200px;
    height: 250px;
    display: flex;
  }
  img {
    width: 128px;
    height: $width;
    position: relative;
    left: 50%;
    // top: 50%;
    transform:translateX(-50%);
    margin: auto;
  }
  .exam-informations {
    div{
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
}
</style>