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
            <template
                v-for="menu in getMenus"
                :key="menu.menuId"
            >
                <template v-if="menu.useYn === 'Y'">
                    <v-list-item
                        v-if="!menu.children && menu.path"
                        :value="menu"
                        link
                        :to="menu.path"
                        :title="menu.name"
                        active-color="primary"
                        :prepend-icon="menu.icon"
                    />

                    <v-list-group
                        v-else-if="menu.children"
                        :value="menu.name"
                    >
                        <template #activator="{ props }">
                            <v-list-item
                                v-bind="props"
                                :prepend-icon="menu.icon"
                                :title="menu.name"
                                active-color="primary"
                            />
                        </template>

                        <v-list-item
                            v-for="child in menu.children"
                            :key="child.menuId"
                            :prepend-icon="child.icon"
                            :title="child.name"
                            link
                            :to="child.path"
                            active-color="primary"
                        />
                    </v-list-group>
                </template>
            </template>
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
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('settings');
export default {
    name: 'MainLayout',
    data: () => ({
        drawer: true,
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
    computed: {
        ...mapGetters(['getMenus'])
    },
    created() {
        // store 에서 관리되고있는 데이터를 사용하되, 원래 데이터가 변경되지 않도록 복사하여 사용
        this.fetchMenus();
    },
    methods: {
        ...mapActions(['fetchMenus']),
        onToolbarMenuClick(value) {
            if (value === '로그아웃') {
                this.$router.replace('/login');
            }
        }
    }
};
</script>

<style></style>
