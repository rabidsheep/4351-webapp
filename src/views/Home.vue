<template>
    <div id="home">
        <div class="header">
            <h1>The Curious Cat</h1>
            <v-divider class="d1" /> <h2>Cat Cafe</h2> <v-divider class="d2" />
        </div>

        <div class="signin">
            <div class="wrapper">
            <h2>Reserve a Table</h2>

            <button class="btn" @click="$router.push('/reserve')">
                <v-icon>mdi-paw</v-icon>
                <v-divider vertical />
                <label>Proceed as Guest</label>
            </button>

            <br />

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