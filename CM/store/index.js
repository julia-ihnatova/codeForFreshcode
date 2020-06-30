import Vue from 'vue'
import Vuex from "vuex"
import order from './order'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        order,
        main: {
            state: {
                user: {
                    name: null,
                    email: null
                },
                debug: true,
                count: 0,
                ebay_global_sites: {
                    0 : { country: 'United States', name: 'us', value: 0, icon: '/images/flags/1x1/us.svg'},
                    3 : { country: 'UK', name: 'gb', value: 3, icon: '/images/flags/1x1/gb.svg'},
                    77 : { country: 'Germany', name: 'de', value: 77, icon: '/images/flags/1x1/de.svg'},
                    71 : { country: 'France', name: 'fr', value: 71, icon: '/images/flags/1x1/fr.svg'},
                    101 : { country: 'Italy', name: 'it', value: 101, icon: '/images/flags/1x1/it.svg'},
                    186 : { country: 'Spain', name: 'es', value: 186, icon: '/images/flags/1x1/es.svg'}
                },
                currencies: [],
                initialCurrencies: null,
                countries:  null,
                orders_statuses: null,
                paymentMethods: [
                    "PayPal",
                    "BankTransfer",
                    "Cash"
                ],
                auction_accounts: [
                    {text: 'aukro.cz-photo-vision', value: 'aukro.cz-photo-vision'},
                    {text: 'CM', value: 'CM'},
                    {text: 'ebay.com-camexpres', value: 'ebay.com-camexpres'},
                    {text: 'ebay.com-eu-tradefactor', value: 'ebay.com-eu-tradefactor'},
                    {text: 'ebay.com-kinoptik-hk', value: 'ebay.com-kinoptik-hk'},
                    {text: 'ebay.com-leica-post', value: 'ebay.com-leica-post'},
                    {text: 'ebay.com-user13867742', value: 'ebay.com-user13867742'},
                    {text: 'ebay.de-camexpres', value: 'ebay.de-camexpres'},
                    {text: 'ebay.de-leica-post', value: 'ebay.de-leica-post'},
                    {text: 'ebay.fr-camexpres', value: 'ebay.fr-camexpres'},
                    {text: 'molotok.ru-trade-partner', value: 'molotok.ru-trade-partner'},
                ],
                productCategories: null,
                productOptions: null,
                globalSearchParams: null,
            },
            mutations: {
                updateTokens(state, tokens){
                    state.tokens = tokens
                },
                updateCurrentUser(state, currentUser){
                    state.user = currentUser
                },
                setCountriesAction (state, newValue) {
                    if (this.debug) { console.log('setMessageAction triggered with', newValue)}
                    state.countries = newValue
                },
                clearCountriesAction () {
                    if (this.debug) {console.log('clearMessageAction triggered')}
                    state.countries = ''
                },
                setUser(state, userData){
                    if(userData){
                        state.user = userData
                    }
                },
                setCurrencies(state, currenciesArr){
                    state.initialCurrencies = currenciesArr
                    state.currencies = _.map(currenciesArr, 'code')
                },
                setCountries(state, countriesArr){
                    state.countries = countriesArr
                },
                setStatuses(state, statusesArr){
                    state.orders_statuses = statusesArr
                },
                setProductOptions(state, optionsArr){
                    let productOptions = _.keyBy(optionsArr, 'products_options_id');
                    productOptions = _.forEach(productOptions, function(element) {
                        element.options_value = _.sortBy(element.options_value, ['products_options_values_order', 'asc'])
                    });

                    state.productOptions = productOptions
                },
                setProductCategories(state, categoriesArr){
                    state.productCategories = categoriesArr
                },
                setGlobalSearchParams(state, searchParamsObj){
                    state.globalSearchParams = searchParamsObj
                }
            },
            getters:{
                currenciesList: state =>  state.currencies,
                initialCurrencies: state => state.initialCurrencies,
                countriesList: state => state.countries,
                orders_statusesList: state => state.orders_statuses,
                ebay_global_sites: state => state.ebay_global_sites,
                paymentMethods: state => state.paymentMethods,
                auction_accounts: state => state.auction_accounts,
                productCategories: state => state.productCategories,
                productOptions: state => state.productOptions,
                globalSearchParams: state => state.globalSearchParams,
            },
            actions:{
                initCurrencies(context){
                    return axios
                        .get('/api/currencies')
                        .then(response => {
                                context.commit('setCurrencies', response.data)
                            }
                        )
                },
                initCountries(context) {
                    return axios
                        .get('/api/countries')
                        .then(response => {
                            context.commit('setCountries', response.data)
                        }).catch(err => {
                            console.log(err)
                        })
                },
                initStatuses(context) {
                    return axios
                        .get('/api/order_statuses')
                        .then(response => {
                            context.commit('setStatuses', response.data)
                        }).catch(err => {
                            console.log(err)
                        })
                },
                getCurrentUser(context, user) {
                    return new Promise((resolve, reject ) => {
                        axios.get('/api/user', data)
                            .then(response => {
                                let responseData = response.data
                                context.commit('updateCurrentUser', responseData)
                                resolve(response)
                            })
                            .catch(response => {
                                reject(response)
                            })
                    })
                },
                initCategories({ dispatch, commit }){
                    return axios
                        .get('/api/category?pagesize=10000')
                        .then(response => {
                            let categoriesArr = []
                            let categoriesArrData = response.data.data;

                            let tree = function (data, root) {
                                let r = [], o = {};
                                data.forEach(function (a) {

                                    a.categories_id = parseFloat(a.categories_id)
                                    a.parent_id = parseFloat(a.parent_id)

                                    if (o[a.categories_id] && o[a.categories_id].children) {
                                        a.children = o[a.categories_id] && o[a.categories_id].children;
                                    }
                                    o[a.categories_id] = a;
                                    if (a.parent_id === root) {
                                        r.push(a);
                                    } else {
                                        o[a.parent_id] = o[a.parent_id] || {};
                                        o[a.parent_id].children = o[a.parent_id].children || [];
                                        o[a.parent_id].children.push(a);
                                    }
                                });
                                return r;
                            }(categoriesArrData, 0);

                            commit('setProductCategories',tree)

                            })
                },
                initProductOptions(context){
                    return axios.get('/api/products_option?pagesize=10000&with[]=options_value')
                        .then(response => {
                            context.commit('setProductOptions', response.data.data)
                        })
                },
                saveSearchRequest(context, searchParamsObj){
                    context.commit('setGlobalSearchParams', searchParamsObj)
                }

            }

        }
    },

});

export default store