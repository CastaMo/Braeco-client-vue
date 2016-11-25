<template>
    <div id='Menu-Combo'>
        <div v-if="comboItem" class='combo-item-container'>
            <div
                v-for="(comboSubItem, index) in comboItem.combos"
                class='combo-item'
                v-bind:class="{
                    'active': activeArray[index]
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
                            v-for="foodItem in comboSubItem.foodItems"
                            :foodItem="foodItem"
                            v-on:food-with-property-click="prepareForFoodProperty"
                            v-on:food-with-normal-click="addChoose"
                        >
                        </food-item>
                    </ul>
                </div>
            </div>
        </div>
        <combo-footer-bar
            :enableFlag="isReadyForAddToTrolley"
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
            chooseOptions: [],
            activeArray: [],
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
        this.chooseOptions =  Array(requireLen).fill([]);
        this.chooseOptions = this.getChooseOptions(this.comboItem);
        this.activeArray = Array(requireLen).fill(false);
        this.showFirstRequireUnFinish();
    },
    methods: {
        prepareForFoodProperty(opts) {
            let index = this.getActiveIndex();
            if (
                this.comboItem.require[index] > 0
            &&  this.comboItem.require[index] <= this.getChooseNumByIndex(index)
            ) {
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
        addChoose(opts) {
            let index = this.getActiveIndex();
            if (
                this.comboItem.require[index] > 0
            &&  this.comboItem.require[index] <= this.getChooseNumByIndex(index)
            ) {
                return console.log("gg");
            }
            let foodItem = Braeco.utils.order.tryGetFoodItemByFoodId(this.chooseOptions[index] ,opts.id);
            let subItem = Braeco.utils.order.tryGetSubItemByGroups(foodItem.subItems, opts.groups, true);
            subItem.num += 1;
            if (
                this.comboItem.require[index]
            &&  this.comboItem.require[index] <= this.getChooseNumByIndex(index)
            ) {
                this.showFirstRequireUnFinish();
            }
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
        getChooseOptions(comboItem) {
            let chooseOptions = [];
            comboItem.combos.forEach(function(comboSubItem) {
                let optionSubItem = [];
                comboSubItem.content.forEach(function(foodId) {
                    optionSubItem.push({
                        id: foodId,
                        subItems: []
                    });
                });
                chooseOptions.push(optionSubItem);
            });
            return chooseOptions;
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
            if (this.activeArray[index]) {
                return this.comboItem.combos[index].content.length * 125;
            }
            return 0;
        },
        getChooseNumByIndex(index) {
            let chooseOption = this.chooseOptions[index];
            let num = 0;
            chooseOption.forEach(function(option) {
                option.subItems.forEach(function(subItem) {
                    num += subItem.num;
                });
            });
            return num;
        },
        showFirstRequireUnFinish() {
            let vm = this;
            this.activeArray.every(function(activeItem, activeIndex) {
                if (
                    vm.comboItem.require[activeIndex] <= 0
                ||  vm.comboItem.require[activeIndex] <= vm.getChooseNumByIndex(activeIndex)
                ) {
                    return true;
                }
                vm.setActiveStateByIndex(activeIndex, true);
                return false;
            });
        },
        getActiveIndex() {
            let index = -1;
            this.activeArray.every(function(activeItem, activeIndex) {
                if (activeItem) {
                    index = activeIndex;
                    return false;
                }
                return true;
            });
            return index;
        },
        setActiveStateByIndex(index, active) {
            let vm = this;
            this.activeArray.forEach(function(activeItem, activeIndex) {
                if (index != activeIndex) {
                    vm.$set(vm.activeArray, activeIndex, false);
                }
            });
            vm.$set(vm.activeArray, index, active);
        },
        titleClickEvent(index) {
            this.setActiveStateByIndex(index, !this.activeArray[index]);
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
