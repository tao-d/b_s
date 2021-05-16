const mysqlConnect = require('../mysqlConnect.js')
//mysql的查询接口
module.exports = {
  userSelect(where,...prop) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let whereEntries = Object.entries(where)
      let SQL = `select ${prop.join(',')} from user where `;
      whereEntries.forEach(item=>{
        SQL+=`${item[0]} = ${typeof item[1]=='string'?"'"+item[1]+"'":item[1]} and `
      })
      SQL+='1 = 1 and lineStatus = 1'
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
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


  userInsert(item) {
    // let checkSQL = `select ${prop.join(',')} from users where 1=1 and id=?`;
    // console.log(checkSQL);
    return new Promise((resolve, reject) => {
      let SQL = `insert into user (userId,account,password,role,createTime,updateTime,username,lineStatus) values (REPLACE(UUID(),"-",""),?,?,?,NOW(),NOW(),?,?)`
      // let checkSQL = `select img_url from users where 1=1 and id=?`;
      mysqlConnect.query(SQL,[item.userId,item.account,item.password,item.role,item.username,1], (err, result) => {
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

  userUpdate(where,set) {
    return new Promise((resolve, reject) => {
      let setEntries = Object.entries(set)
      let whereEntries = Object.entries(where)
      let SQL = `update user set `
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

  userDelete(where) {
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
  }
}