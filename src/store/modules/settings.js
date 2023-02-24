import axios from 'axios';
import { cloneDeep } from 'lodash';

export const type = {
    SET_MENU: 'SET_MENU'
};

const state = {
    menus: []
};

const getters = {
    getMenus({ menus }) {
        const cloneMenus = cloneDeep(menus);
        cloneMenus.forEach(menu => {
            if (menu.parentId) {
                const parentMenu = cloneMenus.find(
                    item => item.menuId === menu.parentId
                );

                if (!Array.isArray(parentMenu.children)) {
                    parentMenu.children = [];
                }
                parentMenu.children.push(menu);
            }
        });

        return cloneMenus.filter(menu => !menu.parentId);
    }
};

const mutations = {
    [type.SET_MENU](state, payload) {
        state.menus = payload;
    }
};

const actions = {
    async fetchMenus({ commit }) {
        const { data } = await axios.get('http://localhost:8080/api/menus');
        commit(type.SET_MENU, data);

        return data;
    },
    async saveMenus({ commit }, payload) {
        const { data } = await axios.post(
            'http://localhost:8080/api/menus',
            payload
        );
        commit(type.SET_MENU, data);

        return data;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
