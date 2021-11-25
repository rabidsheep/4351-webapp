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

            <!--
                NOT YET FUNCTIONAL 
                maybe trigger pop-up window with multiple sign-in
                options? or replace with multiple buttons for each
                option (e.g. email + password, sign in w/ gmail, etc)
            -->
            <button class="btn">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Login & Proceed »</label>
            </button>

            <button class="btn" @click="$router.push('/reserve')">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Proceed as Guest »</label>
            </button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Home',
    components: {

    },
    data: () => {
        return {
            email: null,
            password: null,
            showPassword: false,
        }
    },
    methods: {
        
    }

}
</script>