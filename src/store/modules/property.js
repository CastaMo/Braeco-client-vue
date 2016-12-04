const property = {
    state: {
        currentFoodId: -1,
        chooseArray: []
    },
    getters: {
        currentFoodProperty: function(state, getters, rootState) {
            let temp = {properties: []};
            if (
                !rootState.isLoaded
            ||  state.currentFoodId === -1
            ) {
                return temp;
            }
            let dish = getters.dishMap[state.currentFoodId];
            if (!dish) {
                return temp;
            }
            temp = Braeco.utils.property.getFixedDataForProperty(dish, getters.groupsMap);
            return temp;
        },
        chooseInfo: function() {

        },
        initPrice: function() {

        },
        currentPrice: function() {

        }
    },
    mutations: {
        "property:updateFoodId": function(state, playload) {
            state.currentFoodId = playload.foodId;
        }
    }
};

module.exports = property;
