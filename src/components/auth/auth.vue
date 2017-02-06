<template>
  <div class="auth-main">
    <div class="auth-box">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import "../../assets/style/var";
.auth-main{
  width: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: $authPageBg;

  .auth-box{
    width: $authW;
    margin: 0 auto;
    border-radius: 5px;
    background-color: $authBoxBg;
    color: #fff;
    padding: 32px;

    .el-form-item__label{
      color: #fff;
    }
    input::placeholder{
      color: rgba(0,0,0,0.8);
    }
  }
}
</style>
