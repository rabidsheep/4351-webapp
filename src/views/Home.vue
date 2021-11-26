<template>
    <div id="home">
        <div class="header">
            <h1>The Curious Cat</h1>
            <v-divider class="d1" /> <h2>Cat Cafe</h2> <v-divider class="d2" />
        </div>

        <!--
            BUTTONS TO RESERVATION FORM PAGE
            we can add parameters to these routes later
            in router.js that will tell the reservation
            page to check if user is logged in or not
        -->
        <div class="signin">
            <h2>Reserve a Table</h2>
            
            <template v-if="!loggedIn">
                <div class="email">
                    <input
                    name="email"
                    placeholder="E-mail"
                    v-model="email" />
                </div>

                <div class="password">
                    <input
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password"
                    v-model="password" />

                    <v-btn
                    class="show-password"
                    icon
                    plain
                    :ripple="false"
                    @mousedown="showPassword = true"
                    @mouseup="showPassword = false">
                        <v-icon>mdi-eye</v-icon>
                    </v-btn>
                </div>
            </template>

            <template v-else>
                Welcome, {{ customerName }}!
            </template>

            <!--
                NOT YET FUNCTIONAL 
                maybe trigger pop-up window with multiple sign-in
                options? or replace with multiple buttons for each
                option (e.g. email + password, sign in w/ gmail, etc)
            -->
            <button class="btn" @click="!loggedIn ? login(email, password) : routerPush(userDetails)" :disabled="(!email || !password) && !loggedIn">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Reserve a Table »</label>
            </button>

            <template v-if="!loggedIn">
                <span>Don't have an account?</span>
            <button class="btn" @click="$router.push('/reserve')" v-if="!loggedIn">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Proceed as Guest »</label>
            </button>
            </template>
        </div>
    </div>
</template>

<script>
import "firebase/compat/auth";

export default {
    name: 'Home',
    components: {

    },
    data: () => {
        return {
            email: null,
            password: null,
            uid: null,
            token: null,
            loggedIn: false,
            customerName: null,
            showPassword: false,
            userDetails: {},
        }
    },
    mounted() {
        
        this.$firebase.auth().onAuthStateChanged((data) => {
            if (data) {
                let user = data.multiFactor.user;
                this.customerName = user.displayName;
                this.uid = user.uid;
                this.token = user.accessToken;
                this.retrieveUserData(this.uid, this.token);
                this.loggedIn = true;
            }
        });
    },
    methods: {
        login(email, password) {
            this.$firebase.auth().signInWithEmailAndPassword(email, password)
            .then((data) => {
                if (data) {
                    var cred = data.user.multiFactor.user;
                    console.log(cred.uid);

                    return this.retrieveUserData(cred.uid, cred.accessToken);
                }
            })
            .then(() => {
                console.log("Logging in");
                this.routerPush(this.userDetails);
            })
            .catch((error) => console.error(error));
        },

        retrieveUserData(uid, token) {
            this.$user.get({ uid, token }).then((data) => {
                this.userDetails = data.body;
            });
        },

        routerPush(userDetails) {
            return this.$router.push({ name: 'reserve', params: { userDetails: userDetails } })
        }
    }

}
</script>