const getters = {
    groupsMap(state, getters) {
        if (!state.isLoaded) {
            return {};
        } else {
            let temp = {};
            state.requireData.menu.groups.forEach(function(group) {
                temp[group.id] = group;
            });
            return temp;
        }
    }
}

module.exports = getters;
