<template>
    <v-form id="reservation">
        <div class="main">
            <!-- GUEST INFO -->
            <div class="guest">
                <span><h2>Reservation Info</h2> <hr /></span>

                <div class="fields guest__fields">
                    <div id="guest__name">
                        <div class="input__text input__fn">
                            <label for="fname">First Name <span class="req">*</span></label>
                            <input
                            v-model="customer.firstName"
                            id="fname"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.firstName.$error }"
                            required />
                        </div>

                        <div class="input__text input__ln">
                            <label for="lname">Last Name <span class="req">*</span></label>
                            <input
                            v-model="customer.lastName"
                            id="lname"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.lastName.$error }"
                            required />
                        </div>
                    </div>

                    <div id="guest__contact">
                        <div class="input__text input__email form-group">
                            <label for="email">E-mail <span class="req">*</span></label>
                            <input
                            v-model="customer.email"
                            id="email"
                            type="email"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.email.$error }"
                            required />
                            <div v-if="submitted && $v.customer.email.$error" class="invalid-feedback">
                                <span v-if="!$v.customer.email.email">The email is not valid.</span>
                            </div>
                        </div>

                        <div class="input__text input__phone">
                            <label for="phone">Phone # <i>(Optional)</i></label>
                            <input
                            v-model="customer.phone"
                            placeholder="###-###-####"
                            type="tel"
                            maxlength="12"
                            @keyup="addDashes($event.key, $event.target.value)"
                            @keypress="numKeysOnly($event)"
                            id="phone" />
                        </div>
                    </div>

                    <div id="guest__address-1">
                        <div class="input__text input__address-l1">
                            <label for="maddress">Mailing Address <span class="req">*</span></label>
                            <input
                            v-model="customer.address1"
                            id="maddress"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.address1.$error }"
                            required />                   
                        </div>

                        <div class="input__text input__address-l2">
                            <label for="maddress2">Apt/Suite/Building #</label>
                            <input
                            v-model="customer.address2"
                            id="maddress2"
                            required />                   
                        </div>
                    </div>

                    <div id="guest__address-2">
                        <div class="input__text input__city">
                            <label for="mcity">City <span class="req">*</span></label>
                            <input
                            v-model="customer.city"
                            id="mcity"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.city.$error }"
                            required />
                    </div>

                        <div class="input__select input__state">
                        <label for="mstate">State <span class="req">*</span></label>
                            <select
                            v-model="customer.state"
                            id="mstate"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.state.$error }"
                            required>
                                <option
                                v-for="(state, i) in states"
                                :key="i"
                                :value="state">
                                    {{ state }}
                                </option>
                            </select>
                        </div>

                        <div class="input__text input__zip form-group">
                            <label for="mzip">Zip Code <span class="req">*</span></label>
                            <input
                            v-model="customer.zip"
                            id="mzip"
                            @keypress="numKeysOnly($event)"
                            required />
                            <div v-if="submitted && $v.customer.zip.$error" class="invalid-feedback">
                                <span v-if="!$v.customer.zip.required">valid zipcode required</span>
                            </div>
                        </div>
                    </div>

                    <div id="guest__seating">
                        <div class="input__text input__seating form-group">
                                <label for="seating"># of Guests <span class="req">*</span></label>
                                <input
                                v-model="reservation.numGuests"
                                id="seating"
                                type="number"
                                @keypress="numKeysOnly($event)"
                                required />
                                <div v-if="submitted && $v.reservation.numGuests.$error" class="invalid-state">
                                    <span v-if="!$v.reservation.numGuests.required">Enter valid number of guests</span>
                                </div>
                        </div>
                    </div>

                    <div id="guest__time">
                        <button
                        class="btn__timeslot"
                        v-for="(time, i) in availableTimes"
                        :key="i">
                            {{ time }}
                        </button>
                    </div>

                    <div id="guest__date">
                        <!---
                        <label for="date">Reservation Date <span class="req">*</span></label>
                        -->
                        <DatePicker
                        v-model="reservation.date"
                        mode="date"
                        id="date" />
                    </div>
                 </div>
            </div>

             <!-- PAYMENT INFO -->
            <div class="payment">
                <span><h2>Payment Info</h2> <hr /></span>

                <div class="fields">
                    <div id="cardholder">
                        <div class="input__text chname">
                            <label for="card__name">CARDHOLDER'S NAME <span class="req">*</span></label>
                            <input
                            v-model="payment.ch"
                            id="card__name"
                            required />
                        </div>
                    </div>

                    <div id="card">
                        <div class="input__text input__cnum">
                            <label for="card__num">Card # <span class="req">*</span></label>
                            <input
                            v-model="payment.num"
                            id="card__num"
                            placeholder="#### #### #### ####"
                            maxlength="19"
                            @input="addSpaces($event.target.value)"
                            @keypress="numKeysOnly($event)"
                            required />
                        </div>

                        <div class="input__text input__cvv">
                            <label for="card__cvv">CVV <span class="req">*</span></label>
                            <input
                            v-model="payment.cvv"
                            id="card__cvv"
                            placeholder="###"
                            maxlength="3"
                            @keypress="numKeysOnly($event)"
                            required />
                        </div>

                        <div id="expiration">
                            <div class="input__select input__exp">
                                <label for="card__expiration">Expiration Date <span class="req">*</span></label>
                                <div id="card__expiration">
                                    <select
                                    v-model="expMonth"
                                    @change="payment.exp = expMonth + '/' + expYear"
                                    id="card__month"
                                    required>
                                        <option
                                        v-for="(month, i) in months"
                                        :key="i"
                                        :value="i">
                                            <template v-if="i > 0">
                                            {{ i }} - {{ months[i - 1]}}
                                            </template>
                                        </option>
                                    </select>
                                    /
                                    <select
                                    v-model="expYear"
                                    @change="payment.exp = expMonth + '/' + expYear"
                                    id="card__year"
                                    required>
                                        <option
                                        v-for="j in 21"
                                        :key="j"
                                        :value="j > 1 ? currentYear + (j - 2) : ``">
                                            <template v-if="j > 1">
                                                {{ currentYear + (j - 2) }}
                                            </template>
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BILLING INFO -->
            <div class="billing">
                <span><h2>Billing Info</h2> <hr /></span>

                <div class="fields">
                    <div class="checkbox">
                        <div class="input__checkbox input__same-add">
                            <input
                            v-model="useMailAddress"
                            type="checkbox"
                            id="sameAddress"
                            value="true" />
                            <label for="sameAddress">Same as Mailing Address</label>
                        </div>
                    </div>

                    <div id="bill__address-1" class="address1">
                        <div class="input__text input__address-l1">
                            <label for="baddress1">Mailing Address <span class="req">*</span></label>
                            <input
                            v-model="customer.address1"
                            id="baddress1"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.address1.$error }"
                            required />                   
                        </div>

                        <div class="input__text input__address-l2">
                            <label for="baddress2">Apt/Suite/Building #</label>
                            <input
                            v-model="customer.address2"
                            id="baddress2"
                            required />                   
                        </div>
                    </div>

                    <div id="bill__address-2" class="address2">
                        <div class="input__text input__city">
                            <label for="bcity">City <span class="req">*</span></label>
                            <input
                            v-model="customer.city"
                            id="bcity"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.city.$error }"
                            required />
                    </div>

                        <div class="input__select input__state">
                        <label for="bstate">State <span class="req">*</span></label>
                            <select
                            v-model="customer.state"
                            id="bstate"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.customer.state.$error }"
                            required>
                                <option
                                v-for="(state, i) in states"
                                :key="i"
                                :value="state">
                                    {{ state }}
                                </option>
                            </select>
                        </div>

                        <div class="input__text input__zip form-group">
                            <label for="mzip">Zip Code <span class="req">*</span></label>
                            <input
                            v-model="customer.zip"
                            id="mzip"
                            @keypress="numKeysOnly($event)"
                            required />
                            <div v-if="submitted && $v.customer.zip.$error" class="invalid-feedback">
                                <span v-if="!$v.customer.zip.required">valid zipcode required</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom">
            <div class="legend">
                <i><span class="req">*</span> = Required</i>
            </div>
            <button @click="submitReservation($event)" class="btn submit">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Reserve »</label>
            </button>
        </div>
    </v-form>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import { required, email } from "vuelidate/lib/validators";
