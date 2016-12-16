const pay = {


	getters: {
		all_channel: function(state, getters, rootState) {
			let temp = {};
			if (!rootState.isLoaded) {
				return temp;
			}
			temp = rootState.requireData.channel;
			return temp;
		},
		online_channel: function(state, getters, rootState) {
			let all_channel = getters.all_channel;
			let temp = {};

			temp = Vue.util.extend({}, all_channel);
			delete temp.cash;
			return temp;
		},
		offline_channel: function(state, getters, rootState) {
			let all_channel = getters.all_channel;
			let temp = {};

			if (all_channel.cash) {
				temp.cash = all_channel.cash;
			}
			return temp;
		}
	}
};

module.exports = pay;
