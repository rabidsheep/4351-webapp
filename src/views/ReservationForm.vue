<template>
    <v-form id="reservation">
        <div class="main">
            <!-- GUEST INFO -->
            <div class="guest">
                <span><h2>Reservation Info</h2> <div class="gdivider" /></span>

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
                        <label for="phone">Phone # <span class="req">*</span></label>
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
                        <label for="maddress">Mailing Address <span class="req" v-show="registerUser">*</span></label>
                        <input
                        v-model="customer.mailing.line1"
                        id="maddress"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.customer.address1.$error }"
                        :required="registerUser" />                   
                    </div>

                    <div class="input__text input__address-l2 field-w12">
                        <label for="maddress2">Apt/Suite/Building #</label>
                        <input
                        v-model="customer.mailing.line2"
                        id="maddress2"
                        :required="registerUser" />                   
                    </div>

                    <div class="input__text input__city  field-w4">
                        <label for="mcity">City <span class="req" v-show="registerUser">*</span></label>
                        <input
                        v-model="customer.mailing.city"
                        id="mcity"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.customer.city.$error }"
                        :required="registerUser" />
                    </div>

                    <div class="input__select input__state field-w4">
                        <label for="mstate">State <span class="req" v-show="registerUser">*</span></label>

                        <select
                        v-model="customer.mailing.state"
                        id="mstate"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.customer.state.$error }"
                        :required="registerUser">
                            <option
                            v-for="(state, i) in states"
                            :key="i"
                            :value="state">
                                {{ state }}
                            </option>
                        </select>
                    </div>

                    <div class="input__text input__zip field-w4 form-group">
                        <label for="mzip">Zip Code <span class="req" v-show="registerUser">*</span></label>
                        <input
                        v-model="customer.mailing.zip"
                        id="mzip"
                        @keypress="numKeysOnly($event)"
                        :required="registerUser" />
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

                    <div class="datetime-group field-w12">
                        <div id="guest__date" class="input__general">
                            <label for="date">Date & Time <span class="req">*</span></label>

                            <div class="date-group">
                                <v-date-picker
                                    v-model="selectedDate"
                                    :allowed-dates="allowedDates"
                                    :show-current="false"
                                    scrollable
                                    no-title
                                    id="date"
                                    />
                            </div>
                        </div>

                        <div id="guest__time" class="input__general">
                            <div class="btnbox">
                                <template v-if="availableTimes.length > 0">
                                    <TimeslotBtn
                                    v-for="(time, i) in availableTimes"
                                    :time="time"
                                    :selectedTimeslot="selectedTimeslot"
                                    :i="i"
                                    :key="i"
                                    @set-time="selectTime($event, time, i)" />
                                </template>

                                <template v-else>
                                   Sorry! There are no available timeslots for this date.
                                </template>
                                
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            <template v-if="highTraffic">
             <!-- PAYMENT INFO -->
            <div class="payment">
                <span><h2>Payment Info</h2> <div class="gdivider" /></span>

                <div class="field-group">
                    <div class="input__text input__ch field-w12">
                        <label for="card__name">CARDHOLDER'S NAME <span class="req">*</span></label>
                        <input
                        v-model="payment.cardholderName"
                        id="card__name"
                        required />
                    </div>

                    <div class="input__text input__cnum">
                        <label for="card__num">Card # <span class="req">*</span></label>
                        <div class="wrapper">
                            <input
                            v-model="payment.cardNum"
                            id="card__num"
                            placeholder="#### #### #### ####"
                            maxlength="19"
                            @input="addSpaces($event.target.value)"
                            @keypress="numKeysOnly($event)"
                            required />

                            <div class="merchants">
                            <img :src="require(`@/assets/img/merchants.png`)" />
                            </div>
                        </div>
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
                <span><h2>Billing Info</h2> <div class="gdivider" /></span>

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
                        <label for="baddress1">Billing Address <span class="req">*</span></label>
                        <input
                        v-model="billing.line1"
                        id="baddress1"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.billing.address1.$error }"
                        required
                        :readonly="useMailAddress" />                   
                    </div>

                    <div class="input__text input__address-l2 field-w12">
                        <label for="baddress2">Apt/Suite/Building # <i>(Optional)</i></label>
                        <input
                        v-model="billing.line2"
                        id="baddress2"
                        required
                        :readonly="useMailAddress" />                   
                    </div>

                    <div class="input__text input__city field-w4">
                        <label for="bcity">City <span class="req">*</span></label>
                        <input
                        v-model="billing.city"
                        id="bcity"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.billing.city.$error }"
                        required
                        :readonly="useMailAddress" />
                    </div>

                    <div class="input__select input__state field-w4">
                        <label for="bstate">State <span class="req">*</span></label>
                        <select
                        v-model="billing.state"
                        id="bstate"
                        class="form-control" :class="{ 'is-invalid': submitted && $v.billing.state.$error }"
                        required
                        :disabled="useMailAddress">
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
                        required
                        :readonly="useMailAddress" />
                        <div v-if="submitted && $v.billing.zip.$error" class="invalid-feedback">
                            <span v-if="!$v.billing.zip.required">valid zipcode required</span>
                        </div>
                    </div>
                </div>
            </div>
            </template>
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
import TimeslotBtn from "../components/TimeslotBtn.vue"
import { required, email } from "vuelidate/lib/validators";
import moment from 'moment';
// needed to print objects to the console without values being displayed as "getter & setter" idk why
// const printObj = (obj) => { return console.log(JSON.parse(JSON.stringify(obj))); }

