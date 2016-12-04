const getters = {
    groupsMap(state, getters) {
        let temp = {};
        if (!state.isLoaded) {
            return temp;
        }
        state.requireData.menu.groups.forEach(function(group) {
            temp[group.id] = group;
        });
        return temp;
    },
    dishMap(state, getters) {
        let temp = {};
        if (!state.isLoaded) {
            return temp;
        }
        state.requireData.menu.categories.forEach(function(category) {
            category.dishes.forEach(function(dish) {
                temp[dish.id] = dish;
            });
        });
        return temp;
    }
}

module.exports = getters;
