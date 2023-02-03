import { assign, cloneDeep } from 'lodash';

export const type = {
    SET_SNACKBAR: 'SET_SNACKBAR',
    SET_OVERLAY: 'SET_OVERLAY'
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
    }
};

const mutations = {
    [type.SET_SNACKBAR](state, payload) {
        assign(state.snackbar, payload);
    },
    [type.SET_OVERLAY](state, payload) {
        assign(state.overlay, payload);
    }
};

const actions = {
    setSnackbar({ commit }, payload) {
        commit(type.SET_SNACKBAR, payload);
    },
    setOverlay({ commit }, payload) {
        commit(type.SET_OVERLAY, payload);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
