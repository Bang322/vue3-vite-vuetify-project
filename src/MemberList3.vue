<template>
    <v-container fluid>
        <div class="text-h4">멤버 관리</div>
        <v-breadcrumbs
            :items="['멤버 관리', 'List']"
            class="px-0"
        >
            <template #divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>

        <v-card>
            <v-row
                class="my-table-tool"
                style="padding: 20px"
                no-gutters
                justify="end"
            >
                <v-col cols="4">
                    <v-text-field
                        v-model="search"
                        hide-details
                        density="compact"
                        variant="underlined"
                        append-inner-icon="mdi-magnify"
                        placeholder="검색"
                        clearable
                    />
                </v-col>
            </v-row>
            <MyTable
                v-model="selected"
                :items="items"
                :headers="headers"
                show-select
                :search="search"
                height="auto"
                item-key="userId"
                @click:row="onClickRow"
            >
                <template #item.id="{ item }">
                    <v-chip color="primary">
                        {{ item.id }}
                    </v-chip>
                </template>

                <template #item.userId="{ item }">
                    <span style="color: blue">{{ item.userId }}</span>
                </template>

                <template #no-data>검색된 값이 없습니다.</template>
            </MyTable>
        </v-card>
    </v-container>
</template>

<script>
import MyTable from '@/components/MyTable.vue';

export default {
    name: 'MemberList',
    components: { MyTable },
    data() {
        return {
            selected: [],
            search: '',
            headers: [
                {
                    text: 'ID',
                    align: 'start',
                    sortable: true,
                    key: 'id',
                    width: '200px'
                },
                {
                    text: 'USER ID',
                    align: 'start',
                    sortable: true,
                    key: 'userId',
                    width: 300
                },
                {
                    text: '이름',
                    align: 'start',
                    sortable: false,
                    key: 'name'
                },
                {
                    text: '이메일',
                    align: 'start',
                    sortable: false,
                    key: 'email'
                }
            ],
            items: [
                {
                    id: 2,
                    userId: 'tester',
                    name: '테스터2',
                    email: 'tester2@gmail.com'
                },
                {
                    id: 1,
                    userId: 'tester',
                    name: '테스터',
                    email: 'tester@gmail.com'
                },
                {
                    id: 3,
                    userId: 'tester3',
                    name: '테스터3',
                    email: 'tester3@gmail.com'
                },
                {
                    id: 5,
                    userId: 'tester5',
                    name: '테스터5',
                    email: 'tester5@gmail.com'
                },
                {
                    id: 4,
                    userId: 'tester4',
                    name: '테스터4',
                    email: 'tester4@gmail.com'
                },
                {
                    id: 6,
                    userId: 'tester6',
                    name: '테스터6',
                    email: 'tester6@gmail.com'
                },
                {
                    id: 7,
                    userId: 'tester7',
                    name: '테스터7',
                    email: 'tester7@gmail.com'
                },
                {
                    id: 8,
                    userId: 'tester8',
                    name: '테스터8',
                    email: 'tester8@gmail.com'
                },
                {
                    id: 9,
                    userId: 'tester9',
                    name: '테스터9',
                    email: 'tester9@gmail.com'
                },
                {
                    id: 10,
                    userId: 'tester10',
                    name: '테스터10',
                    email: 'tester10@gmail.com'
                },
                {
                    id: 12,
                    userId: 'tester12',
                    name: '테스터12',
                    email: 'tester12@gmail.com'
                },
                {
                    id: 11,
                    userId: 'tester11',
                    name: '테스터11',
                    email: 'tester11@gmail.com'
                },
                {
                    id: 13,
                    userId: 'bang',
                    name: 'bang',
                    email: 'bang@gmail.com'
                }
            ]
        };
    },
    watch: {
        selected(value) {
            console.log('부모 컴포넌트에서 체크박스값 확인', value.join(','));
        }
    },
    methods: {
        onClickRow(row) {
            console.log('부모 컴포넌트에서 클릭한 row 확인', row);
        }
    }
};
</script>
