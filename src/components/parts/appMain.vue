<template>
  <div class="content-part">
    <el-row class="content-header">
      <el-col :span="12">
        <h2 class="content-title">{{contentTitle}}</h2>
      </el-col>
     <!--  <el-col :span="12" class="clearfix">
        <el-breadcrumb separator="/" class="content-breadcrumb">
          <el-breadcrumb-item
            v-for="item in breadcrumbList"
            :to="{ path: item.path }">
              {{item.meta.label}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col> -->
    </el-row>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default{
  computed: {
    contentTitle() {
      return this.$route.meta.label;
    },
    breadcrumbList() {
      const matched = this.$route.matched.filter(item => item.meta.label);
      const first = matched[0];
      const last = matched[matched.length - 1];
      if (first.path === '') {
        first.path = '/';
      }
      if (last.meta.group && last.meta.group !== last.meta.label) {
        matched.splice(1, 0, { path: '', meta: { label: last.meta.group } });
      }
      return matched;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-header{
  margin-bottom: 20px;
}
.content-title{
  margin: 0;
  font-size: 13px;
}
.content-breadcrumb{
  float: right;
}

.fade-enter,.fade-leave-active{
  opacity: 0;
}
.fade-enter-actice,.fade-leave-active{
  transition: opacity .5s;
  position: absolute;
}
</style>