// needed to print objects to the console without values being displayed as "getter & setter" idk why
const printObj = (obj) => { return console.log(JSON.parse(JSON.stringify(obj))); }

export default {
    name: 'ReservationForm',
    components: {
        DatePicker
    },
    props: {
        // router parameters will go here later
    },
    data: () => {
        return {
            currentYear: parseInt(new Date().getFullYear().toString().slice(-2)),
            months: [
                'January', 'February', 'March',
                'April', 'May', 'June',
                'July', 'August', 'September',
                'October', 'November', 'December'
            ],
            states: [
                "", "AK", "AL", "AR", "AZ", "CA", "CO", "CT",   
                "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL",  
                "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", 
                "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH",
                "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA",
                "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", 
                "WA", "WI", "WV", "WY"
            ],
            availableTimes: [],
            expYear: null,
            expMonth: null,
            useMailAddress: false,
            customer: {
                firstName: null,
                lastName: null,
                email: null,
                phone: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                zip: null,
                preferredPayment: null,
                preferredDiner: null,
                earnedPoints: 0,
            },
            payment: {
                ch: null,
                num: null,
                cvv: null,
                exp: null,
            },
            billing: {
                address1: null,
                address2: null,
                city: null,
                state: null,
                zip: null,
            },
            reservation: {
                firstName: null,
                lastName: null,
                date: new Date(),
                numGuests: null,
                tables: [],
            },
            submitted: false
        }
    },
    validations: {
        customer: {
            firstName: { required },
            lastName: { required },
            email: { required, email },
            address1: { required },
            city: { required },
            state: { required },
            zip: { required },
        },
        reservation: {
            numGuests: { required },
        },
    },
    /* watchers to check for changes in certain variables */
    watch: {
        // check if billing is same as mailing
        'useMailAddress': function(val) {
           if (val) {
               this.billing = {
                   address1: this.customer.address1,
                   address2: this.customer.address2,
                   city: this.customer.state,
                   state: this.customer.city,
                   zip: this.customer.zip
               }
           } 
        },

        // these all update billing alongside mailing if box is checked
        'customer.address1': function(address) {
            if (this.useMailAddress)
                this.billing.address1 = address;
        },

        'customer.address2': function(address) {
            if (this.useMailAddress)
                this.billing.address2 = address;
        },

        'customer.city': function(city) {
            if (this.useMailAddress)
                this.billing.city = city;
        },

        'customer.state': function(state) {
            if (this.useMailAddress)
                this.billing.state = state;
        },

        'customer.zip': function(zip) {
            if (this.useMailAddress)
                this.billing.zip = zip;
        },

        // fetch times

        'reservation.date': function(date) {
            this.getAvailableTimes(date);
        }

    },
    mounted: function() {
        // code for checking if user is logged in will go here
        this.getAvailableTimes(this.reservation.date);
    },
    methods: {

        validationStatus: function(validation) {
            return typeof validation != "undefined" ? validation.$error : false;
        },

        // add dashes to phone number field as user types
        addDashes(key, num) {
            if (key != 'Backspace' && (num.length === 3 || num.length === 7)){
                return this.customer.phone += '-';
            }
        },

        // add spaces to credit card number field as user types
        addSpaces(num) {
            return this.payment.num = num.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
        },
        
        // only allow numerical keys to be pressed
        numKeysOnly(e) {
            if (e.key < '0' || e.key > '9')
                return e.preventDefault();
        },

        getAvailableTimes(date) {
            console.log(date);
            this.$times.get({
                date: new Date(date).toLocaleString("en-US").split(",")[0] })
            .then((response) => {
                this.availableTimes = response.body;
            })
            .catch((error) => console.error(error));
        },

        // submit reservation
        submitReservation(e) {
            e.preventDefault();
            this.submitted = true;
            this.$v.$touch();
            if (this.$v.$invalid){
                return alert("Fix errors!");
            }
            // data to be submitted
            var data = {
                customer: this.customer,
                payment: this.payment,
                billing: this.billing,
                reservation: {
                    ...this.reservation,
                    firstName: this.customer.firstName,
                    lastName: this.customer.lastName
                } 
            }
            printObj(data);

            this.$reservation.save(data)
            .then((response) => {
                console.log(response.body);
            })
            .catch((error) => { 
                console.log(error);
            });
            alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.customer));
        }
    }
}
</script>