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
            <food-item
                :foodItem="foodItem"
                v-on:food-with-property-click="prepareForFoodProperty"
                v-on:food-with-normal-click="addFood"
                v-on:record-ball-set-out-dom="recordBallSetOutDom"
                v-on:food-with-combo-click="routeToCombo"
            ></food-item>
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
            foodItem: null,
            groupsMap: {},
            dishLimit: null,
            foodPropertyItem: {properties: []},
            ballSetOutDom: null
        }
    },
    created() {
        let foodId = Number(this.$root.$route.params.foodId);
        this.foodId = foodId;


        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groupsMap[group.id] = group;
        });


        this.dishLimit = this.$root.requireData.dish_limit;

        this.foodItem = this.getItemForFood(foodId);
        if (!this.foodItem) {
            this.$root.$router.back();
        }

        this.$root.$once("root:route-to-order", function() {
            vm.$root.$router.back();
            setTimeout(function() {
                vm.$root.$router.push('/menu/order');
            }, 10);
        });
    },
    beforeDestroy() {
        this.$root.$off("root:route-to-order");
    },
    methods: {
        getItemForFood(foodId) {
            let dish = this.$root.getDishById(foodId);
            let food = Braeco.utils.food.getFixedDataForFood(dish, this.groupsMap, this.dishLimit);
            food.isViewInfo = true;
            return food;
        },

        prepareForFoodProperty(opts) {
            let id = opts.id;
            let dish = this.$root.getDishById(id);
            this.foodPropertyItem = Braeco.utils.property.getFixedDataForProperty(dish, this.groupsMap);
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
                vm.$root.$router.back();
            }
        },
        routeToCombo(opts) {
            let vm = this;
            vm.$root.$router.back();
            setTimeout(function() {
                vm.$root.$router.push(`/menu/combo/${opts.id}`);
            }, 10);
        }
    },
    directives: {
        'lazy': Vue.directive('lazy')
    },
    components: {
        'food-item': Vue.component('food-item'),
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
