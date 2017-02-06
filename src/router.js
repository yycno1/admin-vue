import Router from 'vue-router';

const Login = resolve => require(['components/auth/login.vue'], resolve);
const Home = resolve => require(['components/home/home.vue'], resolve);
const Welcomme = resolve => require(['components/welcome/welcome.vue'], resolve);

const UserList = resolve => require(['views/userManage/userList.vue'], resolve);
const UserDetail = resolve => require(['views/userManage/userDetail.vue'], resolve);

const RoleManage = resolve => require(['views/authManage/roleManage.vue'], resolve);
const AdminManage = resolve => require(['views/authManage/adminManage.vue'], resolve);

const MerchantManage = resolve => require(['views/merchantManage/merchantManage.vue'], resolve);

// meta.label {string} 页面title
// meta.ancestors {array} 菜单中每个功能页面的页面层级关系，其值为祖先页面的title，
// 用于在菜单中正确定位每个页面对应的index和subMenuIndex，其逻辑实现可查看sidebar.vue组件

const routes = [{
  path: '/login',
  component: Login,
  meta: {
    label: '登录',
  },
}, {
  path: '/',
  component: Home,
  meta: {
    label: '首页',
  },
  children: [{
    path: '',
    component: Welcomme,
    meta: {
      label: '首页',
    },
  }, {
    path: 'userList',
    component: UserList,
    meta: {
      label: '用户列表',
      ancestors: ['用户管理'],
    },
  }, {
    path: 'userDetail',
    component: UserDetail,
    meta: {
      label: '查看详情',
      ancestors: ['用户管理', '用户列表'],
    },
  }, {
    path: 'roleManage',
    component: RoleManage,
    meta: {
      label: '角色管理',
      ancestors: ['权限管理'],
    },
  }, {
    path: 'adminManage',
    component: AdminManage,
    meta: {
      label: '管理员管理',
      ancestors: ['权限管理'],
    },
  }, {
    path: 'merchantManage',
    component: MerchantManage,
    meta: {
      label: '商户列表',
      ancestors: ['商户管理'],
    },
  }],
}];

export default new Router({
  routes,
});
