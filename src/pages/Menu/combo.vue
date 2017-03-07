<template>
    <div id='Menu-Combo'>
        <div v-if="!currentComboItem.inValid" class='combo-item-container'>
            <div
                v-for="(comboSubItem, index) in currentComboItem.combos"
                class='combo-item'
                v-bind:class="{
                    'active': currentActiveIndex === index
                }"
            >
                <div
                    class='combo-item-title'
                    v-on:click="titleClickEvent(index)"
                >
                    <div class='combo-item-title-container'>
                        <div class='combo-item-name'>
                            {{comboSubItem.name}} <span v-if="currentComboItem.require[index]">×{{currentComboItem.require[index]}}</span>
                        </div>
                        <div class='combo-item-label label-option' v-if="currentComboItem.require[index] === 0">
                            可任意选择
                        </div>
                        <div
                            v-bind:class="{
                                'label-danger': currentComboItem.require[index]-getChooseNumByIndex(index),
                                'label-success': !currentComboItem.require[index]-getChooseNumByIndex(index)
                            }"
                            class='combo-item-label'
                            v-else
                        >
                            {{getLabelByRequireAndChooseNum(
                                currentComboItem.require[index],
                                getChooseNumByIndex(index))
                            }}
                        </div>
                        <div class='clear'></div>
                    </div>
                    <div
                        class='choose-info-container'
                        v-show="  currentActiveIndex !== index
                            && chooseAllInfoForFood[index].length>0"
                    >
                        <ul class='choose-info-list'>
                            <li
                                class='choose-info'
                                v-for="item in chooseAllInfoForFood[index]"
                            >
                                <div class='dot'></div>
                                <div class='name'>{{item.name}} <span v-if="item.propertyInfo">({{item.propertyInfo}})</span></div>
                                <div class='num'>{{item.num}}</div>
                                <div class='clear'></div>
                            </li>
                        </ul>
                    </div>
                    <div class='arrow-field vertical-center'>
                        <div class='arrow'></div>
                    </div>
                </div>
                <div
                    class='food-item-list-wrapper'
                    v-bind:style="{
                        'height': `${getFoodListHeightByActive(index)}px`
                    }">
                    <ul class='food-item-list'>
                        <food-item
                            v-for="(foodItem, foodIndex) in comboSubItem.foodItems"
                            :foodItem="foodItem"
                            :num="chooseNumForFood[index][foodIndex]"
                            v-on:food-with-property-add-click="prepareForFoodProperty"
                            v-on:food-with-normal-add-click="addChoose"
                            v-on:food-with-normal-minus-click="minusChoose"
                            v-on:food-with-property-minus-click="judgeForMinusChoose"
                        >
                        </food-item>
                    </ul>
                </div>
            </div>
        </div>
        <combo-footer-bar
            :enableFlag="isReadyForAddToTrolley"
            :comboPrice="totalPriceForCombo"
            v-on:confirm-add="addOrder"
        ></combo-footer-bar>
        <food-property
            v-on:confirm-add="addChoose"
        ></food-property>
        <combo-delete
            v-on:confirm-minus="minusChoose"
        >
        </combo-delete>
    </div>
</template>

<script>

