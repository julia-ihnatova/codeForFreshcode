<template>
    <div class="">
        <v-navigation-drawer
                v-model="isDrawerOpen"
                @keyup.esc="$emit('closeMenu')"
                light
                right
                disable-resize-watcher
                disable-route-watcher
                fixed
                temporary
                absolute
                width="300"
                class="px-4 pt-2"
        >
            <v-form>
                <v-row>
                    <v-col cols="12" class="ma-0 pa-0">
                        <p class="title ma-0 pa-0">Order filters</p>
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                        <v-select dense
                                  clearable
                                  v-model="form.orders_status"
                                  :items="statuses"
                                  label="Status"
                                  @change="onChange"
                                  @click:clear="onClear('orders_status')"
                                  item-text="orders_status_name"
                                  item-value="orders_status_id"
                                  @keyup.enter="()=> { onChange(); filterOrders(); }"
                        />
                        <v-select dense
                                  clearable
                                  v-model="form.site"
                                  :items="sitesList"
                                  label="Site"
                                  @input="onChange"
                                  @click:clear="onClear('site')"
                                  @keyup.enter="()=> { onChange(); filterOrders(); }"
                        />
                        <v-select dense
                                  clearable
                                  v-model="form['order_products.ShippingCarrierUsed']"
                                  :items="carrierList"
                                  label="Carrier"
                                  @change="onChange"
                                  @click:clear="onClear('order_products.ShippingCarrierUsed')"
                                  @keyup.enter="()=> { onChange(); filterOrders(); }"
                        />
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" class="mt-0 pt-0">
                        <v-select dense
                                  clearable
                                  v-model="form.days"
                                  :items="daysList"
                                  label="Days"
                                  @change="onChangeDays"
                                  @click:clear="onClear('date_purchased')"
                                  @keyup.enter="()=> { onChangeDays(); filterOrders(); }"
                        />
                        <custom-date-range
                                :datesValue="form.date_paid"
                                @input="changeDates"/>
                    </v-col>
                </v-row>

                <div class="d-flex justify-space-between align-center my-3">
                    <v-btn small @click="clearFilters">Clear</v-btn>
                    <v-btn v-if="isDrawerOpen"
                           small
                           color="green"
                           @click="filterOrders">
                        Filter
                    </v-btn>
                </div>
            </v-form>
        </v-navigation-drawer>

    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import CustomDateRange from "../../../components/CustomDateRange";

    export default {
        name: "OrderFilters",
        props: {
            drawer: {
                type: Boolean,
                required: true,
            },
            filtersLength: {
                type: Number,
                required: true,
            },
        },
        data: () => ({
            menu: false,
            filledFilters: {},

            form: {
                PayPalTransactionID: null,
                'order_products.ShipmentTrackingNumber': null,
                customers_email_address: null,
                site: null,
                orders_status: null,
                'order_products.ShippingCarrierUsed': null,
                date_paid: [],
                date_purchased: [],
                days: null
            },
            formInit: {
                PayPalTransactionID: null,
                'order_products.ShipmentTrackingNumber': null,
                customers_email_address: null,
                site: null,
                orders_status: null,
                'order_products.ShippingCarrierUsed': null,
                date_paid: [],
                date_purchased: [],
                days: null
            },
            daysList: [
                {text: '5 days', value: 5},
                {text: '10 days', value: 10},
                {text: '30 days', value: 30},
                {text: '60 days', value: 60},
            ],
            carrierList:[
                {text: 'CZECK POST', value: 'CZECK POST'},
                {text: 'FedEx', value: 'FedEx'},
            ]

        }),
        computed:{
            sitesList:{
                get(){
                    return this.auction_accounts
                },
                set(){}
            },
            statuses:{
                get(){
                    if(this.orders_statusesList){
                        return Object.keys(this.orders_statusesList).map(key => {
                            return this.orders_statusesList[key];
                        });

                    }

                    return []
                },
                set(){}
            },
            showFilterButton() {
                console.log(this.filledFilters)
                return Object.keys(this.filledFilters).length
            },
            isDrawerOpen:{
                get(){
                    return this.drawer;
                },
                set(val){
                    if (!val) this.$emit('closeMenu')
                }
            },
            ...mapGetters([
                'productCategories',
                'auction_accounts',
                'orders_statusesList'
            ]),
        },
        methods:{
            closeMenu(){
                this.$emit('closeMenu');
            },
            onChange(){
                const filters = Object.keys(this.form)
                        .filter(e => {
                            return this.form[e] !== null && this.form[e] !== undefined && typeof this.form[e] !== 'object' && e !== 'days'})
                        .reduce( (o, e) => {
                            o[e]  = this.form[e]
                            return o;
                        }, {});


                Object.keys(filters)
                 .map(e => {
                     this.filledFilters[e] = filters[e]
                 })
            },
            changeDates(range){
                if(range.length){
                    this.form.date_paid = range;
                    this.filledFilters = {...this.filledFilters, date_paid: range};
                }else{
                    this.onClear("date_paid");
                    this.form.date_paid = [];
                }
            },
            onChangeDays(){
                if(this.form.days)store{
                    const dateTo = this.$moment().format('YYYY-MM-DD');
                    const dateFrom = this.$moment().subtract(this.form.days,'d').format('YYYY-MM-DD');
                    this.filledFilters = {...this.filledFilters, date_purchased: [dateFrom, dateTo]}
                }
            },
            filterOrders(){
                this.$emit('filterOrders', {'filledFilters': this.filledFilters });
            },
            clearFilters(){
                this.form = _.cloneDeep(this.formInit);
                this.filledFilters = {};
                if (this.filtersLength > 0) this.filterOrders();
                else this.$emit('closeMenu');
            },
            onClear(type){
                delete this.filledFilters[type];

                if(type === "date_purchased"){
                    this.form.date_purchased = [];
                    this.days = null;
                }
            }

        },
        components:{
            CustomDateRange
        }
    }
</script>

<style scoped>

    .v-label{
        font-size: 12px;
        max-width: 100%;
    }

    .filter-button{
        top: 100px;
        right:0;
        position: fixed;
    }

    .filters-container{
        position: fixed;
        width: 256px;
        height: 80%;
        transform: translateX(-236px);
        top: 48px;
    }

</style>