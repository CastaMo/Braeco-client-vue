<template>
    <div id='Member-Recharge'>
        <div class='member-recharge-wrapper'>
            <div class='member-recharge-container'>
                <div id='recharge'>
                    <div class='title-field'>
                        <div class='title-wrapper'>
                            <div class='title-container'>
                                <p>选择充值金额</p>
                            </div>
                        </div>
                    </div>
                    <ul class='recharge-list' v-if="charge_ladder && charge_ladder.length > 0">
                        <li
                            class='recharge-item'
                            v-for="(recharge, index) in charge_ladder"
                            v-bind:class="{
                                'choose': choose === index
                            }"
                            v-on:click="itemClickEvent(index)"
                        >
                            <div class='recharge-item-wrapper margin-left-wrapper'>
                                <div class='recharge-item-container'>
                                    <div
                                        class='left-part item-info-field'
                                        v-bind:class="{
                                            'normal': !recharge.to_rank_info,
                                            'to-rank': recharge.to_rank_info
                                        }"
                                    >
                                        <div class='money-field'>
                                            <div class='left-part pay-money'>{{recharge.pay}}</div>
                                            <div
                                                class='left-part give-item'
                                                v-if="recharge.give"
                                            >( 立送<span class='give-money'>{{recharge.give}}</span> )
                                            </div>
                                            <div class='clear'></div>
                                        </div>
                                        <div class='to-rank-field' v-if="recharge.to_rank_info">
                                            <div class='to-rank-info'>充值后可升级为 Lv.{{recharge.to_rank_info.level}} {{recharge.to_rank_info.level_name}}级会员</div>
                                        </div>
                                    </div>
                                    <div class='right-part choose-icon-field'>
                                        <div class='choose-icon'></div>
                                    </div>
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
    name: 'member-recharge',
    data() {
        return {
            choose: -1
        };
    },
    computed: {
        charge_ladder: function() {
            return this.$store.getters.charge_ladder;
        }
    },
    methods: {
        itemClickEvent(index) {
            this.choose = index;
            let vm = this;
            setTimeout(function() {
                vm.$router.push(`/member/pay/recharge_${vm.choose}`);
            }, 100);
        }
    }
}

</script>

<style scoped lang="less">

.background-norm(@elem: "none") {
    background-repeat: no-repeat;
    background-position: center;
}

#Member-Recharge {
    .member-recharge-wrapper {
        .member-recharge-container {
            padding: 16px 0 80px 0;
        }
    }
}

#recharge {
    border-top: solid 1px #C8C7CC;
    border-bottom: solid 1px #C8C7CC;
    background-color: #fff;
    .title-field {
        line-height: 39px;
        color: #030303;
        font-weight: bold;
        border-bottom: solid 1px #C8C7CC;
        .title-wrapper {
            margin: 0 16px;
        }
        &:last-child {
            border-bottom: none;
        }
    }
    ul.recharge-list {
        li.recharge-item {
            &.choose {
                background-color: #FFF5D6;
                .choose-icon-field .choose-icon {
                    background-image: url("../../assets/pay-choose-icon-checked.png");
                }
            }
            .recharge-item-container {
                padding-right: 16px;
            }

            .item-info-field {
                &.normal {
                    line-height: 56px;
                }
                &.to-rank {
                    margin: 10px 0;
                    .money-field {
                        line-height: 18px;
                    }
                    .to-rank-field {
                        line-height: 16px;
                        margin-top: 2px;
                    }
                }
                .money-field {
                    .pay-money {
                        color: #910012;
                        &:before {
                            content: '￥';
                            font-size: 12px;
                        }
                    }
                    .give-item {
                        font-size: 14px;
                        margin-left: 15px;
                        .give-money {
                            color: #910012;
                            &:before {
                                content: "¥";
                                font-size: 12px;
                            }
                        }
                    }
                }
                .to-rank-field {
                    font-size: 14px;
                }
            }
            .choose-icon-field {
                margin-top: 17px;
                .choose-icon {
                    width: 24px;
                    height: 24px;
                    .background-norm();
                    background-size: 24px 24px;
                    background-image: url("../../assets/pay-choose-icon-unchecked.png");
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
