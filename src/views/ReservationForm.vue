<template>
    <v-form id="reservation">
        
        <div class="guest">
            <h2>Guest Info</h2> <hr />
        
            <div class="fields">
                <div class="guest__name">
                    <div class="input__text first">
                        <label for="fname">First Name</label>
                        <input id="fname" />
                    </div>

                    <div class="input__text last">
                        <label for="lname">Last Name</label>
                        <input id="lname" />
                    </div>
                </div>

                <div class="guest__address">
                    <div class="input__text address">
                        <label for="maddress">Mailing Address</label>
                        <input id="maddress" />
                    </div>
                </div>

                <div class="guest__address2">
                    <div class="input__text add__city">
                        <label for="mcity">City</label>
                        <input id="mcity" />
                    </div>

                    <div class="input__select add__state">
                        <label for="mstate">State</label>
                        <select id="mstate">
                            <option
                            v-for="(state, i) in states"
                            :key="i"
                            :value="state">
                                {{ state }}
                            </option>
                        </select>
                    </div>

                    <div class="input__text add__zip">
                        <label for="mzip">Zip Code</label>
                        <input id="mzip" />
                    </div>
                </div>
            </div>
        </div>

        <div class="payment">
            <h2>Payment Info</h2> <hr />

            <div class="fields">
                <div class="cardholder">
                    <div class="input__text chname">
                        <label for="card__name">CARDHOLDER'S NAME</label>
                        <input id="card__name" />
                    </div>
                </div>

                <div class="card">
                    <div class="input__text cnum">
                        <label for="card__num">Card Number</label>
                        <input id="card__num" />
                    </div>

                    <div class="input__text ccvv">
                        <label for="card__cvv">CVV</label>
                        <input id="card__cvv" />
                    </div>

                    <div class="expiration">
                        <div class="input__select exp">
                            <label for="card__expiration">Expiration Date</label>
                            <div id="card__expiration">
                                <select id="card__month">
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
                                <select id="card__year">
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

        <div class="billing">
            <h2>Billing Info</h2> <hr />

            <div class="fields">
                <div class="checkbox">
                    <div class="input__checkbox sameAdd">
                        <input type="checkbox" id="sameAddress" value="true" />
                        <label for="sameAddress">Same as Mailing Address</label>
                    </div>
                </div>

                <div class="guest__address">
                    <div class="input__text address">
                        <label for="baddress">Billing Address</label>
                        <input id="baddress" />
                    </div>
                </div>

                <div class="guest__address2">
                    <div class="input__text add__city">
                        <label for="bcity">City</label>
                        <input id="bcity" />
                    </div>

                    <div class="input__select add__state">
                        <label for="bstate">State</label>
                        <select id="bstate">
                            <option
                            v-for="(state, i) in states"
                            :key="i"
                            :value="state">
                                {{ state }}
                            </option>
                        </select>
                    </div>

                    <div class="input__text add__zip">
                        <label for="bzip">Zip Code</label>
                        <input id="bzip" />
                    </div>
                </div>
            </div>
        </div>
    </v-form>
</template>

<script>
export default {
    name: 'ReservationForm',
    components: {

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
            ]
        }
    },
    mounted: function() {

    },
    methods: {

    }
}
</script>