module.exports = {
    name: 'menu-combo',
    data() {
        return {
            currentActiveIndex: -1
        }
    },
    computed: {
        dish_limit_remainder: function() {
            return this.$store.getters.dish_limit_remainder;
        },
        allFoodChooseOptions: function() {
            return this.$store.state.combo.allFoodChooseOptions;
        },
        currentComboItem() {
            return this.$store.getters.currentComboItem;
        },
        isReadyForAddToTrolley() {
            if (!this.$store.state.isLoaded) {
                return false;
            }
            let flag = true;
            let vm = this;
            this.currentComboItem.require.every(function(requireItem, index) {
                if (
                    requireItem === 0
                ||  vm.getChooseNumByIndex(index) >= requireItem
                ) {
                    return true;
                }
                flag = false;
                return false;
            });
            return flag;
        },

        // 用于使选项与food顺序对齐
        comboChooseOptionsArray() {
            return this.$store.getters.comboChooseOptionsArray;
        },

        // 用于记录每一个food的选择记录
        chooseNumForFood() {
            return this.$store.getters.chooseNumForFood;
        },

        totalPriceForCombo() {
            return this.$store.getters.totalPriceForCombo;
        },

        // 用于显示每一个food的选择信息，以及价格的更新
        chooseAllInfoForFood() {
            return this.$store.getters.chooseAllInfoForFood;
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.$store.dispatch("combo:initCombo");
            this.showFirstRequireUnFinish();
        },
        prepareForFoodProperty(opts) {
            let index = this.currentActiveIndex;
            if (this.getIsFullChooseByIndex(index)) {
                return this.$root.$emit("tips:error", "若需继续添加, 请先删除已选的餐品");
            }
            let id = opts.id;
            let dish = this.$store.getters.dishMap[id];
            this.$store.dispatch("property:startFoodProperty", {
                foodId: id,
                chooseArrayLen: dish.groups.length,
                comboItem: this.currentComboItem,
                currentActiveIndex: index
            });
        },
        judgeForMinusChoose(opts) {
            let index = this.currentActiveIndex;
            let foodItem = Braeco.utils.order.tryGetFoodItemByFoodId(this.allFoodChooseOptions[index], opts.id);
            if (foodItem.subItems.length === 1) {
                return this.minusChoose({
                    id: opts.id,
                    groups: foodItem.subItems[0].groups
                });
            }
            this.$store.dispatch("combo-delete:startComboDelete", {
                foodId: opts.id,
                subItems: foodItem.subItems,
                comboItem: this.currentComboItem,
                currentActiveIndex: this.currentActiveIndex
            });
        },
        minusChoose(opts) {
            let index = this.currentActiveIndex;
            this.$store.commit("combo:minusChoose", {
                id: opts.id,
                currentActiveIndex: index,
                groups: opts.groups
            });
        },
        addChoose(opts) {
            let index = this.currentActiveIndex;
            if (this.getIsFullChooseByIndex(index)) {
                return this.$root.$emit("tips:error", "若需继续添加, 请先删除已选的餐品");
            }
            this.$store.commit("combo:addChoose", {
                id: opts.id,
                currentActiveIndex: index,
                groups: opts.groups
            });
            if (this.getIsFullChooseByIndex(index)) {
                this.showFirstRequireUnFinish();
            }
        },
        addOrder() {
            let groups = [];
            let vm = this;
            // 合并, 准备用于添加到order中
            this.comboChooseOptionsArray.forEach(function(comboChooseOption) {
                groups = groups.concat(comboChooseOption);
            });

            let opts = {
                id: vm.$store.state.route.params.comboId,
                groups: groups,
                order_init_price: vm.totalPriceForCombo
            };

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

            this.$store.commit("order:addOrderForTrolley", opts);
            this.$root.$emit("tips:success", "添加套餐成功");
            this.$root.$router.back();
        },
        getIsFullChooseByIndex(index) {
            return  this.currentComboItem.require[index] > 0
            &&      this.currentComboItem.require[index] <= this.getChooseNumByIndex(index);
        },
        getLabelByRequireAndChooseNum(require, chooseNum) {
            if (require === 0) {
                return "可任意选择";
            }
            if (chooseNum - require >= 0) {
                return "已选好";
            }
            return `还需选${require - chooseNum}项`;
        },
        getFoodListHeightByActive(index) {
            if (this.currentActiveIndex === index) {
                return this.currentComboItem.combos[index].content.length * 125;
            }
            return 0;
        },
        getChooseNumByIndex(index) {
            let foodListOption = this.allFoodChooseOptions[index];
            let num = 0;
            foodListOption.forEach(function(option) {
                option.subItems.forEach(function(subItem) {
                    num += subItem.num;
                });
            });
            return num;
        },
        showFirstRequireUnFinish() {
            let vm = this;
            let flag = false;
            if (
                !this.currentComboItem.require
            ||  this.currentComboItem.require.length <= 0
            ) {
                return;
            }
            this.currentComboItem.require.every(function(requireItem, index) {
                if (vm.getIsFullChooseByIndex(index)) {
                    return true;
                }
                vm.currentActiveIndex = index;
                flag = true;
                return false;
            });
            if (!flag) {
                this.currentActiveIndex = -1;
            }
        },
        titleClickEvent(index) {
            if (this.currentActiveIndex !== index) {
                this.currentActiveIndex = index;
            } else {
                this.currentActiveIndex = -1;
            }
        }
    },
    components: {
        'food-item': require("./components/food-item"),
        'combo-footer-bar': require("./components/combo-footer-bar"),
        'food-property': require("./components/food-property"),
        'combo-delete': require('./components/combo-delete')
    },
    watch: {
        "currentComboItem": function() {
            this.init();
        }
    }
}

