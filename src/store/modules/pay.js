const pay = {


	getters: {
		online_channel: function(state, getters, rootState) {
			let temp = {};
			if (!rootState.isLoaded) {
				return temp;
			}
			let channel = rootState.requireData.channel;
			temp = Vue.util.extend({}, channel);
			delete temp.cash;
			return temp;
		}
	}
};

module.exports = pay;
