import JoinForm from '@/views/join/JoinForm.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MyDashboard from '@/views/dashboard/MyDashboard.vue';
import LoginForm from '@/views/login/LoginForm.vue';
import MemberList from '@/views/member/MemberList.vue';
import MemberList2 from '@/MemberList2.vue';
import MemberList3 from '@/MemberList3.vue';

const routes = [
    {
        path: '/join',
        name: 'Join',
        component: JoinForm,
        meta: { layout: 'SimpleLayout' }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginForm,
        meta: { layout: 'SimpleLayout' }
    },
    {
        path: '/',
        name: 'Dashboard',
        component: MyDashboard,
        alias: ['/dashboard']
    },
    {
        path: '/member',
        name: 'Member',
        component: MemberList
    },
    {
        path: '/member2',
        name: 'Member2',
        component: MemberList2
    },
    {
        path: '/member3',
        name: 'Member3',
        component: MemberList3
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
