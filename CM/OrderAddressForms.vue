<template>
    <v-layout align-space-around wrap class="elevation-1 caption px-2">
        <v-flex xs12 sm7>
            <v-card flat>
                <v-form ref="addressForm"  v-model="addressValid">
                    <v-tabs class="relative" height="36px">
                        <v-tab ripple @click="() => { this.showCopyToBillingButton = true; this.showCopyToDeliveryButton = false}">
                            <v-flex class="text-xs-left font-weight-medium">
                                Delivery
                            </v-flex>
                        </v-tab>
                        <v-tab ripple @click="() => { this.showCopyToBillingButton = false; this.showCopyToDeliveryButton = true}">
                            <v-flex class="text-xs-left font-weight-medium pa-0">
                                Billing
                            </v-flex>
                        </v-tab>
                        <v-tab-item class="mt-3">
                            <v-card flat class="address">
                                <v-layout>
                                    <v-flex xs12>
                                        <v-text-field dense
                                                      v-model="form.delivery_name"
                                                      :rules="rules.required"
                                                      colorvaluer="blue darken-2"
                                                      label="Delivery name"
                                                      @change="submitForm"
                                                      class="body-1"
                                                      :hide-details=true
                                                      append-icon="mdi-magnify"
                                                      @click:append="openAddCustomerDialog('delivery_name')"
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs12>
                                        <v-text-field dense
                                                      v-model="form.delivery_street_address"
                                                      :rules="rules.required"
                                                      color="blue darken-2"
                                                      label="Delivery street address"
                                                      placeholder="enter delivery street address"
                                                      required
                                                      @change="submitForm"
                                                      class="body-1 mt-4"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.delivery_state"
                                                      color="blue darken-2"
                                                      label="Delivery state"
                                                      placeholder="enter delivery state"
                                                      class="body-1 mt-4"
                                                      @change="submitForm"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.delivery_city"
                                                      :rules="rules.required"
                                                      color="blue darken-2"
                                                      label="Delivery city"
                                                      placeholder="enter delivery city"
                                                      @change="submitForm"
                                                      class="body-1 mt-4"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs6>
                                        <v-autocomplete dense
                                                        v-model="form.delivery_country"
                                                        :rules="rules.required"
                                                        :items="countries"
                                                        color="pink"
                                                        label="Delivery country"
                                                        @change="submitForm"
                                                        class="body-1 mt-4"
                                                        :hide-details=true
                                        />
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.delivery_postcode"
                                                      :rules="rules.required"
                                                      color="blue darken-2"
                                                      label="Delivery postcode"
                                                      placeholder="enter delivery postcode"
                                                      @change="submitForm"
                                                      class="body-1 mt-4"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.customers_email_address"
                                                      :rules="rules.required"
                                                      color="purple darken-2"
                                                      label="Email address"
                                                      placeholder="enter email address"
                                                      @change="submitForm"
                                                      class="body-1 mt-4"
                                                      :hide-details=true
                                                      append-icon="mdi-magnify"
                                                      @click:append="openAddCustomerDialog('customers_email_address')"
                                        />
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.customers_telephone"
                                                      color="blue darken-2"
                                                      label="Telephone"
                                                      placeholder="enter telephone"
                                                      class="body-1 mt-4"
                                                      @change="submitForm"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                </v-layout>

                            </v-card>
                        </v-tab-item>
                        <v-tab-item class="mt-3">
                            <v-card flat class="address">
                                <v-layout>
                                    <v-flex xs12>
                                        <v-text-field
                                                dense
                                                v-model="form.billing_name"
                                                :rules="rules.required"
                                                color="purple darken-2"
                                                label="Billing name"
                                                placeholder="enter billing name"
                                                @change="submitForm"
                                                class="body-1"
                                                :hide-details=true
                                                append-icon="mdi-magnify"
                                                @click:append="openAddCustomerDialog('billing_name')"
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs12>
                                        <v-text-field dense
                                                      v-model="form.billing_street_address"
                                                      :rules="rules.required"
                                                      color="purple darken-2"
                                                      label="Billing street address"
                                                      placeholder="enter billing street address"
                                                      @change="submitForm"
                                                      class="body-1 mt-4"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.billing_state"
                                                      color="purple darken-2"
                                                      label="Billing state"
                                                      placeholder="enter billing state"
                                                      class="body-1 mt-4"
                                                      @change="submitForm"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.billing_city"
                                                      :rules="rules.required"
                                                      color="purple darken-2"
                                                      label="Billing city"
                                                      placeholder="enter billing city"
                                                      @change="submitForm"
                                                      class="body-1 mt-4"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs6>
                                        <v-autocomplete dense
                                                        v-model="form.billing_country"
                                                        :rules="rules.required"
                                                        :items="countries"
                                                        color="pink"
                                                        label="Billing country"
                                                        @change="submitForm"
                                                        class="body-1 mt-4"
                                                        :hide-details=true
                                        />
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field dense
                                                      v-model="form.billing_postcode"
                                                      :rules="rules.required"
                                                      color="purple darken-2"
                                                      label="Billing postcode"
                                                      placeholder="enter billing postcode"
                                                      @change="submitForm"
                                                      class="body-1 mt-4"
                                                      :hide-details=true
                                        />
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                    <v-flex xs5 sm6 class="text-right absolute address-form-buttons">
                        <v-btn
                                small
                                color="primary"
                                class="body-1 address-action"
                                @click="addressFormCopyToBilling"
                                v-show="showCopyToBillingButton"
                        >Copy To Billing</v-btn>
                        <v-btn
                                small
                                color="primary"
                                class="body-1 address-action"
                                @click="addressFormCopyToDelivery"
                                v-show="showCopyToDeliveryButton"
                        >Copy To Delivery</v-btn>
                    </v-flex>
                </v-form>
            </v-card>
        </v-flex>
        <v-flex xs12 class="hidden-sm-and-up">
            <v-divider/>
        </v-flex>
        <v-flex xs12 sm5>
            <v-form ref="additionalParams" class="my-2 pt-2">
                <v-list dense flat>
                    <v-list-item-group>
                        <v-list-item>
                            <v-select dense
                                      label="Status"
                                      v-model="form.orders_status"
                                      :items="statuses"
                                      item-value="orders_status_id"
                                      item-text="orders_status_name"
                                      :rules="rules.required"
                                      prepend-icon="timeline"
                                      class="font-weight-regular full-width"
                                      @change="submitForm"
                            />
                        </v-list-item>
                        <v-list-item>
                            <v-layout>
                                <v-flex xs6>
                                    <v-select dense
                                              label="Payment method"
                                              v-model="form.payment_method"
                                              :items="paymentMethods"
                                              :rules="rules.required"
                                              prepend-icon="account_balance_wallet"
                                              class="caption font-weight-regular full-width"
                                              @change="submitForm"
                                    />
                                </v-flex>
                                <v-flex xs5 offset-xs1>
                                    <v-select dense
                                              label="Currency"
                                              v-model="form.currency"
                                              :items="currencies"
                                              :rules="rules.required"
                                              prepend-icon="euro_symbol"
                                              class="caption font-weight-regular full-width"
                                              @change="submitForm"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-list-item>
                        <v-list-item>
                            <v-layout class="full-width">
                                <v-flex xs6>
                                    <v-select dense
                                              label="Auction account"
                                              v-model="form.site"
                                              :items="auction_accounts"
                                              :rules="rules.required"
                                              prepend-icon="account_box"
                                              class="caption font-weight-regular full-width"
                                              @change="submitForm"
                                    />
                                </v-flex>
                                <v-flex xs5 offset-xs1 class="full-width">
                                    <v-text-field dense
                                                  label="PayPal Id"
                                                  v-model="form.PayPalTransactionID"
                                                  prepend-icon="payment"
                                                  class="caption font-weight-regular"
                                                  @change="submitForm"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-list-item>
                        <v-list-item>
                            <v-layout wrap>

                                <v-flex xs6>
                                    <ordered-datepicker
                                            v-model="form.date_purchased"
                                            :labelName="'Ordered'"
                                            :rules="rules.required"
                                            class="caption font-weight-regular"
                                            @input="submitForm"/>
                                </v-flex>

                                <v-flex xs6>
                                    <ordered-datepicker
                                            v-model="form.date_paid"
                                            :labelName="'Paid'"
                                            class="caption font-weight-regular"
                                            @input="submitForm"/>
                                </v-flex>
                            </v-layout>
                        </v-list-item>
                        <v-list-item>
                            <v-layout>
                                <v-flex xs4>
                                    <ordered-datepicker
                                            v-model="form.date_shipped"
                                            :labelName="'Shipped'"
                                            class="caption font-weight-regular"
                                            @input="submitForm"
                                    />
                                </v-flex>

                                <v-flex xs4>
                                    <ordered-datepicker
                                            v-if="form.duty_date"
                                            v-model="form.duty_date.duty_date"
                                            :labelName="'Cleared'"
                                            class="caption font-weight-regular"
                                            @input="submitForm"
                                    />
                                </v-flex>

                                <v-flex xs4>
                                    <ordered-datepicker
                                            v-model="form.date_refund"
                                            :labelName="'Refunded'"
                                            class="caption font-weight-regular"
                                            @input="submitForm"/>
                                </v-flex>
                            </v-layout>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-form>
        </v-flex>
        <v-flex xs12 v-if="newOrder">
            <v-btn
                    small
                    color="primary"
                    class="body-1 address-action mb-3"
                    @click="saveNewOrder"
            >Save and add products</v-btn>
        </v-flex>
        <add-customer
                v-model="searchCustomerDialog"
                :searchBy="searchByCustomerDialog"
                @closeDialog="searchCustomerDialog = false"
                @addCustomer = saveUserToOrder
        >
            Search Customer
        </add-customer>
    </v-layout>
