const state = require("./state.js");
const getters = require("./getters.js");
const mutations = require("./mutations.js");
const actions = require("./actions.js");


const Vue = require("vue");
// const Vuex = require("vuex");
Vue.use(Vuex);

const category = require("./modules/category.js");
const activity = require("./modules/activity.js");
const header = require("./modules/header.js");
const food = require("./modules/food.js");
const property = require("./modules/property.js");
const combo = require("./modules/combo.js");

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
        combo: combo
    }
});

module.exports = store;
