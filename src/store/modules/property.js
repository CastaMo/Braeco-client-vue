const property = {
    state: {
        currentFoodId: -1,
        chooseArray: [],
        showFlag: false
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
            temp = Braeco.utils.property.getFixedDataForProperty(
                dish,
                getters.groupsMap
            );
            return temp;
        },
        chooseInfo: function(state, getters, rootState) {
            let infoArray = Braeco.utils.property.getInfoArrayByChoose(
                state.chooseArray,
                getters.currentFoodProperty.properties
            );
            return infoArray.join("、");
        },
        initPrice: function(state, getters, rootState) {
            let price = getters.currentFoodProperty.default_price;
            price += Braeco.utils.property.getDiffPriceByChoose(
                state.chooseArray,
                getters.currentFoodProperty.properties
            );
            return price;
        },
        currentPrice: function(state, getters, rootState) {
            let initPrice = getters.initPrice;
            let dc_type = getters.currentFoodProperty.dc_type;
            let dc = getters.currentFoodProperty.dc;
            return Braeco.utils.food.getPriceByDcTypeAndDc(initPrice, dc_type, dc);
        }
    },
    mutations: {
        "property:updateFoodId": function(state, playload) {
            state.currentFoodId = playload.foodId;
        },
        "property:initChooseArray": function(state, playload) {
            state.chooseArray = Array(playload.chooseArrayLen).fill(0);
        },
        "property:setShowFlag": function(state, playload) {
            state.showFlag = playload.showFlag;
        },
        "property:setChoose": function(state, playload) {
            let chooseIndex = playload.chooseIndex;
            let itemIndex = playload.itemIndex;
            state.chooseArray[chooseIndex] = itemIndex;
            state.chooseArray.splice(chooseIndex, 1, itemIndex);
        }
    },
    actions: {
        "property:startFoodProperty": function(context, playload) {
            context.commit("property:updateFoodId", {
                foodId: playload.foodId
            });
            context.commit("property:initChooseArray", {
                chooseArrayLen: playload.chooseArrayLen
            });
            context.commit("property:setShowFlag", {
                showFlag: true
            });
        },
        "property:endFoodProperty": function(context, playload) {
            context.commit("property:updateFoodId", {
                foodId: -1
            });
            context.commit("property:initChooseArray", {
                chooseArrayLen: 0
            });
            context.commit("property:setShowFlag", {
                showFlag: false
            });
        }
    }
};

module.exports = property;
