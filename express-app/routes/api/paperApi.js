var express = require('express');
var router = express.Router();
const paperService = require('../../service/paperService.js')
const multer = require('multer')
const uuid = require('uuid')

router.post('/createPaper', async (req, res) => {
  let query = req.body
  let result = await paperService.createPaper(req.user, query)
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


router.post('/deletePaper', async (req, res) => {
  let query = req.body
  let result = await paperService.deletePaper(req.user, query)
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


router.post('/updatePaper', async (req, res) => {
  let query = req.body
  let result = await paperService.updatePaper(req.user, query)
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

router.get('/getPaperList', async (req, res) => {
  let query = req.body
  let result = await paperService.getPaperList(req.user)
  if (result) {
    res.json({
      msg: 'success',
      code: 1,
      data: result
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})





router.post('/appendQuestion', async (req, res) => {
  let query = req.body
  let result = await paperService.appendQuestion(req.user, query)
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

router.post('/getPaperQuestion', async (req, res) => {
  let query = req.body
  let result = await paperService.getPaperQuestion(req.user, query)
  if (result) {
    res.json({
      msg: 'success',
      code: 1,
      data: result
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})

router.post('/removeQuestion', async (req, res) => {
  let query = req.body
  let result = await paperService.removeQuestion(req.user, query)
  if (result) {
    res.json({
      msg: 'success',
      code: 1,
      data: result
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})


router.post('/updateQuestion', async (req, res) => {
  let query = req.body
  let result = await paperService.updateQuestion(req.user, query)
  if (result) {
    res.json({
      msg: 'success',
      code: 1,
      data: result
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})

router.post('/urlMysql', async (req, res) => {
  let query = req.body
  let result = await paperService.updateImgUrl(req.user, query)
  if (result) {
    res.json({
      msg: 'success',
      code: 1,
      data: result
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})

router.post('/urlRemove', async (req, res) => {
  let query = req.body
  let result = await paperService.removeImgUrl(req.user, query)
  if (result) {
    res.json({
      msg: 'success',
      code: 1,
      data: result
    }).status(200)
  }
  else {
    res.json({
      msg: 'lose',
      code: 0,
    }).status(200)
  }
})


//???????????????????????? upload
const storage = multer.diskStorage({
  //???????????????
  destination(req, file, cb) {
    cb(null, 'public/images/')
  },
  //????????????????????? multer????????????????????????????????????????????????????????????????????????????????????
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

//??????storage ???????????????????????????????????????dest?????????
const upload = multer({ storage })

router.post('/uploadImg', upload.single('file'), (req, res) => {
  //??????????????????????????????????????? ?????? + ???????????? 
  //????????? app.js??????????????????????????????????????????????????????????????? uploa
  const url = 'http://localhost:3000/images/' + req.file.filename
  res.json(url).status(200)
})

router.post('/uploadImgMore', upload.array('files', 8), (req, res) => {
  //??????????????????????????????????????? ?????? + ???????????? 
  //????????? app.js??????????????????????????????????????????????????????????????? uploa
  const url = []
  // for (var i = 0; i < req.files.length; i++) {
  //   var newName = req.files[i].path + pathLib.parse(req.files[i].originalname).ext;
  //   fs.rename(req.files[i].path, newName, function (err) {
  //     if (err) {
  //       console.log("rename failure.");
  //     } else {
  //       console.log("rename success.");
  //     }
  //   });
  // }
  for (var i = 0; i < req.files.length; i++) {
    url.push('http://localhost:3000/images/'+req.files[i].filename)
  }
  // const url = 'http://localhost:3000/images/' + req.file.filename
  res.json(url).status(200)
})







module.exports = router;