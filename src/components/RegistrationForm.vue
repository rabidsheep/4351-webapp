<template>
    <v-form id="registration" class="reservation__form">
        <div class="main">
            <div class="account">
                <span><h2>User Info</h2> <div class="gdivider" /></span>

                <div class="field-group">
                    <div class="input__text input__email field-w6"
                    :class="{
                        'has-error': $v.customer.email.$error
                    }">
                        <label for="email">E-mail <span class="req">*</span></label>
                        <input
                        v-model="customer.email"
                        id="email"
                        @input="$v.customer.email.$touch"
                        required />   
                    </div>

                    <div class="input__text input__password field-w6"
                    :class="{
                        'has-error': $v.password.$error
                    }">
                        <label for="email">Password <span class="req">*</span></label>
                        <input
                        v-model="password"
                        id="password"
                        @input="$v.password.$touch"
                        required />   
                    </div>
                </div>
            </div>

            <div class="mailing">
                <span><h2>Mailing Info</h2> <div class="gdivider" /></span>
                <div class="field-group">
                    <div class="input__text input__address-l1 field-w12"
                    :class="{
                        'has-error': $v.mailing.line1.$error
                    }">
                        <label for="maddress">Mailing Address <span class="req">*</span></label>
                        <input
                        v-model="mailing.line1"
                        id="maddress"
                        @input="$v.mailing.line1.$touch"
                        required />                   
                    </div>

                    <div class="input__text input__address-l2 field-w12">
                        <label for="maddress2">Apt/Suite/Building #</label>
                        <input
                        v-model="mailing.line2"
                        id="maddress2"
                        required />                   
                    </div>

                    <div class="input__text input__city field-w4"
                    :class="{
                        'has-error': $v.mailing.city.$error
                    }">
                        <label for="mcity">City <span class="req">*</span></label>
                        <input
                        v-model="mailing.city"
                        id="mcity"
                        @input="$v.mailing.city.$touch"
                        required />
                    </div>

                    <div class="input__select input__state field-w4"
                    :class="{
                        'has-error': $v.mailing.state.$error
                    }">
                        <label for="mstate">State <span class="req">*</span></label>

                        <select
                        v-model="mailing.state"
                        id="mstate"
                        @change="$v.mailing.state.$touch"
                        required>
                            <option
                            v-for="(state, i) in states"
                            :key="i"
                            :value="state">
                                {{ state }}
                            </option>
                        </select>
                    </div>

                    <div class="input__text input__zip field-w4 form-group"
                    :class="{
                        'has-error': $v.mailing.zip.$error
                    }">
                        <label for="mzip">Zip Code <span class="req">*</span></label>
                        <input
                        v-model="mailing.zip"
                        id="mzip"
                        @keypress="numKeysOnly($event)"
                        maxlength="5"
                        @input="$v.mailing.zip.$touch"
                        required />
                    </div>
                </div>
            </div>

                <div class="payment">
                    <span><h2>Default Payment</h2> <div class="gdivider" /></span>

                    <div class="field-group">
                        <div class="input__checkbox input__use-res field-w12" v-if="highTraffic">
                            <input
                            v-model="useResCard"
                            type="checkbox"
                            id="use-res"
                            value="true" />
                            <label for="use-res">Use Payment On Reservation</label>
                        </div>

                        <div class="input__text input__ch field-w12">
                            <label for="card__name">CARDHOLDER'S NAME <span class="req">*</span></label>
                            <input
                            v-model="defaultPay.cardholderName"
                            id="card__name"
                            required
                            @input="$v.defaultPay.cardholderName.$touch"
                            :readonly="useResCard" />
                        </div>

                        <div class="input__text input__cnum">
                            <label for="card__num">Card # <span class="req">*</span></label>
                            <div class="wrapper">
                                <input
                                v-model="defaultPay.cardNum"
                                id="card__num"
                                placeholder="#### #### #### ####"
                                maxlength="19"
                                @input="addSpaces($event.target.value); $v.defaultPay.cardholderName.$touch"
                                @keypress="numKeysOnly($event)"
                                required
                                :readonly="useResCard" />

                                <div class="merchants">
                                <img :src="require(`@/assets/img/merchants.png`)" />
                                </div>
                            </div>
                        </div>

                        <div class="input__text input__cvv">
                            <label for="card__cvv">CVV <span class="req">*</span></label>
                            <input
                            v-model="defaultPay.cvv"
                            id="card__cvv"
                            placeholder="###"
                            maxlength="3"
                            @keypress="numKeysOnly($event)"
                            @input="$v.defaultPay.cvv.$touch"
                            required
                            :readonly="useResCard" />
                        </div>

                        <div class="input__general input__exp">
                            <label for="card__expiration">Expiration <span class="req">*</span></label>
                            <div class="grouped">
                                <input
                                v-model="expMonth"
                                @change="defaultPay.expirationDate = expMonth + '/' + expYear"
                                id="card__month"
                                required
                                maxlength="2"
                                placeholder="MM"
                                @input="$v.expMonth.$touch"
                                :readonly="useResCard" />

                                <div class="input-divider" :class="{'read-only': useResCard}">/</div>

                                <input
                                v-model="expYear"
                                @change="defaultPay.expirationDate = expMonth + '/' + expYear"
                                id="card__year"
                                required
                                placeholder="YY"
                                maxlength="2"
                                @input="$v.expYear.$touch"
                                :readonly="useResCard" />
                            </div>
                        </div>

                        
                    </div>
                </div>

                <div class="billing">
                    <span><h2>Default Billing</h2> <div class="gdivider" /></span>

                    <div class="field-group">
                        <div class="input__checkbox input__same-add field-w12">
                            <input
                            v-model="useMailAddress"
                            type="checkbox"
                            id="sameAddress"
                            value="true"
                            :disabled="useResCard" />
                            <label for="sameAddress">Use Mailing Address</label>
                        </div>

                        <div class="input__text input__address-l1 field-w12"
                        :class="{
                            'has-error': $v.defaultPay.billing.line1.$error
                        }">
                            <label for="bline1">Billing Address <span class="req">*</span></label>
                            <input
                            v-model="defaultPay.billing.line1"
                            id="bline1"
                            required
                            @input="$v.defaultPay.billing.line1.$touch"
                            :readonly="useMailAddress || useResCard" />                   
                        </div>

                        <div class="input__text input__address-l2 field-w12">
                            <label for="baddress2">Apt/Suite/Building # <i>(Optional)</i></label>
                            <input
                            v-model="defaultPay.billing.line2"
                            id="baddress2"
                            required
                            :readonly="useMailAddress || useResCard" />                   
                        </div>

                        <div class="input__text input__city field-w4"
                        :class="{
                            'has-error': $v.defaultPay.billing.city.$error
                        }">
                            <label for="bcity">City <span class="req">*</span></label>
                            <input
                            v-model="defaultPay.billing.city"
                            id="bcity"
                            required
                            @input="$v.defaultPay.billing.city.$touch"
                            :readonly="useMailAddress || useResCard" />
                        </div>

                        <div class="input__select input__state field-w4"
                        :class="{
                            'has-error': $v.defaultPay.billing.state.$error
                        }">
                            <label for="bstate">State <span class="req">*</span></label>
                            <select
                            v-model="defaultPay.billing.state"
                            id="bstate"
                            required
                            @change="$v.defaultPay.billing.state.$touch"
                            :disabled="useMailAddress || useResCard">
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
                            'has-error': $v.defaultPay.billing.zip.$error
                        }">
                            <label for="bzip">Zip Code <span class="req">*</span></label>
                            <input
                            v-model="defaultPay.billing.zip"
                            id="bzip"
                            @keypress="numKeysOnly($event)"
                            required
                            maxlength="5"
                            @input="$v.defaultPay.billing.zip.$touch"
                            :readonly="useMailAddress || useResCard" />
                        </div>
                    </div>
                </div>
        </div>

        <div class="bottom">
            <div class="legend">
                <i><span class="req">*</span> = Required</i>
            </div>

            <div class="buttons">
                <div class="left">
                    <button class="btn submit"
                    @click="$event.preventDefault(); $emit('goBack')">
                        <label>« Back</label>
                        <v-divider vertical />
                        <v-icon>mdi-paw</v-icon>
                    </button>
                </div>

                <div class="right">
                    <!--
                    <button class="btn submit"
                    :disabled="!$v.$anyDirty || $v.$anyError && $v.$dirty || $v.$invalid"
                    @click="submitReservation($event)">
                        <v-icon>mdi-paw</v-icon>
                        <v-divider vertical />
                        <label>Place reservation »</label>
                    </button>
                    -->

                    <button class="btn submit"
                    :disabled="!$v.$anyDirty || $v.$anyError && $v.$dirty || $v.$invalid"
                    @click="createAccount($event)">
                        <v-icon>mdi-paw</v-icon>
                        <v-divider vertical />
                        <label>Register & Reserve »</label>
                    </button>

                    <!--
                    <button class="btn submit"
                    @click="checkValidation($event)">
                        <v-icon>mdi-paw</v-icon>
                        <v-divider vertical />
                        <label>Check validation »</label>
                    </button>
                    -->
                </div>
            </div>
        </div>
    </v-form>
