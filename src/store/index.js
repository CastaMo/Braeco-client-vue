const state = require("./state.js");
const getters = require("./getters.js");
const mutations = require("./mutations.js");
const actions = require("./actions.js");


const Vue = require("vue");
const Vuex = require("vuex");
Vue.use(Vuex);

const category = require("./modules/category.js");
const activity = require("./modules/activity.js");

const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    modules: {
        category,
        activity
    }
});

module.exports = store;
