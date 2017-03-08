const actions = {
    getData(context, payload) {
        setTimeout(function() {
            context.commit('getData', payload);
        }, 200);
    },
    updateOrder(context, payload) {
    	context.commit('updateOrder', payload);
    }
};

module.exports = actions;
