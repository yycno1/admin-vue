import ElementUi from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import Vue from 'vue';
import Router from 'vue-router';
import http from 'vue-resource';

import formats from 'common/formats';

import App from './App';
import router from './router';
import store from './store';

Vue.use(ElementUi);
Vue.use(Router);

if (!Vue.http) {
  Vue.use(http);
}

const $http = Vue.http;
const $alert = Vue.prototype.$alert;

$http.interceptors.push((request, next) => {
  next((response) => {
    if (!response.ok) {
      $alert('服务器繁忙');
      console.log(response.status, response.statusText);
      return response;
    }

    const body = response.body;
    if (body.responseStatus === '229') {
      // 登录已失效
      router.push('/login');
    } else if (body.responseStatus !== '0') {
      // 不成功
      $alert(body.object);
    }
    return response;
  });
});

for (const key of Object.keys(formats)) {
  Vue.filter(key, formats[key]);
}

/* eslint-disable no-extend-native */

Promise.prototype.finally = function (callback) {
  return this.then((data) => {
    callback(data);
  }, (data) => {
    callback(data);
  });
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});
