<template>
    <button
    :class="isActive ? `btn__timeslot active` : `btn__timeslot`"
    @click="$emit('set-time', $event)">
        {{ time }}
    </button>
</template>

<script>

export default {
    name: "TimeslotBtn",
    props: {
        time: String,
        selectedTimeslot: Number,
        i: Number,
    },
    data: () => {
        return {
            isActive: false,
        }
    },
    watch: {
        selectedTimeslot: function(st) {
            if (st === this.i)
                this.isActive = true;
            else
                this.isActive = false;
        }
    }
}
</script>
