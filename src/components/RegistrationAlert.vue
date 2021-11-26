<template>
    <v-overlay
    absolute>
        <v-stepper
        v-model="step"
        class="registration__stepper">
            <v-stepper-items>
                <v-stepper-content
                class="alertContent pt1"
                step="1">
                    
                </v-stepper-content>

                <v-stepper-content
                class="alertContent pt2"
                step="2">
                    <v-form 
                    class="reservation__form">
                        <div class="main">
                            <div class="mailing">
                                <span><h2>Mailing Info</h2> <div class="gdivider" /></span>
                                <div class="field-group">
                                    <div class="input__text input__address-l1 field-w12">
                                        <label for="maddress">Mailing Address <span class="req">*</span></label>
                                        <input
                                        v-model="mailing.line1"
                                        id="maddress"
                                        class="form-control"
                                        required />                   
                                    </div>

                                    <div class="input__text input__address-l2 field-w12">
                                        <label for="maddress2">Apt/Suite/Building #</label>
                                        <input
                                        v-model="mailing.line2"
                                        id="maddress2"
                                        required />                   
                                    </div>

                                    <div class="input__text input__city field-w4">
                                        <label for="mcity">City <span class="req">*</span></label>
                                        <input
                                        v-model="mailing.city"
                                        id="mcity"
                                        class="form-control"
                                        required />
                                    </div>

                                    <div class="input__select input__state field-w4">
                                        <label for="mstate">State <span class="req">*</span></label>

                                        <select
                                        v-model="mailing.state"
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
                                        v-model="mailing.zip"
                                        id="mzip"
                                        @keypress="numKeysOnly($event)"
                                        required />
                                    </div>
                                </div>
                            </div>

                            <template v-if="showPayment">
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

                            <button @click="$emit('create-account')" class="btn submit">
                                <v-icon>mdi-paw</v-icon>
                                <v-divider vertical />
                                <label>Submit »</label>
                            </button>
                        </div>
                    </v-form>
                </v-stepper-content>

                <v-stepper-content
                class="alertContent pt3"
                step="3">

                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-overlay>
</template>

<script>

export default {
    name: "RegistrationAlert",
    props: {
        mailing: Object,
        payment: Object,
        showPayment: Boolean,
        states: Array,
    },
    data: () => {
        return {
            expMonth: null,
            expYear: null,
            step: 1,
            useMailAddress: false,
            submitted: false,
        }
    },
    watch: {
    },
    methods: {
        
        // add spaces to credit card number field as user types
        addSpaces(num) {
            return this.payment.num = num.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
        },
        
        // only allow numerical keys to be pressed
        numKeysOnly(e) {
            if (e.key < '0' || e.key > '9')
                return e.preventDefault();
        },
    }
}
</script>
