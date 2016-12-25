<template>
    <div id="Menu-Order">
        <div class='menu-order-wrapper'>
            <div class='menu-order-container'>
                <div class='order menu-order-item-container'>
                    <ul>
                        <order-item
                            v-for="orderItem in orderItems"
                            :orderItem="orderItem"
                            v-on:add-click="addFood"
                            v-on:minus-click="minusFood"
                        >
                        </order-item>
                        <order-item
                            v-if="giveItem"
                            :orderItem="giveItem"
                        ></order-item>
                    </ul>
                </div>
                <div class='additional-container'>
                    <ul class='additional-list'>
                        <li class='additional-item active-container'>
                            <div class='additional-item-wrapper margin-left-wrapper'>
                                <div class='additional-item-container'>
                                    <div class='title'>订单备注</div>
                                </div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                        <li class='additional-item active-container'>
                            <div class='additional-item-wrapper margin-left-wrapper'>
                                <div class='additional-item-container'>
                                    <div class='title'>代金券</div>
                                </div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                    </ul>
                </div>
                <div class='discount-container'>
                    <div class='discount-title'>
                        <div class='margin-left-wrapper discount-title-wrapper'>
                            <div class='discount-title-container'>
                                优惠折扣
                            </div>
                        </div>
                    </div>
                    <ul
                        class='discount-item-list'
                    >
                        <li
                            class='discount-item'
                            v-for="(value, type) of discountMap"
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
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    name: 'menu-order',
    data() {
        return {
            discountNameMap: {
                "half": "第二份半价",
                "discount": "折扣优惠",
                "sale": "立减优惠",
                "reduce": "满减优惠",
                "userDiscount": "会员优惠",
                "coupon": "代金券"
            }
        }
    },
    computed: {
        orderItems: function() {
            return this.$store.getters.orderItems;
        },
        discountMap: function() {
            return this.$store.getters.discountMap;
        },
        giveItem: function() {
            return this.$store.getters.giveItem;
        },
        trolley_btn_able: function() {
            return this.$store.getters.trolley_btn_able;
        }
    },
    created() {
        let vm = this;
        this.$root.$on("root:route-to-order", function() {
            if (!vm.$store.state.user.member_info) {
                return vm.$store.dispatch("user:startUserLogin");
            }
            vm.$router.push('/member/pay/order');
        });
    },
    beforeDestroy() {
        this.$root.$off("root:route-to-order");
    },
    components: {
        'order-item': require('../../components/order-item')
    },
    methods: {
        addFood(opts) {
            this.$store.commit("order:addOrderForTrolley", opts);
        },
        minusFood(opts) {
            this.$store.commit("order:minusOrderForTrolley", opts);
        }
    },
    watch: {
        "trolley_btn_able": function() {
            if (!this.trolley_btn_able) {
                this.$router.back();
            }
        }
    }
}


</script>

<style lang="less" scoped>

.menu-order-container {
    padding: 16px 0 100px 0;
}

.menu-order-item-container {
    margin-bottom: 16px;
    background-color: #fff;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    li.order-item:last-of-type {
        .order-item-wrapper {
            color: #fff;
            color: red;
        }
    }
}

.additional-container {
    margin-bottom: 16px;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    ul {
        li.additional-item {
            line-height: 44px;
            .title {
                font-weight: bold;
            }
            &:last-of-type {
                .margin-left-wrapper {
                    border-bottom: none;
                }
            }
        }
    }
}

.discount-container {
    margin-bottom: 16px;
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    .discount-title {
        line-height: 44px;
        font-weight: bold;
    }
    ul.discount-item-list {
        li.discount-item {
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
    }
}

</style>
