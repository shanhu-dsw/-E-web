<template>
  <div class="login">
    <div class="div1">
      <div style="margin-top: 100px; font-size: 50px;text-align: center;">津北公安</br>E监督</div>
      <div style="margin-top: 30px; font-size: 15px">欢迎使用本系统</div>
    </div>
    <div class="div2">
      <div style="
          width: 100%;
          align-self: flex-end;
          display: flex;
          justify-content: center;
        ">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <!-- <div class="title">系统登录</div>

        <div
          style="
            margin-top: 60px;
            margin-bottom: 30px;
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            color: #bac4d2;
          "
        >
          请输入账号密码登录系统
        </div> -->

          <div style="
              width: 100%;
              font-size: 30px;
              text-align: center;
              margin-bottom: 50px;
            ">
            系统登录
          </div>

          <div style="
              width: 100%;
              font-size: 15px;
              color: #bac4d2;
              text-align: center;
              margin-bottom: 30px;
            ">
            请输入账号密码登录系统
          </div>

          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
            >
              <template slot="prepend"><svg-icon icon-class="user" /></template>
              <!-- <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            /> -->
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <template slot="prepend"><svg-icon icon-class="password" /></template>
              <!-- <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            /> -->
            </el-input>
          </el-form-item>

          <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
          >记住密码</el-checkbox>
          <el-form-item style="width: 100%; margin-top: 20px">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <div
              style="float: right"
              v-if="register"
            >
              <router-link
                class="link-type"
                :to="'/register'"
              >立即注册</router-link>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div style="
          font-size: 12px;
          letter-spacing: 1px;
          align-self: flex-end;
          width: 100%;
          text-align: center;
          margin-bottom: 10px;
        ">
        天津市公安局河北分局
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then((resp) => {
              console.log("用户信息", resp);
              if (
                resp.role_name == "superadmin" ||
                resp.role_name == "admin" ||
                (resp.role_name == "ds_admin" &&
                  ((resp.department_uuid2_name.indexOf("督察审计支队") != -1 &&
                    resp.full_name.indexOf("督察审计支队二大队") == -1) ||
                    resp.department_uuid2_type == "分局"))
              ) {
                this.$router.push({ path: "/screen" }).catch(() => {});
              } else {
                this.$router.push({ path: "/" }).catch(() => {});
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scope >
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: "宋体";
  background: #dbdbdb;
  padding: 10vh 20vh;
}

.div1 {
  display: flex;
  width: 450px;
  height: 620px;
  background-image: url("../assets/images/Background.png");
  background-size: 100% 100%;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.div2 {
  display: flex;
  height: 620px;
  flex-flow: row wrap;
  align-items: center;
  background: #fff;
  width: 650px;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
