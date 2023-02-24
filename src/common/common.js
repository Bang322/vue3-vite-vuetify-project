import store from '@/store';

/**
 * 공통 메소드
 */
export default {
    // 스낵바 show 메소드
    async showSnackbar(message, options) {
        await store.dispatch('app/setSnackbar', {
            show: true,
            message,
            options
        });
    },
    // 스낵바 hide 메소드
    async hideSnackbar() {
        await store.dispatch('app/setSnackbar', { show: false });
    },
    // 성공했을 때 스낵바 show 메소드
    async showSuccessSnackbar(message) {
        await this.showSnackbar(message, {
            color: 'success',
            icon: 'mdi-check-circle'
        });
    },
    // 실패했을 떄 스낵바 show 메소드
    async showErrorSnackbar(message) {
        await this.showSnackbar(message, {
            color: 'error',
            icon: 'mdi-close-circle'
        });
    },

    // overlay show 메소드
    async showOverlay() {
        await store.dispatch('app/setOverlay', { show: true });
    },
    // overlay hide 메소드
    async hideOverlay() {
        await store.dispatch('app/setOverlay', { show: false });
    },

    // confirm dialog show 메소드
    async showConfirm(message, okCallback, cancelCallback, options) {
        await store.dispatch('app/setConfirm', {
            show: true,
            message,
            options,
            okCallback,
            cancelCallback
        });
    },
    // confirm dialog hide 메소드
    async hideConfirm() {
        await store.dispatch('app/setConfirm', { show: false });
    }
};
