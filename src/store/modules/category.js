const category = {
    state: {
        isLoaded: false
    },
    getters: {
        categoryItems(state, getters, rootState) {
            console.log(arguments);
            if (!rootState.isLoaded) {
                return [];
            } else {
                let result = [];
                for (let i = 0, len = rootState.requireData.menu.categories.length; i < len; i++) {
                    let category = rootState.requireData.menu.categories[i];
                    if (!category.display_flag) {
                        continue;
                    }
                    let temp = Braeco.utils.category.getFixedDataForCategory(category);
                    result.push(temp);
                }
                return result;
            }
        }
    }
};

module.exports = category;
