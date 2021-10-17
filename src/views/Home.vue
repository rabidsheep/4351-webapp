<template>
    <div id="home">
        <div class="header">
            <div class="wrapper">
            <h1>The Curious Cat</h1>
            <v-layout><v-divider /> <h2>Cat Cafe</h2> <v-divider /></v-layout>
            </div>
        </div>

        <div class="signin">
            <div class="wrapper">
            <h2>Reserve a Table</h2>

            <button @click="$router.push('/reserve')">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Proceed as Guest</label>
            </button>

            <br />

            <button>
                <v-icon>mdi-google</v-icon>
                <v-divider vertical />
                <label>Login with Gmail</label>
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