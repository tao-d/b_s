<template>
  <div class="view-password">
    <section class="password">
      <p class="title">修改密码</p>
      <div class="password-content">
        <el-form
          class="passwordForm"
          status-icon
          :model="passwordForm"
          label-width="120px"
          ref="passwordForm"
          :rules="rules"
        >
          <el-form-item
            label="旧密码"
            label-position="right"
            prop="oldPassword"
          >
            <el-input
              placeholder="输入密码"
              id="oldPassword"
              v-model="passwordForm.oldPassword"
              type="password"
              size="medium"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            label-position="right"
            prop="newPassword"
          >
            <el-input
              placeholder="输入密码"
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              size="medium"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="再次输入密码"
            label-position="right"
            prop="secondPassword"
          >
            <el-input
              placeholder="输入密码"
              id="secondPassword"
              v-model="passwordForm.secondPassword"
              type="password"
              size="medium"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="btnItems" prop="btn">
            <el-button
              type="primary"
              @click="saveBtn('passwordForm')"
              class="save-btn"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import request from "../network/request.js";
export default {
  name: "password",
  data() {
    // var checkTimeout = null;
    // var checkUsername = (rule, value, callback) => {
    //   if (value === "") {
    //     callback("未输入账号");
    //     return;
    //   }
    //   clearTimeout(checkTimeout);
    //   checkTimeout = setTimeout(() => {
    //     request({
    //       url: "/api/user/findOneUser",
    //       method: "post",
    //       data: {
    //         username: `${this.passwordForm.username}`,
    //       },
    //     }).then((res) => {
    //       if (res.data === true) {
    //         callback(new Error("该账号已被注册"));
    //       } else {
    //         callback();
    //       }
    //     });
    //   }, 1500);

    // request({
    //   url:"/api/user/findOneUser",
    //   method:'post',
    //   data:{
    //     username:`${this.passwordForm.username}`
    //   }
    // }).then(res=>{

    //   if(res.data===true)
    //   {
    //     callback(new Error('该账号已被注册'))
    //   }
    //   else{
    //     callback()
    //   }
    // })
    // };
    var validatePass = (rule, value, callback) => {
      let RegExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/g;
      if (value.length < 8) {
        console.log(value.length);
        callback(new Error("新密码需要大于8位"));
      }
      if (!RegExp.test(value)) {
        callback(new Error("密码要包含数字字母 不能以数字开头 8-16位"));
      }
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.secondPassword !== undefined) {
          this.$refs.passwordForm.validateField("secondPassword");
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ifAlert: false,
      passwordForm: {
        oldPassword: ``,
        newPassword: ``,
        secondPassword: ``,
        message: ``,
      },
      rules: {
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        secondPassword: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    savePassword() {
      request({
        url: "/changePassword",
        method: "post",
        data: {
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.$notify({
            title: "修改成功",
            message: "密码修改成功",
            duration: 3000,
            type: "success",
          });
        } else {
          this.$notify({
            title: "修改失败",
            message: "原密码错误",
            duration: 3000,
            type: "error",
          });
        }
      });
    },

    saveBtn(FormName) {
      this.$refs[FormName].validate((validate) => {
        if (validate) {
          this.savePassword();
          this.ifAlert = true;
          setTimeout(() => {
            this.ifAlert = false;
            // this.$router.push("/login");
          }, 3000);
        } else {
          console.log("submit error");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.password {
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
  .password-content {
    display: flex;
    flex-wrap: wrap;
    margin-top: 50px;
    justify-content: center;
    .el-form-item {
      margin-bottom: 32px;
    }
    .save-btn {
      margin-left: 50px;
    }
  }
}
</style>