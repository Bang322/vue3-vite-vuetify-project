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
                    <template v-else>????????? ???????????? ????????????.</template>
                </div>
            </div>
        </div>
        <div
            ref="myTableFooter"
            class="my-table-footer px-2 ma-0"
        >
            <div>????????? ??? ???:</div>
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
            selected: [], // ??????????????? (itemKey ?????? ?????????)
            pageSelect: 5, // ?????? ????????? ??? ?????? ??????
            currentPage: 1, // ?????? ?????????
            // ?????????
            sort: {
                key: '',
                type: ''
            },
            // ????????? ??? ??? select ?????????
            pageSelectItems: Array.from({ length: 4 }, (value, index) =>
                index === 3 ? 'All' : (index + 1) * 5
            )
        };
    },
    computed: {
        // ???????????? ??????
        allCheck: {
            // ????????? ???????????? ?????? ???????????? ??? ???????????? true ??? ??????
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
            // ??????????????? ????????? ??? selected ????????? ??? ??????
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
        // ???????????? ?????? ?????? items ??????
        searchItems() {
            // ???????????? ????????? ???
            if (
                this.search !== '' &&
                this.search !== null &&
                this.search !== undefined
            ) {
                // ?????? ???????????? ???????????? ????????? ??????????????? currentPage ??????
                this.onResetCurrentPage();

                // ???????????? ?????????????????? item ??? ??????????????? return
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
            // ???????????? ???????????? ?????? ?????? props ??? ?????? items ?????? ???????????? return
            else {
                return [...this.items];
            }
        },
        // sorting ??? paging ??? ????????? ????????? ?????? return
        pageItems() {
            let pageItems = [...this.searchItems];

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
        // ????????? ????????? ?????? (??? ?????? ???????????? 1????????? ???????????? ????????????)
        lastPage() {
            return Math.ceil(this.searchItems.length / this.pageSelect);
        },
        // table footer ??? page text ??????
        pageText() {
            let pageText = '';

            if (this.pageItems.length) {
                if (this.pageSelect === 'All') {
                    pageText = `${this.searchItems.length} ??? ??? 1 - ${this.searchItems.length}`;
                } else {
                    pageText = `${this.searchItems.length} ??? ??? ${
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
    // ?????? ??????????????? mount ??? ???
    // table ??? tableBody ??? ????????? ???????????? -> table body ???????????? ??????
    mounted() {
        const headHeight = this.$refs.myTableHead.offsetHeight;
        const footerHeight = this.$refs.myTableFooter.offsetHeight;

        this.$refs.myTable.style.height = `calc(100% - ${footerHeight}px)`;
        this.$refs.myTableBody.style.height = `calc(100% - ${headHeight}px)`;
        this.onUpdateHeaderPadding();
    },
    // ?????? ??????????????? update ??? ???
    updated() {
        this.onUpdateHeaderPadding();
    },
    methods: {
        // ???????????? ?????? ?????? ??? ????????? (sortable ?????? true ??? header ??? ?????? ????????? ????????????)
        onClickHeader(item) {
            // ????????? ??????????????? ?????? ??????????????? ??????
            this.headers.forEach(headerItem => {
                if (headerItem.text !== item.text && headerItem.sortable) {
                    headerItem.sortable = true;
                }
            });

            // ????????? ????????? ???????????? ??????
            if (item.sortable === true) item.sortable = 'asc'; // ????????????
            else if (item.sortable === 'asc')
                item.sortable = 'desc'; // ????????????
            else item.sortable = true; // ?????? X (?????????)

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
        // ??????????????? ?????? ??? ?????????
        onUpdateCheckbox() {
            // ?????? ?????????????????? ???????????? v-model ??? update
            this.$emit('update:modelValue', this.selected);
        },
        // ???????????? row ?????? ??? ?????????
        onClickRow({ target }, row) {
            // ???????????? ?????? ????????? row ?????? ???????????? ???????????? ????????? ??????
            target.type !== 'checkbox' && this.$emit('click:row', row);
        },
        // page Select ??? ?????? ??? ?????????
        onUpdatePageSelect() {
            // ?????? ???????????? ??? ?????? ???????????? ??????
            this.onResetCurrentPage();
        },
        // table body ????????? ???????????? ?????? ??? table head ????????? ????????? ???????????? paddingRight ??????
        onUpdateHeaderPadding() {
            const tableBody = this.$refs.myTableBody;
            const tableHeadTr = document.querySelector(
                '.my-table-head .my-table-tr'
            );

            // table body ????????? ???????????? ?????? ???
            if (tableBody.offsetHeight < tableBody.scrollHeight) {
                tableHeadTr.style.paddingRight = '16px';
            } else {
                tableHeadTr.style.paddingRight = '0';
            }
        },
        // ?????? ???????????? reset
        onResetCurrentPage() {
            this.currentPage = 1;
        }
    }
};
</script>

<style lang="scss">
@import '@/styles/myTable.scss';
</style>
