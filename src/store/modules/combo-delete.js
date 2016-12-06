const comboDelete = {
    state: {
        currentFoodId: -1,
        chooseIndex: -1,
        showFlag: false,
        comboItem: null,
        currentActiveIndex: null,
        subItems: null
    },

    getters: {
        currentComboDeleteItem: function(state, getters, rootState) {
            let temp = {deleteItems: []};
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

            let foodProperty = Braeco.utils.property.getFixedDataForProperty(
                dish,
                getters.groupsMap
            );

            temp.id = state.currentFoodId;
            temp.name = foodProperty.name;

            // 将套餐的优惠传递进去
            Braeco.utils.combo.adjustItemByCombo(
                foodProperty,
                state.currentActiveIndex,
                state.comboItem,
                getters.groupsMap,
                rootState.requireData.dish_limit
            );

            state.subItems.forEach(function(subItem) {
                let propertyInfo = Braeco.utils.property.getInfoArrayByChoose(
                    subItem.groups,
                    foodProperty.properties
                ).join("、");
                let diffPrice = Braeco.utils.property.getDiffPriceByChoose(
                    subItem.groups,
                    foodProperty.properties
                );
                temp.deleteItems.push({
                    groups: subItem.groups,
                    price: diffPrice + foodProperty.default_price,
                    propertyInfo: propertyInfo
                });
            });
            return temp;
        }
    },

    mutations: {
        "combo-delete:updateFoodId": function(state, playload) {
            state.currentFoodId = playload.foodId;
        },
        "combo-delete:setShowFlag": function(state, playload) {
            state.showFlag = playload.showFlag;
        },
        "combo-delete:setAdjustConfig": function(state, playload) {
            state.comboItem = playload.comboItem;
            state.currentActiveIndex = playload.currentActiveIndex;
            state.subItems = playload.subItems;
        },
        "combo-delete:setChoose": function(state, playload) {
            state.chooseIndex = playload.chooseIndex;
        }
    },
    actions: {
        "combo-delete:startComboDelete": function(context, playload) {
            context.commit("combo-delete:updateFoodId", {
                foodId: playload.foodId
            });
            context.commit("combo-delete:setShowFlag", {
                showFlag: true
            });
            context.commit("combo-delete:setAdjustConfig", {
                comboItem: playload.comboItem,
                currentActiveIndex: playload.currentActiveIndex,
                subItems: playload.subItems
            });
            context.commit("combo-delete:setChoose", {
                chooseIndex: 0
            });
        },
        "combo-delete:endComboDelete": function(context, playload) {
            context.commit("combo-delete:updateFoodId", {
                foodId: -1
            });
            context.commit("combo-delete:setShowFlag", {
                showFlag: false
            });
            context.commit("combo-delete:setAdjustConfig", {
                comboItem: null,
                currentActiveIndex: null,
                subItems: null
            });
        }
    }
};

module.exports = comboDelete;
