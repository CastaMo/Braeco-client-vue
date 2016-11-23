const combo = {
    getFixedDataForCombo(dish, groupsMap) {
        let temp = {};
        temp.able = dish.able;
        temp.default_price = dish.default_price;
        temp.type = dish.type;
        temp.name = dish.name;
        temp.require = dish.require;
        temp.combos = [];
        dish.groups.forEach(function(groupId) {
            let comboSubItem = {};
            let groupOption = groupsMap[groupId];
            comboSubItem.type = groupOption.type;
            if (comboSubItem.type === 'discount_combo') {
                comboSubItem.discount = groupOption.discount;
            } else {
                comboSubItem.price = groupOption.price;
            }
            comboSubItem.content = groupOption.content;
            temp.combos.push(comboSubItem);
        });
        return temp;
    }
};

module.exports = combo;
