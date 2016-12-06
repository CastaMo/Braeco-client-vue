const property = {
    state: {
        currentFoodId: -1,
        chooseArray: [],
        showFlag: false,
        comboItem: null,
        currentActiveIndex: null
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
            if (state.comboItem) {
                Braeco.utils.combo.adjustItemByCombo(
                    temp,
                    state.currentActiveIndex,
                    state.comboItem,
                    getters.groupsMap,
                    rootState.requireData.dish_limit
                );
            }
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
            state.chooseArray.splice(chooseIndex, 1, itemIndex);
        },
        "property:setAdjustConfig": function(state, playload) {
            state.comboItem = playload.comboItem;
            state.currentActiveIndex = playload.currentActiveIndex;
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
            if (playload.comboItem) {
                context.commit("property:setAdjustConfig", {
                    comboItem: playload.comboItem,
                    currentActiveIndex: playload.currentActiveIndex
                });
            }
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
            context.commit("property:setAdjustConfig", {
                comboItem: null,
                currentActiveIndex: null
            });
        }
    }
};

module.exports = property;
