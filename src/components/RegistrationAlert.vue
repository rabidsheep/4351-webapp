<template>
    <v-overlay
    absolute>
    <h1>Register an Account?</h1>

    <v-checkbox
    label="Yes, and set payment ">
        
    </v-overlay>
</template>

<script>

export default {
    name: "RegistrationAlert",
    props: {

    },
    data: () => {
        return {
            isActive: false,
        }
    },
    watch: {
    }
}
</script>
