<template>
    <v-form id="reservation">
        <div class="main">
            <!-- GUEST INFO -->
            <div class="guest">
                <span><h2>Reservation Info</h2> <hr /></span>

                <div class="field-group guest__fields">
                    <div class="input__text input__fn field-w6">
                        <label for="fname">First Name <span class="req">*</span></label>
                        <input
                        v-model="customer.firstName"
                        id="fname"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.customer.firstName.$error }"
                        required />
                    </div>

                    <div class="input__text input__ln field-w6">
                        <label for="lname">Last Name <span class="req">*</span></label>
                        <input
                        v-model="customer.lastName"
                        id="lname"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.customer.lastName.$error }"
                        required />
                    </div>

                    <div class="input__text input__email field-w6 form-group">
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

                    <div class="input__text input__phone field-w6">
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

                    <div class="input__text input__address-l1 field-w12">
                        <label for="maddress">Mailing Address <span class="req">*</span></label>
                        <input
                        v-model="customer.address1"
                        id="maddress"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.customer.address1.$error }"
                        required />                   
                    </div>

                    <div class="input__text input__address-l2 field-w12">
                        <label for="maddress2">Apt/Suite/Building # <i>(Optional)</i></label>
                        <input
                        v-model="customer.address2"
                        id="maddress2"
                        required />                   
                    </div>

                    <div class="input__text input__city  field-w4">
                        <label for="mcity">City <span class="req">*</span></label>
                        <input
                        v-model="customer.city"
                        id="mcity"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.customer.city.$error }"
                        required />
                    </div>

                    <div class="input__select input__state field-w4">
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

                    <div class="input__text input__zip field-w4 form-group">
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
                    <div class="datetime-group">
                        <div id="guest__date" class="input__general">
                            <label for="date">Date & Time <span class="req">*</span></label>

                            <div class="date-group">
                                <v-menu
                                ref="dp"
                                v-model="dpOpened"
                                :close-on-content-click="true"
                                :return-value.sync="selectedDate"
                                transition="scale-transition"
                                offset-y
                                min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                        class="btn__date"
                                        size="30px" 
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="$event.preventDefault()">
                                            mdi-calendar
                                        </v-icon>
                                    </template>
                                    <v-date-picker
                                    v-model="selectedDate"
                                    :allowed-dates="allowedDates"
                                    scrollable
                                    id="date"
                                    />
                                </v-menu>

                                <div class="date-group date-dropdowns"
                                @change="dateDropdownUsed(selected.month, selected.day, selected.year)">
                                    <select
                                    v-model="selected.month"
                                    @change="daysInMonth(selected.month, selected.year)"
                                    id="month" class="field-w12">
                                        <option
                                        v-for="(month, i) in months"
                                        :key="i"
                                        :value="i+1">
                                            {{ month }}
                                        </option>
                                    </select>

                                    <select
                                    id="day" class="field-w6"
                                    v-model="selected.day">
                                        <option
                                        v-for="(day, i) in days"
                                        :key="i"
                                        :value="day">
                                            {{ day }}
                                        </option>
                                    </select>

                                    <select
                                    id="year" class="field-w6"
                                    v-model="selected.year"
                                    @change="daysInMonth(selected.month, selected.year)">
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

                        <div id="guest__time" class="input__general">
                            <div class="btnbox">
                                <button
                                :class="reservation.time === time ? `btn__timeslot active` : `btn__timeslot`"
                                v-for="(time, i) in availableTimes"
                                :key="i"
                                @click="selectTime($event, time)">
                                    {{ time }}
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

             <!-- PAYMENT INFO -->
            <div class="payment">
                <span><h2>Payment Info</h2> <hr /></span>

                <div class="field-group">
                    <div class="input__text chname field-w12">
                        <label for="card__name">CARDHOLDER'S NAME <span class="req">*</span></label>
                        <input
                        v-model="payment.ch"
                        id="card__name"
                        required />
                    </div>

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

                    <div class="input__select input__general input__exp">
                        <label for="card__expiration">Expiration <span class="req">*</span></label>
                        <div id="card__expiration">
                            <input
                            v-model="expMonth"
                            @change="payment.exp = expMonth + '/' + expYear"
                            id="card__month"
                            required
                            placeholder="MM" />
                            /
                            <input
                            v-model="expYear"
                            @change="payment.exp = expMonth + '/' + expYear"
                            id="card__year"
                            required
                            placeholder="YY" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- BILLING INFO -->
            <div class="billing">
                <span><h2>Billing Info</h2> <hr /></span>

                <div class="field-group">
                    <div class="input__checkbox input__same-add field-w12">
                        <input
                        v-model="useMailAddress"
                        type="checkbox"
                        id="sameAddress"
                        value="true" />
                        <label for="sameAddress">Use Mailing Address</label>
                    </div>

                    <div class="input__text input__address-l1 field-w12">
                        <label for="baddress1">Mailing Address <span class="req">*</span></label>
                        <input
                        v-model="billing.address1"
                        id="baddress1"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.billing.address1.$error }"
                        required />                   
                    </div>

                    <div class="input__text input__address-l2 field-w12">
                        <label for="baddress2">Apt/Suite/Building # <i>(Optional)</i></label>
                        <input
                        v-model="billing.address2"
                        id="baddress2"
                        required />                   
                    </div>

                        <div class="input__text input__city field-w4">
                            <label for="bcity">City <span class="req">*</span></label>
                            <input
                            v-model="billing.city"
                            id="bcity"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.billing.city.$error }"
                            required />
                    </div>

                        <div class="input__select input__state field-w4">
                        <label for="bstate">State <span class="req">*</span></label>
                            <select
                            v-model="billing.state"
                            id="bstate"
                            class="form-control" :class="{ 'is-invalid': submitted && $v.billing.state.$error }"
                            required>
                                <option
                                v-for="(state, i) in states"
                                :key="i"
                                :value="state">
                                    {{ state }}
                                </option>
                            </select>
                        </div>

                        <div class="input__text input__zip form-group field-w4">
                            <label for="bzip">Zip Code <span class="req">*</span></label>
                            <input
                            v-model="billing.zip"
                            id="bzip"
                            @keypress="numKeysOnly($event)"
                            required />
                            <div v-if="submitted && $v.billing.zip.$error" class="invalid-feedback">
                                <span v-if="!$v.billing.zip.required">valid zipcode required</span>
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
import { required, email } from "vuelidate/lib/validators";
import moment from 'moment';
// needed to print objects to the console without values being displayed as "getter & setter" idk why
const printObj = (obj) => { return console.log(JSON.parse(JSON.stringify(obj))); }

