<template>
    <v-container fluid>
        <div class="text-h4">메뉴 관리</div>
        <v-breadcrumbs
            :items="['Settings', '메뉴 관리']"
            class="px-0"
        >
            <template #divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>

        <v-card class="pa-3">
            <v-row>
                <v-col
                    cols="12"
                    md="6"
                >
                    <el-tree
                        ref="menuTree"
                        :data="menus"
                        :props="defaultProps"
                        draggable
                        node-key="menuId"
                        default-expand-all
                        highlight-current
                        :expand-on-click-node="false"
                        class="menu-tree"
                        @node-click="onNodeClick"
                    >
                        <template #default="{ node, data }">
                            <div
                                class="custom-tree-node"
                                :class="{ disabled: data.useYn === 'N' }"
                            >
                                <v-icon class="node-icon">
                                    {{ data.icon }}
                                </v-icon>
                                <span class="node-label">{{ node.label }}</span>
                                <v-btn
                                    class="remove-node-btn"
                                    density="compact"
                                    variant="tonal"
                                    color="error"
                                    @click="onRemove(node, data, $event)"
                                >
                                    삭제
                                </v-btn>
                            </div>
                        </template>
                    </el-tree>
                </v-col>
                <v-divider :vertical="$vuetify.display.mdAndUp" />
                <v-col
                    cols="12"
                    md="6"
                >
                    <div class="menu-info">
                        <v-text-field
                            v-model="currentNode.path"
                            label="경로"
                            variant="underlined"
                            density="compact"
                            color="primary"
                        />
                        <v-text-field
                            v-model="currentNode.name"
                            label="이름"
                            variant="underlined"
                            density="compact"
                            color="primary"
                        />
                        <v-text-field
                            v-model="currentNode.icon"
                            label="아이콘"
                            variant="underlined"
                            density="compact"
                            :append-icon="currentNode.icon"
                            color="primary"
                        />
                        <v-radio-group
                            v-model="currentNode.useYn"
                            class="use-yn-radio-group"
                            label="사용 여부"
                            :hide-details="true"
                            color="primary"
                        >
                            <v-radio
                                label="사용"
                                value="Y"
                            />
                            <v-radio
                                label="사용안함"
                                value="N"
                            />
                        </v-radio-group>
                    </div>
                </v-col>
            </v-row>
            <MyFloatingButton
                :items="floatingMenuItems"
                @click:item="onClickFloatingItem"
            />
        </v-card>

        <v-dialog
            v-model="dialog"
            width="400"
        >
            <v-card>
                <v-toolbar
                    color="primary"
                    title="메뉴 등록"
                />
                <v-card-text>
                    <v-text-field
                        v-model="addNode.path"
                        label="경로"
                        color="primary"
                        variant="underlined"
                        density="compact"
                    />
                    <v-text-field
                        v-model="addNode.name"
                        label="이름"
                        color="primary"
                        variant="underlined"
                        density="compact"
                    />
                    <v-text-field
                        v-model="addNode.icon"
                        label="아이콘"
                        color="primary"
                        variant="underlined"
                        density="compact"
                        :append-icon="addNode.icon"
                    />
                    <v-radio-group
                        v-model="addNode.useYn"
                        class="use-yn-radio-group"
                        label="사용 여부"
                        :hide-details="true"
                        color="primary"
                    >
                        <v-radio
                            label="사용"
                            value="Y"
                        />
                        <v-radio
                            label="사용안함"
                            value="N"
                        />
                    </v-radio-group>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn
                        color="primary"
                        @click="onAdd"
                        >등록
                    </v-btn>
                    <v-btn
                        color="error"
                        @click="dialog = false"
                    >
                        취소
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import MyFloatingButton from '@/components/MyFloatingButton.vue';
import { cloneDeep } from 'lodash';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('settings');

export default {
    name: 'MenuSetting',
    components: { MyFloatingButton },
    data() {
        return {
            dialog: false,
            floatingMenuItems: [
                {
                    title: '추가',
                    icon: 'mdi-plus',
                    color: 'orange',
                    action: 'add'
                },
                {
                    title: '저장',
                    icon: 'mdi-content-save',
                    color: '#12bf12',
                    action: 'save'
                },
                {
                    title: '초기화',
                    icon: 'mdi-refresh',
                    color: '#fd4f4f',
                    action: 'reset'
                }
            ],
            addNode: {},
            currentNode: {},
            defaultProps: {
                label: 'name'
            },
            menus: []
        };
    },
    created() {
        this.$common.showOverlay();

        this.$axios.get('http://localhost:8080/api/menus').then(res => {
            const { data } = res;
            data.forEach(menu => {
                if (menu.parentId) {
                    const parentMenu = data.find(
                        item => item.menuId === menu.parentId
                    );

                    if (!Array.isArray(parentMenu.children)) {
                        parentMenu.children = [];
                    }
                    parentMenu.children.push(menu);
                }
            });

            this.menus = data.filter(menu => !menu.parentId);

            this.$common.hideOverlay();
        });
    },
    methods: {
        ...mapActions(['saveMenus']),
        onNodeClick(node) {
            this.currentNode = node;
        },
        // tree 에서 삭제버튼 클릭 시
        onRemove(node, data, e) {
            e.stopPropagation();

            this.$refs.menuTree.remove(node);
            this.currentNode = {};
        },
        onClickFloatingItem(item) {
            if (item.action === 'add') {
                this.dialog = true;
            } else if (item.action === 'save') {
                this.onSave();
            }
        },
        onAdd() {
            // 최상위 레벨에 추가
            this.$refs.menuTree.append(this.addNode, null);
            this.dialog = false;
        },
        onSave() {
            // DB 에 저장될 menuId
            let menuId = 1;

            this.$common.showConfirm(
                '변경사항을 저장하시겠습니까?',
                () => {
                    const cloneList = cloneDeep(this.menus);
                    clearParentId(cloneList);
                    const flatMenuList = flatDeep(cloneList);
                    // 서버로 보낼 데이터를 만드는 과정에서 기존 list 는 변경되면 안되기 떄문에 깊은 복제를 해서 해당 list 를 이용

                    this.$common.showOverlay();
                    this.saveMenus(flatMenuList).then(() => {
                        this.$common.hideOverlay();
                    });
                },
                () => console.log('취소함')
            );

            function clearParentId(arr) {
                arr.forEach(item => {
                    if (Array.isArray(item.children)) {
                        clearParentId(item.children);
                    }
                    item.parentId = null;
                });
            }

            function flatDeep(arr) {
                return arr.reduce((acc, cur, index) => {
                    cur.menuId = menuId++;
                    cur.order = index + 1;
                    if (Array.isArray(cur.children)) {
                        cur.children.forEach(
                            child => (child.parentId = cur.menuId)
                        );
                        const returnArr = acc.concat(
                            [].concat(cur, flatDeep(cur.children))
                        );
                        delete cur.children;

                        return returnArr;
                    } else {
                        return acc.concat(cur);
                    }
                }, []);
            }
        }
    }
};
</script>
