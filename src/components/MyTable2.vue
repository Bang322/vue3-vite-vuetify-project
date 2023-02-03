<template>
    <div
        class="my-table-wrap"
        :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    >
        <div
            class="my-table"
            :class="{ mobile: $vuetify.display.smAndDown }"
        >
            <div
                ref="myTableHead"
                class="my-table-head"
            >
                <div class="my-table-tr">
                    <div
                        v-if="showSelect"
                        class="my-table-th select-checkbox"
                    >
                        <v-checkbox-btn
                            v-model="allCheck"
                            density="comfortable"
                            :indeterminate="
                                !!selected.length &&
                                selected.length !== pageItems.length
                            "
                            @update:modelValue="onUpdateCheckbox"
                        />
                    </div>
                    <template v-if="$vuetify.display.mdAndUp">
                        <div
                            v-for="(header, index) in headers"
                            :key="index"
                            class="my-table-th"
                            :class="{
                                sortable: header.sortable,
                                asc: header.sortable === 'asc',
                                desc: header.sortable === 'desc'
                            }"
                            :style="{
                                flex: header.width
                                    ? typeof header.width === 'number'
                                        ? `0 0 ${header.width}px`
                                        : `0 0 ${header.width}`
                                    : '1 1 0px',
                                justifyContent: header.align
                                    ? header.align
                                    : 'center'
                            }"
                            @[header.sortable&&`click`]="onClickHeader(header)"
                        >
                            <div class="d-flex align-center">
                                <template
                                    v-if="
                                        !header.align ||
                                        header.align === 'start'
                                    "
                                >
                                    {{ header.text }}
                                    <v-icon
                                        :size="18"
                                        class="sort-icon"
                                    >
                                        mdi-arrow-up
                                    </v-icon>
                                </template>
                                <template v-else>
                                    <v-icon
                                        :size="18"
                                        class="sort-icon"
                                    >
                                        mdi-arrow-up
                                    </v-icon>
                                    {{ header.text }}
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div
                ref="myTableBody"
                class="my-table-body"
            >
                <div
                    v-for="(item, i) in pageItems"
                    :key="i"
                    class="my-table-tr"
                    @click="onClickRow($event, item)"
                >
                    <div
                        v-if="showSelect"
                        class="my-table-td select-checkbox"
                    >
                        <v-checkbox-btn
                            v-model="allCheck"
                            density="comfortable"
                            :indeterminate="
                                !!selected.length &&
                                selected.length !== pageItems.length
                            "
                            @update:modelValue="onUpdateCheckbox"
                        />
                    </div>
                    <div
                        v-for="(header, j) in headers"
                        :key="j"
                        class="my-table-td"
                        :style="{
                            flex: header.width
                                ? typeof header.width === 'number'
                                    ? `0 0 ${header.width}px`
                                    : `0 0 ${header.width}`
                                : '1 1 0px',
                            justifyContent: header.align
                                ? header.align
                                : 'center'
                        }"
                    >
                        <template v-if="$vuetify.display.mdAndUp">
                            <template v-if="!!$slots[`item.${header.key}`]">
                                <slot
                                    :name="`item.${header.key}`"
                                    :item="item"
                                />
                            </template>
                            <template v-else>
                                {{ item[header.key] }}
                            </template>
                        </template>
                        <template v-else>
                            <div class="mobile-header">
                                {{ header.text }}
                            </div>
                            <div class="mobile-item">
                                <template v-if="!!$slots[`item.${header.key}`]">
                                    <slot
                                        :name="`item.${header.key}`"
                                        :item="item"
                                    />
                                </template>
                                <template v-else>
                                    {{ item[header.key] }}
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div
            ref="myTableFooter"
            class="my-table-footer px-2 ma-0"
        >
            <div>페이지 당 행:</div>
            <div>
                <v-select
                    v-model="pageSelect"
                    :items="pageSelectItems"
                    variant="underlined"
                    density="comfortable"
                    :hide-details="true"
                    @update:modelValue="onUpdatePageSelect"
                />
            </div>
            <div>
                {{ pageText }}
            </div>
            <div>
                <v-btn
                    icon="mdi-chevron-left"
                    variant="plain"
                    density="comfortable"
                    :disabled="currentPage === 1"
                    @click="currentPage--"
                />
                <v-btn
                    icon="mdi-chevron-right"
                    variant="plain"
                    density="comfortable"
                    :disabled="currentPage === lastPage"
                    @click="currentPage++"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyTable2',
    props: {
        modelValue: {
            type: Array,
            default() {
                return [];
            },
            required: false
        },
        headers: {
            type: Array,
            required: true
        },
        items: {
            type: Array,
            required: true
        },
        showSelect: {
            type: Boolean,
            required: false
        },
        itemKey: {
            type: String,
            default: 'id',
            required: false
        },
        height: {
            type: [Number, String],
            default: 'auto',
            required: false
        }
    },
    emits: ['update:modelValue', 'click:row'],
    data() {
        return {
            selected: [],
            pageSelect: 5, // 기본 페이지 당 행값 설정
            currentPage: 1,
            sort: {
                key: '',
                type: ''
            },
            pageSelectItems: Array.from(
                { length: 5 },
                (value, index) => (index + 1) * 5
            )
        };
    },
    computed: {
        // 전체체크 설정
        allCheck: {
            // 리스트 아이템을 모두 체크했을 때 전체체크 true 로 설정
            get() {
                return (
                    this.pageItems.length &&
                    this.selected.length === this.pageItems.length
                );
            },
            // 전체체크를 선택할 때 selected 배열의 값 설정
            set(check) {
                this.selected = check
                    ? this.pageItems.map(item => item[this.itemKey])
                    : [];
            }
        },
        // items 배열로부터 page 를 적용한 새로운 배열 생성
        pageItems() {
            let pageItems = this.items.slice(
                (this.currentPage - 1) * this.pageSelect,
                this.currentPage * this.pageSelect
            );

            if (this.sort.key && this.sort.type) {
                const sortFunction = (a, b) => {
                    const aVal = a[this.sort.key];
                    const bVal = b[this.sort.key];

                    if (this.sort.type === 'asc') {
                        if (aVal > bVal) return 1;
                        else if (aVal < bVal) return -1;
                        else return 0;
                    } else if (this.sort.type === 'desc') {
                        if (aVal > bVal) return -1;
                        else if (aVal < bVal) return 1;
                        else return 0;
                    }
                };

                pageItems.sort(sortFunction);
            }

            return pageItems;
        },
        // 마지막 페이지 설정 (첫 번째 페이지는 1이므로 계산해줄 필요없음)
        lastPage() {
            return Math.ceil(this.items.length / this.pageSelect);
        },
        // page Text 설정
        pageText() {
            return `${this.items.length} 개 중 ${
                (this.currentPage - 1) * this.pageSelect + 1
            } - ${
                this.currentPage === this.lastPage
                    ? this.items.length
                    : this.currentPage * this.pageSelect
            }`;
        }
    },
    mounted() {
        const headHeight = this.$refs.myTableHead.offsetHeight;

        this.$refs.myTableBody.style.height = `calc(100% - ${headHeight}px)`;
        this.onUpdateHeaderPadding();
    },
    updated() {
        this.onUpdateHeaderPadding();
    },
    methods: {
        // 테이블의 헤더 클릭 시 이벤트
        onClickHeader(item) {
            // 하나의 헤더값으로 정렬 가능하도록 설정
            this.headers.forEach(headerItem => {
                if (headerItem.text !== item.text && headerItem.sortable) {
                    headerItem.sortable = true;
                }
            });

            // 클릭할 때마다 정렬방식 변경
            if (item.sortable === true) item.sortable = 'asc';
            else if (item.sortable === 'asc') item.sortable = 'desc';
            else item.sortable = true;

            if (item.sortable !== true) {
                this.sort = {
                    key: item.key,
                    type: item.sortable
                };
            } else {
                this.sort = {
                    key: '',
                    type: ''
                };
            }
        },
        // 체크박스값 변경 시 이벤트
        onUpdateCheckbox() {
            // 상위 컴포넌트에서 전달해준 v-model 값 update
            this.$emit('update:modelValue', this.selected);
        },
        // 테이블의 row 클릭 시 이벤트
        onClickRow({ target }, row) {
            // 체크박스 클릭 시에는 row 클릭 이벤트가 발생하지 않도록 설정
            target.type !== 'checkbox' && this.$emit('click:row', row);
        },
        // page Select 값 변경 시 이벤트
        onUpdatePageSelect(value) {
            // 현재 페이지를 첫 번째 페이지로 설정
            this.currentPage = 1;
        },
        onUpdateHeaderPadding() {
            const tableBody = this.$refs.myTableBody;
            const tableHeadTr = document.querySelector(
                '.my-table-head .my-table-tr'
            );

            // table body 영역에 스크롤이 생길 때
            if (tableBody.offsetHeight < tableBody.scrollHeight) {
                tableHeadTr.style.paddingRight = '16px';
            } else {
                tableHeadTr.style.paddingRight = '0';
            }
        }
    }
};
</script>

<style lang="scss">
@import '@/styles/table2.scss';
</style>
