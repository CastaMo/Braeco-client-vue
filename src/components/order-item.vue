 <template>
    <li class='order-item'>
        <div class='order-item-wrapper margin-left-wrapper'>
            <div class='order-item-container'>
                <div class='name-field'>
                    <div class='name'>{{orderItem.name}}</div>
                    <div class='dc label' v-if="orderItem.dcStr">{{orderItem.dcStr}}</div>
                    <div class='tag label' v-if="orderItem.tag">{{orderItem.tag}}</div>
                    <div class='clear'></div>
                </div>
                <div class='property-choose-info-field' v-if="orderItem.chooseInfo">
                    <p>{{orderItem.chooseInfo}}</p>
                </div>
                <div class='combo-choose-info-field' v-if="orderItem.comboChooseInfoArray">
                    <div class='combo-choose-info-wrapper'>
                        <div class='combo-choose-info-container'>
                            <ul class='combo-choose-info-list'>
                                <li
                                    class='combo-choose-info-item'
                                    v-for="comboChooseInfoItem in orderItem.comboChooseInfoArray"
                                >
                                    <div class='name left-part'>
                                        {{comboChooseInfoItem.name}}<span v-if="comboChooseInfoItem.chooseInfo"> ({{comboChooseInfoItem.chooseInfo}})</span>
                                    </div>
                                    <div class='num right-part'>{{comboChooseInfoItem.num}}</div>
                                    <div class='clear'></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class='price-field'>
                    <div class='left-part price'>{{orderItem.orderInitPrice}}</div>
                    <div class='right-part controll'>
                        <div class='minus' v-on:click="minusClickEvent"></div>
                        <div class='num'>{{orderItem.num}}</div>
                        <div class='add' v-on:click="addClickEvent"></div>
                    </div>
                    <div class='clear'></div>
                </div>
            </div>
        </div>
    </li>
</template>

<script>

module.exports = {
    name: 'order-item',
    props: {
        orderItem: Object
    },
    methods: {
        addClickEvent() {
            let temp = {};
            temp.id = this.orderItem.id;
            if (this.orderItem.groups && this.orderItem.groups.length > 0) {
                temp.groups = this.orderItem.groups;
            }
            this.$emit("add-click", temp);
        },
        minusClickEvent() {
            let temp = {};
            temp.id = this.orderItem.id;
            if (this.orderItem.groups && this.orderItem.groups.length > 0) {
                temp.groups = this.orderItem.groups;
            }
            this.$emit("minus-click", temp);
        }
    }
}

</script>

<style lang="less" scoped>

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

.order-item-container {
    padding: 9px 16px 8px 0;
    .name-field {
        > *:not(.clear) {
            float: left;
        }
        .name {
            line-height: 22px;
            font-weight: bold;
        }
        .dc, .tag {
            line-height: 20px;
            padding: 0 4px;
            font-size: 12px;
            margin: 1px 0 0 8px;
            .rounded-corners(2px);
            color: #fff;
        }
        .dc {
            background-color: #EB4F10;
        }
        .tag {
            background-color: #FF8F00;
        }
    }
    .property-choose-info-field {
        line-height: 17px;
        margin-top: 7px;
        font-size: 12px;
        color: #9B9B9B;
    }
    .combo-choose-info-field {
        .combo-choose-info-wrapper {
            margin: 8px 0 5px 0;
            .combo-choose-info-container {
                padding-left: 8.5px;
                border-left: solid 2px #FFC107;
                ul.combo-choose-info-list {
                    li.combo-choose-info-item {
                        font-size: 12px;
                        line-height: 17px;
                        margin-bottom: 4px;
                        color: #9B9B9B;
                        .name {
                            width: 60%;
                            word-break: break-all;
                        }
                        .num {
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
        }
    }
    .price-field {
        margin-top: 8px;
        height: 24px;
        .price {
            line-height: 19px;
            color: #910012;
            margin-top: 5px;
            &:before {
                content: '￥';
                font-size: 9px;
            }
        }
        .controll {
            > *:not(.clear) {
                float: left;
            }
            .add, .minus {
                width: 24px;
                height: 24px;
                .background-norm();
                background-size: 24px 24px;
            }
            .add {
                background-image: url("../assets/Icon/Round/Plus.png");
            }
            .minus {
                background-image: url("../assets/Icon/Round/Minus.png");
            }
            .num {
                line-height: 24px;
                font-size: 14px;
                margin: 0 12px;
            }
        }
    }
}

.order-item:last-of-type {
    .margin-left-wrapper {
        border-bottom: none;
    }
}

</style>
