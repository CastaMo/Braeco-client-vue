<template>
    <div id="Menu-Order">
        <div class='menu-order-wrapper'>
            <div class='menu-order-container'>
                <div class='order menu-order-item-container'>
                    <ul>
                        <order-item
                            v-for="orderItem in order_items"
                            :orderItem="orderItem"
                            :limitDc="dish_limit_remainder[orderItem.id]"
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
                        <li
                            class='additional-item active-container'
                            v-on:click="$refs.description.show()"
                        >
                            <div class='additional-item-wrapper margin-left-wrapper'>
                                <div class='additional-item-container'>
                                    <div class='title left-part'>订单备注</div>
                                    <div class='desc right-part'>{{description}}</div>
                                    <div class='clear'></div>
                                </div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                        <li
                            class='additional-item active-container'
                            v-on:click="$router.push('/member/coupon/use')"
                        >
                            <div class='additional-item-wrapper margin-left-wrapper'>
                                <div class='additional-item-container'>
                                    <div class='title left-part'>代金券</div>
                                    <div
                                        class='desc right-part'
                                        v-show="coupon_arr_valid_len > 0"
                                    >有 {{coupon_arr_valid_len}} 张代金券可用</div>
                                    <div class='clear'></div>
                                </div>
                            </div>
                            <div class='arrow vertical-center'></div>
                        </li>
                    </ul>
                </div>
                <div class='discount-container' v-show="discount_map_len > 0">
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
                            v-for="(value, type) of discount_map"
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
        <description
            ref="description"
        ></description>
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
                "user_discount": "会员优惠",
                "coupon": "代金券"
            }
        }
    },
    computed: {
        dish_limit_remainder: function() {
            return this.$store.getters.dish_limit_remainder;
        },
        order_items: function() {
            return this.$store.getters.order_items;
        },
        discount_map: function() {
            return this.$store.getters.discount_map;
        },
        discount_map_len: function() {
            let len = 0;
            for (var key in this.discount_map) {
                let value = this.discount_map[key];
                if (value) {
                    len++;
                }
            }
            return len;
        },
        giveItem: function() {
            return this.$store.getters.giveItem;
        },
        trolley_btn_able: function() {
            return this.$store.getters.trolley_btn_able;
        },
        description: function() {
            return this.$store.state.order.description;
        },
        coupon_arr_valid_len: function() {
            return this.$store.getters.coupon_arr.filter(function(item) {
                return !item.$disabled;
            }).length;
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
        'order-item': require('../../components/order-item'),
        'description': require('./components/description')
    },
    methods: {
        addFood(opts) {

            // 加上默认的数量1
            opts = Vue.util.extend(opts, {num: 1});

            let vm = this;

            let limit_flag = Braeco.utils.order.checkIsEnoughForOpts(
                opts,
                vm.dish_limit_remainder,
                vm.$store.getters.dishMap,
                function(food_name_str) {
                    vm.$root.$emit("tips:error", `${food_name_str} 数量不足`);
                }
            );
            if (!limit_flag) {
                return;
            }
            
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

.ellipsis-with-line-num (@num: 1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @num;
    -webkit-box-orient: vertical;
}

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
            .desc {
                margin-right: 40px;
                width: 150px;
                text-align: right;
                color: #8D8D8D;
                .ellipsis-with-line-num(1);

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
