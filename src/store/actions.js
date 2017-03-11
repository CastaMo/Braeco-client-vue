const actions = {
    getData(context, payload) {
        setTimeout(function() {
            context.commit('getData', payload);
        }, 200);
    }
};

module.exports = actions;
