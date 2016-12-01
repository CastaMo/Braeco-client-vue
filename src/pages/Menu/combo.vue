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
            :foodPropertyItem="foodPropertyItem"
            v-on:confirm-add="addChoose"
        ></food-property>
        <combo-delete
            :comboDeleteItem="comboDeleteItem"
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
            foodId: -1,
            dishLimit: null,
            groupsMap: {},
            comboItem: null,
            allFoodChooseOptions: [],
            currentActiveIndex: -1,
            foodPropertyItem: {properties: []},
            comboDeleteItem: {deleteItems: []}
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

        // 用于使选项与food顺序对齐
        comboChooseOptionsArray() {
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
            return temp;
        },

        // 用于记录每一个food的选择记录
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
        },

        totalPriceForCombo() {
            let price = Braeco.utils.combo.getPriceForCombo(this.comboItem, this.chooseAllInfoForFood);
            return price;
        },

        // 用于显示每一个food的选择信息，以及价格的更新
        chooseAllInfoForFood() {
            let temp = [];
            let vm = this;
            this.comboChooseOptionsArray.forEach(function(foodList, index) {
                let infoListTemp = [];
                foodList.forEach(function(foodItem) {
                    let dish = vm.$root.getDishById(foodItem.id);
                    let foodProperty = Braeco.utils.property.getFixedDataForProperty(dish, vm.groupsMap);

                    Braeco.utils.combo.adjustItemByCombo(foodProperty, index, vm.comboItem, vm.groupsMap, vm.dishLimit);

                    let infoTemp = {
                        name: dish.name,
                        num: foodItem.num
                    };
                    infoTemp.default_price = foodProperty.default_price;
                    infoTemp.dc_type = foodProperty.dc_type;
                    infoTemp.dc = foodProperty.dc;
                    if (foodItem.groups && foodItem.groups.length > 0) {
                        infoTemp.propertyInfo = Braeco.utils.property.getInfoArrayByChoose(foodItem.groups, foodProperty.properties).join("、");
                        infoTemp.diff = Braeco.utils.property.getDiffPriceByChoose(foodItem.groups, foodProperty.properties);
                    }
                    infoListTemp.push(infoTemp);
                });
                temp.push(infoListTemp);
            });
            return temp;
        }
    },
    created() {
        this.foodId = this.$root.$route.params.foodId;
        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groupsMap[group.id] = group;
        });

        this.dishLimit = this.$root.requireData.dish_limit;
        this.comboItem = this.getItemForCombo(this.foodId);

        let requireLen = this.comboItem.require.length;
        this.allFoodChooseOptions =  Array(requireLen).fill([]);
        this.allFoodChooseOptions = this.getAllFoodChooseOptions(this.comboItem);
        this.showFirstRequireUnFinish();
    },
    methods: {
        prepareForFoodProperty(opts) {
            let index = this.currentActiveIndex;
            if (this.getIsFullChooseByIndex(index)) {
                return this.$root.$emit("tips:error", "若需继续添加, 请先删除已选的餐品");
            }
            let id = opts.id;
            this.foodPropertyItem = this.getItemForFoodProperty(id);
            this.$root.$emit("root:food-property-show");
        },
        getItemForFoodProperty(foodId) {
            let vm = this;
            let dish = this.$root.getDishById(foodId);
            let temp = Braeco.utils.property.getFixedDataForProperty(dish, this.groupsMap);

            // 将套餐的优惠传递进去
            Braeco.utils.combo.adjustItemByCombo(temp, this.currentActiveIndex, this.comboItem, vm.groupsMap, vm.dishLimit);
            return temp;
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
            this.$root.$emit("root:combo-delete-show");
            this.comboDeleteItem = this.getItemForComboDelete(opts.id, foodItem.subItems);
        },
        getItemForComboDelete(id, subItems) {
            let temp = {};
            let vm = this;
            let dish = vm.$root.getDishById(id);
            let foodProperty = Braeco.utils.property.getFixedDataForProperty(dish, vm.groupsMap);

            temp.id = id;
            temp.name = foodProperty.name;
            temp.deleteItems = [];

            // 将套餐的优惠传递进去
            Braeco.utils.combo.adjustItemByCombo(foodProperty, this.currentActiveIndex, this.comboItem, this.groupsMap, this.dishLimit);

            subItems.forEach(function(subItem) {
                let propertyInfo = Braeco.utils.property.getInfoArrayByChoose(subItem.groups, foodProperty.properties).join("、");
                let diffPrice = Braeco.utils.property.getDiffPriceByChoose(subItem.groups, foodProperty.properties);
                temp.deleteItems.push({
                    groups: subItem.groups,
                    price: diffPrice + foodProperty.default_price,
                    propertyInfo: propertyInfo
                });
            });
            return temp;
        },
        minusChoose(opts) {
            let index = this.currentActiveIndex;
            let foodItem = Braeco.utils.order.tryGetFoodItemByFoodId(this.allFoodChooseOptions[index], opts.id);
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(foodItem.subItems, opts.groups);
            if (subItem.num <= 0) {
                return this.$root.$emit("tips:error", "数量已为0, 无法删除");
            }
            subItem.num -= 1;
            if (subItem.num <= 0) {
                let subItemIndex = foodItem.subItems.indexOf(subItem);
                foodItem.subItems.splice(subItemIndex, 1);
            }
        },
        addChoose(opts) {
            let index = this.currentActiveIndex;
            if (this.getIsFullChooseByIndex(index)) {
                return this.$root.$emit("tips:error", "若需继续添加, 请先删除已选的餐品");
            }
            let foodItem = Braeco.utils.order.tryGetFoodItemByFoodId(this.allFoodChooseOptions[index] ,opts.id);
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(foodItem.subItems, opts.groups, true);
            subItem.num += 1;
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
            this.$root.addOrderForTrolley({
                id: vm.foodId,
                groups: groups,
                orderInitPrice: vm.totalPriceForCombo
            });
            this.$root.$emit("tips:success", "添加套餐成功");
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
            combo.combos.forEach(function(comboSubItem, subItemIndex) {
                comboSubItem.foodItems = [];
                comboSubItem.content.forEach(function(foodId) {
                    let dish = vm.$root.getDishById(foodId);
                    let food = Braeco.utils.food.getFixedDataForFood(dish, vm.groupsMap, vm.dishLimit);
                    food.lastNoBottom = true;

                    // 将套餐的优惠传递进去
                    Braeco.utils.combo.adjustItemByCombo(food, subItemIndex, combo, vm.groupsMap, vm.dishLimit);

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
        'food-item': Vue.component('food-item'),
        'combo-footer-bar': require("./components/combo-footer-bar"),
        'food-property': require("./components/food-property"),
        'combo-delete': require('./components/combo-delete')
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
