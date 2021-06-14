var express = require('express');
var router = express.Router();
const userService = require('../../service/userService')

router.post('/login',async(req,res)=>{
  let username = req.body.username;
  let password = req.body.password;
  // let result = await mysqlUser.checkUser(username,password)
  let {token,role,userName} = await userService.loginService({account:username,password:password})
  if(token){
    res.json({
      msg:'success',
      code:1,
      token:token,
      role:role,
      data:{
        userName,
      }
    }).status(200)
  }
  else{
    res.json({
      msg:'lose',
      code:0,
    }).status(200)
  }
 })

 router.post('/getMyInformations',async(req,res)=>{
  // let query = req.body
  let result = await userService.getMyInformations(req.user)
  res.json(result).status(200)
  
})

//  router.post('/testToken',async(req,res)=>{
//    console.log(req.user);
//    res.send('test')
//  })

 router.post('/update',async(req,res)=>{
  let result = await userService.userUpdateService()
  res.send('test')
})

router.post('/delete',async(req,res)=>{
  let result = await userService.userDeleteService()
  res.send('test')
})

router.post('/changePassword',async(req,res)=>{
  let query = req.body
  let result = await userService.userChangePasswordService(req.user,query.oldPassword,query.newPassword)
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

router.get('/getStudent',async(req,res)=>{
  let param = req.params
  // let result = 
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


module.exports = router;