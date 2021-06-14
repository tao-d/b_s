var express = require('express');
var router = express.Router();
const classService = require('../../service/classService.js')

router.post('/createClass',async(req,res)=>{
    let query = req.body
    let result = await classService.createClass(req.user,query)
    if(result){
        res.json({
          msg:'success',
          code:1,
        }).status(200)
      }
      else{
        res.json({
          msg:'lose',
          code:0,
        }).status(200)
      }
 })

 router.get('/getMyClassList',async(req,res)=>{
    // let query = req.body
    let result = await classService.getMyClassList(req.user)
    if(result.length>0){
        res.json({
          msg:'success',
          code:1,
          data:result,
        }).status(200)
      }
      else{
        res.json({
          msg:'fail',
          code:0,
        }).status(200)
      }
 })

 router.post('/updateClass',async(req,res)=>{
    let query = req.body
    let result = await classService.updateClass(req.user,query)
    if(result.code==1){
        res.json({
          msg:'success',
          code:1,
        }).status(200)
      }
      else{
        res.json({
          msg:'lose',
          code:0,
        }).status(200)
      }
 })

 router.post('/deleteClass',async(req,res)=>{
    let query = req.body
    let result = await classService.deleteClass(req.user,query)
    if(result.code==1){
        res.json({
          msg:'success',
          code:1,
        }).status(200)
      }
      else{
        res.json({
          msg:'lose',
          code:0,
        }).status(200)
      }
 })

 router.get('/getClassStudent',async(req,res)=>{
   let param = req.query
   let result = await classService.classStudent(req.user,param)
   res.json(result)
 })

 router.post('/changeMyClassStudent',async(req,res)=>{
  let query = req.body
  let result = await classService.changeClassStudent(req.user,query)
  res.json(result)
})

router.get('/getMyClassStudentDetail',async(req,res)=>{
  let param = req.query
  let result = await classService.myClassStudentDetail(req.user,param)
  res.json(result)
})

 


module.exports = router;