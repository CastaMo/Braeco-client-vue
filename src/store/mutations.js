const mutations = {
    getData(state, payload) {
        state.requireData = payload.requireData;
        state.isLoaded = true;
    }
};

module.exports = mutations;
