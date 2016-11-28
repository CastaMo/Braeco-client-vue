const order = {
    getFixedDataForOrder(food, groups, num, extras) {
        let temp = {};
        temp.id = food.id;
        temp.name = food.name;
        temp.dcStr = food.dcStr;
        temp.tag = food.tag;
        temp.type = food.type;
        temp.groups = groups;
        temp.num = num;
        temp.dc_type = food.dc_type;
        temp.dc = food.dc;
        if (temp.type === 'normal' && groups && groups.length > 0) {
            temp.price += Braeco.utils.property.getDiffPriceByChoose(groups, extras);
            temp.chooseInfo = Braeco.utils.property.getInfoArrayByChoose(groups, extras).join("、");
        } else if (temp.type !== 'normal' && groups && groups.length > 0) {
            temp.comboChooseInfoArray = [];
            extras.forEach(function(extra) {
                let comboChooseInfoItem = {};
                comboChooseInfoItem.name = extra.food.name;
                comboChooseInfoItem.num = extra.num;
                if (extra.groups && extra.groups.length > 0) {
                    comboChooseInfoItem.chooseInfo = Braeco.utils.property.getInfoArrayByChoose(extra.groups, extra.foodProperty.properties).join("、");
                }
                temp.comboChooseInfoArray.push(comboChooseInfoItem);
            });
        }
        return temp;
    },
    tryGetFoodItemByFoodId(Items, foodId, isExtend) {
        let temp = null;
        Items.every(function(orderItem) {
            if (Number(foodId) === Number(orderItem.id)) {
                temp = orderItem;
                return false;
            }
            return true;
        });

        // 若找不到则新建一个
        if (!temp && isExtend) {
            Items.push(temp = {
                id: foodId,
                subItems: []
            });
        }
        return temp;
    },
    tryGetSubItemByGroups(subItems, groups, isExtend, orderInitPrice) {
        let temp = null;
        subItems.forEach(function(subItem) {
            // 若为普通单品或者groups项相同，则匹配成功
            if (
                !groups
            ||  JSON.stringify(subItem.groups) === JSON.stringify(groups)
            ) {
                temp = subItem;
                return null;
            }
        });
        // 若找不到则新建一个
        if (!temp && isExtend) {
            temp = {
                num: 0,
                groups: groups
            };
            if (typeof orderInitPrice === 'number') {
                temp.orderInitPrice = orderInitPrice;
            }
            subItems.push(temp);
        }
        return temp;
    }
}

module.exports = order;
