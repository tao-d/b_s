const mysqlConnect = require('../mysqlConnect.js')
const uuid = require('uuid')
const moment = require('moment')
//mysql的查询接口
module.exports = {
  examSelect(where, ...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from exam where `;
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1 order by startTime DESC'
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
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

  //获取未完成的考试
  examListSelect(where, ...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from exam where `;
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1 and examStatus in (0,1)'
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

    //获取待批阅或者已完成的考试(老师)
    examFinishedListSelect(where, ...prop) {
      // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
      // console.log(checkSQL);
      return new Promise((resolve, reject) => {
        let whereEntries = Object.entries(where)
        let SQL = `select ${prop.join(',')} from exam where `;
        whereEntries.forEach(item => {
          SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
        })
        SQL += '1 = 1 and examStatus in (2,3) order by exam.examStatus ASC'
        // let checkSQL = `select img_url from users where 1=1 and id=?`;
        // console.log('sql',SQL);
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

        //获取待批阅或者已完成的考试(学生)
        examStudentFinishedListSelect(where, ...prop) {
          // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
          // console.log(checkSQL);
          return new Promise((resolve, reject) => {
            let whereEntries = Object.entries(where)
            let SQL = `select ${prop.join(',')} from exam,exammaking where `;
            whereEntries.forEach(item => {
              SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
            })
            SQL += `1 = 1 and exam.examStatus in (2,3) and exam.examId = exammaking.examId 
            order by exam.examStatus DESC,exam.endTime DESC`
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

        //获取已完成的考试
        examFinishedMarkListSelect(where, ...prop) {
          // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
          // console.log(checkSQL);
          return new Promise((resolve, reject) => {
            let whereEntries = Object.entries(where)
            let SQL = `select ${prop.join(',')} from exam where `;
            whereEntries.forEach(item => {
              SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
            })
            SQL += '1 = 1 and examStatus in (3)'
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

  examInsert(item) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    console.log(item);
    return new Promise((resolve, reject) => {
      const formatedUUID = uuid.v1().replace(/-/g, '');
      // let SQL = `insert into exam (examId,teacherId,examName,startTime,paperId,classId,endTime,examStatus,examMark,passMark,lineStatus) values (REPLACE(UUID(),"-",""),?,?,?,?,?,?,?,?,?,1)`
      let SQL = `insert into exam (examId,teacherId,examName,startTime,paperId,classId,endTime,examStatus,examMark,passMark,lineStatus) values (?,?,?,?,?,?,?,?,?,?,1)`
      console.log(SQL);
      let mysql = mysqlConnect.query(SQL, [formatedUUID, item.teacherId, item.examName, new Date(item.startTime), item.paperId, item.classId, new Date(item.endTime), item.examStatus, item.examMark, item.passMark], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(formatedUUID);
        }
      })
    })
  },

  examUpdate(where, set) {
    return new Promise((resolve, reject) => {
      let setEntries = Object.entries(set)
      let whereEntries = Object.entries(where)
      let SQL = `update exam set `
      //对UpdateSQL进行处理
      setEntries.forEach((item, index) => {
        if (index == 0) {
          SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} `
        }
        else {
          SQL += `, ${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} `
        }
      })
      SQL += ' where '
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1'
      // console.log(SQL);
      mysqlConnect.query(SQL, (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          // console.log(SQL);
          resolve(result);
        }
      })
    })
  },
  //因为更新时间需要特殊格式
  examUpdateTime(where, set) {
    console.log(set.startTime,set.endTime);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `update exam set startTime= ?,endTime= ? `
      //对UpdateSQL进行处理
      SQL += ' where '
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1'
      // console.log(SQL);
      mysqlConnect.query(SQL,[new Date(set.startTime),new Date(set.endTime)], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },

  examDelete(where) {
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `update user set lineStatus = 0 `
      //对UpdateSQL进行处理
      SQL += 'where 1 = 1 '
      whereEntries.forEach(item => {
        SQL += ` and ${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]}`
      })
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

  notInClassStudent(where, ...prop) {
    return new Promise((resolve, reject) => {
      let SQL = `select ${prop.join(',')} from user where lineStatus = 1 and role = 0 and userId not exist (
        select studentId as userId from studentAndclass where teacherId = ? and classId = ?
      )`
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
      mysqlConnect.query(SQL, [where.teacherId, where.classId], (err, result) => {
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

  InExamStudent(where, ...prop) {
    return new Promise((resolve, reject) => {
      let SQL = `select ${prop.join(',')} from studentandgrade where paper = ? and classId = ? and examId = ? `
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
      mysqlConnect.query(SQL, [where.paperId, where.classId, where.examId], (err, result) => {
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

  studentAndGradeDelete(where) {
    return new Promise((resolve, reject) => {
      // let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      let SQL = `delete from studentandclass where teacherId = ? and classId = ? `
      mysqlConnect.query(SQL, [where.teacherId, where.classId, where.classArray], (err, result) => {
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

  studentAndGradeSelect(where, ...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from studentgrade,user,exammaking where user.userId = studentgrade.studentId and 
      exammaking.examId = studentgrade.examId and exammaking.studentId = studentgrade.studentId and `;
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1'
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

  studentAndGradeUpdate(where, set) {
    return new Promise((resolve, reject) => {
      let setEntries = Object.entries(set)
      let whereEntries = Object.entries(where)
      let SQL = `update studentgrade set `
      //对UpdateSQL进行处理
      setEntries.forEach((item, index) => {
        if (index == 0) {
          SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} `
        }
        else {
          SQL += `, ${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} `
        }
      })
      SQL += ' where '
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1'
      console.log(SQL);
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

  studentAndGradeInsert(item) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    console.log(item);
    return new Promise((resolve, reject) => {
      const formatedUUID = uuid.v1().replace(/-/g, '');
      // let SQL = `insert into exam (examId,teacherId,examName,startTime,paperId,classId,endTime,examStatus,examMark,passMark,lineStatus) values (REPLACE(UUID(),"-",""),?,?,?,?,?,?,?,?,?,1)`
      let SQL = `insert into studentgrade (studentGradeId,examId,studentId,studentGrade,detail,gradeStatus,createTime,updateTime,lineStatus) values (?,?,?,?,?,?,NOW(),NOW(),1)`
      console.log(SQL);
      let mysql = mysqlConnect.query(SQL, [formatedUUID, item.examId, item.studentId, item.studentGrade, item.detail, item.gradeStatus], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(formatedUUID);
        }
      })
    })
  },

  


  studentCountChange({ classId }, count, sign) {
    return new Promise((resolve, reject) => {
      // let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      let SQL
      if (sign === '+') {
        SQL = `update examclass set studentCount = studentCount + ${count} where classId = '${classId}'`
      }
      if (sign === '-') {
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


  studentAndClassInserts({ classId, teacherId }, value) {
    return new Promise((resolve, reject) => {

      value = value.map((item) => {
        return `('${item}','${teacherId}','${classId}',NOW())`
      })
      let SQL = `insert into studentandclass (studentId,teacherId,classId,createTime) values ` + value.join(',')
      // value.forEach(item=>{
      //   SQL+=`('${item}','${teacherId}','${classId}'),`
      // })
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
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

  


  examMakingInsert({ examId, studentId, lineStatus,examOrder }, value) {
    return new Promise((resolve, reject) => {

      // value = value.map((item)=>{
      //   return `('${item}','${teacherId}','${classId}',NOW())`
      // })
      let SQL = `insert into exammaking (examId,studentmaking,studentId,lineStatus,examOrder,makingStatus) values (?,?,?,?,?,0)`
      mysqlConnect.query(SQL, [examId, null, studentId, lineStatus,examOrder], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },
  examMakingSelect(where, ...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from exammaking where `;
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1 '
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      console.log(SQL);
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
  examMakingUpdate(where, set) {
    return new Promise((resolve, reject) => {
      let setEntries = Object.entries(set)
      let whereEntries = Object.entries(where)
      let SQL = `update exammaking set `
      //对UpdateSQL进行处理
      setEntries.forEach((item, index) => {
        if (index == 0) {
          SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} `
        }
        else {
          SQL += `, ${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} `
        }
      })
      SQL += ' where '
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1'
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







  examingInsert({ examId, lineStatus, questionType, questionOrder, typeOrder, updateTime, createTime, questionContent, answer, questionName, questionMark, questionAnalysis ,imgUrl}) {
    return new Promise((resolve, reject) => {

      // value = value.map((item)=>{
      //   return `('${item}','${teacherId}','${classId}',NOW())`
      // })
      const formatedUUID = uuid.v1().replace(/-/g, '');
      let SQL = `insert into examing (examId,examQuestionId,lineStatus,questionType,questionOrder,typeOrder,updateTime,createTime,questionContent,answer,questionName,questionMark,questionAnalysis,imgUrl) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      mysqlConnect.query(SQL, [examId, formatedUUID, lineStatus, questionType, questionOrder, typeOrder, updateTime, createTime, questionContent, answer, questionName, questionMark, questionAnalysis,imgUrl], (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          resolve(result);
        }
      })
    })
  },

  examingSelect(where, ...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from examing where `;
      whereEntries.forEach(item => {
        SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      })
      SQL += '1 = 1'
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
  //teacher
  examingTeacherSelect(where, ...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from examing,exam where examing.examId = exam.examId and exam.teacherId = ? and examing.examId = ? 
      order by questionOrder ASC`;
      // whereEntries.forEach(item => {
      //   SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      // })
      // SQL += '1 = 1'
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      console.log(SQL);
      mysqlConnect.query(SQL,[where.teacherId,where.examId], (err, result) => {
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

    //student
    examingStudentSelect(where, ...prop) {
      // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
      // console.log(checkSQL);
      return new Promise((resolve, reject) => {
        // let whereEntries = Object.entries(where)
        let SQL = `select ${prop.join(',')} from examing,exammaking where exammaking.studentId = '${where.studentId}' and examing.examId = '${where.examId}' and exammaking.examId = examing.examId
        order by examing.questionOrder ASC`;
        // whereEntries.forEach(item => {
        //   SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
        // })
        // SQL += '1 = 1'
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


  examStudentListMarking(where, ...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from exam,exammaking,user,studentgrade where studentgrade.examId = exam.examId and studentgrade.studentId = exammaking.studentId and exammaking.studentId = user.userId and exam.examId = exammaking.examId and
      exam.teacherId = ? and exammaking.examId = ? order by exammaking.examOrder ASC`;
      // whereEntries.forEach(item => {
      //   SQL += `${item[0]} = ${typeof item[1] == 'string' ? "'" + item[1] + "'" : item[1]} and `
      // })
      // SQL += '1 = 1'
      // // let checkSQL = `select img_url from users where 1=1 and id=?`;
      // console.log(SQL);
      mysqlConnect.query(SQL,[where.teacherId,where.examId], (err, result) => {
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


  examQuestionSelect(where, ...prop) {
    return new Promise((resolve, reject) => {
      // let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from question where questionId in( ${questionId} )`;
      // whereEntries.forEach(item=>{
      //   SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      // })
      // SQL+='1 = 1'
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

  gradeMarkChange({ examId,studentId }, count, sign) {
    return new Promise((resolve, reject) => {
      // let SQL = `delete from studentandclass where teacherId = ? and classId = ? and studentId not in (?)`
      let SQL
      if (sign === '+') {
        SQL = `update studentgrade set studentGrade = studentGrade + ${count} where examId = '${examId}' and studentId = '${studentId}'`
      }
      if (sign === '-') {
        SQL = `update studentgrade set studentGrade = studentGrade - ${count} where examId = '${examId}' and studentId = '${studentId}'`
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



}