<template>
  <header class="header-wrap">
    <el-row>
      <el-col :span="12" class="logo">
        <span>vue.js</span>
      </el-col>
      <el-col :span="12">
        <el-tooltip class="sign-out pull-right" effect="dark" placement="bottom" content="退出">
          <i class="fa fa-sign-out" @click="$router.push('/login')"></i>
        </el-tooltip>
        <p class="admin-name pull-right">欢迎登录,admin</p>
      </el-col>
    </el-row>
  </header>
</template>

<script>
export default{
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/var";
.header-wrap{
  height: $headerH;
  padding: 10px 20px;
  background-color: $headerBg;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 0 5px #999;
  position: relative;
  z-index: 1000;

  .logo{
    line-height: 40px;
    background-image: url(../../assets/img/logo.png);
    background-position: left center;
    background-repeat: no-repeat;
    background-size: 40px 40px;
    color: #000;
    font-weight: bold;
    padding-left: 50px;
  }
  .admin-name{
    margin: 0;
    text-align: right;
    line-height: 40px;
    color: #000;
  }
  .sign-out{
    line-height: 40px;
    margin-left: 15px;
    color: #000;
    cursor: pointer;
  }
}
</style>
