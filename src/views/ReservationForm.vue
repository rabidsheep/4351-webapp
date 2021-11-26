<template>
    
    <v-stepper
    v-model="step"
    class="registration__stepper">
        <v-stepper-items>
            <v-stepper-content
            step="1">    
                <v-form id="reservation" class="reservation__form">
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

                                <div class="input__text input__seating form-group">
                                    <label for="seating"># of Guests <span class="req">*</span></label>
                                    <input
                                    v-model="reservation.numGuests"
                                    id="seating"
                                    type="number"
                                    min="1"
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
                                                :events="highTrafficDays"
                                                event-color="#c74e4e"
                                                :show-current="false"
                                                :picker-date.sync="pickerDate"
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

                                    <div class="warning" v-show="highTraffic">
                                        This date has a high volume of reservations.
                                        <br />
                                        A valid payment method must be held on file.
                                        <br />
                                        No-shows will incur a $10 charge.
                                    </div>
                                </div>

                                <div id="table-select" class="field-w12">
                                    <div class="input__general">
                                        <label for="table-select">Select Tables <span class="req">*</span></label>
                                        <FloorLayout
                                        :validCombos="validCombos"
                                        :validTables="validTables"
                                        :disableAllSeats="disableAllSeats"
                                        :selectedTables="reservation.tables"
                                        @table-select="setTable($event.label, $event.size)"
                                        @table-deselect="removeTable($event.label, $event.size)" />
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
                                <div class="input__text input__address-l1 field-w12">
                                    <label for="baddress1">Billing Address <span class="req">*</span></label>
                                    <input
                                    v-model="payment.billing.line1"
                                    id="baddress1"
                                    class="form-control" :class="{ 'is-invalid': submitted && $v.payment.billing.line1.$error }"
                                    required
                                    :readonly="useMailAddress" />                   
                                </div>

                                <div class="input__text input__address-l2 field-w12">
                                    <label for="baddress2">Apt/Suite/Building # <i>(Optional)</i></label>
                                    <input
                                    v-model="payment.billing.line2"
                                    id="baddress2"
                                    required
                                    :readonly="useMailAddress" />                   
                                </div>

                                <div class="input__text input__city field-w4">
                                    <label for="bcity">City <span class="req">*</span></label>
                                    <input
                                    v-model="payment.billing.city"
                                    id="bcity"
                                    class="form-control" :class="{ 'is-invalid': submitted && $v.payment.billing.city.$error }"
                                    required
                                    :readonly="useMailAddress" />
                                </div>

                                <div class="input__select input__state field-w4">
                                    <label for="bstate">State <span class="req">*</span></label>
                                    <select
                                    v-model="payment.billing.state"
                                    id="bstate"
                                    class="form-control" :class="{ 'is-invalid': submitted && $v.payment.billing.state.$error }"
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
                                    v-model="payment.billing.zip"
                                    id="bzip"
                                    @keypress="numKeysOnly($event)"
                                    required
                                    :readonly="useMailAddress" />
                                    <div v-if="submitted && $v.payment.billing.zip.$error" class="invalid-feedback">
                                        <span v-if="!$v.payment.billing.zip.required">valid zipcode required</span>
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
                        
                        <template v-if="!uid">

                            <div class="buttons">
                                <div class="right">
                                    <button @click="$event.preventDefault(); step = 3" class="btn submit">
                                        <v-icon>mdi-paw</v-icon>
                                        <v-divider vertical />
                                        <label>Reserve as Guest »</label>
                                    </button>

                                    
                                    <center><h3>... or create an account first!</h3></center>
                                    <button @click="$event.preventDefault(); step = 2" class="btn submit">
                                        <v-icon>mdi-paw</v-icon>
                                        <v-divider vertical />
                                        <label>Register & Reserve »</label>
                                    </button>

                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <div class="buttons">
                                <div class="right">
                                    <button @click="submitReservation($event)" class="btn submit">
                                        <v-icon>mdi-paw</v-icon>
                                        <v-divider vertical />
                                        <label>Place reservation »</label>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                </v-form>
            </v-stepper-content>

            <v-stepper-content
            step="2">
                <v-form id="registration" class="reservation__form">
                    <div class="main">
                        <div class="mailing">
                            <span><h2>Mailing Info</h2> <div class="gdivider" /></span>
                            <div class="field-group">
                                <div class="input__text input__address-l1 field-w12">
                                    <label for="maddress">Mailing Address <span class="req">*</span></label>
                                    <input
                                    v-model="customer.mailing.line1"
                                    id="maddress"
                                    class="form-control"
                                    required />                   
                                </div>

                                <div class="input__text input__address-l2 field-w12">
                                    <label for="maddress2">Apt/Suite/Building #</label>
                                    <input
                                    v-model="customer.mailing.line2"
                                    id="maddress2"
                                    required />                   
                                </div>

                                <div class="input__text input__city field-w4">
                                    <label for="mcity">City <span class="req">*</span></label>
                                    <input
                                    v-model="customer.mailing.city"
                                    id="mcity"
                                    class="form-control"
                                    required />
                                </div>

                                <div class="input__select input__state field-w4">
                                    <label for="mstate">State <span class="req">*</span></label>

                                    <select
                                    v-model="customer.mailing.state"
                                    id="mstate"
                                    class="form-control"
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
                                    v-model="customer.mailing.zip"
                                    id="mzip"
                                    @keypress="numKeysOnly($event)"
                                    required />
                                </div>
                            </div>
                        </div>

                        <template v-if="showPayment">
                            <!--<div class="payment">
                                <span><h2>Preferred Payment Method</h2> <div class="gdivider" /></span>

                                <div class="field-group">
                                    <div class="input__text input__ch field-w12">
                                        <label for="card__name">CARDHOLDER'S NAME <span class="req">*</span></label>
                                        <input
                                        v-model="customer.preferredPayment.cardholderName"
                                        id="card__name"
                                        required />
                                    </div>

                                    <div class="input__text input__cnum">
                                        <label for="card__num">Card # <span class="req">*</span></label>
                                        <div class="wrapper">
                                            <input
                                            v-model="customer.preferredPayment.cardNum"
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
                                        v-model="customer.preferredPayment.cvv"
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
                                            @change="customer.preferredPayment.exp = expMonth + '/' + expYear"
                                            id="card__month"
                                            required
                                            placeholder="MM" />
                                            /
                                            <input
                                            v-model="expYear"
                                            @change="customer.preferredPayment.exp = expMonth + '/' + expYear"
                                            id="card__year"
                                            required
                                            placeholder="YY" />
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>-->

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
                                        v-model="customer.billing.line1"
                                        id="baddress1"
                                        class="form-control" :class="{ 'is-invalid': submitted && $v.payment.billing.line1.$error }"
                                        required
                                        :readonly="useMailAddress" />                   
                                    </div>

                                    <div class="input__text input__address-l2 field-w12">
                                        <label for="baddress2">Apt/Suite/Building # <i>(Optional)</i></label>
                                        <input
                                        v-model="customer.billing.line2"
                                        id="baddress2"
                                        required
                                        :readonly="useMailAddress" />                   
                                    </div>

                                    <div class="input__text input__city field-w4">
                                        <label for="bcity">City <span class="req">*</span></label>
                                        <input
                                        v-model="customer.billing.city"
                                        id="bcity"
                                        class="form-control" :class="{ 'is-invalid': submitted && $v.payment.billing.city.$error }"
                                        required
                                        :readonly="useMailAddress" />
                                    </div>

                                    <div class="input__select input__state field-w4">
                                        <label for="bstate">State <span class="req">*</span></label>
                                        <select
                                        v-model="customer.billing.state"
                                        id="bstate"
                                        class="form-control" :class="{ 'is-invalid': submitted && $v.payment.billing.state.$error }"
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
                                        v-model="customer.billing.zip"
                                        id="bzip"
                                        @keypress="numKeysOnly($event)"
                                        required
                                        :readonly="useMailAddress" />
                                        <div v-if="submitted && $v.payment.billing.zip.$error" class="invalid-feedback">
                                            <span v-if="!$v.payment.billing.zip.required">valid zipcode required</span>
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

                        <div class="buttons">
                            <div class="left">
                                <button @click="$event.preventDefault(); step = 1" class="btn submit">
                                    <label>« Back</label>
                                    <v-divider vertical />
                                    <v-icon>mdi-paw</v-icon>
                                </button>
                            </div>

                            <div class="right">
                                <button @click="$event.preventDefault(); step = 3" class="btn submit">
                                    <v-icon>mdi-paw</v-icon>
                                    <v-divider vertical />
                                    <label>Place reservation »</label>
                                </button>

                                <button @click="createAccount($event)" class="btn submit">
                                    <v-icon>mdi-paw</v-icon>
                                    <v-divider vertical />
                                    <label>Create account »</label>
                                </button>
                            </div>
                        </div>

                        <!--<button @click="$emit('create-account')" class="btn submit">
                            <v-icon>mdi-paw</v-icon>
                            <v-divider vertical />
                            <label>Submit »</label>
                        </button>-->
                    </div>
                </v-form>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script>
