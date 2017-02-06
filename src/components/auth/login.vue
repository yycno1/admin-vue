<template>
  <auth>
    <el-form label-width="80px" :model="user" ref="loginForm" :rules="rules">
      <h3 class="auth-title">欢迎登录系统</h3>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-col :span="15">
          <el-input placeholder="请输入验证码" v-model="user.captcha"></el-input>
        </el-col>
        <el-col :span="8" :offset="1">
          <div class="code-img-box">
            <img :src="crimageSrc" alt="验证码" class="verify-code-img" @click="setCrImage">
          </div>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="10">
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native="handleSubmit">登录</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </auth>
</template>

<script>
import Auth from 'components/auth/auth';
import { doLogin } from 'common/api';
import md5 from 'md5';

export default{
  name: 'login',

  data() {
    return {
      user: {
        username: '',
        password: '',
        captcha: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          // { min: 6, message: '密码不能小于6位', trigger: 'blur' },
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      crimageSrc: '',
      loading: false,
    };
  },
  components: {
    Auth,
  },
  methods: {
    login() {
      this.user.password = md5(this.user.password);
      this.loading = true;
      doLogin(this.user)
        .then(({ body }) => {
          if (body.responseStatus === '0') {
            this.$router.push('/');
          } else {
            this.$alert(body.object);
            this.$refs.loginForm.resetFields();
            this.setCrImage();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.login();
        }
      });
    },
    setCrImage() {
      this.crimageSrc = `/zx/crimage?${new Date().getTime()}`;
    },
  },
  created() {
    this.setCrImage();
  },
};
</script>

<style lang="scss" scoped>
.auth-title{
  text-align: center;
  margin-bottom: 20px;
  margin-top: 0;
}
.code-img-box{
  height: 36px;
}
.verify-code-img{
  display: block;
  width: 100%;
  height: 100%;
}
</style>
