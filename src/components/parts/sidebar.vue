<template>
  <aside class="aside-part" v-loading="loading" element-loading-text="拼命加载中">
    <ul class="aside-menu">
      <li v-for="(item, index) in menuList">
        <router-link
          class="menu-item"
          v-if="item.menu.resourceUrl"
          :to="item.menu.resourceUrl"
          :class="{'expanded': index === activeIndex}"
          @click="toggleExpand(index)"
        >

          <i class="fa fa-laptop"></i>
          {{item.menu.menuName}}

        </router-link>
        <a v-else
          class="menu-item"
          :class="{'expanded': index === activeIndex}"
          @click="toggleExpand(index)">

          <i class="fa fa-laptop"></i>
          {{item.menu.menuName}}
          <i class="fa fa-angle-down"></i>

        </a>
        <expand-transition v-if="item.childrens">
          <ul v-show="index === activeIndex" class="submenu">
            <li v-for="(nav, submenuIndex) in item.childrens">
              <router-link
                :to="nav.resourceUrl"
                class="menu-item"
                :class="{'menu-item-active': submenuIndex === currentSubmenuIndex && index === currentIndex}">
                {{nav.menuName}}
              </router-link>
            </li>
          </ul>
        </expand-transition>
      </li>
    </ul>
  </aside>
</template>

<script>
import ExpandTransition from 'components/expandTransition/expandTransition';
import { mapGetters, mapActions } from 'vuex';

export default{
  data() {
    return {
      activeIndex: -1,
      currentIndex: -1,
      currentSubmenuIndex: -1,
      menuReady: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['menuList']),
  },
  components: {
    ExpandTransition,
  },
  methods: {
    ...mapActions(['fetchMenu']),

    toggleExpand(index) {
      if (this.activeIndex === index) {
        this.activeIndex = -1;
      } else {
        this.activeIndex = index;
      }
    },
    /*
    * 根据route中设置的ancestors,定位页面在menuList中对应的一级菜单的位置
    */
    setCurrentIndex() {
      const ancestors = this.$route.meta.ancestors;
      if (!(ancestors instanceof Array) || ancestors.length === 0) {
        this.currentIndex = this.activeIndex = -1;
        return;
      }
      const menuList = this.menuList;
      const len = menuList.length;
      const menuName = ancestors[0];
      for (let index = 0; index < len; index++) {
        const item = menuList[index];
        if (item.menu.menuName === menuName) {
          this.currentIndex = this.activeIndex = index;
          return;
        }
      }
    },
    /*
    * 根据route中设置的ancestors,定位页面在menuList中对应的二级菜单的位置
    */
    setCurrentSubmenuIndex() {
      if (!this.menuList[this.currentIndex]) {
        return;
      }
      const meta = this.$route.meta;
      const ancestors = meta.ancestors;
      const label = meta.label;
      const submenuName = ancestors[1] || label;
      const submenu = this.menuList[this.currentIndex].childrens;

      for (let index = 0, len = submenu.length; index < len; index++) {
        if (submenu[index].menuName === submenuName) {
          this.currentSubmenuIndex = index;
          return;
        }
      }
    },
    setIndex() {
      this.setCurrentIndex();
      this.setCurrentSubmenuIndex();
    },
    getMenuList() {
      this.loading = true;
      this.fetchMenu().then(() => {
        this.loading = false;
        this.menuReady = true;
      });
    },
  },
  watch: {
    menuReady(isready) {
      if (isready) {
        this.setIndex();
      }
    },
    $route() {
      if (this.menuReady) {
        this.setIndex();
      }
    },
  },
  created() {
    if (!this.menuList || this.menuList.length === 0) {
      this.getMenuList();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/style/var";

.aside-part{
  padding-top: 10px;
}
.aside-menu{
  height: 100%;

  .menu-item{
    display: block;
    padding: 5px 10px;
    border-radius: 3px;
    position: relative;

    .fa-angle-down{
      position: absolute;
      right: 10px;
      transition: transform .377s ease;
    }

    &.expanded .fa-angle-down{
      transform: rotate(180deg);
    }
  }
  .menu-item:hover{
    color: $primary;
    background-color: #f5f5f5;
  }

  .menu-item.menu-item-active{
    background-color: $primary;
    color: #fff;
  }

  .submenu{
    margin: 0 10px 0 14px;
    padding-left: 10px;
    border-left: 1px solid #dbdbdb;
  }
}
</style>
