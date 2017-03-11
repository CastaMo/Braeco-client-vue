<template>
    <div id='Member-Pay'>
        <div class='top-header'>
            <div class='price-bar'>
                <div class='price-bar-wrapper'>
                    <div class='price-bar-container'>
                        <div class='left-part word'>{{topHeaderWord}}:</div>
                        <div class='right-part price'>{{Number(topHeaderPrice.toFixed(2))}}</div>
                        <div class='clear'></div>
                    </div>
                </div>
            </div>
        </div>
        <div class='member-pay-main'>
            <div class='via-balance-field choose-pay-field' v-if="pay_type === 'order'">
                <div class='title-field'>
                    <div class='title-wrapper margin-left-wrapper'>
                        <div class='title-container'>
                            <p>使用会员余额支付</p>
                        </div>
                    </div>
                </div>
                <ul class='choose-pay-list'>
                    <li
                        class='choose-pay-item'
                        v-if="userBalance >= topHeaderPrice"
                        v-bind:class="{
                            'choose': choose === 'prepayment'
                        }"
                        v-on:click="setChoose('prepayment')"
                    >
                        <div class='choose-pay-item-wrapper margin-left-wrapper'>
                            <div class='choose-pay-item-container'>
                                <div class='left-part member-icon icon'>
                                </div>
                                <div class='left-part word'>
                                    <p>您的会员余额:</p>
                                    <p class='balance'>{{Number(userBalance.toFixed(2))}}</p>
                                </div>
                                <div class='right-part choose-icon'>
                                </div>
                                <div class='clear'></div>
                            </div>
                        </div>
                    </li>
                    <li
                        class='choose-pay-item active-container'
                        v-else="userBalance >= topHeaderPrice"
                        v-on:click="routeToRecharge"
                    >
                        <div class='choose-pay-item-wrapper margin-left-wrapper'>
                            <div class='choose-pay-item-container'>
                                <div class='left-part member-icon icon'>
                                </div>
                                <div class='left-part word'>
                                    <p>您的会员余额: <span class='balance'>{{Number(userBalance.toFixed(2))}}</span></p>
                                    <p style="font-size:14px; color:#9B9B9B; font-weight:300;">余额不足以支付，马上充值</p>
                                </div>
                                <div class='clear'></div>
                            </div>
                        </div>
                        <div class="arrow vertical-center"></div>
                    </li>
                </ul>
            </div>
            <div class='via-online-field choose-pay-field'>
                <div class='title-field'>
                    <div class='title-wrapper margin-left-wrapper'>
                        <div class='title-container'>
                            <p>使用在线支付</p>
                        </div>
                    </div>
                </div>
                <ul class='choose-pay-list' v-if="online_channel_length > 0">
                    <li
                        v-for="(value, channel) of online_channel"
                        class='choose-pay-item'
                        v-on:click="setChoose(channel)"
                        v-bind:class="{
                            'choose': choose === channel
                        }"
                    >
                        <div class='choose-pay-item-wrapper margin-left-wrapper'>
                            <div class='choose-pay-item-container'>
                                <div
                                    class='left-part icon'
                                    v-bind:class="iconMap[channel]"
                                >
                                </div>
                                <div class='left-part word'>
                                    <p>{{nameMap[channel]}}</p>
                                    <p class='tips'>推荐使用</p>
                                </div>
                                <div class='right-part choose-icon'>
                                </div>
                                <div class='clear'></div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class='warn-field'>
                    <p>本餐厅暂不支持在线支付</p>
                </div>
            </div>
            <div class='via-cash-field choose-pay-field'>
                <div
                    class='title-field choose-pay-item'
                    v-bind:class="{
                        'choose': choose === 'cash'
                    }"
                    v-on:click="setChoose('cash')"
                    v-if="pay_type === 'order'"
                >
                    <div class='title-wrapper margin-left-wrapper'>
                        <div class='title-container'>
                            <div class='left-part'>
                                <p>使用现金或其他方式下单</p>
                            </div>
                            <div class='right-part choose-icon' v-if="offline_channel.cash">
                            </div>
                            <div class='clear'></div>
                        </div>
                    </div>
                </div>
                <div class='warn-field' v-if="pay_type === 'order' && !offline_channel.cash">
                    <p>本餐厅暂不支持现金支付</p>
                </div>
                <div class='warn-field' v-if="pay_type !== 'order'">
                    <p>使用现金充值请到前台</p>
                </div>
            </div>
            <div class='confirm-btn-field'>
                <button
                    class='braeco-btn yellow'
                    v-bind:disabled="!choose"
                    v-on:click="confirmBtnClickEvent"
                >确认支付</button>
            </div>
        </div>
    </div>
</template>

<script>

