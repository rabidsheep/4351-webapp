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
            <div class="wrapper">
            <h2>Reserve a Table</h2>

            
            <button class="btn" @click="$router.push('/reserve')">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Proceed as Guest</label>
            </button>

            <br />
            
            <!--
                NOT YET FUNCTIONAL 
                maybe trigger pop-up window with multiple sign-in
                options? or replace with multiple buttons for each
                option (e.g. email + password, sign in w/ gmail, etc)
            -->
            <button class="btn">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>I HAVE AN ACCOUNT!</label>
            </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Home',
    components: {

    },

}
</script>