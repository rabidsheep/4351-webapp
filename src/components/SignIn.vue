<template>
    <div class="signin">
        <div class="wrapper">
        <h2>Reserve a Table</h2>

        <input name="username" />
        <input name="password" />

        
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
            <label>I have an account!</label>
        </button>
        </div>
    </div>
</template>