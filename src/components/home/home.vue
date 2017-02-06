<template>
  <div class="home">
    <main-header></main-header>
    <section class="main-content">
      <sidebar class="sidebar-part"></sidebar>
      <app-main class="content-part"></app-main>
    </section>
  </div>
</template>

<script>
import MainHeader from 'components/parts/header';
import Sidebar from 'components/parts/sidebar';
import AppMain from 'components/parts/appMain';

export default{
  components: {
    MainHeader,
    Sidebar,
    AppMain,
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/var";
.main-content{
  width: 100%;
  position: absolute;
  top: $headerH;
  bottom: 0;
}
.sidebar-part,
.content-part{
  position: absolute;
  height: 100%;
  top: 0;
  background-color: $asideBg;
  overflow-y: auto;
}
.aside-part{
  width: $asideW;
  background-color: $asideBg;
}
.content-part{
  left: $asideW;
  right: 0;
  background-color: $contentBg;
  padding: 20px;
}
</style>