module.exports = {
    name: 'member-pay',
    data() {
        return {
            choose: '',
            iconMap: {
                'alipay_wap': 'alipay-icon',
                'p2p_wx_pub': 'weixin-icon'
            },
            nameMap: {
                'alipay_wap': '支付宝',
                'p2p_wx_pub': '微信支付'
            },
            channelWhiteList: [
                'prepayment'
            ]
        }
    },
    computed: {
        charge_ladder: function() {
            return this.$store.getters.charge_ladder;
        },
        pay_type: function() {
            return this.$store.state.route.params.payType;
        },
        recharge_index: function() {
            if (this.pay_type === 'order') {
                return -1;
            }
            let recharge_index = this.pay_type.split("_")[1];
            return Number(recharge_index);
        },
        topHeaderWord: function() {
            if (this.pay_type === "order") {
                return "订单总价";
            } else {
                return "充值金额";
            }
        },
        topHeaderPrice: function() {
            if (this.pay_type === "order") {
                return this.$store.getters.total_final_price_with_coupon;
            } else {
                let recharge_index = this.recharge_index;
                let recharge = this.charge_ladder[recharge_index];
                if (recharge) {
                    return recharge.pay;
                }
            }
            return 0;
        },
        userBalance: function() {
            if (this.$store.state.user.member_info) {
                return this.$store.state.user.member_info.balance;
            }
            return 0;
        },
        all_channel: function() {
            return this.$store.getters.all_channel;
        },
        online_channel: function() {
            return this.$store.getters.online_channel;
        },
        online_channel_length: function() {
            return Object.keys(this.online_channel).length;
        },
        offline_channel: function() {
            return this.$store.getters.offline_channel;
        }
    },
    methods: {
        setChoose(choose) {
            if (
                this.all_channel[choose]
            ||  this.channelWhiteList.indexOf(choose) >= 0
            ) {
                this.choose = choose;
            }
        },
        routeToRecharge() {
            this.$router.push('/member/recharge');
        },
        confirmBtnClickEvent() {
            // console.log(this.$store.getters.order_items);
            if (this.pay_type === "order") {
                this.orderPayCallback();
            }
        },
        routeBackAndGo(backTarget, goTarget, timestamp) {
            let vm = this;
            if (vm.$route.path.indexOf(backTarget) < 0) {
                vm.$router.back();
                setTimeout(function() {
                    vm.routeBackAndGo(backTarget, goTarget, timestamp);
                }, timestamp);
            } else {
                setTimeout(function() {
                    vm.$router.push(goTarget);
                }, timestamp);
            }
        },
        orderPayCallback() {
            let vm = this;
            NProgress.start();

            this.$store.dispatch("order:update-order", {
                callback: function(result) {
                    if (result.message === "success") {
                        vm.$root.$emit("tips:success", "更新菜单成功！");
                        vm.$root.$store.commit("updateRequireData", {
                            order_for_already: result.data.order_for_already
                        });
                    } else {
                        vm.$root.$emit("tips:error", "更新菜单失败，请刷新重试！");
                    }
                }
            });

            this.$store.dispatch("user:get-table-member", {
                callback: function(result) {
                    if (result.message === "success") {
                        setTimeout(function() {
                            vm.$root.$emit("tips:success", "更新个人信息成功！");
                        }, 200);
                        vm.$store.commit("updateRequireData", {
                            couponorder: result.data.couponorder
                        });
                        vm.$store.commit("user:try-login", {
                            member_info: result.data.member_info
                        });
                    } else {
                        setTimeout(function() {
                            vm.$root.$emit("tips:error", "更新个人信息失败，请刷新重试！");
                        }, 200);
                    }

                }
            });

            this.$store.commit("order:clear-order-for-trolley");
            this.routeBackAndGo("/home/menu", "/home/order", 20);
        }
    }
};

</script>


<style scoped lang="less">

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

.top-header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 100;
    .price-bar {
        border-bottom: solid 1px #C8C7CC;
        width: 100%;
        background-color: #FFF5D6;
        .price-bar-container {
            padding: 0 16px;
            line-height: 43px;
            color: #910012;
            font-weight: bold;
            .price {
                &:before {
                    content: '￥';
                    font-size: 12px;
                }
            }
        }
    }
}

.member-pay-main {
    padding: 60px 0;
    .choose-pay-field {
        background-color: #fff;
        border-top: solid 1px #C8C7CC;
        border-bottom: solid 1px #C8C7CC;
        margin-bottom: 16px;
        .title-field {
            line-height: 39px;
            font-weight: bold;
            .title-container {
                padding-right: 16px;
            }
            &:last-child {
                .margin-left-wrapper {
                    border-bottom: none;
                }
            }
        }
        ul.choose-pay-list {
            li.choose-pay-item {
                .choose-pay-item-container {
                    padding-right: 16px;
                }
                &:last-of-type {
                    .margin-left-wrapper {
                        border-bottom: none;
                    }
                }
            }
            .icon {
                width: 40px;
                height: 40px;
                background-size: 40px 40px;
                margin-top: 8px;
                .background-norm();
                &.member-icon {
                    background-image: url("../../assets/member-icon.png");
                }
                &.weixin-icon {
                    background-image: url("../../assets/weixin-icon.png");
                }
                &.alipay-icon {
                    background-image: url("../../assets/alipay-icon.png");
                }
            }
            .word {
                line-height: 20px;
                margin: 8px 0 8px 10px;
                .balance {
                    color: #910012;
                    font-weight: bold;
                    &:before {
                        content: '￥';
                        font-size: 12px;
                    }
                }
                .tips {
                    font-size: 14px;
                    color: #9B9B9B;
                    font-weight: 300;
                }
            }
            .choose-icon {
                margin-top: 17px;
            }
        }
        .choose-icon {
            width: 24px;
            height: 24px;
            background-size: 24px 24px;
            .background-norm();
            background-image: url("../../assets/pay-choose-icon-unchecked.png");
        }
        .choose-pay-item.choose {
            background-color: #FFF5D6;
            .choose-icon {
                background-image: url("../../assets/pay-choose-icon-checked.png");
            }
        }
        .warn-field {
            line-height: 56px;
            text-align: center;
            color: #9B9B9B;
        }
        &.via-cash-field {
            margin-bottom: 0;
            .choose-icon {
                margin-top: 7.5px;
            }
        }
    }
    .confirm-btn-field {
        margin: 26px 26px;
        button {
            width: 100%;
            line-height: 40px;
            font-size: 16px;
            font-weight: bold;
        }
    }
}



</style>