</script>

<style scoped lang="less">

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.transition (@time: .3s) {
    -webkit-transition: all @time ease-in-out;
    -moz-transition: all @time ease-in-out;
    -ms-transition: all @time ease-in-out;
    -o-transition: all @time ease-in-out;
    transition: all @time ease-in-out;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    -moz-backface-visibility: hidden;
    -moz-perspective: 1000;
    backface-visibility: hidden;
    perspective: 1000;
}

.transform (@str: scale(0, 0)) {
    transform: @str;
    -webkit-transform: @str;
    -moz-transform: @str;
    -ms-transform: @str;
    -o-transform: @str;
}

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

#Menu-Combo {
    padding: 16px 0 100px 0;
}

.combo-item-container {
    border-bottom: solid 1px #C8C7CC;
    .combo-item {
        .combo-item-title {
            position: relative;
            background-color: #fff;
            border-top: solid 1px #C8C7CC;
            .combo-item-title-container {
                > *:not(.clear) {
                    float: left;
                }
                .combo-item-name {
                    margin-left: 16px;
                    line-height: 44px;
                }
                .combo-item-label {
                    .rounded-corners(2px);
                    line-height: 20px;
                    padding: 0 4px;
                    margin: 12px 0 0 9px;
                    font-size: 12px;
                    color: #fff;
                    &.label-option {
                        background-color: #FF8F00;
                    }
                    &.label-success {
                        background-color: #7ED321;
                    }
                    &.label-danger {
                        background-color: #EB4F10;
                    }
                }
            }
            .arrow-field {
                right: 16px;
                .arrow {
                    width: 15px;
                    height: 15px;
                    .background-norm();
                    background-size: 15px 15px;
                    background-image: url("../../assets/Icon/Arrow/Next/Yellow.png");
                    .transition(.3s);
                }
            }
        }
        .food-item-list-wrapper {
            overflow: hidden;
            .transition(.3s);
            ul.food-item-list {
                border-top: solid 1px #C8C7CC;
            }
        }
        .choose-info-container {
            padding-bottom: 9px;
            ul.choose-info-list {
                li.choose-info {
                    line-height: 17px;
                    margin-bottom: 4px;
                    color: #9B9B9B;
                    font-size: 12px;
                    .dot {
                        float: left;
                        width: 4px;
                        height: 4px;
                        .rounded-corners(50%);
                        background-color: #FFC107;
                        margin: 7.5px 0 0 16px;
                    }
                    .name {
                        float: left;
                        margin-left: 8px;
                        width: 60%;
                    }
                    .num {
                        float: right;
                        margin-right: 50px;
                        &:before {
                            content: '×';
                        }
                    }
                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
            }
        }
        &.active {
            .arrow {
                .transform(rotate(-180deg));
            }
        }
    }
}

</style>
