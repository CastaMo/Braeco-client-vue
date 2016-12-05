const food = {

    state: {
        currentCategoryId: -1
    },

    getters: {
        currentFoodItems: function(state, getters, rootState) {
            let result = [];
            if (
                !rootState.isLoaded
            ||  state.currentCategoryId === -1
            ) {
                return result;
            }
            rootState.requireData.menu.categories.every(function(category) {
                if (Number(category.id) === Number(state.currentCategoryId)) {
                    category.dishes.every(function(dish) {
                        if (dish.dc_type === "combo_only") {
                            return true;
                        }
                        let temp = Braeco.utils.food.getFixedDataForFood(
                            dish,
                            getters.groupsMap,
                            rootState.requireData.dish_limit
                        );
                        result.push(temp);
                        return true;
                    });
                    return false;
                }
                return true;
            });
            return result;
        },
        currentFoodInfoItem: function(state, getters, rootState) {
            let temp = {
                inValid: true
            };
            if (!rootState.isLoaded) {
                return temp;
            }
            let foodId = Number(rootState.route.params.foodId);
            let flag = false;
            if (foodId === 0 || foodId) {
                rootState.requireData.menu.categories.every(function(category) {
                    category.dishes.every(function(dish) {
                        if (Number(dish.id) === foodId) {
                            temp = Braeco.utils.food.getFixedDataForFood(
                                dish,
                                getters.groupsMap,
                                rootState.requireData.dish_limit
                            );
                            temp.isViewInfo = true;
                            temp.inValid = false;
                            flag = true;
                            return false;
                        }
                        return true;
                    });
                    if (flag) {
                        return false;
                    }
                    return true;
                });
            }
            return temp;
        }
    },

    mutations: {
        "food:updateCurrentCategoryId": function(state, playload) {
            state.currentCategoryId = playload.categoryId;
        }
    },

    actions: {
        "food:updateCurrentCategoryId": function(context, playload) {
            context.commit("food:updateCurrentCategoryId", {
                categoryId: -1
            });
            setTimeout(function() {
                context.commit("food:updateCurrentCategoryId", playload);
            }, 200);
        }
    }

};

module.exports = food;
