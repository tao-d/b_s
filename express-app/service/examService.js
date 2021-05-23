const classMysqlDao = require('../dao/mysql/classMysql.js')
const userService = require('./userService.js')
const userMysqlDao = require('../dao/mysql/userMysql.js')
const examMysqlDao = require('../dao/mysql/examMysql.js')
const paperMysql = require('../dao/mysql/paperMysql.js')
const moment = require('moment')
const run = require('./run')
const { commit } = require('../dao/mysqlConnect.js')

module.exports = {
  async createExam({ userId: teacherId }, { startTime, endTime, examMark, passMark, classId, paperId, examStatus, examName }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    let result = null
    let examId = null
    // console.log(role);
    console.log('111111111111111111 ' + startTime);
    if (role == 'teacher') {
      /**
       * 生成exam的步骤
       * 1.生成exam表的行
       */
      //1.生成exam表

      try {
        let examId = await examMysqlDao.examInsert({
          teacherId,
          startTime,
          endTime,
          examMark,
          passMark,
          classId,
          paperId,
          examStatus,
          examName,
        })
        console.log(examId);
        //2.获取班级学员生成exammaking记录作答情况 and 学生成绩登录
        //exammaking作答情况
        let student = await classMysqlDao.studentAndClassSelect({
          classId,
        }, 'studentId', 'classOrder')
        for (let obj of student) {
          await examMysqlDao.examMakingInsert({
            examId,
            studentId: obj.studentId,
            examOrder: obj.classOrder,
            lineStatus: 1,
          })
        }
        //studentgrade作答情况 学生成绩登录
        for (let obj of student) {
          await examMysqlDao.studentAndGradeInsert({
            examId,
            studentId: obj.studentId,
            studentGrade: 0,
            detail: null,
            gradeStatus: 0,
            lineStatus: 1,
          })
        }



        //3.获取paper试卷里的试题生成examing中使用的question
        let question = await paperMysql.questionSelect({
          paperId,
        }, '*')
        //将试题按规律排序
        //按照questionTypeIndex的顺序
        let questionTypeIndex = [
          "choice singleChoice",
          "choice multipleChoice",
          "judgement",
          "completion",
          "shortAnswer",
        ]
        //试题排序
        question.sort((a, b) => {
          if (a.questionType == b.questionType) {
            // console.log('no change');
            return a.typeOrder - b.typeOrder
          }
          else {
            let aIndex = questionTypeIndex.findIndex(item => item === a.questionType)
            let bIndex = questionTypeIndex.findIndex(item => item === b.questionType)
            if (aIndex < bIndex) {
              return -1
            }
            else {
              return 1
            }
          }
        })
        let questionOrder = 1
        for (let obj of question) {
          await examMysqlDao.examingInsert({
            examId,
            lineStatus: 1,
            questionType: obj.questionType,
            questionOrder: questionOrder++,
            typeOrder: obj.typeOrder,
            updateTime: obj.updateTime,
            createTime: obj.createTime,
            questionContent: obj.questionContent,
            answer: obj.answer,
            questionName: obj.questionName,
            questionMark: obj.questionMark,
            questionAnalysis: obj.questionAnalysis,
            imgUrl: obj.imgUrl
          })
        }
        //新建考试类，用于处理考试与时间的关系开启轮训
        run.examingListAdd({ examId, startTime, endTime, examStatus })

      } catch (e) {
        return {
          error: e,
          msg: '新建失败',
          code: 0,
        }
      }
      return {
        msg: '新建成功',
        code: 1,
      }
    } else {
      return {
        msg: '新建失败',
        code: 0,
      }
    }
  },
  //获取我的考试列表（教师）
  async getMyExamList({ userId: teacherId }) {
    let result = await examMysqlDao.examSelect({
      lineStatus: 1,
      teacherId,
    }, '*')
    for (let item of result) {
      let examStudentCount = (await examMysqlDao.examMakingSelect({
        examId: item.examId
      }, 'count(*) as count'))[0].count
      item.examStudentCount = examStudentCount
    }
    return result
  },


  //获取
  async getMyExamMarkingList({ userId: teacherId }) {
    let result = await examMysqlDao.examSelect({
      lineStatus: 1,
      teacherId,
      examStatus: 2,
    }, '*')
    for (let item of result) {
      let examStudentCount = (await examMysqlDao.examMakingSelect({
        examId: item.examId
      }, 'count(*) as count'))[0].count
      item.examStudentCount = examStudentCount
    }
    return result
  },
  //获取服务器时间
  async getServerTime() {
    return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
  async getStudentAdmin({ userId: studentId }, { examId }) {
    let result = null
    result = await examMysqlDao.examMakingSelect({
      examId,
      studentId,
      lineStatus: 1,
    }, 'makingStatus')
    if (result.length > 0) {
      if (result[0].makingStatus == 1) {
        return {
          msg: '你已提交该考试',
          code: 0,
        }
      }
      else {
        return {
          msg: '正确',
          code: 1,
        }
      }
    }
    else {
      return {
        msg: '你不是该考试成员',
        code: 0,
      }
    }
  },


  //获取正在进行或者准备进行的考试(学生)
  async getStudentExamList({ userId: studentId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let examId = await examMysqlDao.examMakingSelect({
      lineStatus: 1,
      studentId,
    }, 'examId')
    // console.log(examId);
    for (let item of examId) {
      let examInformation = await examMysqlDao.examListSelect({
        examId: item.examId,
        lineStatus: 1,
      }, 'examId', 'startTime', 'endTime', 'examMark', 'examName', 'examStatus', 'teacherId')
      if (examInformation.length > 0) {
        let teacherInformation = await userMysqlDao.userSelect({
          userId: examInformation[0].teacherId,
          lineStatus: 1,
        }, 'username as teacherName')
        result.push({
          ...examInformation[0],
          ...teacherInformation[0],
        })
      }
    }
    return result
  },

  //获取已经完成或待批阅的考试(老师)
  async getFinishExamList({ userId: teacherId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.examFinishedListSelect({
        teacherId,
        lineStatus: 1,
      }, '*')
      for (let item of result) {
        //获取考试的总人数
        let examStudentCount = (await examMysqlDao.examMakingSelect({
          examId: item.examId
        }, 'count(*) as count'))[0].count

        //获取未批阅的人数
        let examMarkingCount = (await examMysqlDao.studentAndGradeSelect({
          ['studentgrade.examId']: item.examId,
          gradeStatus: 2,
        }, 'count(*) as count'))[0].count
        item.examStudentCount = examStudentCount
        item.examNotMarkingCount = examStudentCount - examMarkingCount
        console.log(examMarkingCount);
      }
    }
    return result
  },

  //获取已经完成或待批阅的考试(学生)
  async getStudentFinishExamList({ userId: studentId, role }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    // let role = await userService.checkRole(studentId)
    if (role == 0) {
      result = await examMysqlDao.examStudentFinishedListSelect({
        ['exammaking.studentId']: studentId,
        ['exam.lineStatus']: 1,
      }, 'exam.*')
      for (let item of result) {
        //获取考试的总人数
        let examStudentCount = (await examMysqlDao.examMakingSelect({
          examId: item.examId
        }, 'count(*) as count'))[0].count

        //获取考试分数
        let studentGrade = (await examMysqlDao.studentAndGradeSelect({
          ['studentgrade.examId']: item.examId,
          ['studentgrade.studentId']: studentId,
          ['studentgrade.lineStatus']: 1,
        }, 'studentgrade.studentGrade'))[0].studentGrade

        //获取学生成绩

        //获取未批阅的人数
        // let examNotMarkingCount = (await examMysqlDao.studentAndGradeSelect({
        //   ['studentgrade.examId']: item.examId,
        //   gradeStatus: 0,
        // }, 'count(*) as count'))[0].count
        item.examStudentCount = examStudentCount
        item.studentGrade = studentGrade
        // item.examNotMarkingCount = examNotMarkingCount
        // console.log(examNotMarkingCount);
      }
    }
    return result
  },

  //获取批阅完毕的考试(老师)
  async getFinishMarkExamList({ userId: teacherId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.examFinishedMarkListSelect({
        teacherId,
        lineStatus:1,
      }, '*')
      for (let item of result) {
        //获取考试的总人数
        let examStudentCount = (await examMysqlDao.examMakingSelect({
          examId: item.examId
        }, 'count(*) as count'))[0].count

        //获取未批阅的人数
        let examNotMarkingCount = (await examMysqlDao.studentAndGradeSelect({
          ['studentgrade.examId']: item.examId,
          gradeStatus: 0,
        }, 'count(*) as count'))[0].count
        item.examStudentCount = examStudentCount
        item.examNotMarkingCount = examNotMarkingCount
        console.log(examNotMarkingCount);
      }
    }
    return result
  },

  //获取该考试的参与学生列表
  async getStudentMarkingList({ userId: teacherId }, { examId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.examStudentListMarking(
        {
          teacherId,
          examId,
        }, 'user.account', 'user.userId', 'user.username', 'exammaking.examOrder', 'studentgrade.gradeStatus')
    }
    return result
  },

  //获取学生的作答详情（教师）
  async getStudentMarkingDetail({ userId: teacherId }, { examId, studentId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.examMakingSelect(
        {
          // teacherId,
          examId,
          studentId
        }, '*')
    }
    return result
  },
  //获取学生的作答详情（学生）
  async getStudentMarkingDetail_student({ userId: studentId }, { examId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    // let role = await userService.checkRole(studentId)
    result = await examMysqlDao.examMakingSelect(
      {
        // teacherId,
        examId,
        studentId
      }, '*')
    return result
  },


  //获取学生的grade(教师)
  async getStudentGrade({ userId: teacherId }, { examId, studentId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.studentAndGradeSelect(
        {
          ['studentgrade.examId']: examId,
          ['studentgrade.studentId']: studentId,
        }, 'studentgrade.*', 'user.username', 'exammaking.examOrder')
    }
    return result
  },

  //获取学生的grade(学生)
  async getStudentGrade_student({ userId: studentId }, { examId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(studentId)
    if (role == 'student') {
      result = await examMysqlDao.studentAndGradeSelect(
        {
          ['studentgrade.examId']: examId,
          ['studentgrade.studentId']: studentId,
        }, 'studentgrade.*', 'user.username', 'exammaking.examOrder')
    }
    return result
  },


  //获取考试试题(老师)
  async getTeacherMarkingQuestion({ userId: teacherId }, { examId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.examingTeacherSelect(
        {
          teacherId,
          examId,
        }, 'examing.*')
    }
    console.log(result);
    return result
  },


  //获取考试试题(学生)
  async getStudentMarkingQuestion({ userId: studentId }, { examId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(studentId)
    if (role == 'student') {
      result = await examMysqlDao.examingStudentSelect(
        {
          studentId,
          examId,
        }, 'examing.*')
    }
    console.log(result);
    return result
  },

  //获取考试试题(老师)
  async getTeacherMarkingQuestion({ userId: teacherId }, { examId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.examingTeacherSelect(
        {
          teacherId,
          examId,
        }, 'examing.*')

    }
    return result

  },

  //获取考试学生信息(老师)
  async getExamGrade({ userId: teacherId }, { examId }) {
    // let result = await examMysqlDao.examMakingSelect({
    //   lineStatus: 1,
    //   studentId,
    // }, '*')
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      result = await examMysqlDao.studentAndGradeSelect({
        ['studentgrade.examId']: examId,
        ['studentgrade.lineStatus']: 1,
      }, 'studentgrade.*', 'user.username', 'exammaking.examOrder', 'user.account')
    }
    return result

  },
  //获取考试信息(教师)
  async getTeacherExamInformations({ userId: teacherId }, { examId }) {

    let result = []
    let role = await userService.checkRole(teacherId)
    //学生拥有该考试位置
    if (role == 'teacher') {
      // let result = null
      let examInformation = await examMysqlDao.examSelect({
        lineStatus: 1,
        teacherId,
        examId,
      }, 'examId', 'startTime', 'endTime', 'examMark', 'examName', 'examStatus', 'passMark')
      return examInformation
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //教师结束考试最后批改
  async commitExamMarkFinish({ userId: teacherId }, { examId }) {
    let result = []
    let role = await userService.checkRole(teacherId)
    if (role == 'teacher') {
      //更新exam表
      result = await examMysqlDao.examUpdate({
        lineStatus: 1,
        examId,
        teacherId,
      }, {
        //已批阅完成
        examStatus: 3,
      })
      //

      //更新考试的的学生名次
      let order = 0
      let same = 1
      let studentGradeSame = null
      let students = await examMysqlDao.studentAndGradeSelect({
        ['studentgrade.examId']: examId,
        ['studentgrade.lineStatus']: 1,
      }, 'studentgrade.studentId', 'studentgrade.studentGrade')

      students.sort((a, b) => {
        return b.studentGrade - a.studentGrade
      })
      //更新考试排名名次
      students.forEach(async (item, index) => {
        //排列同名次
        console.log(11111111111111111111111111111111111111111);
        if (studentGradeSame != null && studentGradeSame == item.studentGrade) {
          same++
        }
        else {
          order += same
          studentGradeSame = item.studentGrade
          same = 1
        }
        console.log('order',order);
        await examMysqlDao.studentAndGradeUpdate({
          examId,
          studentId: item.studentId,
        }, {
          gradeOrder: order,
          gradeStatus: 2,
        })
      })

      return true
    }
    else {
      return false
    }
  },

  //revokeMark(教师)
  async revokeMark({ userId: teacherId,role }, { examId }) {

    let result = []
    // let role = await userService.checkRole(teacherId)
    if (role == 1) {
      //撤销考试批阅
      await examMysqlDao.examUpdate({
        teacherId,
        examId,
        lineStatus:1
      },{
        //取消批阅
        examStatus: 2,
      })
      return {
        code:1
      }
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },



  async getStudentExamPower({ userId: studentId }, { examId }) {
    let now = moment();
    // let power = null
    console.log(examId);
    let allTime = (await examMysqlDao.examSelect({
      examId,
      lineStatus: 1,
    }, 'startTime', 'endTime'))[0]
    if (now.isAfter(allTime.startTime) && now.isBefore(allTime.endTime)) {
      return {
        msg: '权限成功',
        code: 1,
      }
    }
    if (now.isBefore(allTime.startTime)) {
      // return {
      //   msg:'未开始',
      //   code:0,
      // }
      let examStatus = (await examMysqlDao.examSelect({
        examId,
        lineStatus: 1,
      }, 'examStatus'))[0].examStatus
      if (examStatus == 2) {
        return {
          code: 0,
          msg: '正在批阅中'
        }
      }
    }



  },

  //学生获取考试试题
  async getStudentExamQuestion({ userId: studentId }, { examId }) {
    let admin = (await examMysqlDao.examMakingSelect({
      studentId,
      examId,
      lineStatus: 1,
      makingStatus: 0,
    }, 'count(*) as count'))[0].count
    //学生拥有该考试位置
    if (admin > 0) {
      let result = null
      result = await examMysqlDao.examingSelect({
        examId,
        lineStatus: 1,
      }, 'examQuestionId as questionId', 'questionType', 'questionOrder', 'typeOrder', 'questionContent', 'questionName', 'questionMark', 'imgUrl')
      // let questionId = await examMysqlDao.examingSelect({
      //   lineStatus: 1,
      //   examId,
      // }, 'questionId')
      // let questionIds = questionId.map(item => `'${item.questionId}'`)
      // console.log(questionIds);
      // result = await examMysqlDao.examQuestionSelect({
      //   questionId: questionIds
      // }, 'questionId', 'questionType', 'questionOrder', 'typeOrder', 'questionContent', 'questionName', 'questionMark')
      return result
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //获取学生考试信息
  async getStudentExamInformations({ userId: studentId }, { examId }) {
    let admin = (await examMysqlDao.examMakingSelect({
      studentId,
      examId,
      lineStatus: 1,
    }, 'count(*) as count'))[0].count
    //学生拥有该考试位置
    if (admin > 0) {
      // let result = null
      let examInformation = await examMysqlDao.examSelect({
        lineStatus: 1,
        examId,
      }, 'examId', 'startTime', 'endTime', 'examMark', 'examName', 'examStatus')
      return examInformation
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //关闭考试
  async closeExam({ userId: teacherId }, { examId }) {

    let result = null
    let role = await userService.checkRole(teacherId)
    //1.关闭考试
    if (role == 'teacher') {
      // let result = null
      let examInformation = await examMysqlDao.examUpdate({
        lineStatus: 1,
        teacherId,
        examId,
      }, {
        examStatus: -1
      })
      //2.将考试信息从run数组列表剔除
      run.examingListPop({
        examId,
      })
      return {
        msg: '成功',
        code: 1,
      }
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //更新考试
  async updateExam({ userId: teacherId }, { examId, startTime, endTime, passMark, examName }) {
    let result = null
    let role = await userService.checkRole(teacherId)
    //1.关闭考试
    if (role == 'teacher') {
      // console.log(startTime);
      // let result = null
      await examMysqlDao.examUpdate({
        teacherId,
        examId,
      }, {
        startTime: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
        passMark,
        examName,
      })
      return {
        msg: '成功',
        code: 1,
      }
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //删除考试
  async deleteExam({ userId: teacherId }, { examId }) {
    let result = null
    let role = await userService.checkRole(teacherId)
    //1.关闭考试
    if (role == 'teacher') {
      // console.log(startTime);
      // let result = null
      await examMysqlDao.examUpdate({
        teacherId,
        examId,
      }, {
        lineStatus: 0,
      })
      return {
        msg: '成功',
        code: 1,
      }
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //开启考试
  async openExam({ userId: teacherId }, { examId, startTime, endTime, examStatus, }) {

    let result = null
    let role = await userService.checkRole(teacherId)
    //1.关闭考试
    if (role == 'teacher') {
      // let result = null
      let examInformation = await examMysqlDao.examUpdate({
        lineStatus: 1,
        teacherId,
        examId,
      }, {
        examStatus: 0
      })
      //2.将考试信息从run数组列表添加
      run.examingListAdd({ examId, startTime, endTime, examStatus:0 })
      return {
        msg: '成功',
        code: 1,
      }
    }
    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //学生提交函数
  async commitStudentExam({ userId: studentId }, { examContent, examId }) {
    let admin = (await examMysqlDao.examMakingSelect({
      studentId,
      examId,
      lineStatus: 1,
      makingStatus: 0,
    }, 'count(*) as count'))[0].count
    //学生拥有该考试位置
    if (admin > 0) {
      // let result = null
      //examContent是学生提交的考试信息
      let studentMaking = JSON.stringify(examContent)

      let examInformation = await examMysqlDao.examMakingUpdate({
        lineStatus: 1,
        examId,
        studentId,
      }, {
        makingStatus: 1,
        studentMaking,
      })
      //进行自动批阅
      /**
       * 将考试信息压进批阅队列
       */
      run.enQueue({
        examId,
        studentId,
        examContent,
      })
      return {
        msg: '成功提交',
        code: 1,
      }
    }

    else {
      return {
        msg: '权限不足',
        code: 0,
      }
    }
  },

  //老师批阅更新
  async updateGrade({ userId: teacherId }, { examId, questionMark, questionId, studentId, questionType }) {
    console.log(questionType);
    //因为串联的多个表，所以需要studentgrade.xxx
    let detail = (await examMysqlDao.studentAndGradeSelect(
      {
        ['studentgrade.examId']: examId,
        ['studentgrade.studentId']: studentId,
      }, 'detail'))[0].detail
    detail = JSON.parse(detail)
    // console.log(detail);
    // console.log(questionId);
    let changeItem = detail.find(item => item.questionId === questionId)
    // console.log(changeItem);
    let oldMark = changeItem.questionMark
    let newMark = questionMark


    //更改gradeStatus 0.未批阅 1.批阅中 2.批阅完成
    await examMysqlDao.studentAndGradeUpdate({
      examId,
      studentId,
    }, {
      gradeStatus: 1,
    })


    //1.更改studentandgrade里的指定试题信息 questionMark:得分 isMark:批改与否  #detail
    changeItem.questionMark = newMark
    if (!changeItem.isMark) {
      changeItem.isMark = true
    }

    //2.更新studentandgrade里的得分
    let sign = null
    if (newMark > oldMark) {
      sign = '+'
      await examMysqlDao.gradeMarkChange({
        studentId,
        examId,
      }, newMark - oldMark, sign)
    }

    if (newMark < oldMark) {
      sign = '-'
      await examMysqlDao.gradeMarkChange({
        studentId,
        examId,
      }, oldMark - newMark, sign)
    }
    //3.判断是否全部批阅完毕

    if (detail.every(item => {
      if (item.isMark == undefined) {
        return true
      }
      else {
        //未批改完
        if (item.isMark == false) {
          return false
        }
        //已批改完
        else {
          return true
        }
      }
    })) {
      await examMysqlDao.studentAndGradeUpdate({
        examId,
        studentId,
      }, {
        gradeStatus: 2,
      })
    }



    //4.将更新的detail写入数据库
    detailJSON = JSON.stringify(detail)
    await examMysqlDao.studentAndGradeUpdate({
      examId,
      studentId,
    }, {
      detail: detailJSON
    })
    return true



  },

  //平均分






}