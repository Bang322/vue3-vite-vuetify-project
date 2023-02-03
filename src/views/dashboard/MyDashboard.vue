<template>
    <v-container fluid>
        <v-btn @click="$common.showSuccessSnackbar('성공했습니다.')">
            스낵바
        </v-btn>
        <v-btn @click="$common.showErrorSnackbar('실패했습니다.')">
            실패 스낵바
        </v-btn>

        <v-btn @click="overlayTest">오버레이</v-btn>
    </v-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { type as memberType } from '@/store/modules/member';

const { mapState, mapGetters, mapMutations } =
    createNamespacedHelpers('member');

export default {
    name: 'MyDashboard',
    data() {
        return {
            fieldValueObj: {
                id: '',
                email: '',
                name: ''
            }
        };
    },
    computed: {
        ...mapState(['members']),
        ...mapGetters(['getMemberCount'])
    },
    methods: {
        ...mapMutations({
            addMember: memberType.ADD_MEMBER,
            removeMember: memberType.REMOVE_MEMBER
        }),
        overlayTest() {
            this.$common.showOverlay();
            setTimeout(() => this.$common.hideOverlay(), 3000);
        }
    }
};
</script>

<style scoped></style>
