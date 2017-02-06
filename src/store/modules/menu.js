import { getMenu } from 'common/api';

const state = {
  menuList: [],
};

const mutations = {
  setMenuList(state, payload) {
    state.menuList = payload.menuList;
  },
  clearMenuList(state) {
    state.menuList = [];
  },
};

const actions = {
  fetchMenu({ commit }) {
    return getMenu().then((res) => {
      const body = res.body;
      if (body.responseStatus === '0') {
        commit('setMenuList', { menuList: body.object });
      }
    });
  },
};

const getters = {
  menuList: state => state.menuList,
};

export default{
  state,
  mutations,
  actions,
  getters,
};
