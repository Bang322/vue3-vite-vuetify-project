<template>
    <slot />
    <div class="fab-main-container">
        <div
            v-my-ripple
            class="fab-container"
            :style="{ backgroundColor: color ? color : '' }"
            @click="isOpen = !isOpen"
        >
            <Transition name="fab">
                <!-- 비활성화 시 아이콘 (기본) -->
                <v-icon
                    v-if="!isOpen"
                    class="fab-icon"
                    size="small"
                >
                    {{ icon }}
                </v-icon>
            </Transition>
            <Transition
                name="fab-active"
                @after-enter="onAfterEnter"
            >
                <!-- 활성화 시 아이콘 -->
                <v-icon
                    v-if="isOpen"
                    class="fab-icon"
                    size="small"
                >
                    {{ activeIcon }}
                </v-icon>
            </Transition>
        </div>
        <div class="fab-item-container">
            <Transition
                v-for="(item, index) in items"
                :key="index"
                name="fab-item"
            >
                <div
                    v-if="isOpen"
                    v-my-ripple
                    class="fab-item fab-container"
                    :style="{
                        top: `${-48 + -50 * index}px`,
                        transitionDelay: `${0.05 * index}s`,
                        backgroundColor: item.color
                    }"
                    @click="onClickItem(item)"
                >
                    <div
                        v-if="item.title"
                        class="fab-title"
                    >
                        {{ item.title }}
                    </div>
                    <v-icon
                        class="fab-icon"
                        size="small"
                    >
                        {{ item.icon || 'mdi-plus' }}
                    </v-icon>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyFloatingButton',
    props: {
        // 메인 버튼 아이콘 (비활성화 시)
        icon: {
            type: String,
            required: false,
            default: 'mdi-menu'
        },
        // 메인 버튼 아이콘 (활성화 시)
        activeIcon: {
            type: String,
            required: false,
            default: 'mdi-plus'
        },
        // 메인 아이콘 color
        color: {
            type: String,
            required: false,
            default: 'primary'
        },
        // 서브 아이템들
        items: {
            type: Array,
            required: true
        }
    },
    emits: ['click:item'],
    data() {
        return {
            isOpen: false
        };
    },
    mounted() {
        document.addEventListener('click', this.onClickDocument);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.onClickDocument);
    },
    methods: {
        onAfterEnter(el) {
            el.classList.add('fab-active');
        },
        onClickDocument(e) {
            const target = e.target;
            const fabMainContainer = target.closest('.fab-main-container');

            if (!fabMainContainer) {
                this.isOpen = false;
            }
        },
        onClickItem(item) {
            this.$emit('click:item', item);
        }
    }
};
</script>

<style lang="scss">
@import '@/styles/myFloatingButton.scss';
</style>
