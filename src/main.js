
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
                    orderForTrolley: []
                }
            }
        },
        created() {
            this.checkIsUnfiniteState();
            this.readFromLocStor();
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
                this.requireData.menu.categories.forEach(function(category) {
                    category.dishes.forEach(function(dish) {
                        if (Number(dish.id) === Number(foodId)) {
                            temp = dish;
                            getFlag = true;
                            return false;
                        }
                    });
                    if (getFlag) {
                        return false;
                    }
                });
                return temp;
            },
            readFromLocStor() {
                this.tempData.orderForTrolley = JSON.parse(utils.locStor.get('orderForTrolley')) || [];
            },
            addOrderForTrolley(order) {

                function tryGetOrderItemByFoodId(orderForTrolley, foodId) {
                    let temp = null;
                    orderForTrolley.forEach(function(orderItem) {
                        if (Number(foodId) === Number(orderItem.id)) {
                            temp = orderItem;
                            return false;
                        }
                    });

                    // 若找不到则新建一个
                    if (!temp) {
                        orderForTrolley.push(temp = {
                            id: foodId,
                            subItems: []
                        });
                    }
                    return temp;
                }

                function tryGetSubItemByGroups(orderItem, groups) {
                    let temp = null;
                    orderItem.subItems.forEach(function(subItem) {
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
                    if (!temp) {
                        orderItem.subItems.push(temp = {
                            num: 0,
                            groups: groups
                        });
                    }
                    return temp;
                }

                let orderItem = tryGetOrderItemByFoodId(this.tempData.orderForTrolley, order.id);
                let subItem = tryGetSubItemByGroups(orderItem, order.groups);
                subItem.num++;
            },
            getOrderForTrolley() {
                return this.tempData.orderForTrolley;
            },
            saveToLocStor(key, val) {
                utils.locStor.set(key, val);
            }
        },
        watch: {
            $route: function(to, from) {
                this.checkIsUnfiniteState();
                this.checkForTransition(to.fullPath, from.fullPath);
            },
            'tempData.orderForTrolley': {
                handler: function(newData, oldData) {
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
