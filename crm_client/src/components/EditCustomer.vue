<template>
    <v-dialog attach max-width="600px">
        <template v-slot:activator="{ on, customer }">
        <v-btn v-on="on" v-bind="customer" class="mr-2=">Edit</v-btn>
        
        </template>
        <v-card >
                <v-card-title>
                    <h2>{{customer.firstName}}</h2>
                </v-card-title>
            </v-card>
    </v-dialog>
</template>

<script>
export default {
    
}
</script>