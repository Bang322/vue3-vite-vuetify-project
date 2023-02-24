<template>
    <div class="my-table-wrap">
        <div
            class="my-table"
            :class="{ mobile: $vuetify.display.smAndDown }"
            :style="{
                height: typeof height === 'number' ? `${height}px` : height
            }"
        >
            <table>
                <thead ref="thead">
                    <tr>
                        <th
                            v-if="showSelect"
                            class="select-checkbox"
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
                        </th>
                        <template v-if="$vuetify.display.smAndUp">
                            <th
                                v-for="(item, index) in headers"
                                :key="index"
                                :class="{
                                    sortable: item.sortable,
                                    asc: item.sortable === 'asc',
                                    desc: item.sortable === 'desc'
                                }"
                                @[item.sortable&&`click`]="onClickHeader(item)"
                            >
                                <div class="d-flex align-center">
                                    {{ item.text }}
                                    <v-icon
                                        :size="18"
                                        class="sort-icon"
                                    >
                                        mdi-arrow-up
                                    </v-icon>
                                </div>
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody ref="tbody">
                    <template v-if="pageItems.length">
                        <tr
                            v-for="(row, index) in pageItems"
                            :key="index"
                            :class="{ mobile: $vuetify.display.xs }"
                            @click="onClickRow($event, row)"
                        >
                            <td
                                v-if="showSelect"
                                class="select-checkbox"
                            >
                                <v-checkbox-btn
                                    v-model="selected"
                                    :value="row[itemKey]"
                                    density="comfortable"
                                    @update:modelValue="onUpdateCheckbox"
                                />
                            </td>
                            <td
                                v-for="(header, i) in headers"
                                :key="i"
                            >
                                <template v-if="$vuetify.display.smAndUp">
                                    <template
                                        v-if="!!$slots[`item.${header.key}`]"
                                    >
                                        <slot
                                            :name="`item.${header.key}`"
                                            :item="row"
                                        />
                                    </template>
                                    <template v-else>
                                        {{ row[header.key] }}
                                    </template>
                                </template>
                                <template v-else>
                                    <div class="mobile-header">
                                        {{ header.text }}
                                    </div>
                                    <div class="mobile-cell">
                                        <template
                                            v-if="
                                                !!$slots[`item.${header.key}`]
                                            "
                                        >
                                            <slot
                                                :name="`item.${header.key}`"
                                                :item="row"
                                            />
                                        </template>
                                        <template v-else>
                                            {{ row[header.key] }}
                                        </template>
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </template>
                    <tr
                        v-else
                        class="no-data text-center"
                    >
                        <td
                            :colspan="
                                showSelect ? headers.length + 1 : headers.length
                            "
                        >
                            <template v-if="!!$slots['no-data']">
                                <slot name="no-data" />
                            </template>
                            <template v-else>
                                검색된 아이템이 없습니다.
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <v-row
            class="my-table-footer px-2 ma-0"
            justify="end"
            align="center"
        >
            <v-col cols="auto"> 페이지 당 행:</v-col>
            <v-col cols="auto">
                <v-select
                    v-model="pageSelect"
                    :items="pageSelectItems"
                    variant="underlined"
                    density="comfortable"
                    :hide-details="true"
                    @update:modelValue="onUpdatePageSelect"
                />
            </v-col>
            <v-col cols="auto">
                {{ pageText }}
            </v-col>
            <v-col cols="auto">
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
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { he } from 'vuetify/locale';
let timer = null;

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
        }
    },
    emits: ['update:modelValue', 'click:row'],
    data() {
        return {
            selected: [],
            pageSelect: 5, // 기본 페이지 당 행값 설정
            currentPage: 1,
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
            return this.items.slice(
                (this.currentPage - 1) * this.pageSelect,
                this.currentPage * this.pageSelect
            );
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
    methods: {
        // 테이블의 헤더 클릭 시 이벤트
        onClickHeader(item) {
            // 하나의 헤더값으로 정렬 가능하도록 설정
            this.headers.forEach(headerItem => {
                if (headerItem.text !== item.text) headerItem.sortable = true;
            });

            // 클릭할 때마다 정렬방식 변경
            if (item.sortable === true) item.sortable = 'asc';
            else if (item.sortable === 'asc') item.sortable = 'desc';
            else item.sortable = true;
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
        }
    }
};
</script>

<style lang="scss">
@import '@/styles/table.scss';
</style>
