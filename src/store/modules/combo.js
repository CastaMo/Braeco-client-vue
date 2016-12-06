const combo = {

    state: {
        allFoodChooseOptions: []
    },

    getters: {
        currentComboItem: function(state, getters, rootState) {
            let temp = {
                inValid: true
            };
            if (!rootState.isLoaded) {
                return temp;
            }
            let comboId = Number(rootState.route.params.comboId);
            let flag = false;
            if (comboId === 0 || comboId) {
                let dish = getters.dishMap[comboId];
                temp = Braeco.utils.combo.getFixedDataForCombo(dish, getters.groupsMap);
                temp.inValid = false;
                temp.combos.forEach(function(comboSubItem, subItemIndex) {

                    // 存储每一个子项的餐品
                    comboSubItem.foodItems = [];
                    comboSubItem.content.forEach(function(foodId) {
                        let dish = getters.dishMap[foodId];
                        let food = Braeco.utils.food.getFixedDataForFood(
                            dish,
                            getters.groupsMap,
                            rootState.requireData.dish_limit
                        );
                        food.lastNoBottom = true;

                        // 将套餐的优惠传递进去
                        Braeco.utils.combo.adjustItemByCombo(
                            food,
                            subItemIndex,
                            temp,
                            getters.groupsMap,
                            rootState.requireData.dish_limit
                        );

                        comboSubItem.foodItems.push(food);
                    });
                });
            }
            return temp;
        },

        // 用于使选项与food顺序对齐
        comboChooseOptionsArray: function(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return [[]];
            }
            let temp = [];
            state.allFoodChooseOptions.forEach(function(foodListOption) {
                let foodListTemp = [];
                foodListOption.forEach(function(foodItem) {
                    foodItem.subItems.forEach(function(subItem) {
                        let chooseTemp = {
                            id: foodItem.id,
                            num: subItem.num
                        };
                        if (subItem.groups && subItem.groups.length > 0) {
                            chooseTemp.groups = subItem.groups;
                        }
                        foodListTemp.push(chooseTemp);
                    });
                });
                temp.push(foodListTemp);
            });
            return temp;
        },

        // 用于存储每个餐品的数量
        chooseNumForFood: function(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return [[{num: 0}]];
            }
            let temp = [];
            state.allFoodChooseOptions.forEach(function(foodListOption) {
                let numListTemp = [];
                foodListOption.forEach(function(foodItem) {
                    let num = 0;
                    foodItem.subItems.forEach(function(subItem) {
                        num += subItem.num;
                    });
                    numListTemp.push(num);
                });
                temp.push(numListTemp);
            });
            return temp;
        },

        // 用于显示每一个food的选择信息，以及价格的更新
        chooseAllInfoForFood(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return [];
            }
            let temp = [];
            getters.comboChooseOptionsArray.forEach(function(foodList, index) {
                let infoListTemp = [];
                foodList.forEach(function(foodItem) {
                    let dish = getters.dishMap[foodItem.id];
                    let foodProperty = Braeco.utils.property.getFixedDataForProperty(
                        dish,
                        getters.groupsMap
                    );

                    Braeco.utils.combo.adjustItemByCombo(
                        foodProperty,
                        index,
                        getters.currentComboItem,
                        getters.groupsMap,
                        rootState.requireData.dish_limit
                    );

                    let infoTemp = {
                        name: dish.name,
                        num: foodItem.num
                    };
                    infoTemp.default_price = foodProperty.default_price;
                    infoTemp.dc_type = foodProperty.dc_type;
                    infoTemp.dc = foodProperty.dc;
                    if (foodItem.groups && foodItem.groups.length > 0) {
                        infoTemp.propertyInfo = Braeco.utils.property.getInfoArrayByChoose(
                            foodItem.groups,
                            foodProperty.properties
                        ).join("、");
                        infoTemp.diff = Braeco.utils.property.getDiffPriceByChoose(
                            foodItem.groups,
                            foodProperty.properties
                        );
                    }
                    infoListTemp.push(infoTemp);
                });
                temp.push(infoListTemp);
            });
            return temp;
        },

        totalPriceForCombo(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return 0;
            }
            let price = Braeco.utils.combo.getPriceForCombo(
                getters.currentComboItem,
                getters.chooseAllInfoForFood
            );
            return price;
        }
    },
    mutations: {
        "combo:initAllChooseByCombos": function(state, playload) {
            state.allFoodChooseOptions = [];
            if (!playload.combos || playload.combos.length === 0) {
                return;
            }
            playload.combos.forEach(function(comboSubItem) {
                let optionSubItem = [];
                comboSubItem.content.forEach(function(foodId) {
                    optionSubItem.push({
                        id: foodId,
                        subItems: []
                    });
                });
                state.allFoodChooseOptions.push(optionSubItem);
            });
        },
        "combo:addChoose": function(state, playload) {
            let index = playload.currentActiveIndex;
            let foodItem = Braeco.utils.order.tryGetFoodItemByFoodId(
                state.allFoodChooseOptions[index],
                playload.id
            );
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(
                foodItem.subItems,
                playload.groups,
                true
            );
            subItem.num += 1;
        },
        "combo:minusChoose": function(state, playload) {
            let index = playload.currentActiveIndex;
            let foodItem = Braeco.utils.order.tryGetFoodItemByFoodId(
                state.allFoodChooseOptions[index],
                playload.id
            );
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(
                foodItem.subItems,
                playload.groups
            );
            if (subItem.num <= 0) {
                return;
            }
            subItem.num -= 1;
            if (subItem.num <= 0) {
                let subItemIndex = foodItem.subItems.indexOf(subItem);
                foodItem.subItems.splice(subItemIndex, 1);
            }
        }
    },
    actions: {
        "combo:initCombo": function(context, playload) {
            context.commit("combo:initAllChooseByCombos", {
                combos: context.getters.currentComboItem.combos
            });
        }
    }


};

module.exports = combo;
