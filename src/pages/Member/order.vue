<template>
    <div id='Member-Order'>
        <transition name="fade" mode="out-in">
            <div
                class='member-order-container'
                v-if="!order_already_item.inValid"
            >
                <div class='order-main'>
                    <div>
                        <ul class='item-list'>
                            <order-item
                                v-for="orderItem in order_already_item.order_items"
                                :orderItem="orderItem"
                            >
                            </order-item>
                            <li
                                class='discount-item'
                                v-for="(value, type) of order_already_item.discount_map"
                                v-if="value"
                            >
                                <div class='discount-item-wrapper margin-left-wrapper'>
                                    <div class='discount-item-container'>
                                        <div class='discount-type left-part'>{{getDiscountName(type, value)}}</div>
                                        <div class='discount-value right-part'>{{getDiscountValue(type, value)}}</div>
                                        <div class='clear'></div>
                                    </div>
                                </div>
                            </li>
                            <li class='order-price-item'>
                                <div class='order-price-item-wrapper margin-left-wrapper'>
                                    <div class='order-price-item-container'>
                                        <div class='order-title left-part'>总价:</div>
                                        <div class='order-price right-part'>{{Number(Number(order_already_item.total_final_price).toFixed(2))}}</div>
                                        <div class='clear'></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
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
                            v-for="(infoType, key) of order_info_map"
                        >
                            <div class='order-info-item-wrapper margin-left-wrapper'>
                                <div class='order-info-item-container'>
                                    <div class='info-type left-part'>{{infoType}}</div>
                                    <div
                                        class='info-value left-part'
                                        v-if="key === 'create_time'"
                                    >{{new Date(order_already_item.create_time).Format("yyyy-MM-dd hh:mm")}}
                                    </div>
                                    <div
                                        class='info-value left-part'
                                        v-else
                                    >{{order_already_item.order_info[key] || "无"}}
                                    </div>
                                    <div class='clear'></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        <div
            class='loadding'
            v-if="order_already_item.inValid"
        >正在加载数据中
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
                "user_discount": "会员优惠",
                "coupon": "代金券"
            },
            order_info_map: {
                "order_id": "订单号",
                "flow_id": "流水号",
                "table_info": "桌号",
                "create_time": "下单时间",
                "pay_info": "支付方式",
                "description": "订单备注"
            }
        }
    },
    computed: {
        order_already_item: function() {
            return this.$store.getters.order_already_item;
        }
    },
    methods: {
        getDiscountName(type, value) {
            if (type === 'user_discount') {
                return value.msg;
            }

            return this.discountNameMap[type];
        },
        getDiscountValue(type, value) {
            if (type === 'user_discount') {
                return value.user_discount_money;
            }
            return Number(value.toFixed(2));
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

.loadding {
    line-height: 44px;
    padding-left: 16px;
    background-color: #fff;
    margin-top: 16px;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
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
