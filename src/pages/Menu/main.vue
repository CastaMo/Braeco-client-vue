<template>
    <div id="Menu-Main">
        <div id='menu-bar'>
            <div class='main-field'>
                <div class='menu'>
                    <div class='menu-wrapper'>
                        <div class='menu-container'>
                            <transition name="fade" mode="out-in">
                                <ul v-show="currentFoodItems && currentFoodItems.length > 0">
                                    <food-item
                                        v-for="foodItem in currentFoodItems"
                                        :foodItem="foodItem"
                                        :limitDc="dish_limit_remainder[foodItem.id]"
                                        v-on:food-with-property-add-click="prepareForFoodProperty"
                                        v-on:food-with-normal-add-click="addFood"
                                        v-on:record-ball-set-out-dom="recordBallSetOutDom"
                                        v-on:view-food-info-by-id="viewFoodInfoById"
                                        v-on:food-with-combo-add-click="routeToCombo"
                                    >
                                    </food-item>
                                </ul>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <category-bar
            :category-items="categoryItems"
            :currentCategoryItem="currentCategoryItem"
            v-on:category-id-change="updateCategoryId"
        ></category-bar>
        <food-property
            v-on:confirm-add="addFood"
        >
        </food-property>
    </div>
</template>

<script>

module.exports = {
    name: 'menu-main',
    data() {
        return {
            foodPropertyItem: {properties: []},
            dishLimit: null,
            groupsMap: {},
            ballSetOutDom: null
        };
    },
    computed: {
        dish_limit_remainder: function() {
            return this.$store.getters.dish_limit_remainder;
        },
        categoryItems: function() {
            return this.$store.getters.categoryItems;
        },
        currentCategoryItem: function() {
            return this.$store.getters.currentCategoryItem;
        },
        currentFoodItems: function() {
            return this.$store.getters.currentFoodItems;
        },
        currentFoodProperty: function() {
            return this.$store.getters.currentFoodProperty;
        }
    },
    created() {
        let vm = this;
        this.$store.dispatch("food:updateCurrentCategoryId", {
            categoryId: this.$route.params.categoryId
        });
        this.$root.$once("root:route-to-order", function() {
            vm.$root.$router.push('/menu/order');
        });
    },
    beforeDestroy() {
        this.$root.$off("root:route-to-order");
    },
    components: {
        'food-item': require('./components/food-item'),
        "category-bar": require("./components/category-bar"),
        "food-property": require("./components/food-property")
    },
    methods: {
        prepareForFoodProperty(opts) {

            let vm = this;

            // 加上默认的数量1
            opts = Vue.util.extend(opts, {num: 1});

            let limit_flag = Braeco.utils.order.checkIsEnoughForOpts(
                opts,
                vm.dish_limit_remainder,
                vm.$store.getters.dishMap,
                function(food_name_str) {
                    vm.$root.$emit("tips:error", `${food_name_str} 数量不足`);
                }
            );

            if (!limit_flag) {
                return;
            }

            let id = opts.id;
            let dish = this.$store.getters.dishMap[id];
            this.$store.dispatch("property:startFoodProperty", {
                foodId: id,
                chooseArrayLen: dish.groups.length
            });
        },
        recordBallSetOutDom(dom) {
            this.ballSetOutDom = dom;
        },
        addFood(opts) {
            let vm = this;

            // 加上默认的数量1
            opts = Vue.util.extend(opts, {num: 1});

            let limit_flag = Braeco.utils.order.checkIsEnoughForOpts(
                opts,
                vm.dish_limit_remainder,
                vm.$store.getters.dishMap,
                function(food_name_str) {
                    vm.$root.$emit("tips:error", `${food_name_str} 数量不足`);
                }
            );

            if (!limit_flag) {
                return;
            }

            if (this.ballSetOutDom) {
                this.ballSetOutDom.scrollIntoViewIfNeeded();
                setTimeout(function() {
                    let rect = vm.ballSetOutDom.getBoundingClientRect();
                    vm.$root.$emit("root:play-ball", {
                        initTop: rect.top,
                        initLeft: rect.left,
                        callback: function() {
                            opts = Vue.util.extend(opts, {
                                failCallback: function(food_name_str) {
                                    vm.$root.$emit("tips:error", `${food_name_str} 数量不足`);
                                },
                                dishMap: vm.$store.getters.dishMap
                            });
                            vm.$store.dispatch("order:add-order-for-trolley", opts);
                        }
                    });
                }, 10);
            }
        },
        updateCategoryId(categoryId) {
            this.$router.replace(`/menu/main/${categoryId}`);
            this.$store.dispatch("food:updateCurrentCategoryId", {
                categoryId: categoryId
            });
        },
        viewFoodInfoById(foodId) {
            this.$root.$router.push(`/menu/info/${foodId}`);
        },
        routeToCombo(opts) {
            let vm = this;

            // 加上默认的数量1
            opts = Vue.util.extend(opts, {num: 1});

            let limit_flag = Braeco.utils.order.checkIsEnoughForOpts(
                opts,
                vm.dish_limit_remainder,
                vm.$store.getters.dishMap,
                function(food_name_str) {
                    vm.$root.$emit("tips:error", `${food_name_str} 数量不足`);
                }
            );

            if (!limit_flag) {
                return;
            }
            this.$root.$router.push(`/menu/combo/${opts.id}`);
        }
    }
}


</script>


<style lang="less" scoped>
#menu-bar {
    .menu {
        .menu-container {
            padding: 48px 0 120px 0;
        }
    }
}

</style>
