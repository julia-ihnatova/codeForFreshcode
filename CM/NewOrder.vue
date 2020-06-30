<template>
   <v-card>
      <v-card-title class="ma-0 pa-0">
         <v-toolbar dark dense color="blue darken-3">
            <v-toolbar-title>Add new order</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
               <v-btn icon dark @click.stop="close">
                  <v-icon>mdi-close</v-icon>
               </v-btn>
            </v-toolbar-items>
         </v-toolbar>
      </v-card-title>
      <v-card-text class="pt-4">
         <OrderAddressForms @saveNewOrder="saveNewOrder"  @submitForm="submitForm" :newOrder="true"  />
      </v-card-text>
   </v-card>

</template>

<script>
    import {mapGetters} from "vuex";
    import OrderAddressForms from "../../../components/OrderAddressForms";

    export default {
        name: "NewOrder",
        data: () => ({

        }),
        computed: {
        },
        mounted(){
            this.$store.commit('setOrder', {})
        },
        methods:{
            submitForm(newOrder){
               //TODO what to do with input value
            },
           saveNewOrder(newOrder){
              this.$emit('newOrderAdded', newOrder)
           },
           close(){
              this.$emit('closeDialog')
           }
        },
        components:{
           OrderAddressForms
        }

    }
</script>

<style scoped>

</style>