export default {
    name: 'ReservationForm',
    components: {
        TimeslotBtn
    },
    props: {
        // router parameters will go here later
    },
    data: () => {
        return {
            currentYear: parseInt(new Date().getFullYear().toString().slice(-4)),
            currentDate: new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            selectedDate: null,
            selectedTimeslot: null,
            highTraffic: false,
            registerUser: false,
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
                mailing: {
                    line1: null,
                    line2: null,
                    city: null,
                    state: null,
                    zip: null,
                },
                preferredPayment: null,
                preferredDiner: null,
                earnedPoints: 0,
            },
            payment: {
                cardholderName: null,
                cardNum: null,
                cvv: null,
                exp: null,
            },
            billing: {
                line1: null,
                line2: null,
                city: null,
                state: null,
                zip: null,
            },
            reservation: {
                firstName: null,
                lastName: null,
                date: new Date(),
                time: null,
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
        payment: {
            cardholderName: { required },
            cardNum: { required },
            cvv: { required },
            exp: { required },
        },
        billing: {
            line1: { required },
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
                   address1: this.customer.mailing.address1,
                   address2: this.customer.mailing.address2,
                   city: this.customer.mailing.state,
                   state: this.customer.mailing.city,
                   zip: this.customer.mailing.zip
               }
           } 
        },
        // update billing alongside mailing if box is checked
        'customer.mailing': {
            handler: function(mailing) {
                if (this.useMailAddress) {
                    this.billing = mailing
                }
            },
            deep: true
        },
        // fetch times available
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
        /*this.$tables.get().then((response) => {
            console.log(response)
        })
        .catch((error) => console.error(error));*/
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
        selectTime: function(e, time, i) {
            e.preventDefault();
            this.selectedTimeslot = i;
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
            this.$times.get({date})
            .then((response) => {
                console.log(response)
                this.availableTimes = response.body;
            })
            .catch((error) => console.error(error));
        },
        // submit reservation
        submitReservation(e) {
            e.preventDefault();
            this.submitted = true;
            /*this.$v.$touch();
            if (this.$v.$invalid){
                return alert("Fix errors!");
            }*/
            // data to be submitted for reservation
            var data = {
                firstName: this.customer.firstName,
                lastName: this.customer.lastName,
                phone: this.customer.phone,
                email: this.customer.email,
                date: this.reservation.date,
                time: this.reservation.time,
                tables: this.reservation.tables
            }

            //printObj(data);

            this.$reservation.save(data)
            .then((response) => {
                console.log(response.body);
            })
            .catch((error) => { 
                console.log(error.body)
            });
            alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.customer));
        }
    }
}
</script>