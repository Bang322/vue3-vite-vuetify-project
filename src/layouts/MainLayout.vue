<template>
    <v-app-bar
        color="primary"
        density="compact"
    >
        <template #prepend>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        </template>

        <v-app-bar-title>안녕하세요</v-app-bar-title>

        <template #append>
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        icon="mdi-dots-vertical"
                        v-bind="props"
                    />
                </template>

                <v-list>
                    <v-list-item
                        v-for="(item, index) in toolbarMenu"
                        :key="index"
                        :prepend-icon="item.icon"
                        @click="onToolbarMenuClick(item.text)"
                    >
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-spacer />
        </template>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        floating
    >
        <v-list
            :lines="false"
            density="compact"
            nav
        >
            <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :value="item"
                link
                :to="item.to"
                :title="item.text"
                active-color="primary"
                :prepend-icon="item.icon"
            />
        </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #f2f5f8">
        <slot />
        <!--
        <router-view v-slot="{ Component }">
            <transition
                name="fade"
                mode="out-in"
            >
                <component :is="Component" />
            </transition>
        </router-view>
-->
    </v-main>
</template>

<script>
export default {
    name: 'MainLayout',
    data: () => ({
        drawer: true,
        items: [
            { text: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
            {
                text: '멤버관리',
                icon: 'mdi-account-edit',
                to: '/member'
            },
            {
                text: '멤버관리2',
                icon: 'mdi-account-edit',
                to: '/member2'
            },
            {
                text: '멤버관리3',
                icon: 'mdi-account-edit',
                to: '/member3'
            },
            {
                text: 'GridListPage',
                icon: 'mdi-clipboard',
                to: '/gridListPage'
            },
            {
                text: 'Breakpoints',
                icon: 'mdi-monitor',
                to: '/breakpoints'
            },
            {
                text: 'typography',
                icon: 'mdi-ab-testing',
                to: '/typography'
            },
            {
                text: 'DataTable',
                icon: 'mdi-table',
                to: '/dataTable'
            }
        ],
        toolbarMenu: [
            {
                text: '내정보',
                icon: 'mdi-account'
            },
            {
                text: '로그아웃',
                icon: 'mdi-logout'
            }
        ]
    }),
    methods: {
        onToolbarMenuClick(value) {
            if (value === '로그아웃') {
                this.$router.replace('/login');
            }
        }
    }
};
</script>

<style></style>
