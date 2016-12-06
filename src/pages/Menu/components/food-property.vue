<template>
    <transition name="fade" mode="out-in">
        <div id='food-property' class='modal' v-show="showFlag">
            <div class='cover' v-on:click="closeFoodProperty"></div>
            <transition name='modal' mode="out-in">
                <div class='modal-dialog adapt-center' v-show="showFlag">
                    <div class='modal-content'>
                        <div class='modal-header'>
                            <b class='icon-close' v-on:click="closeFoodProperty"></b>
                            <p>{{currentFoodProperty.name}}</p>
                        </div>
                        <div class='modal-body'>
                            <div class='food-property'>
                                <div class='food-property-wrapper'>
                                    <div class='food-property-container'>
                                        <ul class='property-list'>
                                            <li
                                                class='property'
                                                v-for="(property, index) in currentFoodProperty.properties"
                                            >
                                                <div class='property-wrapper margin-left-wrapper'>
                                                    <div class='property-container'>
                                                        <div class='property-title'>{{property.name}}</div>
                                                        <ul class='property-content-list'>
                                                            <li
                                                                class='property-content'
                                                                v-for="(item, itemIndex) in property.content"
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
                            <div class='property-choose-display-field'>
                                <div class='choose-info-field'>
                                    已选：{{chooseInfo}}
                                </div>
                                <div class='price-field'>
                                    <div class='current-price'>{{Number(currentPrice.toFixed(2))}}</div>
                                    <div class='init-price' v-if="initPrice > currentPrice">{{Number(initPrice.toFixed(2))}}</div>
                                    <div class='clear'></div>
                                </div>
                            </div>
                            <button class='braeco-btn yellow confirm-btn' v-on:click="confirmBtnClickEvent">加入购物车</button>
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
    computed: {
        currentFoodProperty: function() {
            return this.$store.getters.currentFoodProperty;
        },
        chooseInfo: function() {
            return this.$store.getters.chooseInfo
        },
        initPrice: function() {
            return this.$store.getters.initPrice;
        },
        currentPrice: function() {
            return this.$store.getters.currentPrice;
        },
        showFlag: function() {
            return this.$store.state.property.showFlag;
        },
        chooseArray: function() {
            return this.$store.state.property.chooseArray;
        }
    },
    created() {
    },
    methods: {
        chooseItem(chooseIndex, itemIndex) {
            this.$store.commit("property:setChoose", {
                chooseIndex: chooseIndex,
                itemIndex: itemIndex
            });
        },
        closeFoodProperty() {
            this.$store.dispatch("property:endFoodProperty");
        },
        confirmBtnClickEvent() {
            let vm = this;
            this.$emit("confirm-add", {
                id: vm.currentFoodProperty.id,
                groups: vm.chooseArray,
                orderInitPrice: vm.initPrice
            });
            this.closeFoodProperty();
        }
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

.property-choose-display-field {
    .choose-info-field {
        margin-bottom: 8px;
        line-height: 20px;
        font-size: 14px;
        .ellipsisWithLineNum(1);
    }
    .price-field {
        margin-bottom: 12px;
        > *:not(.clear) {
            float: left;
        }
        line-height: 16px;
        .current-price {
            color: #910012;
            font-size: 14px;
            &:before {
                content: '￥';
                font-size: 10px;
            }
        }
        .init-price {
            font-size: 12px;
            margin-left: 5px;
            text-decoration: line-through;
            &:before {
                content: '￥';
            }
        }
    }
}

</style>
