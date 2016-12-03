const state = require("./state.js");
const getters = require("./getters.js");
const mutations = require("./mutations.js");
const actions = require("./actions.js");


import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex);

const category = require("./modules/category.js");

const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions,
    modules: {
        category: category
    }
});

module.exports = store;
