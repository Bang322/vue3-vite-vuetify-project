<template>
    <component :is="layout">
        <slot />
    </component>
</template>

<script>
import SimpleLayout from '@/layouts/SimpleLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

export default {
    name: 'TheLayout',
    components: {
        SimpleLayout,
        MainLayout
    },
    computed: {
        layout() {
            return this.$route.meta.layout || 'MainLayout';
        }
    }
};
</script>

<style scoped></style>
