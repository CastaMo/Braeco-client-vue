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
        <div class='food' v-if="foodItem">
            <div class='food-wrapper'>
                <div class='food-container'>
                    <div class='info-field'>
                        <div class='name-field'>
                            <p class='name'>{{foodItem.name}}</p>
                            <p class='name2'>{{foodItem.name2}}</p>
                        </div>
                        <div class='label-field'>
                            <div class='dc' v-if="foodItem.dc_type && foodItem.dc_type !== 'none'">{{foodItem.dcStr}}</div>
                            <div class='tag' v-if="foodItem.tag">{{foodItem.tag}}</div>
                            <div class='clear'></div>
                        </div>
                        <div class='money-field'>
                            <div class='current-price'>{{Number(foodItem.currentPrice.toFixed(2))}}</div>
                            <div class='init-price' v-if="foodItem.chooseAllFirstPrice > foodItem.currentPrice">{{Number(foodItem.chooseAllFirstPrice.toFixed(2))}}</div>
                            <div class='controll'>
                                <div
                                    class='add-btn'
                                    v-on:click.stop="addBtnClickEvent(foodItem, $event)"
                                >
                                    <div class='add-btn-img' v-if="foodItem.type === 'normal'"></div>
                                    <div class='add-btn-word' v-else>选择</div>
                                </div>
                            </div>
                            <div class='clear'></div>
                        </div>
                    </div>
                    <div class='clear'></div>
                </div>
            </div>
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
    </div>
</template>

<script>

module.exports = {
    name: 'menu-info',
    data() {
        return {
            foodItem: null,
            groups: {},
            dishLimit: null
        }
    },
    created() {
        let categoryId = Number(this.$root.$route.params.categoryId);
        let foodId = Number(this.$root.$route.params.foodId);
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
                            temp = Braeco.utils.food.getFixedFoodData(dish, vm.groups, vm.dishLimit);
                            return false;
                        }
                    });
                    return false;
                }
            });
            return temp;
        },

        addBtnClickEvent(food, event) {
            let dom = event.target || event.srcElement;
            let rect = dom.getBoundingClientRect();
            this.$root.$emit("root:play-ball", {
                initTop: rect.top,
                initLeft: rect.left
            });
        }
    },
    directives: {
        'lazy': Vue.directive('lazy')
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

.food {
    margin-top: 16px;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    .food-wrapper {
        margin: 0 16px 0 16px;
        .food-container {
            padding: 12px 0;
            .info-field {
                .name-field {
                    height: 40px;
                    .name {
                        line-height: 22px;
                        font-weight: bold;
                        .ellipsisWithLineNum(1);
                    }
                    .name2 {
                        .ellipsisWithLineNum(1);
                        line-height: 16px;
                        font-size: 14px;
                        margin-top: 4px;
                    }
                }
                .label-field {
                    margin-top: 5px;
                    height: 20px;
                    > *:not(.clear) {
                        float: left;
                        line-height: 20px;
                        .rounded-corners(2px);
                        color: #fff;
                        padding: 0 4px;
                        font-size: 12px;
                    }
                    .dc {
                        margin-right: 9px;
                        background-color: #EB4F10;
                    }
                    .tag {
                        background-color: #FF8F00;
                    }
                }
                .money-field {
                    height: 25px;
                    margin-top: 9px;
                    .current-price {
                        float: left;
                        color: #910012;
                        line-height: 20px;
                        margin-top: 3px;
                        font-size: 16px;
                        &:before {
                            content: '￥';
                            font-size: 10px;
                        }
                    }
                    .init-price {
                        float: left;
                        margin-left: 5px;
                        margin-top: 8px;
                        line-height: 14px;
                        font-size: 12px;
                        text-decoration: line-through;
                        &:before {
                            content: '￥';
                            font-size: 8px;
                        }
                    }
                    .controll {
                        float: right;
                        .add-btn {
                            .add-btn-img {
                                .background-norm();
                                width: 25px;
                                height: 25px;
                                background-size: 25px 25px;
                                background-image: url("../../assets/Icon/Round/Plus.png");
                            }
                            .add-btn-word {
                                line-height: 25px;
                                padding: 0 8px;
                                color: #fff;
                                background-color: #FFC107;
                                .rounded-corners(25px);
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
    }
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