</template>

<script>
import { required, minLength, maxLength, email } from "vuelidate/lib/validators";

export default {
    name: 'RegistrationForm',
    props: {
        uid: String,
        customer: Object,
        payment: Object,
        reservation: Object,
        states: Array,
        selectedTables: Array,
        highTraffic: Boolean,
    },
    data: () => {
        return {
            password: 'password',
            expMonth: null,
            expYear: null,
            preferredMethod: null,
            paymentMethods: ["Cash", "Card", "Check"],
            useMailAddress: false,
            useResCard: false,
            mailing: {
                line1: null,
                line2: null,
                city: null,
                state: null,
                zip: null,
            },
            defaultPay: {
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
            submitted: false,
        }
    },
    validations: {
        expYear: { required, minLength: minLength(2) },
        expMonth: { required, minLength: minLength(2) },
        password: { required, minLength: minLength(6) },
        customer: {
            firstName: { required },
            lastName: { required },
            email: { required, email },
            phone: { required },
        },
        mailing: {
            line1: { required },
            city: { required },
            state: { required },
            zip: { required, minLength: minLength(5), maxLength: maxLength(5) },
        },
        defaultPay: {
            cardholderName: { required },
            cardNum: { required, minLength: minLength(18), maxLength: maxLength(19) },
            cvv: { required, minLength: minLength(3) },
            billing: {
                line1: { required },
                city: { required },
                state: { required },
                zip: { required, minLength: minLength(5), maxLength: maxLength(5) },
            }
        },
        
    },
    watch: {
        // check if billing is same as mailing
        'useMailAddress': function(use) {
           if (use) {
               this.defaultPay.billing = this.mailing;
           } else {
               this.defaultPay.billing = {
                    line1: null,
                    line2: null,
                    city: null,
                    state: null,
                    zip: null,
               }
           }
        },

        'mailing': {
            handler: function(address) {
                if (this.useMailAddress)
                    this.defaultPay.billing = address;
            },
            deep: true            
        },

        'useResCard': function(use) {
            if (use) {
                this.defaultPay = this.payment;
                this.expMonth = this.payment.expirationDate.split('/')[0];
                this.expYear = this.payment.expirationDate.split('/')[1];
            } else {
                this.defaultPay = {
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
                    }
                }

                this.expMonth = null;
                this.expYear = null;
            }
        }
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
            return this.defaultPay.cardNum = num.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
        },
        
        // only allow numerical keys to be pressed
        numKeysOnly(e) {
            if (e.key < '0' || e.key > '9')
                return e.preventDefault();
        },

        createAccount(e) {
            e.preventDefault();
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

            var account = {
                firstName: this.customer.firstName,
                lastName: this.customer.lastName,
                phone: this.customer.phone,
                email: this.customer.email,
                mailing: this.mailing,
                payment: this.defaultPay,
            }

            console.log(this.defaultPay)

            this.$emit('createAndSubmit', { 
                email: this.customer.email,
                password: this.password,
                account: account,
                reservation: reservation })
        },

        
        checkValidation(e) {
            e.preventDefault();
            console.log(this.$v);
        }
        
    }
}
</script>