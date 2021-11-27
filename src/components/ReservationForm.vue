<template>  
    <v-form id="reservation" class="reservation__form">
        <div class="main">
            <!-- GUEST INFO -->
            <div class="guest">
                <span><h2>Reservation Info</h2> <div class="gdivider" /></span>

                <div class="field-group guest__fields">
                    <div class="input__text input__fn field-w6"
                    :class="{
                        'has-error': $v.customer.firstName.$error 
                     }">
                        <label for="fname">First Name <span class="req">*</span></label>
                        <input
                        v-model="customer.firstName"
                        id="fname"
                        class="form-control"
                        @input="$v.customer.firstName.$touch"
                        required />
                    </div>


                    <div class="input__text input__ln field-w6"
                    :class="{
                        'has-error': $v.customer.lastName.$error
                    }">
                        <label for="lname">Last Name <span class="req">*</span></label>
                        <input
                        v-model="customer.lastName"
                        id="lname"
                        @input="$v.customer.lastName.$touch"
                        required />
                    </div>

                    <div class="input__text input__email field-w6 form-group"
                    :class="{
                        'has-error': $v.customer.email.$error
                    }">
                        <label for="email">E-mail <span class="req">*</span></label>
                        <input
                        v-model="customer.email"
                        id="email"
                        type="email"
                        @input="$v.customer.email.$touch"
                        required />
                    </div>

                    <div class="input__text input__phone field-w6"
                    :class="{
                        'has-error': $v.customer.phone.$error
                    }">
                        <label for="phone">Phone # <span class="req">*</span></label>
                        <input
                        v-model="customer.phone"
                        placeholder="###-###-####"
                        type="tel"
                        maxlength="12"
                        @keyup="addDashes($event.key, $event.target.value)"
                        @keypress="numKeysOnly($event)"
                        id="phone"
                        @input="$v.customer.phone.$touch" />
                    </div>

                    <div class="input__text input__seating form-group"
                    :class="{
                        'has-error': $v.reservation.numGuests.$error
                    }">
                        <label for="seating"># of Guests <span class="req">*</span></label>
                        <input
                        v-model="reservation.numGuests"
                        id="seating"
                        type="number"
                        min="1"
                        @keypress="numKeysOnly($event)"
                        required
                        @change="$v.reservation.numGuests.$touch" />
                    </div>

                    <div class="datetime-group field-w12">
                        <div id="guest__date" class="input__general"
                        :class="{
                            'has-error': $v.reservation.date.$error
                        }">
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
                                @input="$v.reservation.date.$touch"
                                />
                            </div>
                        </div>

                        <div id="guest__time" class="input__general">
                            <div class="btnbox"
                            :class="{
                                'has-error': $v.reservation.time.$error
                            }">
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

                    <div id="table-select" class="field-w12" 
                    :class="{
                        'has-error': $v.selectedTables.$error && $v.selectedTables.dirty || $v.totalSeats.$error 
                    }">
                        <div class="input__general">
                            <label for="table-select">Select Tables <span class="req">*</span></label>
                            <FloorLayout
                            :validCombos="validCombos"
                            :validTables="validTables"
                            :disableAllSeats="disableAllSeats"
                            :selectedTables="selectedTables"
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
                    <div class="input__text input__ch field-w12"
                    :class="{
                        'has-error': $v.payment.cardholderName.$error
                    }">
                        <label for="card__name">CARDHOLDER'S NAME <span class="req">*</span></label>
                        <input
                        v-model="payment.cardholderName"
                        id="card__name"
                        @input="$v.payment.cardholderName.$touch"
                        required />
                    </div>

                    <div class="input__text input__cnum"
                    :class="{
                        'has-error': $v.payment.cardNum.$error
                    }">
                        <label for="card__num">Card # <span class="req">*</span></label>
                        <div class="wrapper">
                            <input
                            v-model="payment.cardNum"
                            id="card__num"
                            placeholder="#### #### #### ####"
                            maxlength="19"
                            @input="addSpaces($event.target.value); $v.payment.cardNum.$touch"
                            required />

                            <div class="merchants">
                            <img :src="require(`@/assets/img/merchants.png`)" />
                            </div>
                        </div>
                    </div>

                    <div class="input__text input__cvv"
                    :class="{
                        'has-error': $v.payment.cvv.$error
                    }">
                        <label for="card__cvv">CVV <span class="req">*</span></label>
                        <input
                        v-model="payment.cvv"
                        id="card__cvv"
                        placeholder="###"
                        maxlength="3"
                        @keypress="numKeysOnly($event); $v.payment.cvv.$touch"
                        required />
                    </div>

                    <div class="input__general input__exp"
                    :class="{
                        'has-error': $v.expMonth.$error || $v.expYear.$error
                    }">
                        <label for="card__expiration">Expiration <span class="req">*</span></label>
                        <div class="grouped">
                            <input
                            v-model="expMonth"
                            @input="$emit('updateCardExp', `${expMonth}/${expYear}`); $v.expMonth.touch"
                            id="card__month"
                            required
                            maxlength="2"
                            placeholder="MM" />

                            <div class="input-divider">/</div>

                            <input
                            v-model="expYear"
                            @input="$emit('updateCardExp', `${expMonth}/${expYear}`)"
                            id="card__year"
                            required
                            maxlength="2"
                            placeholder="YY" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- BILLING INFO -->
            <div class="billing">
                <span><h2>Billing Info</h2> <div class="gdivider" /></span>

                <div class="field-group">
                    <div class="input__text input__address-l1 field-w12"
                    :class="{
                        'has-error': $v.payment.billing.line1.$error
                    }">
                        <label for="bline1">Billing Address <span class="req">*</span></label>
                        <input
                        v-model="payment.billing.line1"
                        id="bline1"
                        required
                        @input="$v.payment.billing.line1.$touch" />                   
                    </div>

                    <div class="input__text input__address-l2 field-w12">
                        <label for="baddress2">Apt/Suite/Building # <i>(Optional)</i></label>
                        <input
                        v-model="payment.billing.line2"
                        id="baddress2"
                        required />                   
                    </div>

                    <div class="input__text input__city field-w4"
                    :class="{
                        'has-error': $v.payment.billing.city.$error
                    }">
                        <label for="bcity">City <span class="req">*</span></label>
                        <input
                        v-model="payment.billing.city"
                        id="bcity"
                        required
                        @input="$v.payment.billing.city.$touch" />
                    </div>

                    <div class="input__select input__state field-w4"
                    :class="{
                        'has-error': $v.payment.billing.state.$error
                    }">
                        <label for="bstate">State <span class="req">*</span></label>
                        <select
                        v-model="payment.billing.state"
                        id="bstate"
                        class="form-control" 
                        required
                        @change="$v.payment.billing.state.$touch">
                            <option
                            v-for="(state, i) in states"
                            :key="i"
                            :value="state">
                                {{ state }}
                            </option>
                        </select>
                    </div>

                    <div class="input__text input__zip form-group field-w4"
                    :class="{
                        'has-error': $v.payment.billing.zip.$error
                    }">
                        <label for="bzip">Zip Code <span class="req">*</span></label>
                        <input
                        v-model="payment.billing.zip"
                        id="bzip"
                        @keypress="numKeysOnly($event)"
                        @input="$v.payment.billing.zip.$touch"
                        required
                        maxlength="5" />
                    </div>
                </div>
            </div>
            </template>

            <div class="discount" v-if="uid && customer.points > 0">
                <div class="input__text input__discount field-w12">
                    <label for="discount">Points Applied<br /><i>(10 pts = $1 off)</i></label>
                    <input
                    v-model="reservation.pointsApplied"
                    step="10"
                    id="discount"
                    type="number"
                    min="0"
                    :max="customer.points" />
                    Remaining Points: {{ customer.points - reservation.discountApplied }}
                </div>
            </div>
        </div>


        <div class="bottom">
            <div class="legend">
            <i><span class="req">*</span> = Required</i>
            </div>

            <template v-if="!uid">
                <div class="buttons">
                    <div class="right">
                        <button class="btn submit"
                        :disabled="!$v.$anyDirty || $v.$anyError && $v.$dirty || $v.$invalid"
                        @click="reserveAsGuest($event)">
                            <v-icon>mdi-paw</v-icon>
                            <v-divider vertical />
                            <label>Reserve as Guest »</label>
                        </button>
                        
                        <!--
                            <button class="btn submit"
                            @click="checkValidation($event)">
                                <v-icon>mdi-paw</v-icon>
                                <v-divider vertical />
                                <label>Check validation »</label>
                            </button>
                        -->
                        
                        <center><h3>... or create an account first!</h3></center>
                        <button class="btn submit"
                        :disabled="!$v.$anyDirty || $v.$anyError && $v.$dirty || $v.$invalid"
                        @click="createAccount($event)">
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
                        <button class="btn submit"
                        @click="submitReservation($event)">
                            <v-icon>mdi-paw</v-icon>
                            <v-divider vertical />
                            <label>Place reservation »</label>
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </v-form>
</template>

