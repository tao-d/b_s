const mysqlConnect = require('../mysqlConnect.js')
//mysql的查询接口
module.exports = {
  paperSelect(where,...prop) {
    // let checkSQL = `select ${prop.join(',')} from papers where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from paper where `;
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1 '
      // let checkSQL = `select img_url from papers where 1=1 and id=?`;
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


  paperInsert(item) {
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let SQL = `insert into paper (paperId,paperType,paperStatus,teacherId,paperName,questionCount,paperMark,passMark,choiceCount,completionCount,shortAnswerCount,judgementCount,singleChoiceCount,multipleChoiceCount,createTime,updateTime,lineStatus) values
       (REPLACE(UUID(),"-",""),1,1,?,?,0,0,0,0,0,0,0,0,0,NOW(),NOW(),1)`
      // let checkSQL = `select img_url from papers where 1=1 and id=?`;
      mysqlConnect.query(SQL,[item.teacherId,item.paperName], (err, result) => {
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

  paperUpdate(where,set) {
    return new Promise((resolve, reject) => {
      let setEntries = Object.entries(set)
      let whereEntries = Object.entries(where)
      let SQL = `update paper set `
      //对UpdateSQL进行处理
      setEntries.forEach((item,index)=>{
        if(index==0)
        {
          SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
        }
        else{
          SQL+=` , ${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
        }
      })
      SQL+=' where '
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1 and lineStatus = 1'
      console.log(SQL);
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

  paperDelete(where) {
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `update paper set lineStatus = 0 `
      // let SQL = `update paper `
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


  //question
  questionSelect(where,...prop) {
    // let checkSQL = `select ${prop.join(',')} from papers where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from question where `;
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1 order by typeOrder ASC'
      // let checkSQL = `select img_url from papers where 1=1 and id=?`;
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


  questionInsert(item) {
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let SQL = `insert into question (questionId,paperId,questionType,questionName,questionContent,questionMark,answer,questionAnalysis,questionOrder,typeOrder,imgUrl,createTime,updateTime) values
       (REPLACE(UUID(),"-",""),?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`
      // let checkSQL = `select img_url from papers where 1=1 and id=?`;
      mysqlConnect.query(SQL,[item.paperId,item.questionType,item.questionName,item.questionContent,item.questionMark,item.answer,item.questionAnalysis,item.questionOrder,item.typeOrder,item.imgUrl], (err, result) => {
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

  questionUpdate(where,set) {
    return new Promise((resolve, reject) => {
      let setEntries = Object.entries(set)
      let whereEntries = Object.entries(where)
      let SQL = `update question set `
      //对UpdateSQL进行处理
      setEntries.forEach((item,index)=>{
        if(index==0)
        {
          SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
        }
        else{
          SQL+=` , ${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} `
        }
      })
      SQL+=' where '
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1 '
      console.log(SQL);
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

  questionDelete(where) {
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `delete from question `
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

  questionFindOrder(where){
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select questionOrder as od from question `
      //对UpdateSQL进行处理
      SQL+='where 1 = 1 '
      whereEntries.forEach(item=>{
        SQL+=` and ${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]}`
      })
      let mysql = mysqlConnect.query(SQL,(err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          resolve(result);
        }
      })
      console.log(mysql.sql);
    })
  },




  paperCountChange({paperId},type,count,sign){
    return new Promise((resolve, reject) => {
      // let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      let SQL
      if(sign ==='+')
      {
        SQL = `update paper set ${type} = ${type} + ${count} where paperId = '${paperId}'`
      }
      if(sign ==='-')
      {
        SQL = `update paper set ${type} = ${type} - ${count} where paperId = '${paperId}'`
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


  paperMarkChange({paperId},type,count,sign){
    return new Promise((resolve, reject) => {
      // let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      let SQL
      if(sign ==='+')
      {
        SQL = `update paper set ${type} = ${type} + ${count} where paperId = '${paperId}'`
      }
      if(sign ==='-')
      {
        SQL = `update paper set ${type} = ${type} - ${count} where paperId = '${paperId}'`
      }
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
}