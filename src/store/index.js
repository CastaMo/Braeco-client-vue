const state = require("./state.js");
const getters = require("./getters.js");
const mutations = require("./mutations.js");
const actions = require("./actions.js");

// const Vuex = require("vuex");
Vue.use(Vuex);

const category = require("./modules/category.js");
const activity = require("./modules/activity.js");
const header = require("./modules/header.js");
const food = require("./modules/food.js");
const property = require("./modules/property.js");
const combo = require("./modules/combo.js");
const comboDelete = require("./modules/combo-delete.js");
const order = require("./modules/order.js");
const user = require("./modules/user.js");

const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    modules: {
        category: category,
        activity: activity,
        header: header,
        food: food,
        property: property,
        combo: combo,
        comboDelete: comboDelete,
        order: order,
        user: user
    }
});

module.exports = store;
