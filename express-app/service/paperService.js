const classMysqlDao = require('../dao/mysql/classMysql.js')
const userService = require('./userService.js')
const userMysqlDao = require('../dao/mysql/userMysql.js')
const paperMysqlDao = require('../dao/mysql/paperMysql.js')
const qs = require("querystring");
const moment = require('moment')
const multer = require('multer');
const { json } = require('body-parser');

module.exports = {
  async createPaper({ userId: teacherId }, { paperName }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    let result = null
    if (role == 'teacher') {
      result = await paperMysqlDao.paperInsert({
        teacherId,
        paperName,
      })
    }
    return result
  },

  async updateImgUrl({ userId: teacherId }, { imgUrl, paperId, questionId }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    // let result = null
    if (role == 'teacher') {
      let resultImg = (await paperMysqlDao.questionSelect({
        paperId,
        questionId,
      }, 'imgUrl'))[0].imgUrl
      if (resultImg != undefined || resultImg != null || resultImg != '') {
        console.log(resultImg);
        resultImg = JSON.parse(resultImg)
        if (resultImg.findIndex(item => item == imgUrl) != -1) {
          return
        }
        else {
          resultImg.push(imgUrl)
        }
      }
      else {
        resultImg = [imgUrl]
      }
      resultImg = JSON.stringify(resultImg)
      await paperMysqlDao.questionUpdate({
        paperId,
        questionId,
      }, {
        imgUrl: resultImg,
      })
    }
    return true
  },


  async removeImgUrl({ userId: teacherId }, { imgUrl, paperId, questionId }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    // let result = null
    if (role == 'teacher') {
      let resultImg = (await paperMysqlDao.questionSelect({
        paperId,
        questionId,
      }, 'imgUrl'))[0].imgUrl
      if (resultImg != undefined || resultImg != null || resultImg != '') {
        console.log(resultImg);
        resultImg = JSON.parse(resultImg)
        if (resultImg.findIndex(item => item == imgUrl) != -1) {
          resultImg.splice(resultImg.findIndex(item => item == questionId),1)
          console.log(resultImg);
          resultImg = JSON.stringify(resultImg)
          await paperMysqlDao.questionUpdate({
            paperId,
            questionId,
          }, {
            imgUrl: resultImg,
          })
        }
        else{
          return
        }
      }
    }
    return true
  },

  async deletePaper({ userId: teacherId }, { paperId }) {
    let result = await paperMysqlDao.paperUpdate({
      teacherId,
      paperId,
    }, {
      lineStatus: 0,
    })
    if (result) {
      return {
        msg: '删除成功',
        code: 1,
      }
    }
    else {
      return {
        msg: '删除失败',
        code: 0,
      }
    }
  },

  async updatePaper({ userId: teacherId,role }, { paperId,paperName,passMark }) {
    let result = null
    if(role==1)
    {
       result = await paperMysqlDao.paperUpdate({
        teacherId,
        paperId,
      }, {
        paperName,
        passMark,
      })
    }

    if (result) {
      return {
        msg: '修改成功',
        code: 1,
      }
    }
    else {
      return {
        msg: '修改失败',
        code: 0,
      }
    }
  },

  async findQuestionOrder(item) {
    let result = null
    result = await paperMysqlDao.questionFindOrder({
      ...item
    })
    return result
  },


  async getPaperList({ userId: teacherId }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    let result = null
    console.log(role);
    if (role == 'teacher') {
      result = await paperMysqlDao.paperSelect({
        teacherId,
        lineStatus: 1,
      }, 'paperId', 'paperName', 'paperType', 'questionCount', 'paperMark', 'passMark', 'updateTime', 'paperStatus',
        'choiceCount', 'completionCount', 'shortAnswerCount', 'judgementCount', 'singleChoiceCount', 'multipleChoiceCount')
      result = result.map(item => {
        let time = item.updateTime
        item.updateTime = moment(time).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
      // console.log(result);
      if(result.length>0)
      {
        console.log(true);
      }else{
        console.log(false);
      }
    }
    return result
  },

  async appendQuestion({ userId: teacherId }, { questionName, questionType, questionMark, questionContent, paperId, questionAnalysis ,imgUrl}) {
    let role = await userService.checkRole(teacherId)
    let result = null
    let order = null
    let answer = []
    let type = null
    let questionItemContent = null
    switch (questionType) {
      case 'choice': {

        type = `${questionType} ${questionContent.choiceType}`
        if (questionContent.choiceType === 'multipleChoice') {
          //多选题答案
          for (let i = 0; i < questionContent.checkList.length; i++) {
            answer.push(questionContent.chooseContent[questionContent.checkList[i].charCodeAt() - 65])
          }


        }
        else {
          //单选题答案
          answer.push(questionContent.chooseContent[questionContent.radio.charCodeAt() - 65])
        }
        break;
      }
      //判断题
      case 'judgement': {
        answer = (questionContent.radio)
        // if(questionContent.radio === 'yes')
        // {
        //   answer.push(questionContent.chooseContent[0])
        // }
        // else{
        //   answer.push(questionContent.chooseContent[1])
        // }
        type = questionType
        // questionItemContent = JSON.stringify(questionContent.chooseContent)
        break;
      }
      //填空题
      case 'completion': {
        answer = (questionContent.answer)
        type = questionType
        break;
      }
      //简答题
      case 'shortAnswer': {
        answer = (questionContent.answer)
        type = questionType
        break;
      }
    }
    //存入数据库前的处理
    questionName = (questionName)
    questionAnalysis = (questionAnalysis)
    answer = JSON.stringify(answer)
    imgUrl = JSON.stringify(imgUrl)
    questionItemContent = JSON.stringify(questionContent.chooseContent)
    // console.log(answer);

    if (role == 'teacher') {

      //生成的类别题序号
      order = (await this.findQuestionOrder({
        paperId,
      })).length + 1
      console.log(order);
      let typeOrder = (await this.findQuestionOrder({
        paperId,
        questionType: type,
      })).length + 1
      result = await paperMysqlDao.questionInsert({
        paperId,
        questionType: type,
        questionName,
        answer,
        questionContent: questionItemContent,
        questionMark: Number(questionMark),
        questionAnalysis,
        questionOrder: order,
        typeOrder,
        imgUrl,
      })
      //count更新
      await paperMysqlDao.paperCountChange({
        paperId
      }, questionType + 'Count', 1, '+')
      await paperMysqlDao.paperCountChange({
        paperId
      }, 'questionCount', 1, '+')
      if (questionType == 'choice') {
        await paperMysqlDao.paperCountChange({
          paperId
        }, questionContent.choiceType + 'Count', 1, '+')
      }

      //分数更新
      await paperMysqlDao.paperMarkChange({
        paperId
      }, 'paperMark', questionMark, '+')
    }
    return result
  },

  async getPaperQuestion({ userId: teacherId }, { paperId }) {
    let role = await userService.checkRole(teacherId)
    if (role != 'teacher') {
      return {
        msg: '角色未授权',
        code: 0,
      }
    }
    let result = await paperMysqlDao.questionSelect({
      // teacherId,
      paperId,
    }, '*')
    result = result.map(item => {
      return {
        questionId: item.questionId,
        paperId: item.paperId,
        questionType: item.questionType,
        questionMark: item.questionMark,
        questionOrder: item.questionOrder,
        typeOrder: item.typeOrder,
        questionContent: (item.questionContent),
        answer: (item.answer),
        questionName: (item.questionName),
        questionAnalysis: (item.questionAnalysis),
        imgUrl:item.imgUrl

      }
    })
    return result

  },

  //移除试题s
  async removeQuestion({ userId: teacherId }, { questionId, paperId, questionMark }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    let result = null
    console.log(role);
    if (role == 'teacher') {
      let type = (await paperMysqlDao.questionSelect({
        questionId,
        paperId,
      }, 'questionType'))[0].questionType
      type = type.split(' ')
      console.log('type', type);
      result = await paperMysqlDao.questionDelete({
        questionId,
        paperId,
      })
      //count更新
      console.log();
      await paperMysqlDao.paperCountChange({
        paperId
      }, type[0] + 'Count', 1, '-')
      await paperMysqlDao.paperCountChange({
        paperId
      }, 'questionCount', 1, '-')
      if (type[0] == 'choice') {
        await paperMysqlDao.paperCountChange({
          paperId
        }, type[1] + 'Count', 1, '-')
      }

      //分数更新
      await paperMysqlDao.paperMarkChange({
        paperId
      }, 'paperMark', questionMark, '-')
      console.log('hahahahahahaha');

    }
    return result
  },

  //更新试题
  async updateQuestion({ userId: teacherId }, { questionId, paperId, questionMark, questionName, questionType, questionContent, questionAnalysis }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    let result = null
    console.log(role);
    if (role == 'teacher') {
      //获取之前的试题分数
      let oldMark = (await paperMysqlDao.questionSelect({
        questionId,
        paperId,
      }, 'questionMark'))[0].questionMark

      //分数更新
      questionMark = Number(questionMark)
      if (oldMark != questionMark) {
        if (oldMark < questionMark) {
          await paperMysqlDao.paperMarkChange({
            paperId, teacherId,
          }, 'paperMark', questionMark - oldMark, '+')
        }
        else {
          await paperMysqlDao.paperMarkChange({
            paperId, teacherId,
          }, 'paperMark', oldMark - questionMark, '-')
        }
      }
      let answer = []
      let type = null
      let questionItemContent = null
      switch (questionType) {
        case 'choice': {

          type = `${questionType} ${questionContent.choiceType}`
          if (questionContent.choiceType === 'multipleChoice') {
            //多选题答案
            for (let i = 0; i < questionContent.checkList.length; i++) {
              answer.push(questionContent.chooseContent[questionContent.checkList[i].charCodeAt() - 65])
            }
          }
          else {
            //单选题答案
            answer.push(questionContent.chooseContent[questionContent.radio.charCodeAt() - 65])
          }
          break;
        }
        case 'judgement': {
          answer[questionContent.radio] = questionContent.radio === 'yes' ? questionContent.chooseContent[0] : questionContent.chooseContent[1]
          type = questionType
          break;
        }
        case 'completion': {
          answer = (questionContent.answer)
          type = questionType
          break;
        }
        case 'shortAnswer': {
          answer = (questionContent.answer)
          type = questionType
          break;
        }
      }
      //存入数据库前的处理
      questionName = (questionName)
      questionAnalysis = (questionAnalysis)
      answer = JSON.stringify(answer)
      questionItemContent = JSON.stringify(questionContent.chooseContent)
      console.log(1);
      //question更新
      result = await paperMysqlDao.questionUpdate({
        paperId,
        questionId,

      }, {
        questionType: type,
        questionName,
        answer,
        questionContent: questionItemContent==undefined?null:questionItemContent,
        questionMark: Number(questionMark),
        questionAnalysis,
      })


    }
    return result
  },

  //上传图片
  async uploadImg({ userId: teacherId }) {
    console.log('uploadImg');
  }



}