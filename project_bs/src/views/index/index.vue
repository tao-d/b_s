<template>
  <div class="index">
    <el-container>
      <el-aside class="row-left" :width="'250px'">
        <div class="logo">
          <img src="../../assets/exam.png" alt="" />
          <h2>在线考试系统</h2>
        </div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo nav"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>在线考试</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/index/zxks">
                <template slot="title">
                  <i class="el-icon-lock"></i>
                  <span>在线考试</span>
                </template>
              </el-menu-item>
              <el-menu-item index="/index/studentMark">
                <template slot="title">
                  <i class="el-icon-lock"></i>
                  <span>我的成绩</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>个人设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/index/password">
                <template slot="title">
                  <i class="el-icon-lock"></i>
                  <span>修改密码</span>
                </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="row-right">
        <el-header class="header" height="100px">
          <div class="top-bar">
            <div class="bread">
              <el-breadcrumb separator="/" id="breadcrumb">
                <el-breadcrumb-item
                  v-for="item in levellist"
                  :key="item.meta.title"
                  >{{ item.meta.title }}</el-breadcrumb-item
                >
              </el-breadcrumb>
            </div>
            <div class="mine-box" v-if="myInformations">
              <el-popover
                placement="bottom"
                width="80"
                trigger="hover"
                class="login-pop"
              >
                <div class="mine-item" slot="reference">
                  <div class="mine">
                    <el-avatar class="avatar">{{
                      myInformations.username
                    }}</el-avatar>
                  </div>
                  <span class="name">{{ myInformations.username }}</span>
                </div>
                <el-button type="text" class="pop-button" @click="signOut">退出</el-button>
              </el-popover>

              <div class="identity">
                <div>身份:{{ myInformations.role == 1 ? "教师" : "学生" }}</div>
              </div>
            </div>
          </div>
          <section class="route">
            <!-- <el-tag
              :key="tag"
              v-for="tag in tagList"
              closable
              :disable-transitions="true"
              size="small"
              type="info"
              class="item"
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag> -->
          </section>
        </el-header>
        <el-main class="main" style="height: 0; flex-grow: 1">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <el-backtop target=".main"></el-backtop>
    <!-- <div class="top">
      <el-row>
        <el-col :span="18">
          <div class="top-bar-left">
            <b class="logo">在线考试系统</b>
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              background-color='rgb(140, 197, 255)'
              text-color='#303133'
            >
              <el-menu-item index="1">首页</el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="top-bar-right">
            <div class="mine-box">
              <div class="mine">
                <el-avatar class="avatar">阮涛</el-avatar>
              </div>
              <span class="name">阮涛</span>
            </div>
            <div class="identity">
              <div>身份:学生</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div> -->

    <!-- <section class="exam">
      <p class="title">在线考试</p>
      <div class="exam-content">
        <exam-item
          v-for="(item, index) in examList"
          :key="index"
          v-bind="item"
          :ref="'item' + index"
          :data-index="index"
          @itemClick="test"
        ></exam-item>
      </div>
    </section> -->
    <el-row>
      <el-col :span="20" class="row-right"> </el-col>
    </el-row>
  </div>
</template>

<script>
// import examItem from "./examItem.vue";
export default {
  name: "index",
  data() {
    return {
      activeIndex: "1",
      activeMenu: "",
      levellist: null,
      myInformations: null,
      examList: [
        {
          examName: "数学",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "已完成",
          examId: "asdasd1",
        },
        {
          examName: "语文",
          examTime: "2021年1月22日",
          examDuration: "14:00-16:00",
          examStatus: "未开始",
          examId: "asdassadddd",
        },
      ],
      tagList: ["标签一", "标签二"],
    };
  },
  mounted() {
    this.getlevellist();
    this.activeMenu = this.$route.path;
  },
  watch: {
    $route() {
      this.getlevellist();
    },
  },
  created() {
    this.getMyInformations();
  },
  components: {
    // examItem,
  },
  methods: {

    signOut(){
      window.localStorage.removeItem('token')
      this.$router.replace('/login')
    },

    //获取自己个人信息
    getMyInformations() {
      this.$request({
        url: "/getMyInformations",
        method: "post",
      }).then((res) => {
        this.myInformations = res.data;
        this.$store.commit('setUser',res.data)
        console.log(res);
      });
    },

    getlevellist() {
      console.log(1);
      let matched = this.$route.matched;
      this.levellist = matched;
      console.log(this.levellist);
    },
    clickExamItem(event) {
      console.log(this.$refs);
      console.log(event);
    },
    test(string) {
      console.log(string);
    },
    handleClose(tag) {
      this.tagList.splice(this.tagList.indexOf(tag), 1);
    },
  },
};
</script>

<style lang="less" scoped>
.index {
  // background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  max-width: 1920px;
  margin: 0 auto;
  .top {
    height: 80px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.5);
    // background-color:#97cbff;
    .top-bar-left {
      height: 80px;
      background-color: rgb(140, 197, 255);
      display: flex;
      align-items: center;
      .logo {
        color: #303133;
        margin-left: 20px;
        font-size: 32px;
        // letter-spacing: 1.5px;
      }
    }
    .top-bar-right {
      height: 80px;
      color: #303133;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      background-color: rgb(140, 197, 255);
    .mine-box {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 100%;
      .mine-item {
        display: flex;
        cursor: pointer;
        align-items: center;
      }

      .mine {
        .avatar {
          cursor: pointer;
        }
      }
      .name {
        margin-left: 15px;
        cursor: pointer;
      }
      .identity {
        margin-left: 50px;
      }
    }
      .identity {
        margin-left: 50px;
      }
    }
  }

  .exam {
    // background: grey;
    margin-top: 20px;
    margin-left: 50px;
    margin-right: 50px;
    .title {
      font-size: 28px;
      // margin-left:60px ;
      position: relative;
      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 5px;
        height: 28px;
        background-color: rgb(140, 197, 255);
        border-radius: 5px;
        top: 5px;
        left: -10px;
      }
    }
    .exam-content {
      display: flex;
      margin-top: 20px;
    }
  }
}
.row-left {
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  .logo {
    display: flex;
    flex-direction: row;
    flex: 0;
    justify-content: center;
    align-items: center;
    background-color: #545c64;
    h2 {
      margin-top: 20px;
      margin-bottom: 20px;
      margin-left: 10px;
      color: white;
    }
    img {
      width: 32px;
      height: 32px;
    }
  }
  .nav {
    flex: 1;
  }
}
.row-right {
  .header {
    height: 100px;
    padding: 0;
  }
  .top-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    // box-sizing: border-box;
    padding: 0 50px;
    color: white;
    background-color: #9da3a8;
    height: 60px;
    .bread {
      color: white;
      .el-breadcrumb__inner {
        color: white;
      }
    }
    .mine-box {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      height: 100%;
      .mine-item {
        display: flex;
        cursor: pointer;
        align-items: center;
      }
      .mine {
        .avatar {
          cursor: pointer;
        }
      }
      .name {
        margin-left: 15px;
        cursor: pointer;
      }
      .identity {
        margin-left: 50px;
      }
    }
  }
  .route {
    height: 40px;
    background: white;
    box-shadow: 0px 5px 10px 1px rgb(228, 228, 228);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    .item {
      margin-left: 5px;
      cursor: pointer;
    }
  }

  .main {
  }
}
.pop-button {
  margin-left: 55px;
  color: #303133;
}

</style>