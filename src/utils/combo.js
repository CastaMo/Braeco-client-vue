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
            comboSubItem.name = groupOption.name;
            if (comboSubItem.type === 'discount_combo') {
                comboSubItem.discount = groupOption.discount;
            } else {
                comboSubItem.price = groupOption.price;
            }
            comboSubItem.content = groupOption.content;
            temp.combos.push(comboSubItem);
        });
        return temp;
    },
    adjustItemByCombo(item, subItemIndex, comboItem) {
        if (comboItem.type === "combo_static") {
            item.dc_type = "combo_static";
            item.dc = 0;
            item.default_price = 0;
        } else {
            let subItem = comboItem.combos[subItemIndex];
            switch (subItem.type) {
                case "static_combo":
                    item.default_price = subItem.price;
                    item.dc_type = "static_combo";
                    item.dc = 0;
                    break;
                case "discount_combo":
                default:
                    item.dc_type = "discount_combo";
                    item.dc = subItem.discount_combo;
                    break;
            }
        }
    }
};

module.exports = combo;
