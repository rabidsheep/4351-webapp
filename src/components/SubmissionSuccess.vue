<template>
    <div id="submitted">
        <center><h2>Your reservation is booked!</h2></center>
        
        <table class="reservation__details">
            <tr>
                <td>Confirmation #</td>
                <td>{{ confirmation }}</td>
            </tr>
            <tr>
                <td>Name</td>
                <td>{{ customer.firstName + ' ' + customer.lastName }}</td>
            </tr>
            <tr>
                <td>Date</td>
                <td>{{ reservation.date }}</td>
            </tr>
            <tr>
                <td>Time</td>
                <td>{{ reservation.time }}</td>
            </tr>
            <tr>
                <td>Guests</td>
                <td>{{ reservation.numGuests }}</td>
            </tr>
            <tr>
                <td>Tables</td>
                <td>
                    {{ tablesList }}
                </td>
            </tr>
        </table>

        <button class="btn submit"
        @click="$router.push('/')">
            <v-icon>mdi-paw</v-icon>
            <v-divider vertical />
            <label>Return to Home</label>
        </button>
    </div>
</template>

<script>
export default {
    name: 'SubmissionSuccess',
    props: {
        confirmation: String,
        customer: Object,
        reservation: Object,
        selectedTables: Array,
    },
    data: () => {
        return {
        }
    },
    mounted: function() {

    },
    computed: {
        tablesList: function() {
            var list = '';
            for (var i = 0; i < this.selectedTables.length; i++) {
            list += i < this.selectedTables.length - 1 ?
                `${this.selectedTables[i]}, ` : this.selectedTables[i]
            }

            return list;
        }
    },
    methods: {

    }
}
</script>