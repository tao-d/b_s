var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');



var app = express();
const bodyParser = require('body-parser')
const userRoute = require('./routes/api/userApi.js')
const classRoute = require('./routes/api/classApi.js')
const paperRoute = require('./routes/api/paperApi.js')
const examRoute = require('./routes/api/examApi.js')
const expressJWT = require('express-jwt')
const jwt = require('./dao/jwt.js')
const run = require('./service/run.js').start()


//cors解决跨域问题
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  // res.header('Access-Control-Allow-Headers', "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());





//token验证
app.use((req,res,next)=>{
  let token = req.headers['authorization'];
  // console.log(token);
    if(token==undefined)
    {
      return next()
    }
    else{
      jwt.verifyToken(token).then(data=>{
        req.data = data
        console.log('data',data);
        return next()
      }).catch(err=>{
        return next()
      })
    }
  })
  
  
  //使用expressJWT验证token是否正确
  app.use(expressJWT({
    secret:'exam_bs',
    algorithms:['HS256']
  }).unless({
    path:['/login','/register'],
  }))

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/',userRoute)
app.use('/api/class',classRoute)
app.use('/api/paper',paperRoute)
app.use('/api/exam',examRoute)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
