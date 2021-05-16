const mysqlDao = require('../dao/mysql/userMysql.js')
const jwt = require('../dao/jwt.js')
module.exports = {
  async loginService({ account, password }) {
    let token = null
    let role = null
    let username = null
    //判断用户是否存在
    let result = await mysqlDao.userSelect({
      account: account,
      password: password
    }, 'userId', 'account', 'role','username')
    if (result.length > 0) {
      token = jwt.generateToken(result[0].userId, result[0].account, result[0].role)
      role = result[0].role
      username = result[0].username
    }
    return {
      token,
      role,
      username,
    }
  },

  // async userUpdateService(){
  //   let result = await mysqlDao.userUpdate({
  //     role:0,
  //     username:'阮涛',
  //   },{
  //     role:1,
  //     username:'tt',
  //   })
  // },

  async userDeleteService(userId) {
    let result = await mysqlDao.userDelete({
      role: 0,
      username: '阮涛',
    })
  },

  async userChangePasswordService({ userId, account }, oldPassword, newPassowrd) {
    let checkPassword = await mysqlDao.userSelect({
      userId: userId,
      account: account,
      password: oldPassword,
    }, 'userId')
    if (checkPassword.length > 0) {
      //原密码正确
      let result = await mysqlDao.userUpdate({
        userId: userId,
        account: account,
      }, {
        password: newPassowrd
      })
      if (result) {
        return {
          msg: '修改正确',
          code: 1,
        }
      }

    }
    else {
      return {
        msg: '原密码错误',
        code: 0,
      }
    }

  },

  async checkRole(userId) {
    let result = await mysqlDao.userSelect({
      userId: userId
    }, 'role')
    if (result.length > 0) {
      switch (result[0].role) {
        case 0: {
          return 'student'
        }
        case 1: {
          return 'teacher'
        }
        case 2: {
          return 'admin'
        }
      }
    }
  },

  async getMyInformations({ userId }) {
    let result = (await mysqlDao.userSelect({
      userId: userId,
      lineStatus: 1,
    }, 'username', 'userId', 'account', 'role'))[0]
    console.log(result);
    return result
  },

  async getOtherStudent({userId:teacherId}){
    let check
    let result = await mysqlDao.userSelect({
      role:0,
      lineStatus:1,
    })
  },
}