const mysqlConnect = require('../mysqlConnect.js')
const uuid = require('uuid')
//mysql的查询接口
module.exports = {
  classSelect(where,...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from examclass where `;
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1'
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
      mysqlConnect.query(SQL, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          // console.log(result);
          resolve(result);
        }
      })
    })
  },

  classInsert(item) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    console.log(item);
    return new Promise((resolve, reject) => {
      let SQL = `insert into examclass (classId,teacherId,studentIds,classStatus,className,studentCount,classInformations,classCount,course,createTime,updateTime,lineStatus) values (REPLACE(UUID(),"-",""),?,NULL,?,?,?,?,?,?,NOW(),NOW(),1)`
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      console.log(SQL);
      mysqlConnect.query(SQL,[item.teacherId,item.classStatus,item.className,item.studentCount,item.classInformations,item.classCount,item.course], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },

  classUpdate(where,set) {
    return new Promise((resolve, reject) => {
      let setEntries = Object.entries(set)
      let whereEntries = Object.entries(where)
      let SQL = `update examclass set `
      //对UpdateSQL进行处理
      setEntries.forEach((item,index)=>{
        if(index==0)
        {
          SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
        }
        else{
          SQL+=`, ${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
        }
      })
      SQL+=' where '
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1'
      console.log(SQL);
      mysqlConnect.query(SQL,(err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },

  classDelete(where) {
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `update user set lineStatus = 0 `
      //对UpdateSQL进行处理
      SQL+='where 1 = 1 '
      whereEntries.forEach(item=>{
        SQL+=` and ${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]}`
      })
      mysqlConnect.query(SQL,(err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          resolve(result);
        }
      })
    })
  },

  notInClassStudent(where,...prop){
    return new Promise((resolve, reject) => {
      let SQL = `select ${prop.join(',')} from user where lineStatus = 1 and role = 0 and userId not exist (
        select studentId as userId from studentAndclass where teacherId = ? and classId = ?
      )`
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
      mysqlConnect.query(SQL,[where.teacherId,where.classId], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          resolve(result);
        }
      })
    })
  },

  InClassStudent(where,...prop){
    return new Promise((resolve, reject) => {
      let SQL = `select ${prop.join(',')} from studentAndclass where teacherId = ? and classId = ? `
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
      mysqlConnect.query(SQL,[where.teacherId,where.classId], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          resolve(result);
        }
      })
    })
  },

  studentAndClassDelete(where){
    return new Promise((resolve, reject) => {
      // let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      mysqlConnect.query(SQL,[where.teacherId,where.classId,where.classArray], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          resolve(result);
        }
      })
    })
  },


  studentCountChange({classId},count,sign){
    return new Promise((resolve, reject) => {
      // let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      let SQL
      if(sign ==='+')
      {
        SQL = `update examclass set studentCount = studentCount + ${count} where classId = '${classId}'`
      }
      if(sign ==='-')
      {
        SQL = `update examclass set studentCount = studentCount - ${count} where classId = '${classId}'`
      }
      mysqlConnect.query(SQL, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },


  studentAndClassInserts({classId,teacherId},value){
    return new Promise((resolve, reject) => {
      
      value = value.map((item)=>{
        return `('${item}','${teacherId}','${classId}',NOW())`
      })
      let SQL = `insert into studentandclass (studentId,teacherId,classId,createTime) values `+value.join(',')
      // value.forEach(item=>{
      //   SQL+=`('${item}','${teacherId}','${classId}'),`
      // })
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
      mysqlConnect.query(SQL,(err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },

  studentAndClassSelect(where,...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from studentandclass where `;
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1'
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      console.log(SQL);
      mysqlConnect.query(SQL, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          resolve(result);
        }
      })
    })
  },

  studentClassDetail(where,...prop){
    return new Promise((resolve, reject) => {
      let SQL = `select ${prop.join(',')} from studentandclass as a,user where teacherId = ? and classId = ? and user.role = 0 and user.lineStatus = 1 and a.studentId = user.userId
      order by a.classOrder ASC`;
      mysqlConnect.query(SQL,[where.teacherId,where.classId],(err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          resolve(result);
        }
      })
    })
  },
  classOrderUpdate(where,set) {
    return new Promise((resolve, reject) => {
      // let setEntries = Object.entries(set)
      // let whereEntries = Object.entries(where)
      // let SQL = `update examclass set `
      // let SQL = `set @row=0;
      // update studentandclass t1,
      // (select *,@row:=@row+1 rowid
      //  from studentandclass,user
      //  where studentandclass.studentId = user.userId
      //  order by convert(user.username using gbk) asc
      //  ) t2
      //  set t1.order=t2.rowid
      //  where examId = '${where.classId}'`

      // let SQL = `select user.username from studentandclass,user
      // where studentandclass.studentId = user.userId and studentandclass.classId = '${where.classId}'
      // order by convert(user.username using gbk) asc`

      let SQL = `update studentandclass a,
      (select (@i:=@i+1) as i,studentandclass.studentId from studentandclass,user,(SELECT @i:= 0) b where studentandclass.studentId = user.userId and studentandclass.classId = '${where.classId}' order by convert(user.username using gbk) asc) b 
      set a.classOrder = b.i where a.classId = '${where.classId}' and b.studentId = a.studentId`
      // let SQL = `select @rank:=@rank + 1 AS rank_no,studentandclass.studentId from studentandclass,user,(SELECT @rank:= 0) b where studentandclass.studentId = user.userId and studentandclass.classId = '${where.classId}' order by convert(user.username using gbk) asc`
      //对UpdateSQL进行处理
      // setEntries.forEach((item,index)=>{
      //   if(index==0)
      //   {
      //     SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
      //   }
      //   else{
      //     SQL+=`, ${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
      //   }
      // })
      // SQL+=' where '
      // whereEntries.forEach(item=>{
      //   SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      // })
      // SQL+='1 = 1'
      console.log(SQL);
      mysqlConnect.query(SQL,(err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },
}