export default {
    name: 'ReservationForm',
    components: {
    },
    props: {
        // router parameters will go here later
    },
    data: () => {
        return {
            currentYear: parseInt(new Date().getFullYear().toString().slice(-4)),
            currentDate: new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            selectedDate: null,
            dpOpened: false,
            selected: {
                date: null,
                month: new Date().getMonth()+1,
                day: new Date().getDate(),
                year: new Date().getFullYear(),
            },
            months: moment.months(),
            days: new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate(),
            states: [
                "  ", "AK", "AL", "AR", "AZ", "CA", "CO", "CT",   
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
        billing: {
            address1: { required },
            city: { required },
            state: { required },
            zip: { required },
        }
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
        'selectedDate': function(sd) {
            this.reservation.date = moment(sd).format('MM/DD/YYYY')
        },
        'reservation.date': function(date) {
            this.getAvailableTimes(date);
        },


    },
    mounted: function() {
        // code for checking if user is logged in will go here

        this.selectedDate = this.currentDate;
        this.getAvailableTimes(this.reservation.date);
    },
    methods: {
        dateDropdownUsed: function(month, day, year) {
            this.reservation.date = `${month}/${day}/${year}`
        },

        allowedDates: function(v) {
            return (v >= this.currentDate);
        },

        daysInMonth: function(month, year) {
            this.days = new Date(year, month, 0).getDate();   
        },

        selectTime: function(e, time) {
            e.preventDefault();
            this.reservation.time = time;
        },

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
            this.$times.get({
                date: new Date(date).toLocaleString("en-US").split(",")[0]
            })
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