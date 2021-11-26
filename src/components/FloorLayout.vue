<template>
    <div id="floor">
        <div class="group__t2">
            <Table
            v-for="i in tables.t2"
            :key="i"
            :size="2"
            :label="`A${i}`"
            :disabled="!validTables.includes(`A${i}`) || comboTables.length > 0 && !comboTables.includes(`A${i}`) || disableAllSeats"
            :isSelected="selectedTables.includes(`A${i}`)"
            @table-select="$emit('table-select', $event)"
            @table-deselect="$emit('table-deselect', $event)" />
        </div>
        
        <div class="group__t4">
            <Table
            v-for="i in tables.t4"
            :key="i"
            :size="4"
            :label="`B${i}`"
            :disabled="!validTables.includes(`B${i}`) || comboTables.length > 0 && !comboTables.includes(`B${i}`) || disableAllSeats"
            :isSelected="selectedTables.includes(`B${i}`)"
            @table-select="$emit('table-select', $event)"
            @table-deselect="$emit('table-deselect', $event)" />
        </div>

        <div class="group__t6">
            <Table
            v-for="i in tables.t6"
            :key="i"
            :size="6"
            :label="`C${i}`"
            :disabled="!validTables.includes(`C${i}`) || comboTables.length > 0 && !comboTables.includes(`C${i}`) || disableAllSeats"
            :isSelected="selectedTables.includes(`C${i}`)"
            @table-select="$emit('table-select', $event)"
            @table-deselect="$emit('table-deselect', $event)" />
        </div>

        <div class="group__t8">
            <Table
            v-for="i in tables.t8"
            :key="i"
            :size="8"
            :label="`D${i}`"
            :disabled="!validTables.includes(`D${i}`) || comboTables.length > 0 && !comboTables.includes(`D${i}`) || disableAllSeats"
            :isSelected="selectedTables.includes(`D${i}`)"
            :validTables="validTables"
            @table-select="$emit('table-select', $event)"
            @table-deselect="$emit('table-deselect', $event)" />
        </div>
    </div>
</template>

<script>
import Table from '../components/Table.vue';

export default {
    name: 'FloorLayout',
    components: {
        Table
    },
    props: {
        validTables: Array,
        validCombos: Array,
        selectedTables: Array,
        disableAllSeats: Boolean,
    },
    data: () => {
        return {
            tables: {
                t2: 5,
                t4: 4,
                t6: 2,
                t8: 2,
            },
            comboTables: []
        }
    },
    watch: {
        'selectedTables': function(s) {
            this.findComboTables(s);
        }
    },
    methods: {
        findComboTables(selected) {
            let temp = [];
            this.validCombos.forEach((combo) => {
                if (selected.every(table => combo.includes(table))) {
                    combo.forEach((tid) => {
                        if (!temp.includes(tid) && !this.selectedTables.includes(tid)) {
                            temp.push(tid);
                        }
                    })
                }
            })

            this.comboTables = temp;
        }
    },
}
</script>
