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
                                ????????? ???????????? ????????????.
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
            <v-col cols="auto"> ????????? ??? ???:</v-col>
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
            pageSelect: 5, // ?????? ????????? ??? ?????? ??????
            currentPage: 1,
            pageSelectItems: Array.from(
                { length: 5 },
                (value, index) => (index + 1) * 5
            )
        };
    },
    computed: {
        // ???????????? ??????
        allCheck: {
            // ????????? ???????????? ?????? ???????????? ??? ???????????? true ??? ??????
            get() {
                return (
                    this.pageItems.length &&
                    this.selected.length === this.pageItems.length
                );
            },
            // ??????????????? ????????? ??? selected ????????? ??? ??????
            set(check) {
                this.selected = check
                    ? this.pageItems.map(item => item[this.itemKey])
                    : [];
            }
        },
        // items ??????????????? page ??? ????????? ????????? ?????? ??????
        pageItems() {
            return this.items.slice(
                (this.currentPage - 1) * this.pageSelect,
                this.currentPage * this.pageSelect
            );
        },
        // ????????? ????????? ?????? (??? ?????? ???????????? 1????????? ???????????? ????????????)
        lastPage() {
            return Math.ceil(this.items.length / this.pageSelect);
        },
        // page Text ??????
        pageText() {
            return `${this.items.length} ??? ??? ${
                (this.currentPage - 1) * this.pageSelect + 1
            } - ${
                this.currentPage === this.lastPage
                    ? this.items.length
                    : this.currentPage * this.pageSelect
            }`;
        }
    },
    methods: {
        // ???????????? ?????? ?????? ??? ?????????
        onClickHeader(item) {
            // ????????? ??????????????? ?????? ??????????????? ??????
            this.headers.forEach(headerItem => {
                if (headerItem.text !== item.text) headerItem.sortable = true;
            });

            // ????????? ????????? ???????????? ??????
            if (item.sortable === true) item.sortable = 'asc';
            else if (item.sortable === 'asc') item.sortable = 'desc';
            else item.sortable = true;
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
        onUpdatePageSelect(value) {
            // ?????? ???????????? ??? ?????? ???????????? ??????
            this.currentPage = 1;
        }
    }
};
</script>

<style lang="scss">
@import '@/styles/table.scss';
</style>
