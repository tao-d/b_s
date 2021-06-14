
//token
const jwt = require('jsonwebtoken');
let secret = 'exam_bs'

//生成token
//签名
exports.secret = secret;

exports.generateToken = function(userId,account,role){
  let payload = {userId:userId,account:account,time:new Date(),role:role}
  let token = jwt.sign(payload,secret,{expiresIn:60*60*24})
  // let token = jwt.sign(payload,secret,{expiresIn:10})
  return token
}

//解析token
exports.verifyToken = function(e){
  return new Promise((resolve,reject)=>{
		let info = jwt.verify(e,secret);
    // console.log(e);
    // console.log(info);
		resolve(info);
	})
}