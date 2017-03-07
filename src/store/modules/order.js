const order = {

    state: {
        orderForTrolley: [],
        order_for_already: [],
        description: ""
    },
    getters: {
        dish_limit_remainder: function(state, getters, rootState) {
            let temp = {};
            if (!rootState.isLoaded) {
                return temp;
            }
            temp = Vue.util.extend({}, rootState.requireData.dish_limit);
            getters.order_items.forEach(function(orderItem) {
                // 直接就在该餐品上
                if (typeof temp[orderItem.id] === 'number') {
                    temp[orderItem.id] -= orderItem.num;

                } else if (orderItem.type !== "normal") {
                    // 检查套餐内是否存在
                    let outer_num = orderItem.num;
                    orderItem.combo_choose_info.forEach(function(combo_choose_info_item) {
                        if (typeof temp[combo_choose_info_item.id] === 'Number') {
                            temp[combo_choose_info_item.id] -= outer_num * combo_choose_info_item.num;
                        }
                    });
                }
            });
            return temp;
        },
        start_price: function(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return 0;
            }
            return rootState.requireData.startprice;
        },
        trolley_btn_name: function(state, getters, rootState) {
            let path                = rootState.route.path;
            let start_price         = getters.start_price;
            let total_final_price   = getters.total_final_price;
            let order_total_number  = getters.order_total_number;
            if (
                path.indexOf("/menu/info") >= 0
            ||  path.indexOf("/menu/main") >= 0
            ) {
                // 有起送价
                if (start_price != -1) {
                    if (start_price > total_final_price) {
                        return `${start_price}元起送`;
                    }
                }
                return "选好了";
            }
            return "支付";
        },
        trolley_btn_able: function(state, getters, rootState) {
            let start_price         = getters.start_price;
            let total_final_price   = getters.total_final_price;
            let order_total_number  = getters.order_total_number;
            if (start_price != -1) {
                return (start_price <= total_final_price && order_total_number > 0);
            }
            return order_total_number > 0;
        },
        order_already_item: function(state, getters, rootState) {
            let temp = {
                inValid: true
            };
            if (!rootState.isLoaded) {
                return temp;
            }
            let orderId = Number(rootState.route.params.orderId);
            state.order_for_already.every(function(item) {
                if (Number(item.order_info.order_id) === orderId) {
                    temp = item;
                    temp.order_items.forEach(function(orderItem) {
                        orderItem.read_only = true;
                    });
                    return false;
                }
                return true;
            });
            return temp;

        },
        order_items: function(state, getters, rootState) {
            let temp = [];
            state.orderForTrolley.forEach(function(orderItem) {
                orderItem.subItems.forEach(function(subItem) {
                    let dish = getters.dishMap[orderItem.id];
                    let food = Braeco.utils.food.getFixedDataForFood(
                        dish,
                        getters.groupsMap,
                        rootState.requireData.dish_limit
                    );
                    let foodProperty = Braeco.utils.property.getFixedDataForProperty(
                        dish,
                        getters.groupsMap
                    );

                    let extras = foodProperty.properties;
                    // 如果是套餐，那么就要给groups再做一次预处理
                    if (food.type !== 'normal' && subItem.groups && subItem.groups.length > 0) {
                        extras = [];
                        subItem.groups.forEach(function(groupItem) {
                            let extra = {};
                            extra.dish = getters.dishMap[groupItem.id];
                            extra.num = groupItem.num;
                            extra.groups = groupItem.groups;
                            extra.food = Braeco.utils.food.getFixedDataForFood(
                                extra.dish,
                                getters.groupsMap,
                                rootState.requireData.dish_limit
                            );
                            extra.foodProperty = Braeco.utils.property.getFixedDataForProperty(
                                extra.dish,
                                getters.groupsMap
                            );
                            extras.push(extra);
                        });
                    }

                    let order = Braeco.utils.order.getFixedDataForOrder(
                        food,
                        subItem.groups,
                        subItem.num,
                        extras
                    );
                    order.order_init_price = subItem.order_init_price;
                    temp.push(order);
                });
            });
            return temp;
        },
        order_total_number: function(state, getters, rootState) {
            let temp = 0;
            state.orderForTrolley.forEach(function(orderItem) {
                orderItem.subItems.forEach(function(subItem) {
                    temp += Number(subItem.num);
                });
            });
            return temp;
        },
        totalInitPrice: function(state, getters, rootState) {
            let temp = 0;
            state.orderForTrolley.forEach(function(orderItem) {
                orderItem.subItems.forEach(function(subItem) {
                    temp += Number(subItem.order_init_price) * Number(subItem.num);
                });
            });
            return temp;
        },
        discount_map: function(state, getters, rootState) {
            let temp = {
                half: 0,
                discount: 0,
                sale: 0,
                user_discount: 0,
                reduce: 0
            };
            if (!rootState.isLoaded) {
                return temp;
            }
            state.orderForTrolley.forEach(function(orderItem) {
                let dish = getters.dishMap[orderItem.id];
                let discount = Braeco.utils.order.getDiscountForOrderItem(
                    orderItem,
                    dish,
                    getters.rank_info
                );
                if (discount.type) {
                    temp[discount.type] += discount.value;
                }
            });

            // 获取单品优惠以及会员优惠计算之后的订单价格
            let price = getters.totalInitPrice
                            - temp.half
                            - temp.discount
                            - temp.sale
                            - temp.user_discount
                            ;
            let maxReduce = 0;

            // 获取满减优惠
            rootState.requireData.dc_tool.reduce.forEach(function(reduceItem) {
                if (
                    price >= reduceItem[0]
                &&  maxReduce < reduceItem[1]
                ) {
                    maxReduce = reduceItem[1];
                }
            });
            temp.reduce = maxReduce;
            return temp;
        },
        total_final_price: function(state, getters, rootState) {
            let price = getters.totalInitPrice
                            - getters.discount_map.half
                            - getters.discount_map.discount
                            - getters.discount_map.sale
                            - getters.discount_map.user_discount
                            - getters.discount_map.reduce
                            ;
            return price;
        },
        giveItem: function(state, getters, rootState) {
            if (!rootState.isLoaded) {
                return null;
            }
            let price = getters.total_final_price;
            let giveName = "";
            let maxGive = 0;
            rootState.requireData.dc_tool.give.forEach(function(giveItem) {
                if (
                    price >= giveItem[0]
                &&  giveItem[0] >= maxGive
                ) {
                    giveName = giveItem[1];
                    maxGive = giveItem[0];
                }
            });
            if (giveName) {
                return {
                    name: giveName,
                    dc_str: "满送",
                    order_init_price: 0,
                    num: 1,
                    read_only: true
                }
            }
            return null;
        }
    },
    mutations: {
        "order:addOrderForTrolley": function(state, playload) {
            let orderItem = Braeco.utils.order.tryGetFoodItemByFoodId(
                state.orderForTrolley,
                playload.id,
                true
            );
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(
                orderItem.subItems,
                playload.groups,
                true,
                playload.order_init_price
            );
            let num = playload.num || 1;
            subItem.num += num;
        },
        "order:minusOrderForTrolley": function(state, playload) {
            let orderItem = Braeco.utils.order.tryGetFoodItemByFoodId(
                state.orderForTrolley,
                playload.id,
                true
            );
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(
                orderItem.subItems,
                playload.groups,
                true
            );
            subItem.num--;
            if (subItem.num <= 0) {
                let index = orderItem.subItems.indexOf(subItem);
                orderItem.subItems.splice(index, 1);
                if (orderItem.subItems.length === 0) {
                    let index = state.orderForTrolley.indexOf(orderItem);
                    state.orderForTrolley.splice(index, 1);
                }
            }
        },
        "order:confirm-description": function(state, playload) {
            state.description = playload.description;
        },
        "order:clear-order-for-trolley": function(state, playload) {
            state.orderForTrolley = [];
            state.description = "";
        },
        "order:load-order-for-already": function(state, playload) {
            state.order_for_already = playload.order_for_already;
        }
    },
    actions: {
        "order:validate-and-assign-for-orderForTrolley": function(context, playload) {
            playload.lsOrderForTrolley.forEach(function(orderItem) {
                orderItem.subItems.forEach(function(subItem) {
                    try {
                        // 添加来校验，此处校验无法通过，则直接抛出异常而无法加入到orderForTrolley中。
                        let dish = context.getters.dishMap[orderItem.id];
                        let food = Braeco.utils.food.getFixedDataForFood(
                            dish,
                            context.getters.groupsMap,
                            context.rootState.requireData.dish_limit
                        );
                        let foodProperty = Braeco.utils.property.getFixedDataForProperty(
                            dish,
                            context.getters.groupsMap
                        );

                        let extras = foodProperty.properties;
                        // 如果是套餐，那么就要给groups再做一次预处理
                        if (food.type !== 'normal' && subItem.groups && subItem.groups.length > 0) {
                            extras = [];
                            subItem.groups.forEach(function(groupItem) {
                                let extra = {};
                                extra.dish = context.getters.dishMap[groupItem.id];
                                extra.num = groupItem.num;
                                extra.groups = groupItem.groups;
                                extra.food = Braeco.utils.food.getFixedDataForFood(
                                    extra.dish,
                                    context.getters.groupsMap,
                                    context.rootState.requireData.dish_limit
                                );
                                extra.foodProperty = Braeco.utils.property.getFixedDataForProperty(
                                    extra.dish,
                                    context.getters.groupsMap
                                );
                                extras.push(extra);
                            });
                        }

                        let order = Braeco.utils.order.getFixedDataForOrder(
                            food,
                            subItem.groups,
                            subItem.num,
                            extras
                        );
                        let temp = {
                            id: orderItem.id,
                            num: subItem.num,
                            order_init_price: subItem.order_init_price
                        };
                        if (subItem.groups) {
                            temp.groups = subItem.groups;
                        }
                        temp = Vue.util.extend(temp, {
                            dishMap: playload.dishMap,
                            failCallback: playload.failCallback
                        });
                        context.dispatch("order:add-order-for-trolley", temp);
                    } catch(e) {
                        console.log(e);
                    }
                });
            });
        },
        "order:get-order-for-already-item": function(context, playload) {
            let orderForAlreadyItem = {};
            orderForAlreadyItem.create_time = +new Date();
            orderForAlreadyItem.order_items = [];
            context.getters.order_items.forEach(function(orderItem) {
                let temp = orderItem;
                temp.read_only = true;
                orderForAlreadyItem.order_items.push(temp);
            });
            if (context.getters.giveItem) {
                orderForAlreadyItem.order_items.push(context.getters.giveItem);
            }
            orderForAlreadyItem.discount_map = context.getters.discount_map;
            orderForAlreadyItem.total_final_price = context.getters.total_final_price;
            orderForAlreadyItem.order_total_number = context.getters.order_total_number;
            orderForAlreadyItem.description = context.state.description;
            orderForAlreadyItem.order_info = {
                flow_id: "0001",
                order_id: parseInt(Math.random() * Math.pow(10, 10)),
                pay_info: "微信支付",
                description: "玫瑰过敏",
                table_info: "堂食 6 号桌"
            };
            context.state.order_for_already.push(orderForAlreadyItem);
        },
        "order:add-order-for-trolley": function(context, playload) {
            let not_enough_food_id = Braeco.utils.order.getNotEnoughFoodId(
                playload,
                context.getters.dish_limit_remainder
            );
            if (not_enough_food_id.length > 0) {
                let food_name_arr = [];
                not_enough_food_id.forEach(function(food_id) {
                    food_name_arr.push(playload.dishMap[food_id].name);
                });
                if (typeof playload.failCallback === 'function') {
                    let food_name_str = food_name_arr.join("、");
                    playload.failCallback(food_name_str);
                }
                return;
            }
            context.commit("order:addOrderForTrolley", playload);
        }
    }

};

module.exports = order;
