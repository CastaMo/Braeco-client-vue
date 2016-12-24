<template>
    <div id='Member-Order'>
        <div class='member-order-container'>
            <div class='order-main'>
                <ul class='item-list'>
                    <order-item
                        v-for="orderItem in orderAlreadyItem.orderItems"
                        :orderItem="orderItem"
                    >
                    </order-item>
                    <li
                        class='discount-item'
                        v-for="(value, type) of orderAlreadyItem.discountMap"
                        v-if="value"
                    >
                        <div class='discount-item-wrapper margin-left-wrapper'>
                            <div class='discount-item-container'>
                                <div class='discount-type left-part'>{{discountNameMap[type]}}</div>
                                <div class='discount-value right-part'>{{Number(value.toFixed(2))}}</div>
                                <div class='clear'></div>
                            </div>
                        </div>
                    </li>
                    <li class='order-price-item'>
                        <div class='order-price-item-wrapper margin-left-wrapper'>
                            <div class='order-price-item-container'>
                                <div class='order-title left-part'>总价:</div>
                                <div class='order-price right-part'>{{Number(orderAlreadyItem.totalFinalPrice.toFixed(2))}}</div>
                                <div class='clear'></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class='order-info'>
                <div class='info-title-field'>
                    <div class='info-title-wrapper margin-left-wrapper'>
                        <div class='info-title-container'>
                            <div class='info-title'>订单信息</div>
                        </div>
                    </div>
                </div>
                <ul class='order-info-item-list'>
                    <li
                        class='order-info-item'
                        v-for="(infoType, key) of orderInfoMap"
                    >
                        <div class='order-info-item-wrapper margin-left-wrapper'>
                            <div class='order-info-item-container'>
                                <div class='info-type left-part'>{{infoType}}</div>
                                <div
                                    class='info-value left-part'
                                    v-if="key === 'create_time'"
                                >{{new Date(orderAlreadyItem.createTimestamp).Format("yyyy-MM-dd hh:mm")}}
                                </div>
                                <div
                                    class='info-value left-part'
                                    v-else
                                >{{orderAlreadyItem.orderInfo[key]}}
                                </div>
                                <div class='clear'></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>

module.exports = {
    name: 'member-order',
    data() {
        return {
            discountNameMap: {
                "half": "第二份半价",
                "discount": "折扣优惠",
                "sale": "立减优惠",
                "reduce": "满减优惠",
                "userDiscount": "会员优惠",
                "coupon": "代金券"
            },
            orderInfoMap: {
                "order_id": "订单号",
                "flow_id": "流水号",
                "table_info": "桌号",
                "create_time": "下单时间",
                "pay_info": "支付方式",
                "remark_info": "订单备注"
            }
        }
    },
    computed: {
        orderAlreadyItem: function() {
            return this.$store.getters.orderAlreadyItem;
        }
    },
    components: {
        "order-item": require("../../components/order-item")
    }
}

</script>


<style scoped lang="less">

.member-order-container {
    padding: 16px 0 120px 0;
}

.order-main, .order-info {
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    margin-bottom: 16px;
}

li.discount-item, li.order-price-item {
    line-height: 44px;
    .discount-item-container {
        padding-right: 16px;
        .discount-value {
            &:before {
                content: '- ￥';
                font-size: 14px;
            }
        }
    }
    &:last-of-type {
        .margin-left-wrapper {
            border-bottom: none;
        }
    }
}

li.order-price-item {
    line-height: 44px;
    .order-price-item-container {
        padding-right: 16px;
        .order-price {
            color: #910012;
            &:before {
                content: '￥';
                font-size: 14px;
            }
        }
    }
}

li.order-info-item {
    line-height: 44px;
    .info-type {
        width: 64px;
        color: #9B9B9B;
        margin-right: 16px;
    }
    .info-value {
        font-size: 14px;
    }
    &:last-of-type {
        .margin-left-wrapper {
            border-bottom: none;
        }
    }
}

.info-title-field {
    line-height: 44px;
    font-weight: bold;
}



</style>
