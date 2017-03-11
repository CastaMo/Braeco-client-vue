const mutations = {
    getData(state, payload) {
        state.requireData = payload.requireData;
        state.isLoaded = true;
    },
    updateRequireData(state, payload) {
    	for (var key in payload) {
    		state.requireData[key] = payload[key];
    	}
    }
};

module.exports = mutations;
