const category = {
    getters: {
        currentCategoryItem(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return {};
            }
            let categoryId = Number(rootState.route.params.categoryId);
            let temp = {
                inValid: true
            };
            if (categoryId === 0 || categoryId) {
                rootState.requireData.menu.categories.every(function(category) {
                    if (Number(category.id) !== categoryId) {
                        return true;
                    }
                    temp = Braeco.utils.category.getFixedDataForCategory(category);
                    temp.inValid = false;
                    return false;
                });
            }
            return temp;
        },
        categoryItems(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return [];
            }
            let result = [];
            rootState.requireData.menu.categories.every(function(category) {
                if (!category.display_flag) {
                    return true;
                }
                let temp = Braeco.utils.category.getFixedDataForCategory(category);
                result.push(temp);
                return true;
            });
            return result;
        }
    }
};

module.exports = category;
