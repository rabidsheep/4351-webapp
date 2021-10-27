<!--
    TODO:
    - date & time picker
        - system for determining high traffic days
            - holidays
            - day already has a high amount of reservations
            - etc
    - input field for # of guests
    - prompt asking guest if they want to register
        - api call for quick registration
    - input/form validation
    - guest vs logged in check
    - price calculations
        - notice of $10 hold fee for high traffic days
-->

<template>
    <v-form id="reservation">
        <div class="main">
            
            <!-- GUEST INFO -->
            <div class="guest">
                <span><h2>Guest Info</h2> <hr /></span>

                <div class="res__info">
                <div class="fields guest__fields">
                    <div class="guest__name">
                        <div class="input__text first">
                            <label for="fname">First Name <span class="req">*</span></label>
                            <input
                            v-model="customer.firstName"
                            id="fname"
                            required />
                        </div>

                        <div class="input__text last">
                            <label for="lname">Last Name <span class="req">*</span></label>
                            <input
                            v-model="customer.lastName"
                            id="lname"
                            required />
                        </div>
                    </div>

                    <div class="guest__contact">
                        <div class="input__text em">
                            <label for="email">E-mail <span class="req">*</span></label>
                            <input
                            v-model="customer.email"
                            id="email"
                            required />
                        </div>

                        <div class="input__text ph">
                            <label for="phone">Phone # <i>(Optional)</i></label>
                            <input
                            v-model="customer.phone"
                            placeholder="###-###-####"
                            maxlength="12"
                            @keyup="addDashes($event.key, $event.target.value)"
                            id="phone" />
                        </div>
                    </div>

                    <div class="guest__address">
                        <div class="input__text address">
                            <label for="maddress">Mailing Address <span class="req">*</span></label>
                            <input
                            v-model="customer.address"
                            id="maddress"
                            required />
                        </div>
                    </div>

                    <div class="guest__address2">
                        <div class="input__text add__city">
                            <label for="mcity">City <span class="req">*</span></label>
                            <input
                            v-model="customer.city"
                            id="mcity"
                            required />
                        </div>

                        <div class="input__select add__state">
                            <label for="mstate">State <span class="req">*</span></label>
                            <select
                            v-model="customer.state"
                            id="mstate"
                            required>
                                <option
                                v-for="(state, i) in states"
                                :key="i"
                                :value="state">
                                    {{ state }}
                                </option>
                            </select>
                        </div>

                        <div class="input__text add__zip">
                            <label for="mzip">Zip Code <span class="req">*</span></label>
                            <input
                            v-model="customer.zip"
                            id="mzip"
                            required />
                        </div>

                        <!-- IGNORE
                        <div class="input__text seating">
                            <label for="total__seats"># of Seats <span class="req">*</span></label>
                            <input
                            id="seats"
                            required />
                        </div>
                        -->
                    </div>

                    <div class="guest__gnum">
                        <div class="input__text guestcount">
                            <label for="guestno"># of Guests <span class="req">*</span></label>
                            <input
                            v-model="reservation.numGuests"
                            id="guestno"
                            required />
                        </div>
                    </div>

                    
                    </div>

                    <div class="fields res__fields">
                        <div class="input__text datetime">
                            <DatePicker
                            v-model="reservation.date"
                            mode="dateTime"
                            :minute-increment="5" />
                        </div>
                    </div>
                </div>
            </div>

             <!-- PAYMENT INFO -->
            <div class="payment">
                <span><h2>Payment Info</h2> <hr /></span>

                <div class="fields">
                    <div class="cardholder">
                        <div class="input__text chname">
                            <label for="card__name">CARDHOLDER'S NAME <span class="req">*</span></label>
                            <input
                            v-model="payment.ch"
                            id="card__name"
                            required />
                        </div>
                    </div>

                    <div class="card">
                        <div class="input__text cnum">
                            <label for="card__num">Card # <span class="req">*</span></label>
                            <input
                            v-model="payment.num"
                            id="card__num"
                            placeholder="#### #### #### ####"
                            maxlength="19"
                            @input="addSpaces($event.target.value)"
                            required />
                        </div>

                        <div class="input__text ccvv">
                            <label for="card__cvv">CVV <span class="req">*</span></label>
                            <input
                            v-model="payment.cvv"
                            id="card__cvv"
                            placeholder="###"
                            maxlength="3"
                            required />
                        </div>

                        <div class="expiration">
                            <div class="input__select exp">
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
                        <div class="input__checkbox sameAdd">
                            <input
                            v-model="useMailAddress"
                            type="checkbox"
                            id="sameAddress"
                            value="true" />
                            <label for="sameAddress">Same as Mailing Address</label>
                        </div>
                    </div>

                    <div class="guest__address">
                        <div class="input__text address">
                            <label for="baddress">Billing Address <span class="req">*</span></label>
                            <input
                            v-model="billing.address"
                            :disabled="useMailAddress"
                            id="baddress"
                            required />
                        </div>
                    </div>

                    <div class="guest__address2">
                        <div class="input__text add__city">
                            <label for="bcity">City <span class="req">*</span></label>
                            <input
                            v-model="billing.city"
                            :disabled="useMailAddress"
                            id="bcity"
                            required />
                        </div>

                        <div class="input__select add__state">
                            <label for="bstate">State <span class="req">*</span></label>
                            <select
                            v-model="billing.state"
                            :disabled="useMailAddress"
                            id="bstate"
                            required>
                                <option
                                v-for="(state, i) in states"
                                :key="i"
                                :value="state">
                                    {{ state }}
                                </option>
                            </select>
                        </div>

                        <div class="input__text add__zip">
                            <label for="bzip">Zip Code <span class="req">*</span></label>
                            <input
                            v-model="billing.zip"
                            :disabled="useMailAddress"
                            id="bzip"
                            required />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </v-form>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

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
            expYear: null,
            expMonth: null,
            useMailAddress: false,
            customer: {
                firstName: null,
                lastName: null,
                email: null,
                phone: null,
                address: null,
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
                address: null,
                city: null,
                state: null,
                zip: null,
            },
            reservation: {
                firstName: null,
                lastName: null,
                date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
                numGuests: null,
                tables: [],
            }
        }
    },
    /* watchers to check for changes in certain variables */
    watch: {
        // check if billing is same as mailing
        'useMailAddress': function(val) {
           if (val) {
               this.billing = {
                   address: this.customer.address,
                   city: this.customer.state,
                   state: this.customer.city,
                   zip: this.customer.zip
               }
           } 
        },

        // these all update billing alongside mailing if box is checked
        'customer.address': function(address) {
            if (this.useMailAddress)
                this.billing.address = address;
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
        }

    },
    mounted: function() {
        // code for checking if user is logged in will go here
    },
    methods: {
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
        
    }
}
</script>
