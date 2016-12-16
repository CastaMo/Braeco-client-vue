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
            <div class='via-balance-field choose-pay-field'>
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
                            'choose': choose === 'recharge'
                        }"
                        v-on:click="setChoose('recharge')"
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
                >
                    <div class='title-wrapper margin-left-wrapper'>
                        <div class='title-container'>
                            <div class='left-part'>
                                <p>使用现金或其他方式下单</p>
                            </div>
                            <div class='right-part choose-icon'>
                            </div>
                            <div class='clear'></div>
                        </div>
                    </div>
                </div>
                <!-- <div class='warn-field'>
                    <p>本餐厅暂不支持现金支付</p>
                </div> -->
            </div>
            <div class='confirm-btn-field'>
                <button
                    class='braeco-btn yellow'
                    v-bind:disabled="!choose"
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
            }
        }
    },
    computed: {
        topHeaderWord: function() {
            if (this.$store.state.route.params.payType === "order") {
                return "订单总价";
            } else {
                return "充值金额";
            }
        },
        topHeaderPrice: function() {
            if (this.$store.state.route.params.payType === "order") {
                return this.$store.getters.totalFinalPrice;
            } else {
                return 100;
            }
        },
        userBalance: function() {
            if (this.$store.state.user.member_info) {
                return this.$store.state.user.member_info.balance;
            }
            return 0;
        },
        online_channel: function() {
            return this.$store.getters.online_channel;
        },
        online_channel_length: function() {
            return Object.keys(this.online_channel).length;
        }
    },
    methods: {
        setChoose(choose) {
            this.choose = choose;
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
