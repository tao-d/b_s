// const examService = require('./examService.js')
const examMysqlDao = require('../dao/mysql/examMysql.js')
const moment = require('moment')


const studentExamMarking = [];
const examingList = []
console.log('run');
examingListInit()

//不是接口调用 学生作答情况提交and自动批阅客观题
async function markingAutoQuestion({ examContent, examId, studentId }) {
  console.log('开始自动批阅批阅批阅');
  console.log(examContent);
  let array = []
  let zongMark = 0
  let autoQuestion = {
    singleChoiceList: examContent.singleChoiceList,
    multipleChoiceList: examContent.multipleChoiceList,
    judgementList: examContent.judgementList,
    completionList: examContent.completionList,
    shortAnswerList: examContent.shortAnswerList,
  }
  //阅卷单选题
  //每题单选题处理
  for (let i = 0; i < autoQuestion.singleChoiceList.length; i++) {
    let isTrue = null
    let questionId = autoQuestion.singleChoiceList[i].questionId
    let studentAnswer = autoQuestion.singleChoiceList[i].studentAnswer
    let result = await examMysqlDao.examingSelect({
      examQuestionId: questionId,
      lineStatus: 1,
    }, 'questionMark', 'answer')
    let questionMark = result[0].questionMark
    let answer = JSON.parse(result[0].answer)
    //判断答案是否正确,并获得分数
    //答案为字符串
    if (typeof answer == 'string') {
      if (studentAnswer == answer) {
        //添加成绩
        zongMark += questionMark
        //答案正确
        isTrue = true
      }
      else {
        //答案错误
        isTrue = false
      }
    }
    else {
      //答案为数组
      if (answer.includes(studentAnswer)) {
        //添加成绩
        zongMark += questionMark
        isTrue = true
      }
      else {
        isTrue = false
      }
    }
    //添加进json数组
    array.push({
      questionId,
      questionMark: isTrue ? questionMark : 0,
      isTrue,
    })
  }


  //阅卷多选题
  for (let i = 0; i < autoQuestion.multipleChoiceList.length; i++) {
    let isTrue = null
    let questionId = autoQuestion.multipleChoiceList[i].questionId
    let studentAnswer = autoQuestion.multipleChoiceList[i].studentAnswer
    let result = await examMysqlDao.examingSelect({
      examQuestionId: questionId,
      lineStatus: 1,
    }, 'questionMark', 'answer')
    let questionMark = result[0].questionMark
    let answer = JSON.parse(result[0].answer)
    //判断答案是否正确,并获得分数
    //answer为数组,studentAnswer为数组
    // if (studentAnswer.every(item => answer.includes(item))) {
    //   //添加成绩
    //   zongMark += questionMark
    //   //答案正确
    //   isTrue = true
    // }
    // else {
    //   //答案错误
    //   isTrue = false
    // }
    let flag = true
    if (studentAnswer.length != answer.length) {
      flag = false
    }
    else {
      for (let i = 0; i < studentAnswer.length; i++) {
        if (!answer.includes(studentAnswer[i])) {
          flag = false
        }
      }
    }

    if (flag) {
      //添加成绩
      zongMark += questionMark
      //答案正确
      isTrue = true
    }
    else {
      isTrue = false
    }

    //添加进json数组
    array.push({
      questionId,
      questionMark: isTrue ? questionMark : 0,
      isTrue,
    })
  }


  //阅卷判断题
  for (let i = 0; i < autoQuestion.judgementList.length; i++) {
    let isTrue = null
    let questionId = autoQuestion.judgementList[i].questionId
    let studentAnswer = autoQuestion.judgementList[i].studentAnswer
    let result = await examMysqlDao.examingSelect({
      examQuestionId: questionId,
      lineStatus: 1,
    }, 'questionMark', 'answer')
    let questionMark = result[0].questionMark
    //JSON转化为数组,string
    let answer = JSON.parse(result[0].answer)
    //判断答案是否正确,并获得分数
    //答案为字符串
    if (typeof answer == 'string') {
      if (studentAnswer == answer) {
        //添加成绩
        zongMark += questionMark
        isTrue = true
      }
      else {
        //答案正确
        isTrue = false
      }
    }
    else {
      //答案为数组
      if (answer.includes(studentAnswer)) {
        //添加成绩
        zongMark += questionMark
        isTrue = true
      }
      else {
        //答案错误
        isTrue = false
      }
    }
    //添加进json数组
    array.push({
      questionId,
      questionMark: isTrue ? questionMark : 0,
      isTrue,
    })
  }

  //加入填空题
  for (let i = 0; i < autoQuestion.completionList.length; i++) {
    let questionId = autoQuestion.completionList[i].questionId
    let questionMark = 0;
    let isMark = false
    let isTrue = false
    //添加进json数组
    array.push({
      questionId,
      questionMark: isTrue ? questionMark : 0,
      isMark,
      isTrue
    })
  }

  //加入简答题
  for (let i = 0; i < autoQuestion.shortAnswerList.length; i++) {
    let questionId = autoQuestion.shortAnswerList[i].questionId
    let questionMark = 0;
    let isMark = false
    let isTrue = false
    //添加进json数组
    array.push({
      questionId,
      questionMark: isTrue ? questionMark : 0,
      isMark,
      isTrue
    })
  }

  let resultJSON = JSON.stringify(array)
  //将答题情况存进studentGrade
  await examMysqlDao.studentAndGradeUpdate({
    examId,
    studentId,
  }, {
    detail: resultJSON,
    studentGrade: zongMark,
  })
  return true
}

