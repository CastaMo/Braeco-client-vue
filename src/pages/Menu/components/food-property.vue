<template>
    <transition name="fade" mode="out-in">
        <div id='food-property' class='modal' v-show="showFlag">
            <div class='cover' v-on:click="showFlag = !showFlag"></div>
            <transition name='modal' mode="out-in">
                <div class='modal-dialog adapt-center' v-show="showFlag">
                    <div class='modal-content'>
                        <div class='modal-header'>
                            <b class='icon-close' v-on:click="showFlag = !showFlag"></b>
                            <p>{{foodPropertyItem.name}}</p>
                        </div>
                        <div class='modal-body'>
                            <div class='food-property'>
                                <div class='food-property-wrapper'>
                                    <div class='food-property-container'>
                                        <ul class='property-list'>
                                            <li
                                                class='property'
                                                v-for="(property, index) in foodPropertyItem.properties"
                                                v-bind:property="property"
                                                v-bind:index="index"
                                            >
                                                <div class='property-wrapper margin-left-wrapper'>
                                                    <div class='property-container'>
                                                        <div class='property-title'>{{property.name}}</div>
                                                        <ul class='property-content-list'>
                                                            <li
                                                                class='property-content'
                                                                v-for="(item, itemIndex) in property.content"
                                                                v-bind:item="item"
                                                                v-bind:itemIndex="itemIndex"
                                                                v-bind:class="{
                                                                    'choose': chooseArray[index] === itemIndex
                                                                }"
                                                                v-on:click="chooseItem(index, itemIndex)"
                                                            >
                                                                {{item.name}}
                                                            </li>
                                                            <div class='clear'>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='modal-footer'>
                            <button class='braeco-btn yellow confirm-btn'>加入购物车</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>


<script>

module.exports = {
    name: 'food-property',
    props: {
        foodPropertyItem: Object,
    },
    data() {
        return {
            showFlag: false,
            chooseArray: []
        }
    },
    created() {
        let vm = this;
        this.$root.$on("root:food-property-show", function(food) {
            vm.showFlag = true;
        });
    },
    watch: {
        foodPropertyItem() {
            let vm = this,
                len = this.foodPropertyItem.properties.length;
            this.chooseArray = Array(len).fill(0);
        }
    },
    methods: {
        chooseItem(chooseIndex, itemIndex) {
            // 必须这样才能触发更新，或者其他的变异办法
            Vue.set(this.chooseArray, chooseIndex, itemIndex);
        }
    }
}

</script>

<style scoped lang="less">

.overflowScrolling (@num: 0) {
    -webkit-overflow-scrolling: touch;
}

.rounded-corners (@radius: 5px) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    -ms-border-radius: @radius;
    -o-border-radius: @radius;
    border-radius: @radius;
}

.food-property {
    .food-property-wrapper {
        height: 220px;
        overflow: auto;
        .overflowScrolling();
        .food-property-container {
            padding-bottom: 50px;
            ul.property-list {
                li.property {
                    .property-container {
                        padding: 8px 16px 8px 0;
                        .property-title {
                            font-size: 14px;
                            line-height: 20px;
                            font-weight: bold;
                        }
                        .property-content {
                            float: left;
                            padding: 0 14px;
                            line-height: 18px;
                            .rounded-corners(40px);
                            border: solid 1px #C8C7CC;
                            margin: 8px 8px 0 0;
                            background-color: #fff;
                            &.choose {
                                line-height: 20px;
                                padding: 0 15px;
                                border: none;
                                color: #fff;
                                background-color: #CEBCB0;
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>