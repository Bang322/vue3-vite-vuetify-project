import { assign, cloneDeep } from 'lodash';

export const type = {
    SET_SNACKBAR: 'SET_SNACKBAR',
    SET_OVERLAY: 'SET_OVERLAY',
    SET_CONFIRM: 'SET_CONFIRM'
};

const state = {
    snackbar: {
        show: false,
        message: '',
        options: {
            color: '',
            icon: ''
        }
    },
    overlay: {
        show: false
    },
    confirm: {
        show: false,
        message: '',
        options: {},
        okCallback: null,
        cancelCallback: null
    }
};

const mutations = {
    [type.SET_SNACKBAR](state, payload) {
        assign(state.snackbar, payload);
    },
    [type.SET_OVERLAY](state, payload) {
        assign(state.overlay, payload);
    },
    [type.SET_CONFIRM](state, payload) {
        assign(state.confirm, payload);
    }
};

const actions = {
    setSnackbar({ commit }, payload) {
        commit(type.SET_SNACKBAR, payload);
    },
    setOverlay({ commit }, payload) {
        commit(type.SET_OVERLAY, payload);
    },
    setConfirm({ commit }, payload) {
        commit(type.SET_CONFIRM, payload);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
