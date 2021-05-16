
const mysqlConfigure = require('./mysqlConfigure.js')
const mysql = require('mysql')
const connection = mysql.createConnection(mysqlConfigure.config)
connection.connect();

module.exports = connection;