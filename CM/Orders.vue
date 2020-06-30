<template>
    <div class="width-100">
        <v-row no-gutters>
            <v-col class="d-flex">
                <v-data-table
                        :headers="headers"
                        :items="orders"
                        item-key="order_id"
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                        :options.sync="options"
                        :server-items-length="pagination.totalItems"
                        :loading="loading"
                        sort-desc
                        class= "elevation-1 width-100 orders-table"
                        :footer-props="{
                            itemsPerPageOptions: pagination.rowsPerPageItems,
                            showFirstLastPage: true,
                           }"
                >
                    <template v-slot:top>
                        <v-toolbar dense flat color="white" class="pa-0 ma-0">
                            <v-btn small icon color="pink" @click="addNewOrderDialog = true"><v-icon>mdi-tab-plus</v-icon></v-btn>
                            <v-row justify="space-around" style="max-width: 95%;">
                                <v-col cols="12">
                            <v-chip-group
                                    active-class="primary--text"
                                    show-arrows
                            >
                                <v-chip v-for="tag in tags" :key="tag">
                                    {{ tag }}
                                </v-chip>
                            </v-chip-group>
                                </v-col>
                            </v-row>
                            <v-spacer></v-spacer>
                            <v-btn small icon class="mr-2" color="green" @click="getDataFromApi"><v-icon>mdi-cached</v-icon></v-btn>
                            <v-badge
                                        :content="filtersLength"
                                        :value="filtersLength"
                                        color="green"
                                        overlap
                                        left
                                >
                                    <span slot="badge" @click="getDataFromApi">{{ filtersLength }}</span>
                                    <v-btn small icon color="blue"
                                           @click.stop="filterDrawer = !filterDrawer"
                                    >
                                        <v-icon v-if="!filtersLength"
                                        >
                                            mdi-filter-outline
                                        </v-icon>
                                        <v-icon v-else
                                        >
                                            mdi-filter
                                        </v-icon>
                                    </v-btn>
                                </v-badge>
                        </v-toolbar>
                    </template>
                    <template slot="item" slot-scope="props">
                        <tr :key="props.item.orders_id" :class="props.item.orders_id === selectedRow ? 'teal lighten-5' : null" @click="toggleSelectedRow(props.item.orders_id)">
                            <td style="width: 70px; min-width: 70px; max-width: 70px;">
                                <table-id
                                        :item="props.item"
                                        @openOrderDialog="openOrderDialog"
                                />
                            </td>
                            <td style="vertical-align: top;">
                                <order-info
                                        :item="props.item"
                                        @openProductDialog="openProductDialog"
                                ></order-info>
                            </td>
                            <td class="width-25" style="vertical-align: top;">
                                <div class="pa-1 text-left" style="max-height: 82px; overflow-y: auto;">
                                    <p class="ma-0 font-weight-bold">{{ props.item.delivery_name }}</p>
                                    <p class="ma-0">{{ props.item.delivery_street_address}}
                                        <span class="font-weight-medium">{{ props.item.delivery_country}}</span>, {{ props.item.delivery_postcode }}</p>
                                    <p class="ma-0 font-weight-bold">Tel: {{ props.item.customers_telephone }}</p>
                                </div>
                            </td>
                            <td>
                                <table-total :item="props.item"/>
                            </td>
                            <td style="width: 151px;">
                                <v-row v-if="props.item.date_purchased" style="min-width: 150px;" class="ma-0 pa-0 ml-1 Pending">
                                    <v-col cols="6" class="ma-0 pa-0 text-left">Purchased:</v-col>
                                    <v-col cols="6" class="ma-0 pa-0">{{ $moment(props.item.date_purchased).format('DD&nbsp;MMM&nbsp;YY') }}</v-col>
                                </v-row>
                                <v-row v-if="props.item.date_paid" style="min-width: 150px;" class="ma-0 pa-0 ml-1  Paid">
                                    <v-col cols="6" class="ma-0 pa-0 text-left">Paid:</v-col>
                                    <v-col cols="6" class="ma-0 pa-0">{{ $moment(props.item.date_paid).format('DD&nbsp;MMM&nbsp;YY') }}</v-col>
                                </v-row>
                                <v-row v-if="props.item.date_shipped" style="min-width: 150px;" class="ma-0 pa-0 ml-1  Delivered">
                                    <v-col cols="6" class="ma-0 pa-0 text-left">Shipped:</v-col>
                                    <v-col cols="6" class="ma-0 pa-0">{{ $moment(props.item.date_shipped).format('DD&nbsp;MMM&nbsp;YY') }}</v-col>
                                </v-row>
                                <v-row v-if="props.item.date_refund" style="min-width: 150px;" class="ma-0 pa-0 ml-1  Refunded">
                                    <v-col cols="6" class="ma-0 pa-0 text-left">Refunded:</v-col>
                                    <v-col cols="6" class="ma-0 pa-0">{{ $moment(props.item.date_refund).format('DD&nbsp;MMM&nbsp;YY') }}</v-col>
                                </v-row>
                            </td>
                            <td>
                               <span v-if="props.item.duty_date && props.item.duty_date.duty_date" class="pa-2">
                                    {{ $moment(props.item.duty_date.duty_date).format('DD&nbsp;MMM&nbsp;YY') }}
                                </span>
                            </td>
                            <td>
                                <span :class="props.item.orders_status_name.orders_status_name" class="pa-2">
                                    {{ props.item.orders_status_name.orders_status_name}}
                                </span>
                            </td>
                            <td>
                                 <span v-if="props.item.site" class="pa-2">
                                    {{  props.item.site.substring( props.item.site.indexOf("-") + 1)  }}
                                     <!--                            {{ props.item.site.split('-').pop() }}-->
                                </span>
                            </td>
                        </tr>
                    </template>

                    <template v-if="loading" v-slot:body.append>
                        <tr>
                            <td :colspan="headers.length+1" class="pa-0" style="height: 2px;"><v-progress-linear color="blue" :height="2" indeterminate></v-progress-linear></td>
                        </tr>
                    </template>

                </v-data-table>
                <div class="filters-wrapper">
                    <order-filters
                            :drawer="filterDrawer"
                            :filtersLength="filtersLength"
                            @closeMenu="closeFiltersMenu"
                            @filterOrders="filterOrders"
                            @clearFilters="clearFilters"/>
                </div>

            </v-col>
        </v-row>
        <custom-dialog :show="showOrderDialog"
                       :id="currentOrderId"
                       :title="currentOrderId ? currentOrderId : 'Order'"
                       @closeDialog="closeOrderDialog"
        >

            <template v-slot:content>
                <order :id="currentOrderId" :activeTab=activeOrderTab class="pa-2" :needLoadOrder="true"/>
            </template>
        </custom-dialog>

        <custom-dialog :show="showProductDialog"
                       :id="currentProduct.products_id"
                       :title="currentProduct.products_name ? currentProduct.products_id+ '-'+ currentProduct.products_name : `Product ${currentProduct.products_id}`"
                       @closeDialog="closeProductDialog"
        >

            <template v-slot:content>
                <single-product
                        :id="currentProduct.products_id"
                        class="pa-2">
                </single-product>
            </template>
        </custom-dialog>

        <scrollable-dialog :show="addNewOrderDialog" :fullscreen="false" :scrollable="true">
            <template v-slot:content>
                <new-order
                        @newOrderAdded="newOrderAdded"
                        @closeDialog="addNewOrderDialog = false"/>
            </template>
        </scrollable-dialog>
    </div>
