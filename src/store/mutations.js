const mutations = {
    "get-data": function(state, payload) {
        state.requireData = payload.requireData;
        state.isLoaded = true;
    },
    "update-require-data": function(state, payload) {
    	for (var key in payload) {
    		state.requireData[key] = payload[key];
    	}
    }
};

module.exports = mutations;
