<template>
    <div id="Menu-Order">
        <div class='menu-order-wrapper'>
            <div class='menu-order-container'>
                <div class='order menu-order-item-container'>
                    <ul>
                        <order-item
                            v-for="orderItem in orderItems"
                            :orderItem="orderItem"
                            v-on:add-click="addFood"
                            v-on:minus-click="minusFood"
                        >
                        </order-item>
                    </ul>
                </div>
                <div class='additional-container'>
                    <ul class='additional-list'>
                        <li class='additional-item active-container'>
                            <div class='additional-item-wrapper margin-left-wrapper'>
                                <div class='additional-item-container'>
                                    <div class='title'>订单备注</div>
                                </div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                        <li class='additional-item active-container'>
                            <div class='additional-item-wrapper margin-left-wrapper'>
                                <div class='additional-item-container'>
                                    <div class='title'>代金券</div>
                                </div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: 'menu-order',
    data() {
        return {
            orderItems: [],
            groupsMap: {},
            dishLimit: null
        }
    },
    created() {
        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groupsMap[group.id] = group;
        });

        this.dishLimit = this.$root.requireData.dish_limit;

        this.orderItems = this.getItemsForOrder();
        this.$root.$watch('tempData.orderForTrolley', function(newData) {
            vm.orderItems = vm.getItemsForOrder();
        }, {deep: true});
    },
    components: {
        'order-item': Vue.component('order-item')
    },
    methods: {
        getItemsForOrder() {
            let temp = [];
            let vm = this;
            this.$root.tempData.orderForTrolley.forEach(function(orderItem) {
                orderItem.subItems.forEach(function(subItem) {
                    let dish = vm.$root.getDishById(orderItem.id);
                    let food = Braeco.utils.food.getFixedDataForFood(dish, vm.groupsMap, vm.dishLimit);
                    let foodProperty = Braeco.utils.property.getFixedDataForProperty(dish, vm.groupsMap);

                    let extras = foodProperty.properties;
                    // 如果是套餐，那么就要给groups再做一次预处理
                    if (food.type !== 'normal' && subItem.groups && subItem.groups.length > 0) {
                        extras = [];
                        subItem.groups.forEach(function(groupItem) {
                            let extra = {};
                            extra.dish = vm.$root.getDishById(groupItem.id);
                            extra.num = groupItem.num;
                            extra.groups = groupItem.groups;
                            extra.food = Braeco.utils.food.getFixedDataForFood(extra.dish, vm.groupsMap, vm.dishLimit);
                            extra.foodProperty = Braeco.utils.property.getFixedDataForProperty(extra.dish, vm.groupsMap);
                            extras.push(extra);
                        });
                    }

                    let order = Braeco.utils.order.getFixedDataForOrder(food, subItem.groups, subItem.num, extras);
                    order.orderInitPrice = subItem.orderInitPrice;
                    temp.push(order);
                });
            });
            return temp;
        },
        addFood(opts) {
            this.$root.addOrderForTrolley(opts);
        },
        minusFood(opts) {
            this.$root.minusOrderForTrolley(opts);
        }
    }
}


</script>

<style lang="less" scoped>

.menu-order-container {
    padding: 16px 0 100px 0;
}

.menu-order-item-container {
    margin-bottom: 16px;
    background-color: #fff;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    li.order-item:last-of-type {
        .order-item-wrapper {
            color: #fff;
            color: red;
        }
    }
}

.additional-container {
    margin-bottom: 16px;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    ul {
        li.additional-item {
            line-height: 44px;
            .title {
                font-weight: bold;
            }
            &:last-of-type {
                .margin-left-wrapper {
                    border-bottom: none;
                }
            }
        }
    }
}

</style>
