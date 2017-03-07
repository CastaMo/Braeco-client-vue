const order = {
    getFixedDataForOrder(food, groups, num, extras) {
        let temp = {};
        temp.id = food.id;
        temp.name = food.name;
        temp.dc_str = food.dc_str;
        temp.tag = food.tag;
        temp.type = food.type;
        temp.groups = groups;
        temp.num = num;
        temp.dc_type = food.dc_type;
        temp.dc = food.dc;
        if (temp.type === 'normal' && groups && groups.length > 0) {
            temp.choose_info = Braeco.utils.property.getInfoArrayByChoose(groups, extras).join("、");
        } else if (temp.type !== 'normal' && groups && groups.length > 0) {
            temp.combo_choose_info = [];
            extras.forEach(function(extra) {
                let combo_choose_info_item = {};
                combo_choose_info_item.id = extra.food.id;
                combo_choose_info_item.name = extra.food.name;
                combo_choose_info_item.num = extra.num;
                if (extra.groups && extra.groups.length > 0) {
                    combo_choose_info_item.choose_info = Braeco.utils.property.getInfoArrayByChoose(extra.groups, extra.foodProperty.properties).join("、");
                }
                temp.combo_choose_info.push(combo_choose_info_item);
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
    tryGetSubItemByGroups(subItems, groups, isExtend, order_init_price) {
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
            if (typeof order_init_price === 'number') {
                temp.order_init_price = order_init_price;
            }
            subItems.push(temp);
        }
        return temp;
    },
    getDiscountForOrderItem(orderItem, dish, rank_info) {
        function getUserDiscount(price, num, rank_info) {
            if (rank_info && rank_info.discount > 0) {
                return {
                    type: "user_discount",
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
                return getUserDiscount(orderItem.subItems[0].order_init_price, 1, rank_info);
            }
            // 将所有价格都塞到一个容器中准备排序进行计算第二杯半价优惠
            let temp = [];
            orderItem.subItems.forEach(function(subItem) {
                temp = temp.concat(Array(subItem.num).fill(subItem.order_init_price));
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
                value += (100 - dish.dc) * subItem.order_init_price * subItem.num / 100;
            });
            return {
                type: "discount",
                value: value
            };
        }
        let value = 0;
        let type;
        orderItem.subItems.forEach(function(subItem) {
            let discount = getUserDiscount(subItem.order_init_price, subItem.num, rank_info)
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
    },
    getNotEnoughFoodId(order_options, dish_limit_remainder) {
        let temp = [];
        if (typeof dish_limit_remainder[order_options.id] === 'number') {
            if (order_options.num > dish_limit_remainder[order_options.id]) {
                temp.push(order_options.id);
            }
        }
        if (order_options.groups && typeof order_options.groups[0] === 'object') {
            let outer_num = order_options.num;
            order_options.groups.forEach(function(groupItem) {
                if (typeof dish_limit_remainder[groupItem.id] === 'number') {
                    let total_sum = outer_num * groupItem.num;
                    if (total_sum > dish_limit_remainder[groupItem.id]) {
                        temp.push(groupItem.id);
                    }
                }
            });
        }
        return temp;
    },
    checkIsEnoughForOpts(opts, dish_limit_remainder, dishMap, failCallback) {
        // 检查有无不足的餐品id
        let not_enough_food_id = this.getNotEnoughFoodId(
            opts,
            dish_limit_remainder
        );
        if (not_enough_food_id.length > 0) {
            let food_name_arr = [];
            not_enough_food_id.forEach(function(food_id) {
                food_name_arr.push(dishMap[food_id].name);
            });
            if (typeof failCallback === 'function') {
                let food_name_str = food_name_arr.join("、");
                failCallback(food_name_str);
            }
            return false;
        }
        return true;
    }
}

module.exports = order;