</template>

<script>
    import {mapGetters} from "vuex";
    import OrderedDatepicker from "../pages/order/OrderedDatepicker";
    import AddCustomer from "./AddCustomer";

    import ordersApi from '@/services/orders.api';

    export default {
        name: "OrderAddressForm",
        props: {
            order: {
                type: Object,
                required: false,
                default: null,
            },
            newOrder: {
                type: Boolean,
                required: false,
                default: false,
            }
        },
        data: () => ({
            rules: {
                max25chars: v => v.length <= 30 || 'Input too long!',
                required: [value => !!value || ''],
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
            },
            showCopyToBillingButton: true,
            showCopyToDeliveryButton: false,
            addressValid: false,
            orders:[],
            form: {
                customers_id: null,
                date_shipped: null,
                date_paid: null,
                date_purchased: null,
                PayPalTransactionID: null,
                payment_method: null,
                orders_status: null,
                customers_email_address: null,
                delivery_name: null,
                delivery_street_address: null,
                delivery_state: null,
                delivery_city: null,
                delivery_postcode: null,
                delivery_country: null,
                billing_name: null,
                billing_street_address: null,
                billing_state: null,
                billing_city: null,
                billing_postcode: null,
                billing_country: null,
                customers_telephone: null,
                currency: null,
                duty_date:{
                    "id": null,
                    "duty_date": null
                },
                date_refund: null,
            },
            formInit: {
                customers_id: null,
                date_shipped: null,
                date_paid: null,
                date_purchased: null,
                PayPalTransactionID: null,
                payment_method: null,
                orders_status: null,
                customers_email_address: null,
                delivery_name: null,
                delivery_street_address: null,
                delivery_state: null,
                delivery_city: null,
                delivery_postcode: null,
                delivery_country: null,
                billing_name: null,
                billing_street_address: null,
                billing_state: null,
                billing_city: null,
                billing_postcode: null,
                billing_country: null,
                customers_telephone: null,
                currency: null,
                duty_date:{
                    "id": null,
                    "duty_date": null
                },
                date_refund: null,
            },
            searchCustomerDialog: false,
            searchByCustomerDialog: null,
        }),
        computed: {
            statuses(){
                if(this.orders_statusesList){
                    return Object.values(this.orders_statusesList)
                }
            },
            currencies(){
                return this.currenciesList
            },
            countries(){
                return _.map(this.countriesList, 'countries_name')
            },
            ...mapGetters([
                'currenciesList',
                'countriesList',
                'orders_statusesList',
                'paymentMethods',
                'auction_accounts',
            ]),
        },
        watch: {

        },
        mounted(){
            if(this.order){
                this.form = this.order;
                this.orders.push(this.order);

                this.$refs.addressForm.validate();
                this.$refs.additionalParams.validate();
            }

        },
        methods: {
            submitForm(){
                this.$emit('submitForm', this.form)
            },
            saveNewOrder(){
                if(this.$refs.addressForm.validate() && this.$refs.additionalParams.validate()) {
                    this.$emit('saveNewOrder', this.form);
                    this.form = _.cloneDeep(this.formInit);
                }
            },
            addressFormCopyToDelivery() {
                this.form.delivery_name = this.form.billing_name;
                this.form.delivery_street_address = this.form.billing_street_address;
                this.form.delivery_state = this.form.billing_state;
                this.form.delivery_city = this.form.billing_city;
                this.form.delivery_postcode = this.form.billing_postcode;
                this.form.delivery_country = this.form.billing_country;
                this.$refs.addressForm.validate();
            },
            addressFormCopyToBilling() {
                this.form.billing_name = this.form.delivery_name;
                this.form.billing_street_address = this.form.delivery_street_address;
                this.form.billing_state  = this.form.delivery_state;
                this.form.billing_city  = this.form.delivery_city;
                this.form.billing_postcode  = this.form.delivery_postcode;
                this.form.billing_country  = this.form.delivery_country;
                this.$refs.addressForm.validate();
            },
            openAddCustomerDialog(searchBy){
                this.searchByCustomerDialog = searchBy;
                this.searchCustomerDialog=true;
            },
            saveUserToOrder(order){
                this.form.delivery_name = order.delivery_name;
                this.form.delivery_street_address = order.delivery_street_address;
                this.form.delivery_state = order.delivery_state;
                this.form.delivery_city = order.delivery_city;
                this.form.delivery_postcode = order.delivery_postcode;
                this.form.delivery_country = order.delivery_country;
                this.form.billing_name = order.billing_name;
                this.form.billing_street_address = order.billing_street_address;
                this.form.billing_state = order.billing_state;
                this.form.billing_city = order.billing_city;
                this.form.billing_postcode = order.billing_postcode;
                this.form.billing_country = order.billing_country;
                this.form.customers_email_address = order.customers_email_address;
                this.form.customers_telephone = order.customers_telephone;
                this.form.customers_id = order.customers_id

                this.$refs.addressForm.validate();
                this.$refs.additionalParams.validate();

            }
        },
        components:{
            OrderedDatepicker,
            AddCustomer
        }

    }
</script>

<style scoped>

    .address .layout .flex{
        padding: 0 5px;
    }

    .autocomplete {
        position: relative;
    }

    @media all and (max-width: 960px) {
        .address-action{
            min-width: 0;
            margin: 0;
        }
    }

</style>