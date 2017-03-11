const actions = {
    "get-data": function(context, payload) {
        setTimeout(function() {
            context.commit('get-data', payload);
        }, 200);
    }
};

module.exports = actions;