import TimeslotBtn from "../components/TimeslotBtn.vue";
import FloorLayout from "../components/FloorLayout.vue";
import { required, email } from "vuelidate/lib/validators";
import "firebase/compat/auth";

import moment from 'moment';
// needed to print objects to the console without values being displayed as "getter & setter" idk why
// const printObj = (obj) => { return console.log(JSON.parse(JSON.stringify(obj))); }

export default {
    name: 'ReservationForm',
    components: {
        TimeslotBtn,
        FloorLayout,
    },
    props: {
    },
    data: () => {
        return {
            step: 1,
            uid: null,
            currentYear: parseInt(new Date().getFullYear().toString().slice(-4)),
            currentDate: new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            selectedDate: null,
            selectedTimeslot: null,
            highTraffic: false,
            highTrafficDays: [],
            pickerDate: null,
            registerUser: false,
            showPayment: true,
            reuseResPayment: false,
            disableAllSeats: false,
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
            availableTimes: [
                "9:00am", "10:00am", "11:00am",
                "12:00pm", "1:00pm", "2:00pm",
                "3:00pm", "4:00pm", "5:00pm",
                "6:00pm", "7:00pm", "8:00pm"
            ],
            validCombos: [],
            validTables: [],
            validTablesOriginal: [],
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
                billing: {
                    line1: null,
                    line2: null,
                    city: null,
                    state: null,
                    zip: null,
                },
                preferredPayment: null,
                dinerId: null,
                points: 0,
            },
            payment: {
                cardholderName: null,
                cardNum: null,
                cvv: null,
                exp: null,
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
                numGuests: 5,
                tables: [],
            },
            submitted: false,
            totalSeats: 0,
        }
    },
    validations: {
        customer: {
            firstName: { required },
            lastName: { required },
            email: { required, email },
            mailing: {
                line1: { required },
                city: { required },
                state: { required },
                zip: { required },
            }
            
        },
        payment: {
            cardholderName: { required },
            cardNum: { required },
            cvv: { required },
            exp: { required },
            billing: {
                line1: { required },
                city: { required },
                state: { required },
                zip: { required },
            }
        },
        
    },
    /* watchers to check for changes in certain variables */
    watch: {
        // check if billing is same as mailing
        'useMailAddress': function(val) {
           if (val) {
               this.customer.billing = this.customer.mailing;
           } else {
               this.customer.billing = {
                    line1: null,
                    line2: null,
                    city: null,
                    state: null,
                    zip: null,
               }
           }
        },

        'pickerDate': function(current) {
            let year = parseInt(current.split('-')[0]);
            let month = parseInt(current.split('-')[1]);
            let next = month === 12 ? `${year + 1}-01` : `${year}-${(month + 1).toString().padStart(2, 0)}`;
            this.getHighTrafficDays(moment(current).format('YYYY-MM-DD'), moment(next).format('YYYY-MM-DD'))
        },

        // update billing alongside mailing if box is checked
        'customer.mailing': {
            handler: function(mailing) {
                if (this.useMailAddress)
                    this.customer.billing = mailing;
            },
            deep: true
        },

        // fetch times available
        'selectedDate': function(sd) {
            this.reservation.date = moment(sd).format('YYYY-MM-DD')
        },

        'reservation': {
            handler: function(reservation) {
                if (reservation.time && reservation.date && reservation.numGuests)
                    this.getAvailableTables(reservation.date, reservation.time, reservation.numGuests);
            },
            deep: true,
        },

        'reservation.numGuests': function(guests) {
            this.reservation.tables = []

            if (this.totalSeats < guests) {
                this.disableAllSeats = false;
            } else {
                this.disableAllSeats = true;
            }
        },
        
        'reservation.date': function() {
            if (this.highTrafficDays.includes(this.reservation.date))
                this.highTraffic = true;
            else
                this.highTraffic = false;
        },
    },
    mounted: function() {
        this.selectedDate = this.currentDate;

        if (this.$route.params.userDetails) {
            let details = this.$route.params.userDetails;
            this.uid = details.uid;

            this.customer = {
                firstName: details.firstName,
                lastName: details.lastName,
                phone: details.phone,
                email: details.email,
                mailing: details.mailing,
                billing: details.billing,
                dinerId: details.dinerId,
                points: details.points,
                preferredPayment: details.preferredPayment ? details.preferredPayment : null
            }

            this.payment.billing = details.billing;
        }
    },
    methods: {

        allowedDates: function(v) {
            return (v >= this.currentDate);
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
            return this.payment.cardNum = num.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
        },
        
        // only allow numerical keys to be pressed
        numKeysOnly(e) {
            if (e.key < '0' || e.key > '9')
                return e.preventDefault();
        },

        getHighTrafficDays(current, next) {
            this.$traffic.get({current, next})
            .then((response) => {
                this.highTrafficDays = response.body;

                if (this.highTrafficDays.includes(this.reservation.date))
                    this.highTraffic = true;
            })
            .catch((error) => console.error(error));
        },
        
        setTable(table, size) {
            this.reservation.tables.push(table);
            this.totalSeats += size;

            if (this.totalSeats >= this.reservation.numGuests) {
                this.disableAllSeats = true;
            }

        },

        findValidCombos(combos, selected, tid) {
            let tables = [];
            
            combos
            .filter((combo) => combo.length > 1 && selected.every(table => combo.includes(table)))
            .map((combo) => {
                combo.forEach((table) => {
                    if (!tables.includes(table) && table !== tid)
                        tables.push(table);
                })
            })

            this.validTables = tables;

        },

        removeTable(table, size) {
            let i = this.reservation.tables.findIndex(t => t === table);
            this.reservation.tables.splice(i, 1);
            this.totalSeats -= size;

            if (this.totalSeats < this.reservation.numGuests) {
                this.disableAllSeats = false;
            }
        },

        getAvailableTables(date, time, guests) {
            this.$tables.get({date, time, guests})
            .then((response) => {
                this.validCombos = response.body.combos;
                this.validTables = response.body.selectable;
                this.validTablesOriginal = response.body.selectable;
            })
            .catch((error) => console.error(error));
        },

        createAccount(e) {
            e.preventDefault();

            /*var data = {
                ...this.customer,
            }*/

            this.$firebase.auth().createUserWithEmailAndPassword(this.customer.email, 'password')
            .then((data) => {
                var credentials = data.user.multiFactor.user;

                var user = {
                    ...this.customer,
                    uid: credentials.uid
                }

                data.user.updateProfile({
                    displayName: this.customer.firstName
                });

                return this.$user.create({data: user, token: credentials.accessToken})
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => console.error(error));
        },

        // submit reservation
        submitReservation(e) {
            e.preventDefault();
            this.step = 3;
            this.submitted = true;
            /*this.$v.$touch();
            if (this.$v.$invalid){
                return alert("Fix errors!");
            }*/
            // data to be submitted for reservation
            var reservation = {
                firstName: this.customer.firstName,
                lastName: this.customer.lastName,
                phone: this.customer.phone,
                email: this.customer.email,
                date: this.reservation.date,
                time: this.reservation.time,
                tables: this.reservation.tables,
                numGuests: this.reservation.numGuests,
            }

            //printObj(data);

            this.$reservation.save(reservation)
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