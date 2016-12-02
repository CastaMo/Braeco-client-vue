let Vuex = require("Vuex");


const state = require("./state.js");
const getters = require("./getters.js");
const mutations = require("./mutations.js");
const actions = require("./actions.js");

const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    actions: actions
});

module.exports = store;
