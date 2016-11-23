<template>
    <div id='Menu-Combo'>
        <div v-if="comboItem" class='combo-item-container'>
            <div v-for="(comboSubItem, index) in comboItem.combos" class='combo-item'>
                <div class='combo-item-title'>
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
                </div>
                <ul>
                    <food-item
                        v-for="foodItem in comboSubItem.foodItems"
                        :foodItem="foodItem"
                    >
                    </food-item>
                </ul>
            </div>
        </div>
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
            chooseOptions: []
        }
    },
    created() {
        let foodId = this.$root.$route.params.foodId;
        console.log(foodId);
        let vm = this;
        this.$root.requireData.menu.groups.forEach(function(group) {
            vm.groupsMap[group.id] = group;
        });

        this.dishLimit = this.$root.requireData.dish_limit;
        this.comboItem = this.getItemForCombo(foodId);
        let requireLen = this.comboItem.require.length;
        this.chooseOptions =  Array(requireLen).fill([]);
    },
    methods: {
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
        getLabelByRequireAndChooseNum(require, chooseNum) {
            if (require === 0) {
                return "可任意选择";
            }
            if (chooseNum - require >= 0) {
                return "已选好";
            }
            return `还需选${require - chooseNum}项`;
        },
        getChooseNumByIndex(index) {
            let chooseOption = this.chooseOptions[index];
            let num = 0;
            chooseOption.forEach(function(option) {
                num += option.num;
            });
            return num;
        }
    },
    components: {
        'food-item': Vue.component('food-item')
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
        }
    }
}

</style>
