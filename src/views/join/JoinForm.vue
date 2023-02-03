<template>
    <v-container class="d-flex align-center h-100">
        <v-row justify="center">
            <v-card
                width="400"
                rounded="lg"
                elevation="12"
            >
                <v-toolbar
                    title="회원가입"
                    color="pink-lighten-2"
                    density="compact"
                />

                <v-card-text>
                    <v-container>
                        <v-form
                            ref="form"
                            @submit.prevent="onSubmit"
                        >
                            <v-row no-gutters>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="formData.id"
                                        label="아이디"
                                        :rules="idRules"
                                        variant="underlined"
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="formData.password"
                                        label="비밀번호"
                                        :rules="passwordRules"
                                        variant="underlined"
                                        type="password"
                                        clearable
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        ref="passwordChk"
                                        v-model="passwordChk"
                                        label="비밀번호 확인"
                                        :rules="passwordChkRules"
                                        variant="underlined"
                                        type="password"
                                        clearable
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="formData.name"
                                        label="이름"
                                        variant="underlined"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-btn
                                        type="submit"
                                        block
                                        color="pink-lighten-2"
                                        variant="flat"
                                    >
                                        회원가입
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'JoinForm',
    data() {
        return {
            formData: {
                id: '',
                password: '',
                name: ''
            },
            passwordChk: '',
            dialog: false,
            idRules: [value => !!value || '필수 입력값입니다.'],
            passwordRules: [value => !!value || '필수 입력값입니다.'],
            passwordChkRules: [
                value => !!value || '필수 입력값입니다.',
                value =>
                    (value && value === this.formData.password) ||
                    '비밀번호가 일치하지 않습니다.'
            ]
        };
    },
    watch: {
        'formData.password'() {
            // 비밀번호값이 변경될 때마다 비밀번호 확인값 validation 체크
            // 비밀번호 확인값이 있을때만 체크함
            this.passwordChk && this.$refs.passwordChk.validate();
        }
    },
    methods: {
        async onSubmit() {
            const { valid } = await this.$refs.form.validate();

            // form 의 유효성 검사를 모두 통과했을 때
            if (valid) {
                const { data, status } = await this.$axios.post(
                    'http://localhost:8080/api/member',
                    this.formData
                );

                status === 200 && this.$router.push('/');
            }
        }
    }
};
</script>
