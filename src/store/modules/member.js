import { cloneDeep } from 'lodash';

export const type = {
    ADD_MEMBER: 'ADD_MEMBER',
    REMOVE_MEMBER: 'REMOVE_MEMBER',
    SET_MEMBERS: 'SET_MEMBERS'
};

const state = {
    members: []
};

const getters = {
    getMemberCount(state) {
        return state.members.length;
    }
};

const mutations = {
    [type.ADD_MEMBER](state, payload) {
        state.members.push(cloneDeep(payload.member));
    },
    [type.REMOVE_MEMBER](state, payload) {
        state.members = state.members.filter(
            member => member.id !== payload.id
        );
    },
    [type.SET_MEMBERS](state, payload) {
        state.members = payload.members;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations
};