<script>
import { required, minLength, maxLength, email } from "vuelidate/lib/validators";
import TimeslotBtn from "./TimeslotBtn.vue";
import FloorLayout from "./FloorLayout.vue";
import "firebase/compat/auth";

import moment from 'moment';
// needed to print objects to the console without values being displayed as "getter & setter" idk why
// const printObj = (obj) => { return console.log(JSON.parse(JSON.stringify(obj))); }


const gte = (seated, vm) => {
    return seated >= vm.reservation.numGuests
}

export default {
    name: 'ReservationForm',
    components: {
        TimeslotBtn,
        FloorLayout,
    },
    props: {
        customer: Object,
        payment: Object,
        reservation: Object,
        uid: String,
        states: Array,
        availableTimes: Array,
        highTraffic: Boolean,
    },
    data: () => {
        return {
            expMonth: null,
            expYear: null,
            currentDate: new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0, 10),
            selectedDate: null,
            selectedTimeslot: null,
            highTrafficDays: [],
            pickerDate: null,
            showPayment: true,
            disableAllSeats: false,
            validCombos: [],
            validTables: [],
            selectedTables: [],
            totalSeats: 0,
            submitted: false,
            expirationDate: null,
        }
    },
    validations () {
        if (this.highTraffic) {
            return {
                customer: {
                    firstName: { required },
                    lastName: { required },
                    email: { required, email },
                    phone: { required },
                },
                payment: {
                    cardholderName: { required },
                    cardNum: { required, minLength: minLength(19), maxLength: maxLength(19) },
                    cvv: { required, minLength: minLength(3) },
                    billing: {
                        line1: { required },
                        city: { required },
                        state: { required },
                        zip: { required, minLength: minLength(5), maxLength: maxLength(5) },
                    }
                },
                expYear: { required, minLength: minLength(2), maxLength: maxLength(2) },
                expMonth: { required, minLength: minLength(2), maxLength: maxLength(2) },
                reservation: {
                    date: { required },
                    time: { required },
                    numGuests: { required },
                },
                selectedTables: { required },
                totalSeats: {
                    required,
                    gte
                }
            }
        } else {
            return {
                customer: {
                    firstName: { required },
                    lastName: { required },
                    email: { required, email },
                    phone: { required },
                },
                reservation: {
                    date: { required },
                    time: { required },
                    numGuests: { required },
                },
                selectedTables: { required },
                totalSeats: {
                    required,
                    gte
                }
            }
        }
        
    },
    /* watchers to check for changes in certain variables */
    watch: {
        'pickerDate': function(current) {
            let year = parseInt(current.split('-')[0]);
            let month = parseInt(current.split('-')[1]);
            let next = month === 12 ? `${year + 1}-01` : `${year}-${(month + 1).toString().padStart(2, 0)}`;
            this.getHighTrafficDays(moment(current).format('YYYY-MM-DD'), moment(next).format('YYYY-MM-DD'))
        },

        // fetch times available
        'selectedDate': function(date) {
            this.reservation.date = date;
        },

        'reservation': {
            handler: function(reservation) {
                if (reservation.time && reservation.date && reservation.numGuests)
                    this.getAvailableTables(reservation.date, reservation.time, reservation.numGuests);
            },
            deep: true,
        },

        // reset table selection stuff when guest number changes
        'reservation.numGuests': function() {
            this.disableAllSeats = false;
            this.totalSeats = 0;
            this.selectedTables = [];
        },

        // check if selected date is a high traffic day
        'reservation.date': function() {
            if (this.highTrafficDays.includes(this.reservation.date))
                this.$emit('setHighTraffic', true);
            else
                this.$emit('setHighTraffic', false);
        },

        'selectedTables': function(tables) {
            this.validateInput(this.$v.selectedTables);
            this.$emit('setTables', tables);
        },

        'totalSeats': function() {
            this.validateInput(this.$v.totalSeats);
        }
    },
    mounted: function() {
        
        this.selectedDate = this.currentDate;

        
    },
    methods: {

        allowedDates: function(v) {
            return (v >= this.currentDate);
        },

        selectTime: function(e, time, i) {
            e.preventDefault();
            this.selectedTimeslot = i;
            this.reservation.time = time;
            this.$v.reservation.time.$touch();
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
                    this.$emit('setHighTraffic', true);
            })
            .catch((error) => console.error(error));
        },
        
        setTable(table, size) {
            this.selectedTables.push(table);
            this.totalSeats += size;

            if (this.totalSeats >= this.reservation.numGuests) {
                this.disableAllSeats = true;
            }

        },

        removeTable(table, size) {
            let i = this.selectedTables.findIndex(t => t === table);
            this.selectedTables.splice(i, 1);
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
                this.selectedTables = [];
                this.totalSeats = 0;
                this.disableAllSeats = false;
            })
            .catch((error) => console.error(error));
        },

        validateInput(input) {
            input.$touch();
        },

        reserveAsGuest(e) {
            e.preventDefault();
            
            this.submitted = true;

            this.$v.$touch();
            if (this.$v.$error)
                return alert("Invalid submission!");
            
            var reservation = {
                uid: this.uid,
                firstName: this.customer.firstName,
                lastName: this.customer.lastName,
                phone: this.customer.phone,
                email: this.customer.email,
                date: this.reservation.date,
                time: this.reservation.time,
                numGuests: this.reservation.numGuests,
                tables: this.selectedTables,
                payment: this.highTraffic ? this.payment : null,
                discount: this.reservation.discountApplied,
            }

            this.$emit('submitReservation', reservation);

        },

        createAccount(e) {
            e.preventDefault();

            this.$emit('createAccount');
        },

        checkValidation(e) {
            e.preventDefault();
            console.log(this.$v);
        }

    }
}
</script>