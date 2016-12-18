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
        Items.every(function(item) {
            if (Number(foodId) === Number(item.id)) {
                temp = item;
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
    },
    getDiscountForOrderItem(orderItem, dish, rank_info) {
        function getUserDiscount(price, num, rank_info) {
            if (rank_info && rank_info.discount > 0) {
                return {
                    type: "userDiscount",
                    value: num * price * (100 - rank_info.discount) / 100
                };
            }
            return {
                value: 0
            };
        }
        // 第二杯半价
        if (dish.dc_type === 'half') {
            if (
                orderItem.subItems.length === 1
            &&  orderItem.subItems[0].num === 1
            ) {
                return getUserDiscount(orderItem.subItems[0].orderInitPrice, 1, rank_info);
            }
            // 将所有价格都塞到一个容器中准备排序进行计算第二杯半价优惠
            let temp = [];
            orderItem.subItems.forEach(function(subItem) {
                temp = temp.concat(Array(subItem.num).fill(subItem.orderInitPrice));
            });

            // 取最高的前半段
            temp.sort(function(a, b) {
                return b - a;
            });
            let value = 0;
            let middle = Math.floor(temp.length / 2);
            for (let i = 0, len = middle; i < len; i++) {
                value += (temp[i] / 2);
            }
            return {
                type: "half",
                value: value
            };
        }
        if (dish.dc_type === 'sale') {
            let value = 0;
            orderItem.subItems.forEach(function(subItem) {
                value += dish.dc * subItem.num;
            });
            return {
                type: "sale",
                value: value
            }
        }
        if (dish.dc_type === 'discount') {
            let value = 0;
            orderItem.subItems.forEach(function(subItem) {
                value += (100 - dish.dc) * subItem.orderInitPrice * subItem.num / 100;
            });
            return {
                type: "discount",
                value: value
            };
        }
        let value = 0;
        let type;
        orderItem.subItems.forEach(function(subItem) {
            let discount = getUserDiscount(subItem.orderInitPrice, subItem.num, rank_info)
            value += discount.value;
            type = discount.type;
        });
        let result = {
            value: value
        };
        if (type) {
            result.type = type;
        }
        return result;
    }
}

module.exports = order;
