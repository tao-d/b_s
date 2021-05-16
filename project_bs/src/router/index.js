import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const login = () => import('@/views/login/login.vue')
const index = () => import('@/views/index/index.vue')
const zxks = () => import('@/views/index/zxks.vue')
const teacher = () => import('@/views/teacher/teacher.vue')
const password = () => import('@/views/password.vue')
const classManager = () => import('@/views/teacher/classManager.vue')
const paperManager =  () => import('@/views/teacher/paperManager.vue')
const examManager =  () => import('@/views/teacher/examManager.vue')
const addExam =  () => import('@/views/teacher/addExam.vue')
const studentExam =  () => import('@/views/index/studentExam.vue')
const examMarking =  () => import('@/views/teacher/examMarking.vue')
const marking =  () => import('@/views/teacher/marking.vue')
const markDetail =  () => import('@/views/teacher/markDetail.vue')
const studentMark =  () => import('@/views/index/studentMark.vue')
const studentMarkDetail =  () => import('@/views/index/studentMarkDetail.vue')
// const Profile = ()=>import('../views/Profile/Profile.vue')
const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/examing',
    name: '/examing',
    component: studentExam
  },

  {
    path: '/teacher',
    name: 'teacher',
    component: teacher,
    meta: { title:"首页" },
    children: [
      {
        path: 'examMarking',
        name: 'examMarking',
        component: examMarking,
        meta: { title:"阅卷管理"}
      },
      {
        path: 'markDetail',
        name: 'markDetail',
        component: markDetail,
        meta: { title:"成绩统计"}
      },
      {
        path: 'zxks',
        name: 'zxks',
        component: zxks,
        meta: { title:"在线考试"}
      },
      {
        path: 'password',
        name: 'password',
        component: password,
        meta: { title:"修改密码"},
      },
      {
        path: 'classManager',
        name: 'classManager',
        component: classManager,
        meta: { title:"班级管理"},
      },
      {
        path: 'paperManager',
        name: 'paperManager',
        component: paperManager,
        meta: { title:"试卷管理"},
      },
      {
        path: 'marking',
        name: 'marking',
        component: marking,
        meta: { title:"考试阅卷"},
      },
      {
        path: 'examManager',
        name: 'examManager',
        component: examManager,
        meta: { title:"考试管理"},
        children:[
          {
            path: 'addExam',
            name: 'addExam',
            component: addExam,
            meta: { title:"试卷管理"},
          },
        ]
      },
      {
        path: 'addExam',
        name: 'addExam',
        component: addExam,
        meta: { title:"新建考试"},
      },
    ]
  },
  {
    path: '/index',
    name: 'index',
    component: index,
    meta: { title:"首页" },
    children: [
      {
        path: 'zxks',
        name: 'zxksI',
        component: zxks,
        meta: { title:"在线考试"}
      },
      {
        path: 'studentMark',
        name: 'studentMark',
        component: studentMark,
        meta: { title:"我的成绩"},
      },
      {
        path: 'studentMarkDetail',
        name: 'studentMarkDetail',
        component: studentMarkDetail,
        meta: { title:"成绩详情"},
      },
      {
        path: 'password',
        name: 'passwordI',
        component: password,
        meta: { title:"修改密码"},
      },
    ]
  },
  // {
  //   path: '/profile',
  //   name:'profile',
  //   component: Profile
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});


export default router;
