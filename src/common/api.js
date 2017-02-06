import Vue from 'vue';
import http from 'vue-resource';
import md5 from 'md5';

/* eslint-disable no-unused-vars */

Vue.use(http);

const $http = Vue.http;

$http.options.root = '/zx';
$http.options.emulateJSON = true;


/* 模拟后台api请求 */

function mockResponse(obj) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(obj);
    }, 500);
  });
}

function getRandom(min, max) {
  return Math.round((Math.random() * (max - min)) + min);
}

const menuList = [
  {
    menu: {
      menuName: '用户管理',
    },
    childrens: [
      {
        menuName: '用户列表',
        resourceUrl: '/userList',
        childrens: [
          {
            menuName: '查看详情',
            resourceUrl: '/userDetail',
          },
        ],
      },
    ],
  }, {
    menu: {
      menuName: '权限管理',
    },
    childrens: [
      {
        menuName: '角色管理',
        resourceUrl: '/roleManage',
      }, {
        menuName: '管理员管理',
        resourceUrl: '/adminManage',
      },
    ],
  }, {
    menu: {
      menuName: '商户管理',
    },
    childrens: [
      {
        menuName: '商户列表',
        resourceUrl: '/merchantManage',
      },
    ],
  },
];

const tableList = [];
let total = 25;
const codeInfos = ['公积金', '移动', '地税'];
for (let i = 0; i < total; i++) {
  const item = {
    customer_realName: `a${i}`,
    customer_mobile: '13000000000',
    customer_identity: '320705198102122967',
    customer_info: `The info of a${i}`,
    credit_flow: i,
    credit_time: new Date().getTime(),
    code_info: codeInfos[getRandom(0, 2)],
    credit_state: getRandom(0, 3),
  };

  tableList.push(item);
}

/* 登录
 * data = { username, password, captcha }
 */
export function doLogin(data) {
  const username = 'admin';
  const password = 'admin';
  const captcha = '1234';
  const mockData = {
    body: {},
  };

  if (username === data.username && md5(password) === data.password) {
    if (captcha === data.captcha) {
      mockData.body.responseStatus = '0';
    } else {
      mockData.body.responseStatus = '1';
      mockData.body.object = '验证码错误';
    }
  } else {
    mockData.body.responseStatus = '1';
    mockData.body.object = '用户名或密码错误';
  }
  return mockResponse(mockData);
}

/* 获取菜单数据 */
export function getMenu() {
  const mockData = {
    body: {
      responseStatus: '0',
      object: menuList,
    },
  };
  return mockResponse(mockData);
}


/* 获取用户列表,可用于条件查询
 * params = { userName, userMobile, userIdentity, state, typeId, pageSize, pageNum }
 */
export function getCreditList(params) {
  const start = params.pageSize * (params.pageNum - 1);
  const end = start + params.pageSize;
  const list = tableList.slice(start, end);
  const mockData = {
    body: {
      responseStatus: '0',
      object: {
        total,
        list,
      },
    },
  };
  return mockResponse(mockData);
}

/* 新增用户
 * params = {
 *   customer_realName, customer_mobile, customer_identity, customer_info, type_id
 * }
 */
export function addCustomer(params) {
  const item = {
    customer_realName: params.customer_realName,
    customer_mobile: params.customer_mobile,
    customer_identity: params.customer_identity,
    customer_info: params.customer_info,
    credit_flow: tableList[tableList.length - 1] + 1,
    credit_state: 1,
    credit_time: new Date().getTime(),
    code_info: codeInfos[params.type_id - 1],
  };
  tableList.push(item);
  total++;
  return mockResponse({
    body: {
      responseStatus: '0',
    },
  });
}

/* 删除用户
 * params = { credit_flow }
 */
export function delCustomer(params) {
  let mockData;
  for (let i = 0, len = tableList.length; i < len; i++) {
    const item = tableList[i];
    if (item.credit_flow === params.credit_flow) {
      tableList.splice(i, 1);
      total--;
      mockData = {
        body: {
          responseStatus: '0',
        },
      };
      break;
    }
  }
  if (!mockData) {
    mockData = {
      body: {
        responseStatus: '1',
        object: '删除失败',
      },
    };
  }
  return mockResponse(mockData);
}

/* 获取公积金账户
 * params = { credit_flow }
 */
export function fetchFundsAccount() {
  return mockResponse({
    body: {
      responseStatus: '0',
      object: {},
    },
  });
}
/* 获取公积金贷款
 * params = { credit_flow, pageSize, pageNum }
 */
export function fetchFundsLoan(params) {
  return mockResponse({
    body: {
      responseStatus: '0',
      object: {},
    },
  });
}
/* 获取公积金流水
 * params = { credit_flow }
 */
export function fetchFundsFlowList(params) {
  return mockResponse({
    body: {
      responseStatus: '0',
      object: {
        total: 0,
        list: [],
      },
    },
  });
}
