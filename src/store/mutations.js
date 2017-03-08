const mutations = {
    getData(state, payload) {
        state.requireData = payload.requireData;
        state.isLoaded = true;
    },
    updateOrder(state, payload) {
    	state.requireData.order_for_already = payload.order_for_already;
    }
};

module.exports = mutations;
