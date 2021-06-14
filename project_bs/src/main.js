import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './network/request.js'
import moment from 'moment'
import * as echarts from 'echarts'
//import {request, requestMysql} from './network/index'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// import Quill from 'quill's
// import { ImageExtend} from 'quill-image-extend-module'
// import ImageResize from 'quill-image-resize-module'
// Quill.register('modules/ImageExtend', ImageExtend)
// Quill.register('modules/imageResize', ImageResize)
// 将富文本编辑器，注册为全局可用组件
// Vue.use(Quill)
Vue.use(VueQuillEditor)




import { 
  
  MessageBox,
  Popover,
  Message,
  Button,
  Select,
  Input,
  Form,
FormItem,
Container,
Header,
Breadcrumb,
BreadcrumbItem,
Aside,
Main,Menu,
MenuItem,
MenuItemGroup,
Row,
Col,
Avatar,
Radio,
RadioButton,RadioGroup,
Calendar,Loading,
Dialog,DatePicker,
Table,
Upload,
TableColumn,
Tag,
Alert,
Submenu,
Notification,
Pagination,
Transfer,
Tree,
Tabs,Step,Steps,
TabPane,Option,Checkbox,Card,ButtonGroup,Collapse,CollapseItem,Backtop,Icon} from 'element-ui';

Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$moment = moment
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$request = request
Vue.prototype.$echarts = echarts

Vue.use(Loading.directive);
Vue.use(Backtop)
Vue.use(Icon)
Vue.use(Upload)
Vue.use(ButtonGroup)
Vue.use(CollapseItem)
Vue.use(Collapse)
Vue.use(Tabs)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Card)
Vue.use(Checkbox)
Vue.use(Option)
Vue.use(TabPane)
Vue.use(Tree)
Vue.use(Transfer)
Vue.use(Pagination)
Vue.use(Submenu)
Vue.use(Popover)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Calendar)
Vue.use(RadioButton)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(Avatar)
Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Select)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



