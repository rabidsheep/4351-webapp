<template>
    <v-stepper
    v-model="step"
    class="registration__stepper">
        <v-stepper-items>
            <v-stepper-content step="1"> 
                <ReservationForm
                :customer="customer"
                :payment="payment"
                :reservation="reservation"
                :uid="uid"
                :states="states"
                :availableTimes="availableTimes"
                :highTraffic="highTraffic"
                @updateCardExp="payment.expirationDate = $event"
                @setTables="selectedTables = $event"
                @setHighTraffic="highTraffic = $event"
                @submitReservation="submitReservation($event)"
                @createAccount="step = 2"
                 />
            </v-stepper-content>

            <v-stepper-content step="2">
                <RegistrationForm
                :customer="customer"
                :payment="payment"
                :reservation="reservation"
                :states="states"
                :highTraffic="highTraffic"
                :selectedTables="selectedTables"
                @goBack="step = 1"
                @createAndSubmit="createAndSubmit($event)"
                 />
            </v-stepper-content>

            <v-stepper-content step="3">
                <SubmissionSuccess
                :confirmation="confirmation"
                :customer="customer"
                :reservation="reservation"
                :selectedTables="selectedTables"
                 />
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
import ReservationForm from '../components/ReservationForm.vue';
import RegistrationForm from '../components/RegistrationForm.vue';
import SubmissionSuccess from '../components/SubmissionSuccess.vue';
import "firebase/compat/auth";

export default {
    name: 'Reserve',
    components: {
        ReservationForm,
        RegistrationForm,
        SubmissionSuccess
    },
    props: {

    },
    data: () => {
        return {
            step: 1,
            uid: null,
            confirmation: null,
            highTraffic: false,
            retrieveTables: false,
            states: [
                "  ", "AK", "AL", "AR", "AZ", "CA", "CO", "CT",   
                "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL",  
                "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", 
                "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
                "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA",
                "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", 
                "WA", "WI", "WV", "WY"
            ],
            availableTimes: [
                "9:00am", "10:00am", "11:00am",
                "12:00pm", "1:00pm", "2:00pm",
                "3:00pm", "4:00pm", "5:00pm",
                "6:00pm", "7:00pm", "8:00pm"
            ],
            customer: {
                firstName: null,
                lastName: null,
                email: null,
                phone: null,
                mailing: {
                    line1: null,
                    line2: null,
                    city: null,
                    state: null,
                    zip: null,
                },
                payment: {
                    cardholderName: null,
                    cardNum: null,
                    cvv: null,
                    expirationDate: null,
                    billing: {
                        line1: null,
                        line2: null,
                        city: null,
                        state: null,
                        zip: null,
                    }
                },
                dinerId: null,
                points: 0,
            },
            payment: {
                cardholderName: null,
                cardNum: null,
                cvv: null,
                expirationDate: null,
                billing: {
                    line1: null,
                    line2: null,
                    city: null,
                    state: null,
                    zip: null,
                },
            },
            reservation: {
                date: new Date(),
                time: null,
                numGuests: 1,
                discountApplied: 0,
            },
            selectedTables: [],
            totalSeats: 0,
            submitted: false,
        }
    },
    mounted() {
        if (this.$route.params.userDetails) {
            let details = this.$route.params.userDetails;
            this.uid = details.uid;

            this.customer = {
                firstName: details.firstName,
                lastName: details.lastName,
                phone: details.phone,
                email: details.email,
                mailing: details.mailing,
                payment: details.payment,
                dinerId: details.dinerId,
                points: details.points,
            }

            this.payment = details.payment;
        }
    },
    watch: {
    },
    methods: {
        submitReservation(reservation) {
            this.$reservation
            .save({ reservation: reservation, uid: this.uid })
            .then((response) => {
                console.log("Reservation success.")
                console.log(response.body);
                this.confirmation = response.body.id;
                this.step = 3;
            })
            .catch((error) => { 
                console.log("Reservation failed.")
                console.log(error.body)
            });
        },

        createAndSubmit(details) {
            this.$firebase
            .auth()
            .createUserWithEmailAndPassword(details.email, details.password)
            .then((data) => {
                var credentials = data.user.multiFactor.user;

                var account = {
                    ...details.account,
                    uid: credentials.uid
                }

                data.user.updateProfile({
                    displayName: this.customer.firstName
                });

                console.log("Account created")

                return this.$user.create({ data: account, token: credentials.accessToken })
            })
            .then(() => {
                //console.log(response);
                console.log("Account added to database")
                return this.submitReservation(details.reservation);
            })
            .catch((error) => console.error(error));
        },
    }
}
</script>