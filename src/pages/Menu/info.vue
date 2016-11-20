<template>
    <div id="Menu-Info">
        <div class=''>
        <div class='img-container' v-if="foodItem">
            <div
                class='img'
                v-lazy:background-image="foodItem.largePic"
                v-bind:style="{
                    'width': `${foodItem.largeWidth}px`,
                    'height': `${foodItem.largeHeight}px`,
                    'background-size': `${foodItem.largeWidth}px ${foodItem.largeHeight}px`
                }"
            >
            </div>
        </div>
        <div class='food-info-container'>
            <food
                :foodItem="foodItem"
                v-on:food-with-property-click="prepareForFoodProperty"
                v-on:food-with-normal-click="addFood"
                v-on:record-ball-set-out-dom="recordBallSetOutDom"
            ></food>
        </div>
        <div class='detail' v-if="foodItem.detail">
            <div class='detail-header'>
                <div class='detail-header-wrapper margin-left-wrapper'>
                    <div class='detail-header-container'>
                        <p>餐品简介</p>
                    </div>
                </div>
            </div>
            <div class='detail-content'>
                <div class='detail-content-wrapper'>
                    <div class='detail-content-container'>
                        <p>{{foodItem.detail}}</p>
                    </div>
                </div>
            </div>
        </div>
        <food-property
            :foodPropertyItem="foodPropertyItem"
            v-on:confirm-add="addFood"
        >
        </food-property>
    </div>
</template>

<script>

module.exports = {
    name: 'menu-info',
    data() {
        return {
            foodId: null,
            categoryId: null,
            foodItem: null,
            groups: {},
            dishLimit: null,
            foodPropertyItem: {properties: []},
            ballSetOutDom: null
        }
    },
    created() {
        let categoryId = Number(this.$root.$route.params.categoryId);
        let foodId = Number(this.$root.$route.params.foodId);
        this.foodId = foodId;
        this.categoryId = categoryId;


        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groups[group.id] = group;
        });


        this.dishLimit = this.$root.requireData.dish_limit;

        this.foodItem = this.getItemForFood(categoryId, foodId);
        if (!this.foodItem) {
            this.$root.$router.back();
        }
    },
    methods: {
        getItemForFood(categoryId, foodId) {
            let temp = null;
            let vm = this;
            let clientWidth = document.body.clientWidth;
            let picHeight = Math.floor(clientWidth * 200 / 375);
            this.$root.requireData.menu.categories.forEach(function(category) {
                if (Number(category.id) === categoryId) {
                    category.dishes.forEach(function(dish) {
                        if (Number(dish.id) === foodId) {
                            if (dish.dc_type === "combo_only") {
                                return false;
                            }
                            temp = Braeco.utils.food.getFixedDataForFood(dish, vm.groups, vm.dishLimit);
                            temp.isViewInfo = true;
                            return false;
                        }
                    });
                    return false;
                }
            });
            return temp;
        },

        prepareForFoodProperty(opts) {
            let id = opts.id;
            this.foodPropertyItem = this.getItemForFoodProperty(id);
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
                        initLeft: rect.left
                    });
                }, 10);
            }
        },
        getItemForFoodProperty(foodId) {
            let vm = this;
            let temp = {};
            this.$root.requireData.menu.categories.forEach(function(category) {
                if (Number(category.id) === vm.categoryId) {
                    category.dishes.forEach(function(dish) {
                        if (Number(dish.id) === Number(foodId)) {
                            temp = Braeco.utils.property.getFixedDataForProperty(dish, vm.groups);
                            return false;
                        }
                    });
                    return false;
                }
            });
            return temp;
        },
    },
    directives: {
        'lazy': Vue.directive('lazy')
    },
    components: {
        'food': require("./components/food"),
        'food-property': require("./components/food-property")
    }
}

</script>


<style scoped lang="less">


.ellipsisWithLineNum (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

#Menu-Info {
    padding-bottom: 120px;
}

.img-container {
    .img {
        .background-norm();
    }
}

.food-info-container {
    margin-top: 16px;
}



.detail {
    margin-top: 16px;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    .detail-header {
        line-height: 40px;
        font-weight: bold;
    }
    .detail-content {
        .detail-content-wrapper {
            margin: 0 16px;
            .detail-content-container {
                padding: 10px 0;
                line-height: 20px;
                font-size: 14px;
                color: #333333;
            }
        }
    }
}


</style>