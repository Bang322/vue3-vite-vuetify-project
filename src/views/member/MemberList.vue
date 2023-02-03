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

        <v-card class="pa-3">
            <v-data-table
                v-resize="onResize"
                :headers="headers"
                :items="desserts"
                item-value="name"
                :class="{ mobile: isMobile }"
            >
                <template #item="{ item }">
                    <tr
                        v-if="!isMobile"
                        @click="onClickRow(item)"
                    >
                        <td>{{ item.columns.name }}</td>
                        <td class="text-right">{{ item.columns.calories }}</td>
                        <td class="text-right">{{ item.columns.fat }}</td>
                        <td class="text-right">{{ item.columns.carbs }}</td>
                        <td class="text-right">{{ item.columns.protein }}</td>
                        <td class="text-right">{{ item.columns.iron }}</td>
                    </tr>
                    <tr
                        v-else
                        @click="onClickRow(item)"
                    >
                        <td>
                            <ul class="flex-content">
                                <li
                                    class="flex-item"
                                    data-label="Name"
                                >
                                    {{ item.columns.name }}
                                </li>
                                <li
                                    class="flex-item"
                                    data-label="Calories"
                                >
                                    {{ item.columns.calories }}
                                </li>
                                <li
                                    class="flex-item"
                                    data-label="Fat (g)"
                                >
                                    {{ item.columns.fat }}
                                </li>
                                <li
                                    class="flex-item"
                                    data-label="Carbs (g)"
                                >
                                    {{ item.columns.carbs }}
                                </li>
                                <li
                                    class="flex-item"
                                    data-label="Protein (g)"
                                >
                                    {{ item.columns.protein }}
                                </li>
                                <li
                                    class="flex-item"
                                    data-label="Iron (%)"
                                >
                                    {{ item.columns.iron }}
                                </li>
                            </ul>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: 'MemberList',
    data: () => ({
        isMobile: false,
        headers: [
            {
                title: 'Dessert (100g serving)',
                align: 'start',
                key: 'name',
                sortable: false
            },
            { title: 'Calories', key: 'calories' },
            { title: 'Fat (g)', key: 'fat' },
            { title: 'Carbs (g)', key: 'carbs' },
            { title: 'Protein (g)', key: 'protein' },
            { title: 'Iron (%)', key: 'iron' }
        ],
        desserts: [
            {
                name: 'Frozen Yogurt',
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                iron: '1%'
            },
            {
                name: 'Ice cream sandwich',
                calories: 237,
                fat: 9.0,
                carbs: 37,
                protein: 4.3,
                iron: '1%'
            },
            {
                name: 'Eclair',
                calories: 262,
                fat: 16.0,
                carbs: 23,
                protein: 6.0,
                iron: '7%'
            },
            {
                name: 'Cupcake',
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
                iron: '8%'
            },
            {
                name: 'Gingerbread',
                calories: 356,
                fat: 16.0,
                carbs: 49,
                protein: 3.9,
                iron: '16%'
            },
            {
                name: 'Jelly bean',
                calories: 375,
                fat: 0.0,
                carbs: 94,
                protein: 0.0,
                iron: '0%'
            },
            {
                name: 'Lollipop',
                calories: 392,
                fat: 0.2,
                carbs: 98,
                protein: 0,
                iron: '2%'
            },
            {
                name: 'Honeycomb',
                calories: 408,
                fat: 3.2,
                carbs: 87,
                protein: 6.5,
                iron: '45%'
            },
            {
                name: 'Donut',
                calories: 452,
                fat: 25.0,
                carbs: 51,
                protein: 4.9,
                iron: '22%'
            },
            {
                name: 'KitKat',
                calories: 518,
                fat: 26.0,
                carbs: 65,
                protein: 7,
                iron: '6%'
            }
        ]
    }),
    methods: {
        onResize() {
            this.isMobile = window.innerWidth < 769;
        },
        onClickRow(row) {
            console.log('row', row);
        }
    }
};
</script>

<style scoped></style>
