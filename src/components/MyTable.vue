<template>
    <div
        class="my-table-wrap"
        :class="{ loading }"
        :style="{ height: typeof height === 'number' ? `${height}px` : height }"
    >
        <div
            ref="myTable"
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
                            :indeterminate="checkboxIndeterminate"
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

                    <v-progress-linear
                        v-if="loading"
                        indeterminate
                        rounded-bar
                        class="my-table-loading"
                        height="3"
                        color="primary"
                    />
                </div>
            </div>

            <div
                ref="myTableBody"
                class="my-table-body"
            >
                <template v-if="pageItems.length">
                    <div
                        v-for="(item, i) in pageItems"
                        :key="`item${i}`"
                        v-ripple="{ class: `text-primary` }"
                        class="my-table-tr"
                        @click="onClickRow($event, item)"
                    >
                        <div
                            v-if="showSelect"
                            class="my-table-td select-checkbox"
                        >
                            <v-checkbox-btn
                                v-model="selected"
                                :value="item[itemKey]"
                                density="comfortable"
                                @update:modelValue="onUpdateCheckbox"
                            />
                        </div>
                        <div
                            v-for="(header, j) in headers"
                            :key="`header${j}`"
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
                                    <template
                                        v-if="!!$slots[`item.${header.key}`]"
                                    >
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
                </template>
                <div
                    v-else
                    class="my-table-tr no-data"
                >
                    <template v-if="!!$slots['no-data']">
                        <slot name="no-data" />
                    </template>
                    <template v-else>검색된 아이템이 없습니다.</template>
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
                    icon="mdi-chevron-double-left"
                    variant="plain"
                    density="comfortable"
                    :disabled="currentPage === 1"
                    @click="currentPage = 1"
                />
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
                    :disabled="!pageItems.length || currentPage === lastPage"
                    @click="currentPage++"
                />
                <v-btn
                    icon="mdi-chevron-double-right"
                    variant="plain"
                    density="comfortable"
                    :disabled="!pageItems.length || currentPage === lastPage"
                    @click="currentPage = lastPage"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyTable',
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
        },
        search: {
            type: String,
            default: '',
            required: false
        },
        loading: {
            type: Boolean,
            required: false
        }
    },
    emits: ['update:modelValue', 'click:row'],
    data() {
        return {
            selected: [], // 체크박스값 (itemKey 값이 들어감)
            pageSelect: 5, // 기본 페이지 당 행값 설정
            currentPage: 1, // 현재 페이지
            // 정렬값
            sort: {
                key: '',
                type: ''
            },
            // 페이지 당 행 select 아이템
            pageSelectItems: Array.from({ length: 4 }, (value, index) =>
                index === 3 ? 'All' : (index + 1) * 5
            )
        };
    },
    computed: {
        // 전체체크 설정
        allCheck: {
            // 리스트 아이템을 모두 체크했을 때 전체체크 true 로 설정
            get() {
                let checkCount = 0;

                for (let i = 0; i < this.pageItems.length; i++) {
                    const itemKey = this.pageItems[i][this.itemKey];

                    if (this.selected.includes(itemKey)) checkCount++;
                }

                return checkCount === this.pageItems.length;
                /*
                if (
                    this.pageItems.length &&
                    this.selected.length === this.pageItems.length
                ) {
                    for (let i = 0; i < this.pageItems.length; i++) {
                        const itemKey = this.pageItems[i][this.itemKey];

                        if (!this.selected.includes(itemKey)) return false;
                    }

                    return true;
                } else {
                    return false;
                }
*/
            },
            // 전체체크를 선택할 때 selected 배열의 값 설정
            set(check) {
                this.selected = check
                    ? [
                          ...this.selected,
                          ...this.pageItems
                              .map(item => item[this.itemKey])
                              .filter(
                                  itemKey => !this.selected.includes(itemKey)
                              )
                      ]
                    : this.selected.filter(
                          selectedKey =>
                              this.pageItems.findIndex(
                                  item => item[this.itemKey] === selectedKey
                              ) === -1
                      );
            }
        },
        checkboxIndeterminate() {
            if (this.selected.length) {
                let checkCount = 0;
                for (let i = 0; i < this.pageItems.length; i++) {
                    const itemKey = this.pageItems[i][this.itemKey];

                    if (this.selected.includes(itemKey)) checkCount++;
                }

                return checkCount !== 0 && checkCount !== this.pageItems.length;
            } else {
                return false;
            }
        },
        // 검색값이 있을 경우 items 설정
        searchItems() {
            // 검색값이 존재할 때
            if (
                this.search !== '' &&
                this.search !== null &&
                this.search !== undefined
            ) {
                // 현재 페이지와 상관없이 검색이 돼야하므로 currentPage 리셋
                this.onResetCurrentPage();

                // 검색값을 포함하고있는 item 만 필터링하여 return
                return this.items.filter(obj => {
                    let filterResult = false;

                    for (const value of Object.values(obj)) {
                        let castValue;

                        if (
                            typeof value === 'number' ||
                            typeof value === 'string'
                        ) {
                            castValue = String(value);

                            if (castValue.includes(this.search)) {
                                filterResult = true;
                                break;
                            }
                        }
                    }

                    return filterResult;
                });
            }
            // 검색값이 존재하지 않을 때는 props 로 받은 items 배열 복사하여 return
            else {
                return [...this.items];
            }
        },
        // sorting 과 paging 을 적용한 새로운 배열 return
        pageItems() {
            let pageItems = this.searchItems;

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

            return this.pageSelect === 'All'
                ? pageItems
                : pageItems.slice(
                      (this.currentPage - 1) * this.pageSelect,
                      this.currentPage * this.pageSelect
                  );
        },
        // 마지막 페이지 설정 (첫 번째 페이지는 1이므로 계산해줄 필요없음)
        lastPage() {
            return Math.ceil(this.searchItems.length / this.pageSelect);
        },
        // table footer 의 page text 설정
        pageText() {
            let pageText = '';

            if (this.pageItems.length) {
                if (this.pageSelect === 'All') {
                    pageText = `${this.searchItems.length} 개 중 1 - ${this.searchItems.length}`;
                } else {
                    pageText = `${this.searchItems.length} 개 중 ${
                        (this.currentPage - 1) * this.pageSelect + 1
                    } - ${
                        this.currentPage === this.lastPage
                            ? this.searchItems.length
                            : this.currentPage * this.pageSelect
                    }`;
                }
            } else {
                pageText = '-';
            }
            return pageText;
        }
    },
    // 해당 컴포넌트가 mount 된 후
    // table 과 tableBody 의 높이를 설정해줌 -> table body 스크롤을 위해
    mounted() {
        const headHeight = this.$refs.myTableHead.offsetHeight;
        const footerHeight = this.$refs.myTableFooter.offsetHeight;

        this.$refs.myTable.style.height = `calc(100% - ${footerHeight}px)`;
        this.$refs.myTableBody.style.height = `calc(100% - ${headHeight}px)`;
        this.onUpdateHeaderPadding();
    },
    // 해당 컴포넌트가 update 된 후
    updated() {
        this.onUpdateHeaderPadding();
    },
    methods: {
        // 테이블의 헤더 클릭 시 이벤트 (sortable 값이 true 인 header 만 클릭 이벤트 바인딩됨)
        onClickHeader(item) {
            // 하나의 헤더값으로 정렬 가능하도록 설정
            this.headers.forEach(headerItem => {
                if (headerItem.text !== item.text && headerItem.sortable) {
                    headerItem.sortable = true;
                }
            });

            // 클릭할 때마다 정렬방식 변경
            if (item.sortable === true) item.sortable = 'asc'; // 오름차순
            else if (item.sortable === 'asc')
                item.sortable = 'desc'; // 내림차순
            else item.sortable = true; // 정렬 X (초기화)

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
        onUpdatePageSelect() {
            // 현재 페이지를 첫 번째 페이지로 설정
            this.onResetCurrentPage();
        },
        // table body 영역에 스크롤이 생길 때 table head 영역에 스크롤 크기만큼 paddingRight 설정
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
        },
        // 현재 페이지값 reset
        onResetCurrentPage() {
            this.currentPage = 1;
        }
    }
};
</script>

<style lang="scss">
@import '@/styles/myTable.scss';
</style>
