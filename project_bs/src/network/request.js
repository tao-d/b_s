import axios from 'axios'
import Router from '../router/index.js'
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

//请求拦截器
request.interceptors.request.use(req => {
  //在拦截器中设置请求头token
  let token = null
  //查询sessionStorage
  // console.log(window.sessionStorage.getItem(token));
  //需要添加Bearer 在token之前
  if (window.localStorage.getItem('token')) {
    token = window.localStorage.getItem('token')
    token = window.localStorage.getItem('token')
    req.headers.Authorization = 'Bearer '+token;
  }
  return req

}, err => {
  return Promise.reject(err)
});


//响应拦截器

request.interceptors.response.use(res => {

  // console.log(res);
  return res


}, error => {
  if (error && error.response) {
      switch (error.response.status) {
          case 400:
              error.message = '错误请求';
              alert(error.message)
              break;
          case 401:
              error.message = '未授权，请重新登录';
              alert(error.message)
              Router.push('/login')
              break;

          default:
              error.message = `连接错误${error.response.status}`;
              alert(error.message)
      }
  } 

  return Promise.reject(error);
})


export default request