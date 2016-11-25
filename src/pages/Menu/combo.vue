<template>
    <div id='Menu-Combo'>
        <div v-if="comboItem" class='combo-item-container'>
            <div
                v-for="(comboSubItem, index) in comboItem.combos"
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
                            {{comboSubItem.name}} <span v-if="comboItem.require[index]">×{{comboItem.require[index]}}</span>
                        </div>
                        <div class='combo-item-label label-option' v-if="comboItem.require[index] === 0">
                            可任意选择
                        </div>
                        <div
                            v-bind:class="{
                                'label-danger': comboItem.require[index]-getChooseNumByIndex(index),
                                'label-success': !comboItem.require[index]-getChooseNumByIndex(index)
                            }"
                            class='combo-item-label'
                            v-else
                        >
                            {{getLabelByRequireAndChooseNum(comboItem.require[index], getChooseNumByIndex(index))}}
                        </div>
                        <div class='clear'></div>
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
                            v-on:food-with-property-click="prepareForFoodProperty"
                            v-on:food-with-normal-click="addChoose"
                            v-on:food-minus-click="judgeMinusChoose"
                        >
                        </food-item>
                    </ul>
                </div>
            </div>
        </div>
        <combo-footer-bar
            :enableFlag="isReadyForAddToTrolley"
            v-on:confirm-add="addOrder"
        ></combo-footer-bar>
        <food-property
            :foodPropertyItem="foodPropertyItem"
            v-on:confirm-add="addChoose"
        ></food-property>
    </div>
</template>

<script>

module.exports = {
    name: 'menu-combo',
    data() {
        return {
            dishLimit: null,
            groupsMap: {},
            comboItem: null,
            allFoodChooseOptions: [],
            currentActiveIndex: -1,
            foodPropertyItem: {properties: []},
        }
    },
    computed: {
        isReadyForAddToTrolley() {
            let flag = true;
            let vm = this;
            this.comboItem.require.every(function(requireItem, index) {
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
        chooseOptionsArray() {
            let temp = [];
            this.allFoodChooseOptions.forEach(function(foodListOption) {
                let foodListTemp = [];
                foodListOption.forEach(function(foodItem) {
                    foodItem.subItems.forEach(function(subItem) {
                        let chooseTemp = {
                            id: foodItem.id,
                            num: subItem.num
                        };
                        if (subItem.groups && subItem.groups.length > 0) {
                            chooseTemp.groups = subItem.groups;
                        }
                        foodListTemp.push(chooseTemp);
                    });
                });
                temp.push(foodListTemp);
            });
            console.log(JSON.parse(JSON.stringify(temp)));
            return temp;
        },
        chooseNumForFood() {
            let temp = [];
            this.allFoodChooseOptions.forEach(function(foodListOption) {
                let numListTemp = [];
                foodListOption.forEach(function(foodItem) {
                    let num = 0;
                    foodItem.subItems.forEach(function(subItem) {
                        num += subItem.num;
                    });
                    numListTemp.push(num);
                });
                temp.push(numListTemp);
            });
            return temp;
        }
    },
    created() {
        let foodId = this.$root.$route.params.foodId;
        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groupsMap[group.id] = group;
        });

        this.dishLimit = this.$root.requireData.dish_limit;
        this.comboItem = this.getItemForCombo(foodId);

        let requireLen = this.comboItem.require.length;
        this.allFoodChooseOptions =  Array(requireLen).fill([]);
        this.allFoodChooseOptions = this.getAllFoodChooseOptions(this.comboItem);
        this.showFirstRequireUnFinish();
    },
    methods: {
        prepareForFoodProperty(opts) {
            let index = this.currentActiveIndex;
            if (this.getIsFullChooseByIndex(index)) {
                return console.log("gg");
            }
            let id = opts.id;
            this.foodPropertyItem = this.getItemForFoodProperty(id);
            this.$root.$emit("root:food-property-show");
        },
        getItemForFoodProperty(foodId) {
            let vm = this;
            let dish = this.$root.getDishById(foodId);
            let temp = Braeco.utils.property.getFixedDataForProperty(dish, this.groupsMap);
            return temp;
        },
        judgeMinusChoose(opts) {
            console.log(opts);
        },
        addChoose(opts) {
            let index = this.currentActiveIndex;
            if (this.getIsFullChooseByIndex(index)) {
                return console.log("gg");
            }
            let foodItem = Braeco.utils.order.tryGetFoodItemByFoodId(this.allFoodChooseOptions[index] ,opts.id);
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(foodItem.subItems, opts.groups, true);
            subItem.num += 1;
            if (this.getIsFullChooseByIndex(index)) {
                this.showFirstRequireUnFinish();
            }
        },
        addOrder() {
            this.$root.$router.back();
        },
        getIsFullChooseByIndex(index) {
            return  this.comboItem.require[index] > 0
            &&      this.comboItem.require[index] <= this.getChooseNumByIndex(index);
        },
        getItemForCombo(id) {
            let vm = this;
            let dish = this.$root.getDishById(id);
            console.log(JSON.parse(JSON.stringify(dish)));
            let combo = Braeco.utils.combo.getFixedDataForCombo(dish, this.groupsMap);
            combo.combos.forEach(function(comboSubItem) {
                comboSubItem.foodItems = [];
                comboSubItem.content.forEach(function(foodId) {
                    let dish = vm.$root.getDishById(foodId);
                    let food = Braeco.utils.food.getFixedDataForFood(dish, vm.groupsMap, vm.dishLimit);
                    food.lastNoBottom = true;
                    comboSubItem.foodItems.push(food);
                });
            });
            console.log(JSON.parse(JSON.stringify(combo)));
            return combo;
        },
        getAllFoodChooseOptions(comboItem) {
            let allFoodChooseOptions = [];
            comboItem.combos.forEach(function(comboSubItem) {
                let optionSubItem = [];
                comboSubItem.content.forEach(function(foodId) {
                    optionSubItem.push({
                        id: foodId,
                        subItems: []
                    });
                });
                allFoodChooseOptions.push(optionSubItem);
            });
            return allFoodChooseOptions;
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
                return this.comboItem.combos[index].content.length * 125;
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
            this.comboItem.require.every(function(requireItem, index) {
                if (
                    requireItem <= 0
                ||  requireItem <= vm.getChooseNumByIndex(index)
                ) {
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
        'food-item': Vue.component('food-item'),
        'combo-footer-bar': require("./components/combo-footer-bar"),
        'food-property': require("./components/food-property")
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
        &.active {
            .arrow {
                .transform(rotate(-180deg));
            }
        }
    }
}

</style>
