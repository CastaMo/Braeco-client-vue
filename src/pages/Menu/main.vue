<template>
    <div id="Menu-Main">
        <div id='menu-bar'>
            <div class='main-field'>
                <div class='menu'>
                    <div class='menu-wrapper'>
                        <div class='menu-container'>
                            <transition name="fade" mode="out-in">
                                <ul v-if="foodItems">
                                    <food-item
                                        v-for="foodItem in foodItems"
                                        :foodItem="foodItem"
                                        v-on:food-with-property-click="prepareForFoodProperty"
                                        v-on:food-with-normal-click="addFood"
                                        v-on:record-ball-set-out-dom="recordBallSetOutDom"
                                        v-on:view-food-info-by-id="viewFoodInfoById"
                                        v-on:food-with-combo-click="routeToCombo"
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
            :categoryId="categoryId"
            :categoryItems="categoryItems"
            :categoryName="categoryName"
            v-on:category-id-change="updateCategoryId"
        ></category-bar>
        <food-property
            :foodPropertyItem="foodPropertyItem"
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
            categoryId: null,
            categoryName: null,
            categoryItems: null,
            foodItems: null,
            foodPropertyItem: {properties: []},
            dishLimit: null,
            groupsMap: {},
            ballSetOutDom: null
        };
    },
    created() {

        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groupsMap[group.id] = group;
        });

        this.dishLimit = this.$root.requireData.dish_limit;
        this.categoryId = Number(this.$root.$route.params.categoryId);
        this.categoryItems = this.getItemsForCategory();
        this.foodItems = this.getItemsForFood();

        this.$root.$once("root:route-to-order", function() {
            vm.$root.$router.push('/menu/order');
        });

    },
    beforeDestroy() {
        this.$root.$off("root:route-to-order");
    },
    directives: {
        lazy: Vue.directive('lazy')
    },
    components: {
        'food-item': Vue.component('food-item'),
        "category-bar": require("./components/category-bar"),
        "food-property": require("./components/food-property")
    },
    methods: {
        prepareForFoodProperty(opts) {
            let id = opts.id;
            this.foodPropertyItem = this.getItemForFoodProperty(id);
            this.$root.$emit("root:food-property-show");
        },
        recordBallSetOutDom(dom) {
            this.ballSetOutDom = dom;
        },
        addFood(opts) {
            let vm = this;
            if (this.ballSetOutDom) {
                this.ballSetOutDom.scrollIntoViewIfNeeded();
                setTimeout(function() {
                    let rect = vm.ballSetOutDom.getBoundingClientRect();
                    vm.$root.$emit("root:play-ball", {
                        initTop: rect.top,
                        initLeft: rect.left,
                        callback: function() {
                            vm.$root.addOrderForTrolley(opts);
                        }
                    });
                }, 10);
            }
        },
        updateCategoryId(id) {
            this.categoryId = id;
        },
        viewFoodInfoById(foodId) {
            this.$root.$router.push(`/menu/info/${foodId}`);
        },
        getItemForFoodProperty(foodId) {
            let vm = this;
            let dish = this.$root.getDishById(foodId);
            let temp = Braeco.utils.property.getFixedDataForProperty(dish, this.groupsMap);
            return temp;
        },
        getItemsForCategory() {
            let result = [];
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (!category.display_flag) {
                    continue;
                }
                let temp = Braeco.utils.category.getFixedDataForCategory(category);
                result.push(temp);
            }
            return result;
        },
        getItemsForFood() {
            let result = [];
            let vm = this;
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (Number(category.id) === this.categoryId) {
                    for (let j = 0, len = category.dishes.length; j < len; j++) {
                        let dish = category.dishes[j];
                        if (dish.dc_type === "combo_only") {
                            continue;
                        }
                        let temp = Braeco.utils.food.getFixedDataForFood(dish, vm.groupsMap, vm.dishLimit);
                        result.push(temp);
                    }
                    break;
                }
            }
            return result;
        },
        routeToCombo(opts) {
            this.$root.$router.push(`/menu/combo/${opts.id}`);
        }
    },
    watch: {
        categoryId(id) {
            let vm = this;
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (Number(category.id) === id) {
                    let vm = this;
                    vm.categoryName = category.name;
                    vm.foodItems = null;

                    //通过时间tick交错的方式，使dom结构强制更换，不然v-lazy会出现问题。
                    Vue.nextTick(function() {
                        vm.foodItems = vm.getItemsForFood();
                    });
                    this.$root.$router.replace(`/menu/main/${id}`);
                    return true;
                }
            }
            //找不到正确的id
            this.$root.$router.back();
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
