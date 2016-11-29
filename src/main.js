
const routes = require('./routes.js');
const routeWeight = require("./routeWeight.js");
const config = require("./common/config.js");
const components = require('./components/index.js');

const utils = require("./utils/index.js");

const style = require('./style/index.less');

const router = new VueRouter({
    mode: 'history',
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { x: 0, y: 0 };
    }
});
let count = 3,
    requireData = {};
let init = function() {
    new Vue({
        router: router,
        data() {
            return {
                transitionName: "page-fade",
                requireData: requireData,
                tempData: {
                    orderForTrolley: [],
                    groupsMap: {},
                    discountMap: {
                        half: 0,
                        discount: 0,
                        sale: 0,
                        userDiscount: 0
                    }
                }
            }
        },
        created() {
            let vm = this;
            this.requireData.menu.groups.forEach(function(group) {
                vm.tempData.groupsMap[group.id] = group;
            });
            this.checkIsUnfiniteState();

            let lsOrderForTrolley = this.readFromLocStor();
            this.validateAndAssignForOraderForTrolley(lsOrderForTrolley);
        },
        methods: {
            checkIsUnfiniteState() {
                let routerArray = this.$route.path.split('/')
                if (routerArray.pop() === 'x') {
                    router.push(routerArray.join("/"));
                }
            },
            checkForTransition(toPath, fromPath) {
                let to = toPath.split("/");
                to.shift();
                let from = fromPath.split("/");
                from.shift();

                let toValue = -10,
                    fromValue = -100;
                if (to.length === 0) {
                    toValue = -10;
                } else if (to.length >= 2) {
                    toValue = routeWeight[to[0]].value;
                    toValue += routeWeight[to[0]].next[to[1]].value;
                }
                if (from.length === 0) {
                    fromValue = -10;
                } else if (from.length >= 2) {
                    fromValue = routeWeight[from[0]].value;
                    fromValue += routeWeight[from[0]].next[from[1]].value;
                }

                this.transitionName = "page-fade";
                if (toValue - fromValue <= 20 && toValue > fromValue) {
                    this.transitionName = "page-slide-left";
                } else if (fromValue - toValue <= 20 && fromValue > toValue) {
                    this.transitionName = "page-slide-right";
                }
            },
            getDishById(foodId) {
                let temp = null;
                let getFlag = false;
                this.requireData.menu.categories.every(function(category) {
                    category.dishes.every(function(dish) {
                        if (Number(dish.id) === Number(foodId)) {
                            temp = dish;
                            getFlag = true;
                            return false;
                        }
                        return true;
                    });
                    if (getFlag) {
                        return false;
                    }
                    return true;
                });
                return temp;
            },
            readFromLocStor() {
                return JSON.parse(utils.locStor.get('orderForTrolley') || "[]");
            },
            validateAndAssignForOraderForTrolley(lsOrderForTrolley) {
                let vm = this;
                lsOrderForTrolley.forEach(function(orderItem) {
                    orderItem.subItems.forEach(function(subItem) {
                        try {
                            // 添加来校验，此处校验无法通过，则直接抛出异常而无法加入到orderForTrolley中。
                            let dish = vm.getDishById(orderItem.id);
                            let food = Braeco.utils.food.getFixedDataForFood(dish, vm.tempData.groupsMap, vm.requireData.dish_limit);
                            let foodProperty = Braeco.utils.property.getFixedDataForProperty(dish, vm.tempData.groupsMap);

                            let extras = foodProperty.properties;
                            // 如果是套餐，那么就要给groups再做一次预处理
                            if (food.type !== 'normal' && subItem.groups && subItem.groups.length > 0) {
                                extras = [];
                                subItem.groups.forEach(function(groupItem) {
                                    let extra = {};
                                    extra.dish = vm.getDishById(groupItem.id);
                                    extra.num = groupItem.num;
                                    extra.groups = groupItem.groups;
                                    extra.food = Braeco.utils.food.getFixedDataForFood(extra.dish, vm.tempData.groupsMap, vm.requireData.dish_limit);
                                    extra.foodProperty = Braeco.utils.property.getFixedDataForProperty(extra.dish, vm.tempData.groupsMap);
                                    extras.push(extra);
                                });
                            }

                            let order = Braeco.utils.order.getFixedDataForOrder(food, subItem.groups, subItem.num, extras);

                            let temp = {
                                id: orderItem.id,
                                num: subItem.num,
                                orderInitPrice: subItem.orderInitPrice
                            };
                            if (subItem.groups) {
                                temp.groups = subItem.groups;
                            }
                            vm.addOrderForTrolley(temp);
                        } catch(e) {
                            console.log(e);
                        }
                    });
                });
            },
            addOrderForTrolley(order) {
                let orderItem = Braeco.utils.order.tryGetFoodItemByFoodId(this.tempData.orderForTrolley, order.id, true);
                let subItem = Braeco.utils.order.tryGetSubItemByGroups(orderItem.subItems, order.groups, true, order.orderInitPrice);
                let num = order.num || 1;
                subItem.num += num;
            },

            minusOrderForTrolley(order) {
                let orderItem = Braeco.utils.order.tryGetFoodItemByFoodId(this.tempData.orderForTrolley, order.id, true);
                let subItem = Braeco.utils.order.tryGetSubItemByGroups(orderItem.subItems, order.groups, true);
                subItem.num--;
                if (subItem.num <= 0) {
                    let index = orderItem.subItems.indexOf(subItem);
                    orderItem.subItems.splice(index, 1);
                    if (orderItem.subItems.length === 0) {
                        let index = this.tempData.orderForTrolley.indexOf(orderItem);
                        this.tempData.orderForTrolley.splice(index, 1);
                    }
                }
            },
            getOrderForTrolley() {
                return this.tempData.orderForTrolley;
            },
            saveToLocStor(key, val) {
                utils.locStor.set(key, val);
            },
            updateDiscount() {
                let vm = this;
                vm.tempData.discountMap.half = 0;
                vm.tempData.discountMap.discount = 0;
                vm.tempData.discountMap.sale = 0;
                vm.tempData.discountMap.userDiscount = 0;
                this.tempData.orderForTrolley.forEach(function(orderItem) {
                    let dish = vm.getDishById(orderItem.id);
                    let discount = Braeco.utils.order.getDiscountForOrderItem(orderItem, dish);
                    if (discount.type) {
                        vm.tempData.discountMap[discount.type] += discount.value;
                    }
                });
            }
        },
        watch: {
            $route: function(to, from) {
                this.checkIsUnfiniteState();
                this.checkForTransition(to.fullPath, from.fullPath);
            },
            'tempData.orderForTrolley': {
                handler: function(newData, oldData) {
                    // 更新优惠信息
                    this.updateDiscount();

                    this.saveToLocStor("orderForTrolley", JSON.stringify(newData));
                },
                deep: true
            }
        },
        components: {
            "footer-bar": Vue.component("footer-bar"),
            "trolley-footer-bar": Vue.component("trolley-footer-bar"),
            "router-link": Vue.component("router-link"),
            "router-view": Vue.component("router-view")
        }
    }).$mount('#braeco-client');
}

//试试箭头函数
let getData = requireName =>
    requireManage.get(requireName).require({
        method: "GET",
        success: function(result) {
            let data = result.data;
            if (result.message === "success") {
                for (let key in data) {
                    requireData[key] = data[key];
                }
                count--;
            }
            if (count === 0) {
                console.log(JSON.parse(JSON.stringify(requireData)));
                NProgress.done();
                init();
            }
        },
        always: function() {
            NProgress.done();
        }
    });

NProgress.start();
getData("getTableDinner");
getData("getTableLimit");
getData("getTableMember");
