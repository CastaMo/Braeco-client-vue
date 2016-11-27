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
    adjustItemByCombo(item, subItemIndex, comboItem, groupsMap, dishLimit) {
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
                    item.dc = subItem.discount;
                    break;
            }
        }
        item.chooseAllFirstPrice = Braeco.utils.food.getChooseAllFirstPrice(item, groupsMap);
        item.currentPrice = Braeco.utils.food.getPriceByDcTypeAndDc(item.chooseAllFirstPrice, item.dc_type, item.dc);
        item.dcStr = Braeco.utils.food.getDcForFood(item, dishLimit);
    },
    getPriceForCombo(combo, chooseAllInfoForFood) {
        let price;
        switch (combo.type) {
            // 只算default_price和diff
            case "combo_static":
                price = combo.default_price;
                chooseAllInfoForFood.forEach(function(chooseAllInfoFoodList) {
                    chooseAllInfoFoodList.forEach(function(chooseAllInfoForFood) {
                        if (chooseAllInfoForFood.diff) {
                            price += chooseAllInfoForFood.diff * chooseAllInfoForFood.num
                        }
                    });
                });
                break;
            case "combo_sum":
                price = 0;
                chooseAllInfoForFood.forEach(function(chooseAllInfoFoodList) {
                    chooseAllInfoFoodList.forEach(function(chooseAllInfoForFood) {
                        let foodPrice = chooseAllInfoForFood.default_price;
                        if (chooseAllInfoForFood.diff) {
                            foodPrice += chooseAllInfoForFood.diff;
                        }
                        price += Braeco.utils.food.getPriceByDcTypeAndDc(foodPrice, chooseAllInfoForFood.dc_type, chooseAllInfoForFood.dc);
                    });
                });
                break;
            default:
                price = 0;
                break;
        }
        return price;
    }
};

module.exports = combo;