</template>

<script>
    import ordersApi from '@/services/orders.api';
    import OrderFilters from './components/OrderFilters';
    import { mapActions, mapGetters } from 'vuex';
    import EventBus from "@/event-bus";
    import TableId from './components/TableId';
    import TableTotal from "./components/TableTotal";
    import OrderInfo from './components/OrderInfo';
    import CustomDialog from "@/components/CustomDialog";
    import ScrollableDialog from "@/components/ScrollableDialog";
    import Order from '@/pages/order/Order';
    import SingleProduct from '@/pages/Catalog/product/SingleProduct';
    import NewOrder from "./components/NewOrder";

    export default {
        name: "Orders",
        data: () => ({
            sortDesc: false,
            headers: [
                {
                    text: 'ID',
                    value: 'orders_id',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Order',
                    value: 'info',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Address',
                    value: 'address',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Total',
                    value: 'total',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Dates',
                    value: 'date_purchased',
                    align: 'center',
                    sortable: true,
                    width: '80px',
                },
                {
                    text: 'Duty',
                    value: 'duty_date',
                    align: 'center',
                    sortable: true,
                    width: '80px',
                },
                {
                    text: 'Status',
                    value: 'status',
                    align: 'center',
                    sortable: false,
                },
                {
                    text: 'Site',
                    value: 'site',
                    align: 'center',
                    sortable: false,
                },

            ],
            orders: [],
            options:{},
            totalOrders: 0,
            pagination: {
                descending: true,
                page: 1,
                rowsPerPage: 10,
                totalItems: 0,
                rowsPerPageItems: [10, 15, 20, 50, 100]
            },
            loading: false,
            filterDrawer: false,
            filtersLength: 0,
            ordersSearchType: "orderParams",
            orderDialog: false,
            filtersRequest: null,
            sortBy: ['date_purchased'],
            customProductDialog: false,
            selectedRow: null,
            tags: [],
            showOrderDialog: false,
            currentOrderId: null,
            currentOrder: null,
            activeOrderTab: null,
            showProductDialog: false,
            currentProduct: {
                products_id: null,
                products_name: null
            },
            addNewOrderDialog: false,
            needLoadOrder: true
        }),
        computed: {
            request: {
                get(){
                    let searchParam = {};
                    if(this.globalSearchParams && this.globalSearchParams[this.ordersSearchType]){
                        searchParam = this.globalSearchParams[this.ordersSearchType];
                        // console.log([this.ordersSearchType], this.globalSearchParams[this.ordersSearchType])
                    }

                    return{ ...searchParam, ...this.filtersRequest }
                },
                set(){
                    this.getDataFromApi()
                }

            },
            ...mapGetters([
                'globalSearchParams',
                'orders_statusesList',
                'order',
            ]),
        },
        mounted(){
            EventBus.$on('reloadOrders',  (type) => {
                this.ordersSearchType = type
                this.getDataFromApi()
            });

            this.initCategories()
        },
        watch: {
            options: {
                handler () {
                    // console.log(this.options);
                    this.getDataFromApi()
                },
                deep: true,
            },
        },
        methods:{
            async loadOrder(dialog){
                console.log('loadOrder')
                try {
                    await this.$store.dispatch('fetchOrder', this.currentOrderId)
                } catch (ex) {
                    console.log('loadOrder - error')
                } finally {
                    console.log('loadOrder - finally')
                    console.log(this.order)
                    this.currentOrder = this.order;
                    this[dialog] = true;
                }
            },
            async getDataFromApi(){
                this.loading = true;
                const response = await ordersApi.getOrdersFromApi(this.request, this.options)
                this.orders = response.data.data
                this.pagination.totalItems = response.data.total
                this.loading = false;
            },
            filterOrders({filledFilters}) {
                this.filtersLength = Object.keys(filledFilters).length
                let i = 0;
                let uri = {};
                if(Object.entries(filledFilters)){
                    this.tags = []
                    let tag_value = ''
                    for (const [key, value] of Object.entries(filledFilters)) {
                        // console.log(key, value)
                        if (key === 'orders_status') {
                            Object.keys(this.orders_statusesList).forEach(key => {
                                if (this.orders_statusesList[key].orders_status_id === value) tag_value = this.orders_statusesList[key].orders_status_name
                            });
                        }else if(key === 'date_purchased' || key === 'date_paid'){
                            tag_value = value.toString().replace(',', '-')
                        }else tag_value = value;

                        this.tags.push(tag_value);
                        if(key === 'date_paid' || key ==='date_purchased'){
                            if(value.length){
                                uri[`filterGroups[${i}][field]`]=key;
                                uri[`filterGroups[${i}][filters][0][value]`]=value[0]+' 00:00:00';
                                uri[`filterGroups[${i}][filters][0][condition]`]='GREATER_THAN_OR_EQUAL';
                                uri[`filterGroups[${i}][filters][0][type]`]='stringfilter';
                                uri[`filterGroups[${i}][filters][0][operator]`]='and';
                                uri[`filterGroups[${i}][filters][1][value]`]=value[1]+' 23:59:59';
                                uri[`filterGroups[${i}][filters][1][condition]`]='LESS_THAN_OR_EQUAL';
                                uri[`filterGroups[${i}][filters][1][type]`]='stringfilter';
                                uri[`filterGroups[${i}][filters][1][operator]`]='and';
                                uri[`filterGroups[${i}][operator]`]='and';
                                i++;
                            }
                        }else{
                            uri[`filterGroups[${i}][field]`]=key;
                            uri[`filterGroups[${i}][filters][0][value]`]=value;
                            uri[`filterGroups[${i}][filters][0][condition]`]='EQUAL';
                            uri[`filterGroups[${i}][filters][0][type]`]='numericfilter';
                            uri[`filterGroups[${i}][filters][0][operator]`]='or';
                            uri[`filterGroups[${i}][operator]`]='and';
                            i++;
                        }
                    }
                }

                this.filtersRequest = {...uri};

                this.getDataFromApi();
                this.closeFiltersMenu();

            },
            closeFiltersMenu(){
                this.filterDrawer = false;
            },
            clearFilters(){
                this.filtersLength = 0;
                this.closeFiltersMenu();
            },
            toggleSelectedRow: function (rowId) {
                this.selectedRow = rowId
            },
            openOrderDialog(orderId, activeTab = 'tab-order-info'){
                this.activeOrderTab = activeTab;
                this.currentOrderId = orderId;
                this.showOrderDialog = true;
            },

            closeOrderDialog(){
                this.showOrderDialog = false;
                this.currentOrderId = null;
                this.needLoadOrder = true;
                this.currentOrder = null;
            },
            openProductDialog(product){
                this.currentProduct = product;
                this.showProductDialog = true;
            },
            closeProductDialog(){
                this.showProductDialog = false;
                this.currentProduct = {
                    products_id: null,
                    products_name: null
                };
            },
            async newOrderAdded(newOrder){
                await this.newOrderAdd(newOrder);
                this.addNewOrderDialog= false;
                this.needLoadOrder = false;
                this.openOrderDialog(this.order.orders_id);
            },
            ...mapActions([
                "initCategories",
                "newOrderAdd"
            ]),

        },
        components:{
            OrderFilters,
            TableId,
            TableTotal,
            OrderInfo,
            ordersApi,
            CustomDialog,
            ScrollableDialog,
            Order,
            NewOrder,
            SingleProduct,
        },
    }
</script>

<style >

    .width-25{
        max-width: 24vw;
        min-width: 12vw;
    }

    .orders-table .v-data-footer {
        position: static;
    }

    .orders-table .v-data-table__wrapper {
        margin-bottom: 0;
        height: calc(100vh - 35px - 48px - 24px - 48px);
        overflow: auto;
    }


</style>