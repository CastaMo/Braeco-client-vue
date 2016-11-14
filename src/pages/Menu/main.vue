<template>
    <div id="Menu-Main">
        <menu-bar
            :foodItems="foodItems"
        >
        </menu-bar>
        <trolley-footer-bar>
        </trolley-footer-bar>
        <category-bar
            :categoryId="categoryId"
            :categoryItems="categoryItems"
            :categoryName="categoryName"
        ></category-bar>
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
            dishLimit: null,
            groups: {}
        };
    },
    created() {

        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groups[group.id] = group;
        });

        this.dishLimit = this.$root.requireData.dish_limit;
        this.categoryId = Number(this.$root.$route.params.id);
        this.categoryItems = this.getItemsForCategory();
        this.foodItems = this.getItemsForFood();

    },
    directives: {
        lazy: Vue.directive('lazy')
    },
    components: {
        "category-bar": require("./components/category-bar"),
        "menu-bar": require("./components/menu-bar"),
        "trolley-footer-bar": require("./components/trolley-footer-bar")
    },
    methods: {
        changeCategoryId(id) {
            this.categoryId = id;
        },
        viewFoodInfoById(foodId) {
            this.$root.$router.push(`/menu/info/${this.categoryId}/${foodId}`);
        },
        getItemsForCategory() {
            let result = [];
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (!category.display_flag) {
                    continue;
                }
                let temp = {};
                temp.id = category.id;
                temp.name = category.name;
                if (category.pic) {
                    temp.pic = `${category.pic}?imageView2/1/w/${40 * 2}/h/${40 * 2}`;
                }
                result.push(temp);
            }
            return result;
        },
        getItemsForFood() {
            let result = [];
            for (let i = 0, len = this.$root.requireData.menu.categories.length; i < len; i++) {
                let category = this.$root.requireData.menu.categories[i];
                if (Number(category.id) === this.categoryId) {
                    for (let j = 0, len = category.dishes.length; j < len; j++) {
                        let dish = category.dishes[j];
                        if (dish.dc_type === "combo_only") {
                            continue;
                        }
                        let temp = {};
                        temp.able = dish.able;
                        temp.dc = dish.dc;
                        temp.dc_type = dish.dc_type;
                        temp.dcStr = this.getDcForFood(dish);
                        temp.default_price = dish.default_price;
                        temp.groups = dish.groups;
                        temp.id = dish.id;
                        temp.name = dish.name;
                        temp.name2 = dish.name2;
                        if (dish.pic) {
                            temp.pic = `${dish.pic}?imageView2/1/w/${100 * 2}/h/${100 * 2}`
                        }
                        temp.chooseAllFirstPrice = this.getChooseAllFirstPrice(dish);
                        temp.currentPrice = this.getPriceByDcTypeAndDc(temp.chooseAllFirstPrice, dish.dc_type, dish.dc);
                        temp.tag = dish.tag;
                        temp.type = dish.type;
                        result.push(temp);
                    }
                    break;
                }
            }
            return result;
        },
        getDcForFood(food) {
            if (!food.dc_type || food.dc_type === "none") {
                return "";
            }

            let numToChinese = ["零","一","二","三","四","五","六","七","八","九","十"]
            if (food.dc_type === "discount") {
                let num = food.dc
                if (food.dc % 10 === 0) {
                    num = numToChinese[Math.round(food.dc) / 10];
                } else {
                    num = food.dc / 10;
                }
                return `${num}折`;
            }

            if (food.dc_type === "sale") return `减${food.dc}元`;
            if (food.dc_type === "half") return `第二份半价`;
            if (food.dc_type === "limit") {
                let dc = this.dishLimit[food.id];
                return `剩${dc}件`;
            }
        },
        getPriceByDcTypeAndDc(price, dc_type, dc) {
            if (dc_type === "sale") {
                return price - dc;
            }
            if (dc_type === "discount") {
                return price * dc / 100;
            }
            return price;
        },
        getChooseAllFirstPrice(food) {
            let price = food.default_price,
                vm = this;
            if (food.type === "normal") {
                if (food.groups && food.groups.length > 0) {
                    food.groups.forEach(function(groupId) {
                        let content = vm.groups[groupId].content[0];
                        price += content.price;
                    });
                }
            }
            return price;
        },
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


</style>
