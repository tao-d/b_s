const classMysqlDao = require('../dao/mysql/classMysql.js')
const userService = require('./userService.js')
const userMysqlDao = require('../dao/mysql/userMysql.js')
module.exports = {
  async createClass({ userId: teacherId }, { classStatus, className, classCount, classInformations, course }) {
    //判断身份
    let role = await userService.checkRole(teacherId)
    let result = null
    console.log(role);
    if (role == 'teacher') {
      result = await classMysqlDao.classInsert({
        teacherId, classStatus, className, classCount, classInformations, course,
        studentCount:0,
      })
    }
    return result
  },

  async getMyClassList({ userId: teacherId }) {
    let result = await classMysqlDao.classSelect({
      lineStatus: 1,
      teacherId: teacherId,
    }, '*')
    
    return result
  },
  async updateClass({ userId: teacherId }, { classId, course,
    className,
    classCount,
    classInformations }) {
    let result = await classMysqlDao.classUpdate({
      teacherId,
      classId
    }, {
      course,
      classInformations,
      classCount,
      className,
    })
    if (result) {
      return {
        msg: '修改正确',
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

  async deleteClass({userId:teacherId},{classId}){
    let result = await classMysqlDao.classUpdate({
      teacherId,
      classId,
    },{
      lineStatus:0,
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

  async classStudent({userId:teacherId},{ classId}){
    // let result = await classMysqlDao.notInClassStudent({
    //   teacherId,classId,
    // },'userId','account','username')
    let result = []
    let studentAll = await userMysqlDao.userSelect({
      lineStatus:1,
      role:0,
    },'userId','account','username')
    let userIn = await classMysqlDao.InClassStudent({
      teacherId,classId
    },'studentId')
    //提取班级内存在的studentId组成新数组
    let userInArray = userIn.map((item)=>{
        return item.studentId
    }) 
    studentAll.forEach((item,index)=>{
      if(userInArray.indexOf(item.userId)!=-1)
      {
        studentAll[index].thisClass = true
      }
      else{
        studentAll[index].thisClass = false
      }
    })
    return studentAll
  },

  async changeClassStudent({userId:teacherId},{studentData,classId}){
    //先删除，后添加
    let decrease = 0
    let increase = 0
    let value = []   //需要添加到表里的学生数据
    let result = null
    //获取班级学生信息列表
    let classArray = studentData.map(item=>{
      return item.data.studentId
    });
    console.log('classArray',classArray);
    //删除移除的学生信息
    decrease = (await classMysqlDao.studentAndClassDelete({
      classArray:classArray.length>0?classArray:'1'
      ,classId,teacherId
    })).affectedRows
    //获取删除后依然存在的学生信息列表
    let already = await classMysqlDao.studentAndClassSelect({
      classId,teacherId
    },'studentId')
    let alreadyStudent = already.map(item=>{
      return item.studentId
    });
    for(let i = 0;i<classArray.length;i++){
      if(alreadyStudent.indexOf(classArray[i])==-1)
      {
        value.push(classArray[i])
      }
    }
    //增加
    if(value.length>0)
    {
      increase = (await classMysqlDao.studentAndClassInserts({
        classId,teacherId
      },value)).affectedRows
    }
    //更新实际人数
    if(increase>decrease)
    {
      await classMysqlDao.studentCountChange({
        classId
      },increase-decrease,'+')
    }
    else{
      await classMysqlDao.studentCountChange({
        classId
      },decrease-increase,'-')
    }
    //更新班级学生的序号。按姓名首字母排序
    //  ?
    console.log(await classMysqlDao.classOrderUpdate({
      classId:classId,
    })); 

    return{
      msg:'修改成功',
      code:1,
    }
  },

  async myClassStudentDetail({userId:teacherId},{classId})
  {
    let result = classMysqlDao.studentClassDetail({
      teacherId,classId
    },'user.account','user.username','a.createTime','user.role','user.sex','a.classOrder')
    console.log(result);
    return result
  }

}