const food = {

    state: {
        currentCategoryId: -1
    },

    getters: {
        currentFoodItems: function(state, getters, rootState) {
            if (
                !rootState.isLoaded
            ||  state.currentCategoryId === -1
            ) {
                return [];
            }
            let result = [];
            rootState.requireData.menu.categories.every(function(category) {
                if (Number(category.id) === Number(state.currentCategoryId)) {
                    category.dishes.every(function(dish) {
                        if (dish.dc_type === "combo_only") {
                            return true;
                        }
                        let temp = Braeco.utils.food.getFixedDataForFood(dish, getters.groupsMap, rootState.requireData.dish_limit);
                        result.push(temp);
                        return true;
                    });
                    return false;
                }
                return true;
            });
            return result;
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
