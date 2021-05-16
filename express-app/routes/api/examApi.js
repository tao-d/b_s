var express = require('express');
var router = express.Router();
const classService = require('../../service/classService.js')
const examService = require('../../service/examService.js')

router.post('/createExam', async (req, res) => {
  let query = req.body
  let result = await examService.createExam(req.user, query)
  console.log(result);
  if (result) {
    res.json({
      msg: 'success',
      code: 1,
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})

router.get('/getServerTime', async (req, res) => {
  let time = await examService.getServerTime()
  if (time) {
    res.json({
      msg: 'success',
      code: 1,
      time: time
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})

router.post('/getStudentExamPower', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentExamPower(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      // data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '时间不符合',
      code: 0,
    }).status(200)
  }
})

router.get('/getMyClassList', async (req, res) => {
  // let query = req.body
  let result = await classService.getMyClassList(req.user)
  console.log(result);
  if (result.length > 0) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})

router.post('/updateClass', async (req, res) => {
  let query = req.body
  let result = await classService.updateClass(req.user, query)
  // console.log(result);
  if (result.code == 1) {
    res.json({
      msg: 'success',
      code: 1,
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})

router.post('/deleteClass', async (req, res) => {
  let query = req.body
  let result = await classService.deleteClass(req.user, query)
  // console.log(result);
  if (result.code == 1) {
    res.json({
      msg: 'success',
      code: 1,
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})

router.get('/getClassStudent', async (req, res) => {
  let param = req.query
  console.log(param);
  let result = await classService.classStudent(req.user, param)
  res.json(result)
})

router.post('/changeMyClassStudent', async (req, res) => {
  let query = req.body
  let result = await classService.changeClassStudent(req.user, query)
  res.json(result)
})

router.get('/getMyClassStudentDetail', async (req, res) => {
  let param = req.query
  console.log(param);
  let result = await classService.myClassStudentDetail(req.user, param)
  res.json(result)
})

router.get('/getMyExamList', async (req, res) => {
  // let query = req.body
  let result = await examService.getMyExamList(req.user)
  console.log(result);
  if (result.length > 0) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})

//学生获取考试信息列表(未考试)
router.get('/getStudentExamList', async (req, res) => {
  let result = await examService.getStudentExamList(req.user)
  console.log(result);
  if (result.length > 0) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})

//学生获取已完成或待批阅考试信息列表(已完成)
router.get('/getStudentFinishExamList', async (req, res) => {
  let result = await examService.getStudentFinishExamList(req.user)
  console.log(result);
  if (result.length > 0) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})

//老师获取已完成或待批阅考试信息列表
router.get('/getFinishExamList', async (req, res) => {
  let result = await examService.getFinishExamList(req.user)
  console.log(result);
  if (result.length > 0) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})


//老师获取已完成考试信息列表
router.get('/getFinishMarkExamList', async (req, res) => {
  let result = await examService.getFinishMarkExamList(req.user)
  console.log(result);
  if (result.length > 0) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})

//关闭考试
router.post('/closeExam', async (req, res) => {
  let query = req.body
  console.log(query);
  let result = await examService.closeExam(req.user,query)
  console.log(result);
  if (result.code==1) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})
//删除考试
router.post('/deleteExam', async (req, res) => {
  let query = req.body
  console.log(query);
  let result = await examService.deleteExam(req.user,query)
  console.log(result);
  if (result.code==1) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})

//开启考试
router.post('/openExam', async (req, res) => {
  let query = req.body
  console.log(query);
  let result = await examService.openExam(req.user,query)
  console.log(result);
  if (result.code==1) {
    res.json({
      msg: 'success',
      code: 1,
      data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})

//撤销批阅
router.post('/revokeMark', async (req, res) => {
  let query = req.body
  // console.log(query);
  let result = await examService.revokeMark(req.user,query)
  // console.log(result);
  if (result.code==1) {
    res.json({
      msg: 'success',
      code: 1,
      // data: result,
    }).status(200)
  }
  else {
    res.json({
      msg: 'fail',
      code: 0,
    }).status(200)
  }
})



router.post('/getStudentExamQuestion', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentExamQuestion(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '时间不符合',
      code: 0,
    }).status(200)
  }
}),
router.post('/getStudentExamInformations', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentExamInformations(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '时间不符合',
      code: 0,
    }).status(200)
  }
}),
router.post('/commitStudentExam', async (req, res) => {
  let query = req.body
  let result = await examService.commitStudentExam(req.user,query)
  console.log(result);
  res.json(result).status(200)
}),
router.post('/getStudentAdmin', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentAdmin(req.user,query)
  res.json(result).status(200)
}),


//获取考试学生列表
router.post('/getStudentMarkingList', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentMarkingList(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取学生的作答详情(教师)
router.post('/getStudentMarkingDetail', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentMarkingDetail(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取学生的作答详情(学生)
router.post('/getStudentMarkingDetail_student', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentMarkingDetail_student(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取某学生的grade请求(教师)
router.post('/getStudentGrade', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentGrade(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取全部学生的grade请求(教师)
router.post('/getAllStudentGrade', async (req, res) => {
  let query = req.body
  let result = await examService.getAllStudentGrade(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取某学生的grade请求(学生)
router.post('/getStudentGrade_student', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentGrade_student(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取考试试题(老师)
router.post('/getTeacherMarkingQuestion', async (req, res) => {
  let query = req.body
  let result = await examService.getTeacherMarkingQuestion(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取考试试题(学生)
router.post('/getStudentMarkingQuestion', async (req, res) => {
  let query = req.body
  let result = await examService.getStudentMarkingQuestion(req.user,query)
  if (result.length>0) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//主观题更新
router.post('/updateGrade', async (req, res) => {
  let query = req.body
  let result = await examService.updateGrade(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取考试信息（教师）
router.post('/getTeacherExamInformations', async (req, res) => {
  let query = req.body
  let result = await examService.getTeacherExamInformations(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取考试信息（学生）
// router.post('/getStudentExamInformations', async (req, res) => {
//   let query = req.body
//   let result = await examService.getStudentExamInformations(req.user, query)
//   if (result) {
//     res.json({
//       msg: '成功',
//       code: 1,
//       data:result,
//     }).status(200)
//   }
//   else {
//     res.json({
//       msg: '请求错误',
//       code: 0,
//     }).status(200)
//   }
// }),

//提交已完成的examMarkFinish
router.post('/commitExamMarkFinish', async (req, res) => {
  let query = req.body
  let result = await examService.commitExamMarkFinish(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取已完成的examMarkFinish
router.post('/getFinishMarkExamList', async (req, res) => {
  let query = req.body
  let result = await examService.getFinishMarkExamList(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//获取已完成的examMarkFinish
router.post('/getExamGrade', async (req, res) => {
  let query = req.body
  let result = await examService.getExamGrade(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),

//更新考试
router.post('/updateExam', async (req, res) => {
  let query = req.body
  let result = await examService.updateExam(req.user, query)
  if (result) {
    res.json({
      msg: '成功',
      code: 1,
      data:result,
    }).status(200)
  }
  else {
    res.json({
      msg: '请求错误',
      code: 0,
    }).status(200)
  }
}),




module.exports = router;