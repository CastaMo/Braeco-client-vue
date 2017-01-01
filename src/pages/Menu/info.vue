<template>
    <div id="Menu-Info">
        <div class='img-container' v-if="currentFoodInfoItem">
            <div
                class='img'
                v-lazy:background-image="currentFoodInfoItem.largePic"
                v-bind:style="{
                    'width': `${largeWidth}px`,
                    'height': `${largeHeight}px`,
                    'background-size': `${largeWidth}px ${largeHeight}px`
                }"
            >
            </div>
        </div>
        <div class='food-info-container' v-if="!currentFoodInfoItem.inValid">
            <food-item
                :foodItem="currentFoodInfoItem"
                :limitDc="dish_limit_remainder[currentFoodInfoItem.id]"
                v-on:food-with-property-add-click="prepareForFoodProperty"
                v-on:food-with-normal-add-click="addFood"
                v-on:record-ball-set-out-dom="recordBallSetOutDom"
                v-on:food-with-combo-add-click="routeToCombo"
            ></food-item>
        </div>
        <div class='detail' v-if="currentFoodInfoItem && currentFoodInfoItem.detail">
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
                        <p>{{currentFoodInfoItem.detail}}</p>
                    </div>
                </div>
            </div>
        </div>
        <food-property
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
            ballSetOutDom: null,
            largeWidth: null,
            largeHeight: null
        };
    },
    computed: {
        dish_limit_remainder: function() {
            return this.$store.getters.dish_limit_remainder;
        },
        currentFoodInfoItem: function() {
            return this.$store.getters.currentFoodInfoItem;
        }
    },
    created() {
        let vm = this;
        vm.largeWidth = document.body.clientWidth;
        vm.largeHeight = Math.floor(vm.largeWidth * 200 / 375);

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

                    opts = Vue.util.extend(opts, {
                        failCallback: function(food_name_str) {
                            vm.$root.$emit("tips:error", `${food_name_str} 数量不足`);
                        },
                        dishMap: vm.$store.getters.dishMap
                    });

                    vm.$root.$emit("root:play-ball", {
                        initTop: rect.top,
                        initLeft: rect.left,
                        callback: function() {
                            vm.$store.commit("order:addOrderForTrolley", opts);
                        }
                    });
                }, 10);
                vm.$router.back();
            }
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

            vm.$router.back();
            setTimeout(function() {
                vm.$router.push(`/menu/combo/${opts.id}`);
            }, 10);
        }
    },
    components: {
        'food-item': require('./components/food-item'),
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
