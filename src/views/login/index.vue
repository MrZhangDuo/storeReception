<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">登陆页面</h3>
      </div>

      <el-form-item prop="userAccount">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userAccount"
          v-model="loginForm.userAccount"
          placeholder="userAccount"
          name="userAccount"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="userPass">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="userPass"
            v-model="loginForm.userPass"
            :type="passwordType"
            placeholder="userPass"
            name="userPass"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    // 账号验证
    const validateUserAccount = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    // 密码验证
    const validateUserPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于六位'))
      } else {
        callback()
      }
    }
    return {
      // 登录页面默认值
      loginForm: {
        userAccount: 'admin',
        userPass: '111111'
      },
      // 账号和密码验证
      loginRules: {
        userAccount: [{ required: true, trigger: 'blur', validator: validateUserAccount }],
        userPass: [{ required: true, trigger: 'blur', validator: validateUserPass }]
      },
      // 类型:密码类型
      passwordType: 'password',
      capsTooltip: false,
      // 是否加载中的状态
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },

  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    // 查看密码 || 隐藏密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.userPass.focus()
      })
    },
    // 回车登录 || 点击登录按钮登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)

            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })// 登录成功后重定向到首页
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })

          // const currThis = this
          // currThis.$axios.get('http://localhost:8080/login/toLogin',{
          //   params: {
          //     userAccount:currThis.loginForm.username,
          //     userPass:currThis.loginForm.password
          //   }
          // })
          // .then(res=>{
          //   let returnsJson = res.data
          //   if(returnsJson.code === 200){
          //     this.loading = false
          //     currThis.$message.success(returnsJson.message);
          //   }else{
          //     this.loading = false
          //     currThis.$message.error(returnsJson.message);
          //   }
          // })
          // .catch(err=>{
          //   console.log(err);
          // });
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
