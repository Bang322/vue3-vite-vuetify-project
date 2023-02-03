<template>
    <v-container
        class="d-flex align-center h-100 mx-auto"
        fluid
    >
        <v-row justify="center">
            <v-card
                width="400"
                rounded="lg"
                elevation="12"
            >
                <v-toolbar
                    color="primary"
                    density="compact"
                >
                    <v-toolbar-title>로그인</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-text-field
                                    label="아이디"
                                    variant="underlined"
                                    prepend-inner-icon="mdi-account"
                                />
                            </v-col>
                            <v-col cols="12">
                                <v-text-field
                                    label="비밀번호"
                                    variant="underlined"
                                    prepend-inner-icon="mdi-lock"
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-btn
                                    block
                                    color="primary"
                                    variant="flat"
                                >
                                    로그인
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col cols="auto">
                                <router-link to="/join"> 회원가입 </router-link>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'LoginForm'
};
</script>

<style scoped></style>
