<template>
    <!-- please don't think too hard about how this works -->
    <button
    :disabled="disabled && !isSelected"
    :class="isSelected ? `table t${size} selected` : `table t${size}`">
        <label @click="!(disabled && !isSelected) ? onClick($event) : undefined">{{ label }}</label>
    </button>
</template>

<script>

export default {
    name: 'Table',
    props: {
        size: Number,
        label: String,
        disabled: Boolean,
        isSelected: Boolean,
    },
    data: () => {
        return {
        }
    },
    watch: {
    },
    methods: {
        onClick(e) {
            e.preventDefault();

            if (this.isSelected) {
                this.$emit('table-deselect', { label: this.label, size: this.size })
            } else {
                this.$emit('table-select', { label: this.label, size: this.size })
            }
        }
    }
}
</script>
