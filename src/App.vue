<template>
    <v-app>
        <TheLayout>
            <router-view v-slot="{ Component }">
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <component :is="Component" />
                </transition>
            </router-view>
        </TheLayout>
        <v-snackbar
            v-model="snackbar.show"
            location="top"
            :color="snackbar.options.color"
            style="top: 50px"
        >
            <template #actions>
                <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="$common.hideSnackbar()"
                />
            </template>

            <div class="d-flex align-center">
                <v-icon
                    v-if="snackbar.options.icon"
                    class="mr-1"
                >
                    {{ snackbar.options.icon }}
                </v-icon>

                <span>{{ snackbar.message }}</span>
            </div>
        </v-snackbar>

        <v-overlay
            v-model="overlay.show"
            class="align-center justify-center"
            persistent
        >
            <v-progress-circular
                color="primary"
                indeterminate
                size="64"
            />
        </v-overlay>
    </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers('app');

export default {
    name: 'App',
    computed: {
        ...mapState(['snackbar', 'overlay'])
    }
};
</script>

<style lang="scss">
@import '@/styles/common.scss';
</style>