//获得当前被激活的考试列表
async function examingListInit() {
  //获取未开始的考试列表
  let result = await examMysqlDao.examSelect({
    lineStatus: 1,
    examStatus: 0,
  }, '*')

  //获取开始未结束的考试列表
  let result1 = await examMysqlDao.examSelect({
    lineStatus: 1,
    examStatus: 1,
  }, '*')// console.log(result);
  result.forEach(item => {
    examingList.push(new exams(
      item.examId,
      item.startTime,
      item.endTime,
      examingList.length
    ))
  });
  result1.forEach(item => {
    examingList.push(new exams(
      item.examId,
      item.startTime,
      item.endTime,
      item.examStatus,
      examingList.length
    ))
  });
}
async function examingListPop({ examId }) {
  let index = examingList.findIndex(item=>item.examId==examId)
  examingList[index].clearTimer()
  examingList.splice(index, 1)
}

async function examingListAdd({ examId, startTime, endTime,examStatus }) {
  examingList.push(new exams(
    examId,
    startTime,
    endTime,
    examStatus,
    examingList.length
  ))
}

async function changeExamStatus() {

}

function timeDiff(myTime) {

}
function timeInterval() {
  setInterval(() => {
    moment()
  }, 1000)
}

class exams {
  constructor(examId, startTime, endTime, examStatus,index) {
    this.examId = examId
    this.startTime = startTime
    this.endTime = endTime
    this.index = index
    this.examStatus = examStatus
    this.init = this.init()
  }
  //初始化exam类并进入列表
  init() {
    let timer = setInterval(() => {
      let now = moment()
      let endTime = moment(this.endTime)
      let startTime = moment(this.startTime)
      // if(now.diff(class))
      console.log(now.diff(moment(endTime)));
      //考试时间结束。将examStatus设置为2
      if (now.diff(moment(endTime)) > 0 ) {
        this.changeStatus(2)
        //考试结束所进行的操作
        //自动提交未提交的同学
        //通过延迟10秒来让前端自动提交已经作答但时间结束后提交的答题情况
        setTimeout(()=>{
          this.pushStudentDetail()
        },10000)
        // 
        clearInterval(timer)
        examingList.splice(this.index, 1)
      }
      //考试时间开始。将examStatus设置为1
      if (now.diff(moment(startTime)) > 0 && now.diff(moment(endTime)) < 0 ) {
        if(this.examStatus==0){
          this.changeStatus(1).then(()=>{
            this.examStatus = 1
          })
        }
      }
    }, 500);
    return{
      clearTimer(){
        clearInterval(timer)
      }
    }
  }

  // //finish
  // finishExam(){

  // }

  clearTimer(){
    this.init.clearTimer()
  }
  async changeStatus(status) {
    let result = await examMysqlDao.examUpdate({
      examId: this.examId,
      lineStatus: 1,
    }, {
      //考试已完成
      examStatus: status
    })
  }

  //未提交的
  async pushStudentDetail() {
    let result = {
      singleChoiceList: [],
      multipleChoiceList: [],
      judgementList: [],
      completionList: [],
      shortAnswerList: [],
    }
    let question = await examMysqlDao.examingSelect({
      examId: this.examId
    }, '*')
    question.forEach(item => {

      let type = item.questionType.split(' ')
      let questionType = null
      if (type[0] == 'choice') {
        questionType = type[1]
      }
      else {
        questionType = type[0]
      }
      result[`${questionType}List`].push({
        questionId: item.examQuestionId,
        studentAnswer: questionType == 'multipleChoice' ? [] : '',
      })
    })
    let resultJSON = JSON.stringify(result)
    let makingResult = await examMysqlDao.examMakingSelect({
      examId: this.examId,
    }, '*')
    let making = makingResult.map(item => {
      return {
        studentmaking: item.studentmaking,
        studentId: item.studentId
      }
    })
    making.forEach(async item => {
      console.log('examMaking',item.studentmaking);
      if (item.studentmaking == undefined || item.studentmaking == null) {
        await examMysqlDao.examMakingUpdate({
          studentId: item.studentId,
          examId: this.examId,
        }, {
          studentmaking: resultJSON,
          makingStatus: 1,
        })
        studentExamMarking.push({
          examId: this.examId,
          studentId: item.studentId,
          examContent: result,
        })
      }


    })

  }

}
// function marking() {

// }
module.exports = {

  examListPush() {
    examingList.add()
  },
  examingListAdd,
  examingListPop,








  //下面是处理自动批阅
  //处理
  async marking({ examContent, examId, studentId }) {
    console.log('marking');
    let result = await markingAutoQuestion({
      examContent, examId, studentId
    })
    console.log(result);
  },
  //入队
  enQueue(item) {
    console.log('enQueue');
    studentExamMarking.push(item)
  },
  //出队
  deQueue() {
    return studentExamMarking.shift()
  },
  size() {
    return studentExamMarking.length
  },
  //查看队列头
  front() {
    return studentExamMarking[0]
  },
  isEmpty() {
    return studentExamMarking.length === 0
  },
  start() {
    // while(true){
    //   if(!this.isEmpty()){

    //   }
    // }
    setInterval(() => {
      if (!this.isEmpty()) {
        console.log('我终于不是空的了你知道吗');
        // console.log(examService);
        this.marking(this.deQueue())
      }
      else {
        // console.log('not');
      }
    }, 100)
  }
}
