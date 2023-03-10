import { createStore } from 'vuex';
import member from '@/store/modules/member';
import app from '@/store/modules/app';
import settings from '@/store/modules/settings';

export default createStore({
    state: {
        count: 0
    },
    mutations: {
        INCREMENT_COUNT(state, payload) {
            state.count += payload.amount;
        },
        DECREMENT_COUNT(state, payload) {
            state.count -= payload.amount;
        }
    },
    modules: {
        member,
        app,
        settings
    }
});
